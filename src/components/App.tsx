import * as React from "react";
import { useEffect, useState } from "react";
import styles from "/src/css/App.css"
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MapComponent, MapProps } from "./map/map";
import { Place } from "./place";
import PlaceList from "./placeList";
import type { TransportMode } from "./types";
import TransportCheckboxes from "./transportCheckboxes";

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
  useEffect(() => {
    fetch("/rankPlacesToLiveStub", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "placesToLive": [
            "Oxford,UK",
            "Banbury,UK",
            "Bicester,UK",
            "Milton Keynes,UK"
        ],
        "importantPlaces": [
            {
                "id": "Guildford, UK",
                "visitsPerMonth" : 0.5
            },
            {
                "id": "Lewisham, UK",
                "visitsPerMonth" : 1
            },
            {
                "id": "Chester, UK",
                "visitsPerMonth" : 1
            }
        ],
        "travelModes": ["driving", "public_transport"]
      })
    })
    .then(res => {
      console.log(res);
      return res.json();
    })
    .then(json => console.log(json) )
    .catch( a => { console.log(a) })
  }, [])

  const [potentialHomes, setPotentialHomes] = useState<Array<Place>>([]);
  const [importantPlaces, setImportantPlaces] = useState<Array<Place>>([]);
  const [focusedPlace, setFocusedPlace] = useState<Place>();
  const [transportModeOptions, setTransportModeOptions] = useState<Array<TransportMode>>(['driving', 'public_transport'])

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
  </>
)};