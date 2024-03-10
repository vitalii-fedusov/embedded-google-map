import { AdvancedMarker, InfoWindow, Pin, useMap } from "@vis.gl/react-google-maps";
import React, { useEffect, useRef, useState } from "react";
import { MapMarker } from "../types/MapMarker";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from '@googlemaps/markerclusterer';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

type Props = {
  positions: MapMarker[];
  setIsDragging: (value: boolean) => void;
};

export const Markers: React.FC<Props> = ({ positions, setIsDragging }) => {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);

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

  const toggleOpen = async (selectedMarker: MapMarker) => {
    await updateDoc(doc(db, "positions", selectedMarker.id), {
      isOpen: !selectedMarker.isOpen,
    });
  };

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      {positions.map((position) => (
        <React.Fragment key={position.id}>
          <AdvancedMarker
            position={position.location}
            className="advanced-marker"
            onClick={() => toggleOpen(position)}
            draggable={true}
            onDrag={() => setIsDragging(true)}
            onDragEnd={(e) => handleDragEnd(e, position)}
            ref={(marker) => setMarkerRef(marker, position.id)}
          >
            <Pin
              background={"grey"}
              borderColor={"green"}
              glyphColor={"purple"}
            />
          </AdvancedMarker>

          {position.isOpen && (
            <InfoWindow
              position={position.location}
              onCloseClick={() => toggleOpen(position)}
            >
              <p>{`My id is: ${position.id}`}</p>
            </InfoWindow>
          )}
        </React.Fragment>
      ))}
    </>
  );
};
