"use client";
import React, { useEffect, useState } from "react";
import classnames from "classnames";
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map,
  MapMouseEvent,
  Pin,
} from "@vis.gl/react-google-maps";
import { MapMarker } from "./types/MapMarker.ts";
import { db } from "./firebase.js";
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";

const { REACT_APP_GOOGLE_MAPS_API_KEY } = process.env;
const { REACT_APP_MAP_ID } = process.env;

export const App: React.FC = () => {
  const position = { lat: 53.54992, lng: 10.00678 };
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
      console.log(positionsArr);

      setPositions(positionsArr);
      console.log(positions);
    });

    return () => unsubscribe();
  }, []);

  const toggleOpen = async (selectedMarker: MapMarker) => {
    await updateDoc(doc(db, "positions", selectedMarker.id), {
      isOpen: !selectedMarker.isOpen,
    });
  };

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

  const handleDragEnd = async (
    e: google.maps.MapMouseEvent,
    marker: MapMarker
  ) => {
    const newLat = e.latLng?.lat() || 0;
    const newLng = e.latLng?.lng() || 0;

    await updateDoc(doc(db, "positions", marker.id), {
      location: {
        lat: newLat,
        lng: newLng,
      },
    });

    setIsDragging(false);
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
          {positions.map((marker, index) => (
            <React.Fragment key={index}>
              <AdvancedMarker
                position={marker.location}
                className="advanced-marker"
                onClick={() => toggleOpen(marker)}
                draggable={true}
                onDrag={() => setIsDragging(true)}
                onDragEnd={(e) => handleDragEnd(e, marker)}
              >
                <Pin
                  background={"grey"}
                  borderColor={"green"}
                  glyphColor={"purple"}
                />
              </AdvancedMarker>

              {marker.isOpen && (
                <InfoWindow
                  position={marker.location}
                  onCloseClick={() => toggleOpen(marker)}
                >
                  <p>{`My id is: ${marker.id}`}</p>
                </InfoWindow>
              )}
            </React.Fragment>
          ))}
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
