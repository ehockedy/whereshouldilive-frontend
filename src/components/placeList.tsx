import classnames from "classnames";
import React from "react";
import { PlaceType, Place, placeTypeIcon } from "./place";
import styles from "/src/css/placeList.css";

type PlaceListProps = {
    type: PlaceType;
    places: Array<Place>;
}

const PlaceList = (props: PlaceListProps) => {
    return <div className={styles.placeList}>
        <div className={classnames(styles.placeListTitle, {
            [styles.potentialHomes]: props.type === 'POTENTIAL_HOME',
            [styles.importantPlaces]: props.type === 'IMPORTANT_PLACE',
        })}>
            <span>{props.type === 'POTENTIAL_HOME' ? "Potential Homes" : "Important Places"}</span>
            <span className={styles.titleIcon}>{placeTypeIcon(props.type)}</span>
        </div>
        <div className={styles.placeListList}>
            {props.places.map((place, idx) => 
                <div key={`place_${idx}`}>{place.name}</div>
            )}
        </div>
    </div>
}

export default PlaceList;