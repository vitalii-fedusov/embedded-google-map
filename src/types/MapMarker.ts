export type MapMarker = {
  id: string,
  location: {
    lat: number,
    lng: number,
  },
  time: Date,
  isOpen: boolean,
  next: null | MapMarker,
}
