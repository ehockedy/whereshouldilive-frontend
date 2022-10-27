import * as React from "react";
import { useEffect } from "react";
import styles from "/src/css/App.css"
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MapComponent } from "./map/map";

const renderMapStatus = (status: Status) => {
  return <h1>{status}</h1>;
};

const MapWrapper = () => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
      return <div>Unable to load API key, does .env file exist in top level directory?</div>
  }
  return <Wrapper apiKey={API_KEY} render={renderMapStatus} libraries={['places']}>
      <MapComponent/>
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



  return (<>
    <h1 className={styles.title}>
      Where Should I Live?
    </h1>

    <div className={styles.mapAndLists}>
      <MapWrapper />
    </div>
  </>
)};