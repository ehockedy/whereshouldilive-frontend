import classnames from "classnames";
import React, { useState } from "react";
import { Place, PlaceType, placeTypeIcon } from "./place";
import styles from "/src/css/placeList.css";
import commonstyles from "/src/css/common.css";

type ChangeVPMInputProps = {
    place: Place;
    importantPlaces: Array<Place>;
    updateImportantPlaceList: (place: Array<Place>) => void;
}

const ChangeVPMInput = ({place, importantPlaces, updateImportantPlaceList}: ChangeVPMInputProps) => {
    const [tempInputVal, setTempInputValue] = useState<string>('1');
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const vpm = place.visitsPerMonth;
    if (!vpm) {
        return null;
    }

    return <input
            type={'number'}
            step={0.25}
            value={isFocused ? tempInputVal : vpm.toString()}
            className={styles.entryValueInput}

            // Start using the temp value
            onFocus={() => {
                setIsFocused(true)
                setTempInputValue(vpm.toString())
            }}
            onBlur={(e) => {
                // Update the visits per month of that place
                updateImportantPlaceList(importantPlaces.map((p: Place) => {
                    const parsedValue = Number(e.target.value)
                    if (place.id === p.id && !isNaN(parsedValue) && parsedValue > 0) {
                        return {
                            ...p,
                            'visitsPerMonth': parsedValue
                        }
                    }
                    return p;
                }))
                setIsFocused(false)
            }}
            onChange={(e) => {
                setTempInputValue(e.target.value)
            }}
        />
}

type DeleteEntryProps = {
  updatePlaceList: (places: Place[]) => void;
  placeList: Array<Place>;
  placeToDelete: Place;
}
const DeleteEntry = ({updatePlaceList, placeList, placeToDelete}: DeleteEntryProps) => <div className={classnames(styles.entryDelete, commonstyles.noselect)}>
    <button
        onClick={() => {updatePlaceList(placeList.filter(p => p.id != placeToDelete.id))}}
        className={styles.entryDeleteCross}>&times;
    </button>
</div>


type PlaceListProps = {
    type: PlaceType;
    places: Array<Place>;
    updatePlaceList: (places: Array<Place>) => void;
    setFocusedPlace: (place: Place | undefined) => void;
}

const PlaceList = (props: PlaceListProps) => {
    const isIPList = props.type === 'IMPORTANT_PLACE';

    return <div className={styles.placeList}>
        <div className={classnames(styles.title)}>
            <div className={classnames(styles.placeListTitle, {
                [styles.potentialHomes]: props.type === 'POTENTIAL_HOME',
                [styles.importantPlaces]: props.type === 'IMPORTANT_PLACE',
            })}>
                <span>{props.type === 'POTENTIAL_HOME' ? "Potential Homes" : "Important Places"}</span>
                <span className={styles.titleIcon}>{placeTypeIcon(props.type)}</span>
            </div>
            {isIPList && <div className={styles.vpmTitle}>Visits per Month</div>}
        </div>
        <div className={styles.placeListList}>
            {isIPList ? props.places.map((place) =>
                <div
                    key={place.id}
                    className={classnames(styles.importantPlaceEntry, styles.placeEntry)}
                    onMouseOver={() => props.setFocusedPlace(place)}
                    onMouseLeave={() => props.setFocusedPlace(undefined)}
                >
                    <div>{place.name}</div>
                    <ChangeVPMInput
                        place={place}
                        importantPlaces={props.places}
                        updateImportantPlaceList={props.updatePlaceList}
                    />
                    <DeleteEntry placeList={props.places} placeToDelete={place} updatePlaceList={props.updatePlaceList}/>
                </div>
            ) :
            props.places.map((place, idx) => 
                <div
                    key={place.id}
                    className={styles.placeEntry}
                    onMouseOver={() => props.setFocusedPlace(place)}
                    onMouseLeave={() => props.setFocusedPlace(undefined)}
                >
                    <span className={styles.potentialHomeName}>{place.name}</span>
                    <DeleteEntry placeList={props.places} placeToDelete={place} updatePlaceList={props.updatePlaceList}/>
                </div>
            )}
        </div>
    </div>
}

export default PlaceList;