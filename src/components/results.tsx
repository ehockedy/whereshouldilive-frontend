import classnames from "classnames";
import React, { useState } from "react";
import { PlaceRankSummaries } from "../__generated__/types"
import { Place } from "./place";
import styles from "/src/css/results.css"

const formatTravelTime = (seconds: number) => {
    var hours   = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    return `${hours}h ${minutes}m`
}

type ResultsLineProps = {
    placeName: string,
    travelTimePerMonth: number,
}
const ResultsLine = (props: ResultsLineProps) => {
    const [expand, setExpand] = useState<boolean>(false)
    return <div className={styles.resultLineContainer}>
        <div className={styles.resultLine} >
            <div className={styles.name}>
                {props.placeName}
            </div>
            <div className={styles.travelTimePerMonth}>
                {formatTravelTime(props.travelTimePerMonth)}
            </div>
            <button className={styles.expand} onClick={() => setExpand(!expand)}>{">"}</button>
        </div>
        <div className={classnames(styles.resultLine, styles.moreInfo, {[styles.moreInfoExpanded]: expand})}>
            <div className={classnames(styles.moreInfoContent)}>
                <div>efhiwefuhewf</div>
                <div>efhiwefuhewf</div>
                <div>efhiwefuhewf</div>
            </div>
        </div>
    </div>
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
                    const name = potentialHome?.name || result.name;
                    return <ResultsLine placeName={name} travelTimePerMonth={result.totalTravelTimePerMonth} key={name} />
                })}
            </div>
        </div>
    </div>
}

export default Results;