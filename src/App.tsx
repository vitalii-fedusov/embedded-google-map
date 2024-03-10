"use client";
import React, { useEffect, useState } from "react";
import { APIProvider, Map, MapMouseEvent } from "@vis.gl/react-google-maps";
import { MapMarker } from "./types/MapMarker.ts";
import { db } from "./firebase.js";
import {
  query,
  collection,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { Markers } from "./components/Markers.tsx";
import { Aside } from "./components/Aside.tsx";
import type { Marker } from '@googlemaps/markerclusterer';

const { REACT_APP_GOOGLE_MAPS_API_KEY, REACT_APP_MAP_ID } = process.env;

export const App: React.FC = () => {
  const position = { lat: 49.81615484961103, lng: 23.995046766797874 };
  const [positions, setPositions] = useState<MapMarker[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prevMarkers) => {
      if (!marker || prevMarkers[key]) {
        return prevMarkers;
      }
  
      return { ...prevMarkers, [key]: marker };
    });
  };

  // useEffect(() => {
  //   const newMarkers = {...markers};
  
  //   for (const key in markers) {
  //     if (positions.some(item => item.id === key)) {
  //       continue;
  //     } else {
  //       delete markers[key];
  //     }
  //   }
  
  //   setMarkers(newMarkers);
  // }, [positions]);

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

  useEffect(() => {
    positions.map((item, index) => {
      if (positions.length <= 1) {
        return item;
      }

      if (index < positions.length - 1) {
        updateDoc(doc(db, "positions", positions[index].id), {
          next: positions[index + 1].id,
        });
      }

      return item;
    });
  }, [positions]);

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
      next: null,
    };

    await addDoc(collection(db, "positions"), newPosition);
  };

  const deletePosition = async (id: string) => {
    await deleteDoc(doc(db, "positions", id));
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
            deletePosition={deletePosition}
            markers={markers}
            setMarkerRef={setMarkerRef}
            setMarkers={setMarkers}
          />
        </Map>
      </div>
      <Aside positions={positions} deletePosition={deletePosition} setMarkers={setMarkers} />
    </APIProvider>
  );
};
