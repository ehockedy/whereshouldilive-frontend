import classnames from "classnames";
import React, { useState } from "react";
import { JourneySummary, PlaceRankSummaries, TravelModesEnum } from "../__generated__/types"
import { Place } from "./place";
import styles from "/src/css/results.css"

const travelModeToString = (travelMode: TravelModesEnum): string => {
    switch (travelMode) {
        case TravelModesEnum.cycling:
            return "Cycling";
        case TravelModesEnum.driving:
            return "Driving";
        case TravelModesEnum.public_transport:
            return "Public transport";
        case TravelModesEnum.walking:
            return "Walking";
    }
}

const formatTravelTime = (seconds: number) => {
    var hours   = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    return `${hours}h ${minutes}m`
}

type JourneyLineProps = {
    journey: JourneySummary;
    importantPlaceName: string;
}

const JourneyLine = ({journey, importantPlaceName}: JourneyLineProps) => {
    return <div className={classnames(styles.journeyLine)}>
        <div>{importantPlaceName}</div>
        {journey.success ? 
            <div className={styles.journeyLineTimeTravel}>
                <span>{travelModeToString(journey.travelMode)}</span>
                <span>{formatTravelTime(journey.travelTime)}</span>
            </div> :
            <div className={styles.journeyError}>⚠ Unable to evaluate journey</div>} 
    </div>
};

type ResultsLineProps = {
    placeName: string,
    travelTimePerMonth: number,
    fastestJourneys?: JourneySummary[],
    importantPlaces: Array<Place>,
}
const ResultsLine = (props: ResultsLineProps) => {
    const [expand, setExpand] = useState<boolean>(false)
    return <div className={styles.resultLineContainer}>
        <div className={classnames(styles.resultLine, styles.resultLineMainLine)} >
            <div className={styles.name}>
                {props.placeName}
            </div>
            <div className={styles.travelTimePerMonth}>
                {props.travelTimePerMonth ? formatTravelTime(props.travelTimePerMonth) : '-'}
            </div>
            <button
                className={styles.expand}
                onClick={() => setExpand(!expand)}>
                    <span className={classnames(styles.expandButtonUp, {[styles.expandButtonDown]: !expand})}>
                        {">"}
                    </span>
            </button>
        </div>
        <div className={classnames(styles.resultLine, styles.moreInfo, {[styles.moreInfoExpanded]: expand})}>
            {props.fastestJourneys && props.fastestJourneys.length
                ? <div className={classnames(styles.moreInfoContent)}>
                    <div className={styles.moreInfoTitle}>Journey breakdown</div>
                    {props.fastestJourneys.map((journey) => {
                        const importantPlaceName = props.importantPlaces.find(place => place.id === journey.name)
                        return importantPlaceName
                            ? <JourneyLine journey={journey} key={journey.name} importantPlaceName={importantPlaceName.name}/>
                            : null;
                    })}
                  </div>
                : <div>No succesful journies</div>}

        </div>
    </div>
}


type ResultsProps = {
    results: PlaceRankSummaries;
    potentialHomes: Array<Place>;
    importantPlaces: Array<Place>;
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
                {props.results.map((result) => {
                    const potentialHome = props.potentialHomes.find((ph) => ph.id === result.name)
                    const name = potentialHome?.name || result.name;
                    return <ResultsLine
                        key={name}
                        placeName={name}
                        travelTimePerMonth={result.totalTravelTimePerMonth}
                        fastestJourneys={result.fastestJourneys}
                        importantPlaces={props.importantPlaces}
                    />
                })}
            </div>
        </div>
    </div>
}

export default Results;