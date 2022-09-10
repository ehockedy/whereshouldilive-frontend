import * as React from "react";
import { useEffect } from "react";
import styles from "/src/css/App.css"
import Map from "./map"


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

    <Map/>
  </>
)};