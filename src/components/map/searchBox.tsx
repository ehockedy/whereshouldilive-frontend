import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from '/src/css/searchBox.css'

type SearchBoxProps = {
    map: google.maps.Map;
    onPlacesChanged: (result: google.maps.places.PlaceResult) => void;
}

const SearchBox = ({map, onPlacesChanged}: SearchBoxProps) => {
    const input = useRef<HTMLInputElement>(null);
    const [searchBox, setSearchBox] = useState<google.maps.places.Autocomplete>();

    const handleOnPlacesChanged = useCallback(() => {
        if (onPlacesChanged && searchBox) {
            const placeResults = searchBox.getPlace();
            if (placeResults) {
                onPlacesChanged(placeResults);
            }
        }
    }, [onPlacesChanged, searchBox]);

    useEffect(() => {
        if (!searchBox && map && input.current) {
            setSearchBox(new google.maps.places.Autocomplete(input.current,{
                fields: ['formatted_address', 'place_id', 'geometry']
            }))
            map.controls[google.maps.ControlPosition.RIGHT_TOP].push(input.current);
        }

        // return () => {
        //     // TODO clean up
        // };
    }, [map, handleOnPlacesChanged]);

    useEffect(() => {
        if (searchBox) {
            searchBox.addListener('place_changed', handleOnPlacesChanged);
        }
    }, [searchBox, handleOnPlacesChanged])

    return <input
        ref={input}
        placeholder={"Search for a place"}
        type="text"
        className={styles.searchBoxInput}
    />;
};

export default SearchBox;