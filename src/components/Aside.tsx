import classNames from 'classnames';
import { collection, deleteDoc, getDocs } from 'firebase/firestore';
import React from 'react';
import { db } from '../firebase';
import { MapMarker } from '../types/MapMarker';
import type { Marker } from '@googlemaps/markerclusterer';

type Props = {
  positions: MapMarker[];
  deletePosition: (id: string) => void;
  setMarkers: (value: { [key: string]: Marker }) => void;
};

export const Aside: React.FC<Props> = ({positions, deletePosition, setMarkers}) => {
  const deleteAllPositions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "positions"));

      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {}
  };

  return (
    <div className="aside page__aside">
        <div className="aside__top">
          <h1>Markers</h1>
          <button className="button" onClick={deleteAllPositions}>
            Delete All
          </button>
        </div>
        <div className="positions">
          {positions.map((marker, index) => (
            <div
              key={marker.id}
              className={classNames("position", {
                "position--selected": marker.isOpen,
              })}
            >
              <div>{`index: ${index}`}</div>
              <div>{`id: ${marker.id}`}</div>
              <div>{`lat: ${marker.location.lat}`}</div>
              <div>{`lng: ${marker.location.lng}`}</div>
              <div>{`isOpen: ${marker.isOpen}`}</div>
              {/* @ts-ignore */}
              <div>{`createdAt: ${marker.time.toDate()}`}</div>
              {marker.next && <div>{`nextPosId: ${marker.next}`}</div>}
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
  )
}