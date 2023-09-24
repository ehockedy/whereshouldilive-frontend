import { Place } from "./place";
import { LatLng, TravelModesEnum } from "../__generated__/types";

type ImportantPlaceParam = {
    id: string;
    visitsPerMonth: number;
}

const API_URL =  process.env.API_URL;
const endpoint = API_URL + '/rankPlacesToLive'

/**
 * Constructs ranking endpoint query and initiates call to the backend.
 * 
 * @param potentialHomes Array of places that are potential places to live
 * @param importantPlace Array of places that are important to consider proximity to
 * @param transportModeOptions Array of available transport types that should be considered in journey times
 * @returns A Promise for the result of the fetch
 */
export const getPlaceRanking = (
    potentialHomes: Array<Place>,
    importantPlace: Array<Place>, 
    transportModeOptions: Array<TravelModesEnum>,
) => {
    const placesToLiveParam: Array<string> = potentialHomes.map((place) => place.id);
    const importantPlaceParam: Array<ImportantPlaceParam> = importantPlace.map((place) => {
        const vpm = place.visitsPerMonth;
        if (!vpm) {
            throw new Error('Invalid important place: no visitsPerMonth parameter')
        }
        return {
            id: place.id,
            visitsPerMonth: vpm,
        }
    })

    return fetch(endpoint, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "placesToLive": placesToLiveParam,
          "importantPlaces": importantPlaceParam,
          "travelModes": transportModeOptions,
          "latLng": calulateLatLngMidpoint(potentialHomes),
        })
    })
}

const getSignedDifferece = (a: number, b: number, absoluteMax: number) => {
    const diff = a - b
    return (diff + absoluteMax) % (absoluteMax * 2) - absoluteMax;
}

export const calulateLatLngMidpoint = (places: Place[]): LatLng => {
    let latSum = 0
    let lngSum = 0
    places.forEach((place) => {
        latSum += place.latlng.lat()
        lngSum += place.latlng.lng()
    })
    const count = places.length;
    return {
        lat: latSum / count,
        lng: lngSum / count,
    }
}