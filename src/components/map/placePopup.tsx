import * as React from "react";
import styles from "/src/css/placePopup.css"
import classnames from "classnames";
import { Place, PlaceType } from "../place";
import { useMemo, useState } from "react";

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
    onAddImportantPlace: (visitsPerMonth: number) => void;
    onAddPotentialHome: () => void;
}
const PlacePopup = (props: PlacePopupProps) => {
    const [isAddVisitsPerMonth, setIsAddVisitsPerMonth] = useState<boolean>(false);
    const [visitsPerMonth, setVisitsPerMonth] = useState('1');
    const [validVPM, setValidVPM] = useState(true);

    const SetVisitsPerMonthForm = <div className={styles.vpm}>
        <div>
            <span>Visits per month:</span>
            <input
                className={styles.vpmInput}
                type={'number'}
                step={0.5}
                onChange={e => {
                    setVisitsPerMonth(e.target.value)
                    setValidVPM(true)
                }}
                value={visitsPerMonth}>
            </input>
        </div>
        <div className={styles.vpmErrorMessage}>
            {!validVPM && "Please enter valid positive number"}
        </div>
        <button
            className={styles.vpmConfirm}
            onClick={() => {
                // Validate is a float
                const parsedValue = parseFloat(visitsPerMonth)
                if (isNaN(parsedValue) || parsedValue < 0) {
                    setValidVPM(false)
                } else {
                    props.onAddImportantPlace(parsedValue)
                }
            }
        }>
            Confirm
        </button>
    </div>

    const AddPlaceButtons = useMemo(() => <div className={classnames(styles.popupButtons)}>
        <AddPlaceButton type={'POTENTIAL_HOME'} onClick={props.onAddPotentialHome}/>
        <AddPlaceButton type={'IMPORTANT_PLACE'} onClick={() => setIsAddVisitsPerMonth(true)}/>
    </div>, [props.onAddImportantPlace, props.onAddPotentialHome])

    return <div className={styles.popup}
        // Prevent map interactions
        ref={ ref => ref && google.maps.OverlayView.preventMapHitsAndGesturesFrom(ref) }
    >
        <div className={styles.popupHeader}>
            <div className={styles.popupTitle}>
                {props.name}
            </div>
            <button onClick={props.onClose} className={styles.popupCancel}>&times;</button>
        </div>
        {isAddVisitsPerMonth ? SetVisitsPerMonthForm : AddPlaceButtons}
        <div className={styles.popupContent}></div>
    </div>
}

export default PlacePopup;