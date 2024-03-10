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
  deletePosition: (id: string) => void;
  markers: { [key: string]: Marker };
  setMarkerRef: (marker: Marker | null, key: string) => void;
  setMarkers: (value: any) => void;
};

export const Markers: React.FC<Props> = ({ 
  positions, 
  setIsDragging, 
  deletePosition,
  markers,
  setMarkerRef,
  setMarkers,
}) => {
  const map = useMap();
  const clusterer = useRef<MarkerClusterer | null>(null);

  console.log(markers);

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
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <p>{`My id is: ${position.id}`}</p>
                <button className="button" onClick={() => {
                  deletePosition(position.id);
                }}>
                  delete this marker
                </button>
              </div>
            </InfoWindow>
          )}
        </React.Fragment>
      ))}
    </>
  );
};
