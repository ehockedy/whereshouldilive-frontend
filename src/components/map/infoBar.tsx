import * as React from "react";
import classnames from "classnames"
import styles from "/src/css/infoBar.css";

export type InfoType = 'info';

type InfoBarProps = {
    shown: boolean;
    message: string;
    type: InfoType;
}

export const InfoBar = (props: InfoBarProps) => {
    return <div className={classnames(styles.infoBar, {
        [styles.hidden]: !props.shown,
        [styles.infoType]: props.type === 'info'
    })}>
        <span className={styles.icon}>
            &#128712;
        </span>
        {props.message}
    </div>
}