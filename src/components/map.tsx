import * as React from "react";
import { useEffect, useRef, useState } from "react";
import styles from "/src/css/map.css";
import OverlayView from "./customOverlay";
import PlacePopup from "./placePopup";
import { getBestResult, bestResultMethod } from "./mapUtils";

const activeBestResultMethod = bestResultMethod.USE_FIRST;

export const MapComponent: React.FC<{}> = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map>();

    // Store of markers currently displayed on the map
    const [markers, setMarkers] = useState<JSX.Element[]>([]);

    // One up counter, used to assign unique key to each marker
    const [markerCount, setMarkerCount] = useState<number>(0);


    const onClick = (event: google.maps.MapMouseEvent) => {
        if (!map) {
            return
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
                const zoom = map.getZoom()
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
                        <OverlayView
                            position={selectedPlace.geometry.location}
                            map={map}
                            key={`marker${markerCount}`}
                        >
                        </OverlayView>;
                    // Add overlay to store and increment unique counter
                    setMarkers([...markers, overlay]);
                    setMarkerCount(markerCount + 1);
                    map.fitBounds(selectedPlace.geometry.viewport);
                }
            })

    }

    useEffect(() => {
        // Initialise map
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {
                zoom: 8,
                center: new google.maps.LatLng(51.74, -1.25),
                disableDefaultUI: true,
                clickableIcons: false
            }));
        }
    }, [ref, map]);


    useEffect(() => {
        // Add map events
        if (map) {
            ["click"].forEach((eventName) =>
                google.maps.event.clearListeners(map, eventName)
            );

            if (onClick) {
                map.addListener("click", onClick);
            }
        }
    }, [map, onClick]);

    return <div ref={ref} className={styles.map} >
        {markers.map((m) => m)}
    </div>
}
