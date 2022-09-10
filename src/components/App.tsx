import * as React from "react";
import styles from "/src/css/App.css"
import Map from "./map"


export const App = () => {
  return (<>
    <h1 className={styles.title}>
      Where Should I Live?
    </h1>

    <Map/>
  </>
)};