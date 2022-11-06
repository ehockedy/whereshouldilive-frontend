import classnames from "classnames";
import React from "react";
import { PlaceType } from "../place";
import styles from "/src/css/selectedPlaceMarker.css";
import commonStyles from "/src/css/common.css"
import MarkerIcon from "/src/assets/icons/map-pin.svg";

type SelectedPlaceMarkerProps = {
    name: string;
    type: PlaceType;
}

const SelectedPlaceMarker = (props: SelectedPlaceMarkerProps) => {
    return <div className={styles.markerContainer}>
        <MarkerIcon className={classnames(styles.markerIcon, commonStyles.noselect,{
                [styles.potentialHome]: props.type === 'POTENTIAL_HOME',
                [styles.importantPlace]: props.type === 'IMPORTANT_PLACE',
            })}
            stroke="#000"
        />
        <span className={styles.markerEmoji}>
            {props.type === 'POTENTIAL_HOME' ? '🏠' : '⭐'}
        </span>
    </div>
}

export default SelectedPlaceMarker;