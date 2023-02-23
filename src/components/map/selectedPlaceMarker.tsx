import classnames from "classnames";
import React from "react";
import { PlaceType, placeTypeIcon } from "../place";
import styles from "/src/css/selectedPlaceMarker.css";
import commonStyles from "/src/css/common.css"
import MarkerIcon from "/src/assets/icons/map-pin.svg";

type SelectedPlaceMarkerProps = {
    name: string;
    type: PlaceType;
}

const SelectedPlaceMarker = (props: SelectedPlaceMarkerProps) => {
    return <div className={classnames(styles.markerContainer, commonStyles.noselect)}>
        <MarkerIcon className={classnames(styles.markerIcon,{
                [styles.potentialHome]: props.type === 'POTENTIAL_HOME',
                [styles.importantPlace]: props.type === 'IMPORTANT_PLACE',
            })}
            stroke="#000"
        />
    </div>
}

export default SelectedPlaceMarker;