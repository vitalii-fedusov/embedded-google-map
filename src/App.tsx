"use client";
import React, { useState } from "react";
import { APIProvider, AdvancedMarker, InfoWindow, Map, MapMouseEvent, Pin } from "@vis.gl/react-google-maps";
import { Marker } from "./components/Marker.tsx";
import { MapMarker } from "./types/MapMarker.ts";

const { REACT_APP_GOOGLE_MAPS_API_KEY } = process.env;
const { REACT_APP_MAP_ID } = process.env;

export function generateId(arr: MapMarker[]) {
  if (arr.length === 0) {
    return 1;
  }

  const ids = arr.map((i) => i.id);

  const newId = Math.max(...ids) + 1;
  console.log(newId);

  return newId;
}

export const App: React.FC = () => {
  const position = { lat: 53.54992, lng: 10.00678 };
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const handleOpen = (e: MapMarker) => {
    console.log(e);
  };

  const onMapClick = (e: MapMouseEvent) => {
    if (isDragging) {
      return;
    }

    const marker = {
      id: generateId(markers),
      location: {
        lat: e.detail.latLng?.lat || 0,
        lng: e.detail.latLng?.lng || 0,
      },
      time: new Date(),
      isOpen: false,
      next: null,
    };

    setMarkers((prev) => {
      return [...prev, marker];
    });
  };

  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    console.log(e.latLng?.lat());

    setIsDragging(false);
  }

  return (
    <APIProvider apiKey={REACT_APP_GOOGLE_MAPS_API_KEY || ""}>
      <div className="page">
        <Map
          className="map page__map"
          zoom={9}
          center={position}
          mapId={REACT_APP_MAP_ID}
          gestureHandling={"greedy"}
          onClick={onMapClick}
        >
          {markers.map((marker) => (
            // <Marker marker={marker} key={marker.id} setMarkers={setMarkers} />
            <React.Fragment key={marker.id}>
              <AdvancedMarker
                position={marker.location}
                className="advanced-marker"
                onClick={() => handleOpen(marker)}
                draggable={true}
                onDrag={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
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
                  onCloseClick={() => (marker.isOpen = false)}
                >
                  <p>I`m Hamburg</p>
                </InfoWindow>
              )}
            </React.Fragment>
          ))}
        </Map>
      </div>
    </APIProvider>
  );
};
