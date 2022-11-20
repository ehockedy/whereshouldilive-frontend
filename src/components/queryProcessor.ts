import { Place } from "./place";
import { TravelModesEnum } from "../__generated__/types";

type ImportantPlaceParam = {
    id: string;
    visitsPerMonth: number;
}

const endpoint = '/rankPlacesToLive';


/**
 * Constructs ranking endpoint query and initiates call to the backend.
 * 
 * @param potentialHomes Array of places that are potential places to live
 * @param importantPlace Array of places that are important to consider proximity to
 * @param transportModeOptions Array of available transport ypes that should be considered in jounrey times
 * @returns A Promise for the result of the fetch
 */
export const getPlaceRanking = (
    potentialHomes: Array<Place>,
    importantPlace: Array<Place>, 
    transportModeOptions: Array<TravelModesEnum>
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

    console.log('IP:', importantPlaceParam)
    console.log('PH:', placesToLiveParam)
    console.log('TM:', transportModeOptions)
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
        })
    })
}