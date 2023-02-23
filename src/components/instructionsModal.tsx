import * as React from "react";
import classnames from "classnames";
import styles from "/src/css/instructionsModal.css";
import { useCallback, useEffect } from "react";

type InstructionsModalProps = {
    isHidden: boolean;
    setIsHidden: () => void;
}

const InstructionsModal = (props: InstructionsModalProps) => {
    // Closable via ESC
    const escFunction = useCallback((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            props.setIsHidden();
        }
      }, []);
    
    useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
        document.removeEventListener("keydown", escFunction, false);
    };
    }, [escFunction]);

    return <div
        className={classnames(styles.background, {
            [styles.hidden]: props.isHidden
        })}
    >
        <div className={styles.modal}>
            <button className={styles.closeButton} onClick={props.setIsHidden}>&times;</button>
            <div className={styles.modalBody}>
                <div className={styles.sectionTitle}>What is this?</div>
                <div className={styles.sectionContent}>
                    <span className={styles.highlightWSIL}>Where Should I Live</span> is a site to help you decide the best place to live based on travel time to selected locations.
                </div>
                <div className={styles.sectionTitle}>How do I use it?</div>
                <div className={styles.sectionContent}>
                    Locations are split into two types:
                    <span className={styles.highlightPTL}> Potential Homes </span>
                    and
                    <span className={styles.highlightIP}> Important Places</span>.
                    <ul>
                        <li>
                            <span className={styles.highlightPTL}>Potential Homes </span> are places you consider living. 
                        </li>
                        <li>
                            <span className={styles.highlightIP}>Important Places </span> are places you visit regularly.
                            Each important place has a "visits per month" associated with it. Travel time to this place will
                            be multiplied by this number, so will have a direct impact on the total travel time.
                        </li>
                    </ul>
                    Use the interactive map and search bar to add places. These will appear in the relevant lists next to the map, where they can be updated or removed if necessary.
                    Different modes of transport to use can also be specified.
                </div>
                <div className={styles.sectionTitle}>How does it work?</div>
                <div className={styles.sectionContent}>
                    Once you have selected all the places, press EVALUATE.
                    For each <span className={styles.highlightPTL}>Potential Home</span> the total
                    time spent travelling to all <span className={styles.highlightIP}>Important Places</span> in a month will be calulated. The
                    results are ranked in order from lowest total time to highest.
                </div>
                <div className={styles.sectionContent}>
                    Travel times are calculated using data from Google Maps. Please note travel times may be affected by real-world events, such as traffic or public transport scheduling issues.
                </div>
            </div>
        </div>
    </div>
}

export default InstructionsModal;