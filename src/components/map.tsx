import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import styles from "/src/css/map.css"

/**
 * When lat/lng is used to reverse geocode, multiple places are returned with increasing granularity
 * We should pick an appropriate one based on zoom, since it is assumed if the user is zommed in more,
 * they want a specific place/road/house etc. If they are zoomed out, more likely just want the general
 * region. Each place returned by google has a number of types. The below list specifies the types we should
 * accept for zoom levels of the givin minumum or lower. We accept lower zoom level types in case the types
 * listed are not found in the results list.
 */
const zoomLevelToPlaceTypeMappings = [
    {
        minZoomLevel: 18,
        placeTypes: [
            'premise',
            'establishment',
            'point_of_interest',
        ]
    },
    {
        minZoomLevel: 16,
        placeTypes: [
            'street address',
            'route',
        ]
    },
    {
        minZoomLevel: 14,
        placeTypes: [
            'sublocality',
            'sublocality_level_1',
        ]
    },
    {
        minZoomLevel: 10,
        placeTypes: [
            'administrative_area',
            'administrative_area_level_4',
            'locality',
            'postal_code',
        ]
    },
    {
        minZoomLevel: 6,
        placeTypes: [
            'postal_town',
            'locality',
            'administrative_area_level_2 ',
        ]
    },
    {
        minZoomLevel: 4,
        placeTypes: [
            'administrative_area_level_1',
            'country'
        ]
    },
    {
        minZoomLevel: 0,
        placeTypes: [
            'country'
        ]
    },
]

// Given the list of results and zoom level, determine the most appropriate result
const getBestResult = (results: Array<google.maps.GeocoderResult>, zoom: number): google.maps.GeocoderResult => {
    const firstTypesCheckIdx = zoomLevelToPlaceTypeMappings.findIndex((val) => val.minZoomLevel <= zoom)
    for (const result of results) {
        for (let idx = firstTypesCheckIdx; idx < zoomLevelToPlaceTypeMappings.length; idx++) {
            for (const type of zoomLevelToPlaceTypeMappings[idx].placeTypes) {
                if (result.types.includes(type)) {
                    return result;
                }
            }

        }
    }
    return results[0];
}

const MapComponent: React.FC<{}> = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map>();

    const onClick = (event: google.maps.MapMouseEvent) => {
        if (!map) {
            return
        }

        // Get place from lat/long of clicked spot on map
        const geocoder = new google.maps.Geocoder();
        geocoder
            .geocode({
                location: event.latLng,
                bounds: map.getBounds(),
            })
            .then((response) => {
                const zoom = map.getZoom()
                if (response && response.results.length && zoom) {
                    const selectedPlace = getBestResult(response.results, zoom)
                    // TODO put pin on map and centre that point
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

    return <div ref={ref} className={styles.map} />
}

const renderMapStatus = (status: Status) => {
    return <h1>{status}</h1>;
};

const MapWrapper = () => {
    return <Wrapper apiKey={"API KEY"} render={renderMapStatus}>
        <MapComponent/>
    </Wrapper>
}

export default MapWrapper;