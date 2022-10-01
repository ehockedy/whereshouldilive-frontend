import * as React from "react";
import { useEffect, useRef, useState } from "react";
import styles from "/src/css/map.css";
import { MarkerOverlayView } from "./customOverlay";
import PlacePopup from "./placePopup";
import { getBestResult, bestResultMethod } from "./mapUtils";
import { InfoBar } from "./infoBar";

const activeBestResultMethod = bestResultMethod.USE_FIRST;
const maxZoomForSelection = 14;
const initialMapZoom = 8;

export const MapComponent: React.FC<{}> = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map>();

    // Store of markers currently displayed on the map
    const [markers, setMarkers] = useState<JSX.Element[]>([]);

    // One up counter, used to assign unique key to each marker
    const [markerCount, setMarkerCount] = useState<number>(0);

    // Whether the drop down info bar is on show
    const [infoBarShown, setInfoBarShown] = useState<boolean>(false);
    const [infoBarMessage, setInfoBarMessage] = useState<string>("");

    const [infowindowTimeout, setinfowindowTimeout] = useState<ReturnType<typeof setTimeout>>();
    const [doubleClickTimeout, setdoubleClickTimeout] = useState<ReturnType<typeof setTimeout>>();

    const onClick = (event: google.maps.MapMouseEvent) => {
        if (!map) {
            return
        }
        const zoom = map.getZoom()
        if (zoom && zoom < maxZoomForSelection) {
            // User has clicked but zoomed too far out
            setInfoBarShown(true);
            setInfoBarMessage("Zoom in more to get a more accurate selection");
            if (infowindowTimeout) {
                clearTimeout(infowindowTimeout)
            }
            setinfowindowTimeout(setTimeout(() => {
                //infowindow.close();
                setInfoBarShown(false);
            }, 3000))
            return;
        }


        // Get place from lat/long of clicked spot on map
        const geocoder = new google.maps.Geocoder();
        const clickedLocation = event.latLng;
        geocoder
            .geocode({
                location: clickedLocation,
                bounds: map.getBounds(),
            })
            .then((response) => {
                if (response && response.results.length && zoom && clickedLocation) {
                    const selectedPlace = getBestResult(activeBestResultMethod, response.results, map, clickedLocation);
                    if (selectedPlace) {
                        return geocoder.geocode({
                            placeId: selectedPlace.place_id,
                      });
                    }
                }
                return null;
            })
            .then((response) => {
                if (response && response.results.length) {
                    const selectedPlace = response.results[0];
                    const overlay = 
                        <MarkerOverlayView
                            position={selectedPlace.geometry.location}
                            map={map}
                            key={`marker${markerCount}`}
                        >
                            <PlacePopup />
                        </MarkerOverlayView>;
                    // Add overlay to store and increment unique counter
                    setMarkers([...markers, overlay]);
                    setMarkerCount(markerCount + 1);
                    map.panTo(selectedPlace.geometry.location);
                }
            })
    }

    const onClickDelayed = (event: google.maps.MapMouseEvent) => {
        // Wait a short amount of time before starting the click event. This
        // prevents prematurely running click action if user actually wanted
        // to double click.
        setdoubleClickTimeout(setTimeout(() => {
            onClick(event)
        }, 300));
    }

    const onDblClick = () => {
        // On double click, do not show the info bar, and if the first click
        // event is waiting, cancel it.
        setInfoBarShown(false);
        if (doubleClickTimeout) {
            clearTimeout(doubleClickTimeout);
        }
    }

    const getPointerType = (zoom: number | undefined) => {
        if (zoom && zoom >= maxZoomForSelection) {
            return 'pointer';
        }
        return 'grab';
    }

    const onZoom = () => {
        if (!map) {
            return;
        }
        const zoom = map.getZoom();
        map.setOptions({
            draggableCursor: getPointerType(zoom)
        })
    }

    useEffect(() => {
        // Initialise map
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {
                zoom: initialMapZoom,
                center: new google.maps.LatLng(51.74, -1.25),
                disableDefaultUI: true,
                clickableIcons: false,
                draggableCursor: getPointerType(initialMapZoom)
            }));
        }
    }, [ref, map]);

    useEffect(() => {
        // Add map events
        if (map) {
            ["click", "dblclick", "zoom_changed"].forEach((eventName) =>
                google.maps.event.clearListeners(map, eventName)
            );

            map.addListener("click", onClickDelayed);
            map.addListener("dblclick", onDblClick);
            map.addListener("zoom_changed", onZoom);
            
        }
    }, [map, onClickDelayed, onDblClick, onZoom]);

    return <div className={styles.mapContainer}>
        <div ref={ref} className={styles.map} >
            {markers}
        </div>
        <div className={styles.infoBar}>
            <InfoBar
                message={infoBarMessage}
                shown={infoBarShown}
                type={'info'}
            />
        </div>
    </div>

}
