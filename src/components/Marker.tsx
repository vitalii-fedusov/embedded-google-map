import { AdvancedMarker, InfoWindow, Pin } from "@vis.gl/react-google-maps";
import React from "react";
import { MapMarker } from "../types/MapMarker";

type Props = {
  marker: MapMarker,
  setMarkers: (newMarkers: MapMarker[]) => void,
}

export const Marker: React.FC<Props> = ({marker, setMarkers}) => {
  const handleOpen = (e: MapMarker) => {
    console.log(e);
  };

  const handleDrag = (e: MapMarker) => {
    
  }

  return (
    <>
      <AdvancedMarker
        position={marker.location}
        className="advanced-marker"
        onClick={() => handleOpen(marker)}
        draggable={true}
        onDragEnd={(e) => console.log(e.latLng?.lat)}
      >
        <Pin background={"grey"} borderColor={"green"} glyphColor={"purple"} />
      </AdvancedMarker>

      {marker.isOpen && (
        <InfoWindow position={marker.location} onCloseClick={() => marker.isOpen = false}>
          <p>I`m Hamburg</p>
        </InfoWindow>
      )}
    </>
  );
};
