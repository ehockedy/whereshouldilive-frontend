export type PlaceType = 'POTENTIAL_HOME' | 'IMPORTANT_PLACE'

export type Place = {
    name: string;
    id: string;
    latlng: google.maps.LatLng;
    type: PlaceType;
}