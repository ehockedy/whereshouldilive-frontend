
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
        minZoomLevel: 12,
        placeTypes: [
            'sublocality',
            'sublocality_level_1',
            'postal_code_prefix'
        ]
    },
    {
        minZoomLevel: 10,
        placeTypes: [
            'administrative_area',
            'administrative_area_level_4',
            'locality',
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
const pickBestByType = (results: Array<google.maps.GeocoderResult>, zoom: number): google.maps.GeocoderResult => {
    //results.reverse()  // Reverse in place
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


const drawBounds = (bounds: google.maps.LatLngBounds, map: google.maps.Map) => {
    new google.maps.Rectangle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.1,
        map,
        bounds: {
          north: bounds.getNorthEast().lat(),
          south: bounds.getSouthWest().lat(),
          east: bounds.getNorthEast().lng(),
          west: bounds.getSouthWest().lng(),
        },
    });
}


const calculateBoundedArea = (bounds: google.maps.LatLngBounds) => {
    const width = Math.abs(bounds.getNorthEast().lat() - bounds.getSouthWest().lat());
    const height = Math.abs(bounds.getNorthEast().lng() - bounds.getSouthWest().lng());
    return width * height;

}

const evaluateBoundSimilarity = (viewportBounds: google.maps.LatLngBounds, placeBounds: google.maps.LatLngBounds): number => {
    const viewportArea = calculateBoundedArea(viewportBounds);
    const placeArea = calculateBoundedArea(placeBounds);
    return (placeArea + viewportArea);
}

const getBoundWidth = (bounds: google.maps.LatLngBounds): number => {
    return Math.abs(bounds.getNorthEast().lng() - bounds.getSouthWest().lng());
}
const getBoundHeight = (bounds: google.maps.LatLngBounds): number => {
    return Math.abs(bounds.getNorthEast().lat() - bounds.getSouthWest().lat());
}

const getDirectDistance = (point1: google.maps.LatLng, point2: google.maps.LatLng) => {
    const latDist = Math.abs(point1.lat() - point2.lat());
    const lngDist = Math.abs(point1.lng() - point2.lng());
    return Math.sqrt(
        Math.pow(latDist, 2) + Math.pow(lngDist, 2)
    );
}

const isPlaceWithinViewport = (viewportBounds: google.maps.LatLngBounds, placeBounds: google.maps.LatLngBounds) => {
    //console.log(viewportBounds.toString(), placeBounds.toString());
    const placeBoundsInViewport = viewportBounds.contains(placeBounds.getNorthEast()) && viewportBounds.contains(placeBounds.getSouthWest());

    const placeWidthSmallerThanView = getBoundWidth(viewportBounds) > getBoundWidth(placeBounds);
    const placeHeightSmallerThanView =  getBoundHeight(viewportBounds) > getBoundHeight(placeBounds);
    //console.log(placeBoundsInViewport, placeWidthSmallerThanView, placeHeightSmallerThanView)
    return placeBoundsInViewport || (placeWidthSmallerThanView && placeHeightSmallerThanView);
}

const isClickedLocationCloseToPlace = (viewportBounds: google.maps.LatLngBounds, placeBounds: google.maps.LatLngBounds, clickedLocation: google.maps.LatLng, zoom: number) => {
    const placeCentre = placeBounds.getCenter();
    const dist = getDirectDistance(placeCentre, clickedLocation);
    const distRange = getBoundHeight(viewportBounds) * 0.25 / zoom;
    //viewportBounds.getCenter().
    console.log(dist, distRange)
    return dist < distRange;
}

const isPlaceWithinViewportAndClose = (
    viewportBounds: google.maps.LatLngBounds,
    placeBounds: google.maps.LatLngBounds,
    clickedLocation: google.maps.LatLng,
    zoom: number,
) => {
    const withinViewport = isPlaceWithinViewport(viewportBounds, placeBounds);
    const isClose = isClickedLocationCloseToPlace(viewportBounds, placeBounds, clickedLocation, zoom);
    console.log("Within view: ", withinViewport, " is close: ", isClose);
    return withinViewport && isClose;
}

// Iterate over the results and find the one with the biggest bound that still fits within the bounds of the map when
// the user clicked it. The idea here is that based on the zoom, find the place that most snugly fits within the current
// bounds.
const pickBest = (
    evalFunction: (viewportBounds: google.maps.LatLngBounds, placeBounds: google.maps.LatLngBounds) => boolean,
    results: Array<google.maps.GeocoderResult>,
    mapBounds: google.maps.LatLngBounds,
): google.maps.GeocoderResult => {
    let result = results[0];
    let resultFound = false;
    let idx = 1;
    while (idx < results.length && !resultFound) {
        const resultToTry = results[idx];
        const resultToTryBounds = resultToTry?.geometry.viewport;
        
        // If this result fits within th ebounds then save it as the curent best. Since the resutls
        // are returned in increasing order of bound size (I belive), we try to find the one with the
        // bounds that fit the best.
        // If no result bounds, skip as some very zoomed in locations have no bounds.
        if (resultToTry && resultToTryBounds) {
            if (evalFunction(mapBounds, resultToTryBounds)) {
                result = resultToTry;
                console.log(resultToTry.formatted_address, true)

            } else {
                // First one that doesn't fit, so rest clearly won't. We can stop searching.
                resultFound = true;
                console.log(resultToTry.formatted_address, false)
            }
        }
        idx += 1;
    }
    return result;
}

const pickBestByBounds = (results: Array<google.maps.GeocoderResult>, mapBounds: google.maps.LatLngBounds): google.maps.GeocoderResult =>
    pickBest(isPlaceWithinViewport, results, mapBounds);

const pickBestByBoundsAndDistance = (results: Array<google.maps.GeocoderResult>, mapBounds: google.maps.LatLngBounds, clickedLocation: google.maps.LatLng, zoom: number): google.maps.GeocoderResult =>
    pickBest((viewportBounds: google.maps.LatLngBounds, placeBounds: google.maps.LatLngBounds) => {
        return isPlaceWithinViewportAndClose(viewportBounds, placeBounds, clickedLocation, zoom)
    }, results, mapBounds);


export enum bestResultMethod {
    BY_TYPE,
    BY_BOUNDS,
    BY_BOUNDS_AND_DISTANCE,
    USE_FIRST,
}

const getBestResult = (
    method: bestResultMethod,
    results: google.maps.GeocoderResult[],
    map: google.maps.Map,
    clickedLocation: google.maps.LatLng
) => {
    const zoom = map.getZoom();
    const bounds = map.getBounds();
    switch (method) {
        case bestResultMethod.BY_TYPE: {
            return zoom ? pickBestByType(results, zoom) : null;
        } case bestResultMethod.BY_BOUNDS: {
            return bounds ? pickBestByBounds(results, bounds) : null;
        } case bestResultMethod.BY_BOUNDS_AND_DISTANCE: {
            return (bounds && zoom) ? pickBestByBoundsAndDistance(results, bounds, clickedLocation, zoom) : null;
        } case bestResultMethod.USE_FIRST: {
            return results[0];
        } default:
            return null;
    }
}

export { getBestResult, drawBounds };