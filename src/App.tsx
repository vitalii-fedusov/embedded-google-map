"use client";
import React, { useEffect, useState } from "react";
import classnames from "classnames";
import {
  APIProvider,
  Map,
  MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { MapMarker } from "./types/MapMarker.ts";
import { db } from "./firebase.js";
import {
  query,
  collection,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { Markers } from "./components/Markers.tsx";

const {
  REACT_APP_GOOGLE_MAPS_API_KEY,
  REACT_APP_MAP_ID,
} = process.env;

export const App: React.FC = () => {
  const position = { lat: 49.81615484961103, lng: 23.995046766797874 };
  const [positions, setPositions] = useState<MapMarker[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "positions"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let positionsArr = [];
      querySnapshot.forEach((doc) => {
        // @ts-ignore
        positionsArr.push({ ...doc.data(), id: doc.id });
      });

      setPositions(positionsArr);
    });

    return () => unsubscribe();
  }, []);

  const createPosition = async (e: MapMouseEvent) => {
    if (isDragging) {
      return;
    }

    const newPosition = {
      location: {
        lat: e.detail.latLng?.lat || 0,
        lng: e.detail.latLng?.lng || 0,
      },
      time: new Date(),
      isOpen: false,
    };

    await addDoc(collection(db, "positions"), newPosition);
  };

  const deletePosition = async (id: string) => {
    await deleteDoc(doc(db, "positions", id));
  };

  const deleteAllPositions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "positions"));
      
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
  
      console.log("All positions deleted successfully.");
    } catch (error) {
      console.error("Error deleting positions:", error);
    }
  };

  return (
    <APIProvider apiKey={REACT_APP_GOOGLE_MAPS_API_KEY || ""}>
      <div className="page">
        <Map
          className="map page__map"
          defaultCenter={position}
          mapId={REACT_APP_MAP_ID}
          defaultZoom={9}
          gestureHandling={"greedy"}
          disableDefaultUI={false}
          onClick={createPosition}
        >
          <Markers
            positions={positions} 
            setIsDragging={setIsDragging}
          />
        </Map>
      </div>
      <div className="aside page__aside">
        <div className="aside__top">
          <div>Markers</div>
          <button
            className="button"
            onClick={deleteAllPositions}
          >
            Delete All
          </button>
        </div>
        <div className="positions">
          {positions.map((marker) => (
            <div
              key={marker.id}
              className={classnames("position", {
                "position--selected": marker.isOpen,
              })}
            >
              <div>{`id: ${marker.id}`}</div>
              <div>{`lat: ${marker.location.lat}`}</div>
              <div>{`lng: ${marker.location.lng}`}</div>
              <div>{`isOpen: ${marker.isOpen}`}</div>
              {/* @ts-ignore */}
              <div>{`createdAt: ${marker.time.toDate()}`}</div>
              <button
                className="button"
                onClick={() => deletePosition(marker.id)}
              >
                Delete Marker
              </button>
            </div>
          ))}
        </div>
      </div>
    </APIProvider>
  );
};
