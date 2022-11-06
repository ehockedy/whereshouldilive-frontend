export type PlaceType = 'POTENTIAL_HOME' | 'IMPORTANT_PLACE'

export const placeTypeIcon = (type: PlaceType) => {
    if (type === 'POTENTIAL_HOME') {
        return '🏠';
    }
    return '⭐';
}

export type Place = {
    name: string;
    id: string;
    latlng: google.maps.LatLng;
    type: PlaceType;
}

export type PotentialHome = Place;

export type ImportantPlace = Place & {
    visitsPerMonth: number;
}