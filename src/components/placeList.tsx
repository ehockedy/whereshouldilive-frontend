import classnames from "classnames";
import React, { useState } from "react";
import { PlaceType, Place, placeTypeIcon, ImportantPlace, PotentialHome } from "./place";
import styles from "/src/css/placeList.css";

type ChangeVPMInputProps = {
    place: ImportantPlace;
    importantPlaces: Array<ImportantPlace>;
    updateImportantPlaceList: (place: Array<ImportantPlace>) => void;
}

const ChangeVPMInput = ({place, importantPlaces, updateImportantPlaceList}: ChangeVPMInputProps) => {
    const [tempInputVal, setTempInputValue] = useState<string>('1');
    const [isFocused, setIsFocused] = useState<boolean>(false);

    return <div className={classnames(styles.importantPlaceEntry, styles.placeEntry)}>
        <div className={styles.entryName}>{place.name}</div>
        <input
            type={'number'}
            step={0.5}
            value={isFocused ? tempInputVal : place.visitsPerMonth.toString()}
            className={styles.entryValue}

            // Start using the temp value
            onFocus={() => {
                setIsFocused(true)
                setTempInputValue(place.visitsPerMonth.toString())
            }}
            onBlur={(e) => {
                // Update the visits per month of that place
                updateImportantPlaceList(importantPlaces.map((p: ImportantPlace) => {
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
        ></input>
    </div>
}


type PlaceListProps = {
    type: PlaceType;
    potentialHomes?: Array<PotentialHome>;
    importantPlaces?: Array<ImportantPlace>;
    updateImportantPlaceList?: (place: Array<ImportantPlace>) => void;
}

const PlaceList = (props: PlaceListProps) => {

    const isIPList = props.type === 'IMPORTANT_PLACE';
    const importantPlaces = props.importantPlaces;
    const updateImportantPlaceList = props.updateImportantPlaceList;

    return <div>
        <div className={styles.placeList}>
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
                {isIPList && importantPlaces && updateImportantPlaceList ? importantPlaces.map((place) => 
                    <ChangeVPMInput
                        key={place.id}
                        place={place}
                        importantPlaces={importantPlaces}
                        updateImportantPlaceList={updateImportantPlaceList}
                    />
                ) :
                   props.potentialHomes && props.potentialHomes.map((place, idx) => 
                    <div key={`place_${idx}`} className={styles.placeEntry}>
                        <span>{place.name}</span>
                    </div>
                )}
            </div>
        </div>
    </div>
}

export default PlaceList;