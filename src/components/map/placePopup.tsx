import * as React from "react";
import styles from "/src/css/placePopup.css"
import classnames from "classnames";

type PlaceType = 'POTENTIAL_HOME' | 'IMPORTANT_PLACE'
type AddPlaceButtonProps = {
    type: PlaceType;
}
const AddPlaceButton = (props: AddPlaceButtonProps) =>
<div className={styles.addPlaceButtonContainer}>
    <button
        onClick={(e) => {
            // e.preventDefault()
            e.stopPropagation()
        }}
        className={classnames(styles.addPlaceButton, {
            [styles.green]: props.type === 'POTENTIAL_HOME',
            [styles.blue]: props.type === 'IMPORTANT_PLACE'
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
            <AddPlaceButton type={'POTENTIAL_HOME'}/>
            <AddPlaceButton type={'IMPORTANT_PLACE'}/>
        </div>
    </div>
}

export default PlacePopup;