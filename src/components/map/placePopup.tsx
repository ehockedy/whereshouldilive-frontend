import * as React from "react";
import styles from "/src/css/placePopup.css"
import classnames from "classnames";
import { Place, PlaceType } from "../place";

type AddPlaceButtonProps = {
    type: PlaceType;
    onClick: () => void;
}
const AddPlaceButton = (props: AddPlaceButtonProps) =>
<div className={styles.addPlaceButtonContainer}>
    <button
        onClick={(e) => {
            e.stopPropagation()
            props.onClick()
        }}
        className={classnames(styles.addPlaceButton, {
            [styles.potentialHome]: props.type === 'POTENTIAL_HOME',
            [styles.importantPlace]: props.type === 'IMPORTANT_PLACE'
        })}
    >
        +
    </button>
    <div className={styles.addPlaceButtonText}>
        {props.type === 'POTENTIAL_HOME' ? 'Add Potential Home' : 'Add Important Place'}
    </div>
</div>

type PlacePopupProps = {
    name: string;
    onClose: () => void
    onAddImportantPlace: () => void;
    onAddPotentialHome: () => void;
}
const PlacePopup = (props: PlacePopupProps) => {
    return <div className={styles.popup}
        // Prevent map interactions
        ref={ ref => ref && google.maps.OverlayView.preventMapHitsFrom(ref) }
    >
        <div className={styles.popupHeader}>
            <div className={styles.popupTitle}>
                {props.name}
            </div>
            <button onClick={props.onClose} className={styles.popupCancel}>&times;</button>
        </div>

        <div className={classnames(styles.popupContent, styles.popupButtons)}>
            <AddPlaceButton type={'POTENTIAL_HOME'} onClick={props.onAddPotentialHome}/>
            <AddPlaceButton type={'IMPORTANT_PLACE'} onClick={props.onAddImportantPlace}/>
        </div>
    </div>
}

export default PlacePopup;