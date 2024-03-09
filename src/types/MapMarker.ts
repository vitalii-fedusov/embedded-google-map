export type MapMarker = {
  id: number,
  location: {
    lat: number,
    lng: number,
  },
  time: Date,
  isOpen: boolean,
  next: null | MapMarker,
}
