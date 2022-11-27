import * as React from "react";
import { useState } from "react";
import styles from "/src/css/App.css"
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MapComponent, MapProps } from "./map/map";
import { Place } from "./place";
import PlaceList from "./placeList";
import TransportCheckboxes from "./transportCheckboxes";
import { getPlaceRanking } from "./queryProcessor";
import { PlaceRankSummaries, TravelModesEnum } from "../__generated__/types"

const renderMapStatus = (status: Status) => {
  return <h1>{status}</h1>;
};

const MapWrapper = (props: MapProps) => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
      return <div>Unable to load API key, does .env file exist in top level directory?</div>
  }
  return <Wrapper apiKey={API_KEY} render={renderMapStatus} libraries={['places']}>
      <MapComponent {...props}/>
  </Wrapper>
}

export const App = () => {
  // Query state
  const [potentialHomes, setPotentialHomes] = useState<Array<Place>>([]);
  const [importantPlaces, setImportantPlaces] = useState<Array<Place>>([]);
  const [transportModeOptions, setTransportModeOptions] = useState<Array<TravelModesEnum>>([TravelModesEnum.driving, TravelModesEnum.public_transport])
  const [result, setResult] = useState<PlaceRankSummaries>([]);

  // Map state
  const [focusedPlace, setFocusedPlace] = useState<Place>();

  return (<>
    <h1 className={styles.title}>
      Where Should I Live?
    </h1>

    <div className={styles.mapAndLists}>
      <div>
        <MapWrapper
          potentialHomes={potentialHomes}
          importantPlaces={importantPlaces}
          onAddPotentialHome={(p: Place) => {setPotentialHomes([...potentialHomes, p])}}
          onAddImportantPlace={(p: Place) => {setImportantPlaces([...importantPlaces, p])}}
          focusedPlace={focusedPlace}
        />
        <TransportCheckboxes
          selectedTransportModeOptions={transportModeOptions}
          toggleTransportModeOption={(mode) => {
            if (transportModeOptions.includes(mode)) {
              setTransportModeOptions(transportModeOptions.filter((m) => m != mode))
            } else {
              setTransportModeOptions([...transportModeOptions, mode])
            }
          }}
        />
      </div>
      <div className={styles.lists}>
        <PlaceList
          type={"POTENTIAL_HOME"}
          places={potentialHomes}
          updatePlaceList={setPotentialHomes}
          setFocusedPlace={setFocusedPlace}
        />
        <PlaceList
          type={"IMPORTANT_PLACE"}
          places={importantPlaces}
          updatePlaceList={setImportantPlaces}
          setFocusedPlace={setFocusedPlace}
        />
      </div>
    </div>

    <div className={styles.evaluateButtonContainer}>
      <button className={styles.submitButton} onClick={() => {
        const rankingResult = getPlaceRanking(potentialHomes, importantPlaces, transportModeOptions);
        rankingResult
          .then(res => {
            if (!res.ok) {
              throw new Error('Bad request');  // TODO handle different responses
            }
            return res.json();
          })
          .then(json => setResult(json as PlaceRankSummaries) )
          .catch( a => { console.log(a) })
      }}>
        EVALUATE
      </button>
    </div>

    <div className={styles.resultsContainer}>

    </div>

  </>
)};