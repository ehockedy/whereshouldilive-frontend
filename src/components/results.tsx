import classNames from "classnames";
import React from "react";
import { PlaceRankSummaries } from "../__generated__/types"
import { Place } from "./place";
import styles from "/src/css/results.css"

const formatTravelTime = (seconds: number) => {
    var hours   = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    return `${hours}h ${minutes}m`
}

type ResultsProps = {
    results: PlaceRankSummaries;
    potentialHomes: Array<Place>;
}

const Results = (props: ResultsProps) => {
    if (!props.results.length) {
        return null;
    }
    return <div className={styles.resultsContainer}>
        <div className={styles.results}>
            <div className={styles.mainTitle}>
                Your Results...
            </div>
            <div className={styles.titles}>
                <div>Potential Home</div>
                <div>Travel Time Per Month</div>
            </div>
            <div className={styles.resultLines}>
                {props.results.filter((result) => result.success).map((result) => {
                    const potentialHome = props.potentialHomes.find((ph) => ph.id === result.name)
                    const name = potentialHome?.name;
                    return <div className={styles.resultLine} key={result.name}>
                        <div className={styles.name}>
                            {name ? name : result.name}
                        </div>
                        <div className={styles.travelTimePerMonth}>
                            {formatTravelTime(result.totalTravelTimePerMonth)}
                        </div>
                    </div>
                })}
            </div>
        </div>
    </div>
}

export default Results;