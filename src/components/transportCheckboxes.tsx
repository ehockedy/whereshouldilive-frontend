import classnames from "classnames";
import React from "react";
import { TravelModesEnum } from "../__generated__/types"
import styles from '/src/css/transportCheckboxes.css'

const TransportModes = Object.values(TravelModesEnum);

type CheckboxProps = {
    mode: TravelModesEnum;
    selected: boolean;
    onSelect: () => void;
}

const Checkbox = (props: CheckboxProps) => {
    return <button className={styles.transportCheckbox} onClick={props.onSelect}>
        <div className={classnames(styles.checkboxBox, {[styles.selected]: props.selected})}></div>
        <div className={styles.checkboxLabel}>{transportLabels[props.mode]}</div>
    </button>
}


const transportLabels: Record<TravelModesEnum, string> = {
    'cycling': 'Cycling',
    'driving': 'Driving',
    'public_transport': 'Public Transport',
    'walking': 'Walking',
}

type TranspostCheckboxesProps = {
    selectedTransportModeOptions: Array<TravelModesEnum>;
    toggleTransportModeOption: (transportMode: TravelModesEnum) => void;
}

const TransportCheckboxes = (props: TranspostCheckboxesProps) => {
    return <div className={styles.transportCheckboxes}>
        <div className={styles.transportCheckboxesTitle}>Available transport:</div>
        <div className={styles.transportCheckboxWrapper}>
            {TransportModes.map((mode) =>
                <Checkbox
                    key={mode}
                    mode={mode}
                    selected={props.selectedTransportModeOptions.includes(mode)}
                    onSelect={() => props.toggleTransportModeOption(mode)}
                />
            )}
        </div>
    </div>

}

export default TransportCheckboxes;