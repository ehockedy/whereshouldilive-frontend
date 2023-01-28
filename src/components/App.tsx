import * as React from "react";
import { useEffect, useState } from "react";
import styles from "/src/css/App.css"
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MapComponent, MapProps } from "./map/map";
import { Place } from "./place";
import PlaceList from "./placeList";
import TransportCheckboxes from "./transportCheckboxes";
import { getPlaceRanking } from "./queryProcessor";
import { PlaceRankSummaries, TravelModesEnum } from "../__generated__/types"
import Results from "./results";
import classNames from "classnames";
import InstructionsModal from "./instructionsModal";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<PlaceRankSummaries>([
    {
      name: 'ChIJJTcn0yzDdkgRobE0ieoazrM',
      success: true,
      totalTravelTimePerMonth: 18897,
      fastestJourneys: [{
        name: 'ChIJafWcYtnBekgRn_jYjbNsYkk',
        success: true,
        travelMode: TravelModesEnum.driving,
        travelTime: 9742,
      },
      {
        name: 'ChIJ31mWt6_EdUgRoajr-bKZZpQ',
        success: true,
        travelMode: TravelModesEnum.driving,
        travelTime: 4858,
      },
      {
        name: 'ChIJoSzvQGUCdkgRBqNtgGxNqoc',
        success: true,
        travelMode: TravelModesEnum.public_transport,
        travelTime: 6726,
      },
      ],
    },
    {
      name: 'ChIJ5xOOaNPUcEgRquyg7y5e_-A',
      success: true,
      totalTravelTimePerMonth: 19157,
      fastestJourneys: [{
        name: 'ChIJafWcYtnBekgRn_jYjbNsYkk',
        success: true,
        travelMode: TravelModesEnum.driving,
        travelTime: 8824,
      },
      {
        name: 'ChIJ31mWt6_EdUgRoajr-bKZZpQ',
        success: true,
        travelMode: TravelModesEnum.driving,
        travelTime: 5654,
      },
      {
        name: 'ChIJoSzvQGUCdkgRBqNtgGxNqoc',
        success: true,
        travelMode: TravelModesEnum.public_transport,
        travelTime: 7506,
      },
      ],
    },
    {
      name: 'ChIJz_Lr9vv9cEgRzxnoIZabcOw',
      success: true,
      totalTravelTimePerMonth: 23434,
      fastestJourneys: [{
        name: 'ChIJafWcYtnBekgRn_jYjbNsYkk',
        success: true,
        travelMode: TravelModesEnum.driving,
        travelTime: 9418,
      },
      {
        name: 'ChIJ31mWt6_EdUgRoajr-bKZZpQ',
        success: true,
        travelMode: TravelModesEnum.driving,
        travelTime: 7578,
      },
      {
        name: 'ChIJoSzvQGUCdkgRBqNtgGxNqoc',
        success: true,
        travelMode: TravelModesEnum.driving,
        travelTime: 10227,
      },
      ],
    },
  ]);

  // Map state
  const [focusedPlace, setFocusedPlace] = useState<Place>();

  // Page state
  const [instructionsModalHidden, setInstructionsModalHidden] = useState<boolean>(true);

  useEffect(() => {
    // If an error message is showing, only remove it if user takes action to rectify error
    if (!!errorMessage) {
      setErrorMessage(null);
    }
  }, [potentialHomes, importantPlaces, transportModeOptions])

  return (<div className={styles.mainStructure}>
    <h1 className={styles.title}>
      Where Should I Live?
    </h1>

    <div className={styles.explanation} role="button" onClick={() => setInstructionsModalHidden(false)}>
      What is this and how does it work?
    </div>
    <InstructionsModal isHidden={instructionsModalHidden} setIsHidden={() => setInstructionsModalHidden(true)} />

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
      <div className={styles.submitButtonErrorMessage}>
        {errorMessage}
      </div>
      <button className={styles.submitButton} onClick={() => {
        if (importantPlaces.length < 1 || potentialHomes.length < 1) {
          setErrorMessage("Must have at least one Potential Home and one Important Place");
          return;
        } else if (transportModeOptions.length < 1) {
          setErrorMessage("Must have at least one transport option");
          return;
        }

        const rankingResult = getPlaceRanking(potentialHomes, importantPlaces, transportModeOptions);
        setLoading(true)
        rankingResult
          .then(res => {
            // if (!res.ok) {
            //   throw new Error('Bad request');  // TODO handle different responses
            // }
            return res.json();
          })
          .then(json => setResults(json as PlaceRankSummaries) )
          .catch(a => {
            setResults([])
            console.log(a)
          })
          .finally(() => {
            setLoading(false);
          })
      }}>
        EVALUATE
      </button>
    </div>

    {(!!results.length || loading) &&
      <Results
        results={results}
        potentialHomes={potentialHomes}
        importantPlaces={importantPlaces}
        loading={loading}
      />
    }
  </div>
)};