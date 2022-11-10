import * as React from "react";
import { useEffect, useRef, useState } from "react";
import styles from "/src/css/map.css";
import { MarkerOverlayView } from "./customOverlay";
import PlacePopup from "./placePopup";
import { getBestResult, bestResultMethod } from "./mapUtils";
import { InfoBar } from "./infoBar";
import SearchBox from "./searchBox";
import { Place, PlaceType } from "../place";
import SelectedPlaceMarker from "./selectedPlaceMarker";

const activeBestResultMethod = bestResultMethod.USE_FIRST;
const maxZoomForSelection = 14;
const initialMapZoom = 8;

export type MapProps = {
    importantPlaces: Array<Place>;
    potentialHomes: Array<Place>;
    onAddImportantPlace: (p: Place) => void;
    onAddPotentialHome: (p: Place) => void;
}

export const MapComponent: React.FC<MapProps> = (props: MapProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const [map, setMap] = useState<google.maps.Map>();

    // Store of markers currently displayed on the map
    const [marker, setMarker] = useState<JSX.Element>();

    // Whether the drop down info bar is on show
    const [infoBarShown, setInfoBarShown] = useState<boolean>(false);
    const [infoBarMessage, setInfoBarMessage] = useState<string>("");

    const [infowindowTimeout, setinfowindowTimeout] = useState<ReturnType<typeof setTimeout>>();
    const [doubleClickTimeout, setdoubleClickTimeout] = useState<ReturnType<typeof setTimeout>>();

    const placeMarker = (
        name: string,
        id: string,
        location: google.maps.LatLng,
        bounds: google.maps.LatLngBounds | undefined,
        map: google.maps.Map
    ) => {
        const overlay =
            <MarkerOverlayView
                position={location}
                map={map}
                key={id}
            >
                <PlacePopup
                    name={name}
                    onClose={() => {setMarker(undefined)}}
                    onAddPotentialHome={() => {
                        props.onAddPotentialHome({
                            name: name,
                            id: id,
                            latlng: location,
                            type: 'POTENTIAL_HOME'
                        })
                        setMarker(undefined)
                    }}
                    onAddImportantPlace={(vpm: number) => {
                        props.onAddImportantPlace({
                            name: name,
                            id: id,
                            latlng: location,
                            type: 'IMPORTANT_PLACE',
                            visitsPerMonth: vpm
                        })
                        setMarker(undefined)
                    }}
                />
            </MarkerOverlayView>;
        // Add overlay to store and increment unique counter
        setMarker(overlay);
        if (bounds) {
            map.fitBounds(bounds);
        } else {
            map.panTo(location);
        }
    }

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
                    placeMarker(
                        selectedPlace.formatted_address,
                        selectedPlace.place_id,
                        selectedPlace.geometry.location,
                        selectedPlace.geometry.bounds,
                        map
                    )
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

    const onPlaceSearch = (place: google.maps.places.PlaceResult) => {
        if (place.geometry?.location && place.place_id && place.formatted_address && map) {
            placeMarker(
                place.formatted_address,
                place.place_id,
                place.geometry.location,
                place.geometry.viewport,
                map
            );
        }
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

    useEffect(() => {
        // Add a place for testing
        props.onAddImportantPlace({
                "name": "Oxford, UK",
                "id": "ChIJrx_ErYAzcUgRAnRUy6jbIMg",
                "latlng": new google.maps.LatLng(51.7520209, -1.2577263),
                "type": "IMPORTANT_PLACE",
                "visitsPerMonth": 1
        })
    }, [])

    const createPlaceMarkerArray = (list: Array<Place>, type: PlaceType, map: google.maps.Map): Array<JSX.Element> =>
        list.map(place =>
            <MarkerOverlayView position={place.latlng} map={map} key={`${place.id}`}>
                <SelectedPlaceMarker name={place.name} type={type}/>
            </MarkerOverlayView>
        )

    return <div className={styles.mapContainer}>
        {<div ref={ref} className={styles.map} >
            {marker}
            {map && <>
                {createPlaceMarkerArray(props.potentialHomes, 'POTENTIAL_HOME', map)}
                {createPlaceMarkerArray(props.importantPlaces, 'IMPORTANT_PLACE', map)}
                {<SearchBox map={map} onPlacesChanged={onPlaceSearch} />}
            </>}
        </div>}
        <div className={styles.infoBar}>
            <InfoBar
                message={infoBarMessage}
                shown={infoBarShown}
                type={'info'}
            />
        </div>
    </div>
}
