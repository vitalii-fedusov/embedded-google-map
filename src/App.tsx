"use client";
import React, { useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from '@vis.gl/react-google-maps';

const { REACT_APP_GOOGLE_MAPS_API_KEY } = process.env;
const { REACT_APP_MAP_ID } = process.env;

export const App: React.FC = () => {
  const position = {lat: 53.54992, lng: 10.00678};
  const [open, setOpen] = useState(false);

  return (
    <APIProvider apiKey={REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
      <div className="page">
        <Map
          className="map page__map"
          zoom={9} 
          center={position} 
          mapId={REACT_APP_MAP_ID}
        >
          <AdvancedMarker
            position={position}
            className="advanced-marker"
            onClick={() => setOpen(true)}
          >
            <Pin
              background={"grey"}
              borderColor={"green"}
              glyphColor={"purple"}
            />
          </AdvancedMarker>

          {open && (
            <InfoWindow
              position={position}
              onCloseClick={() => setOpen(false)}
            >
              <p>I`m Hamburg</p>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
};
