import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";

const pinIcon = new L.icon({
  iconUrl : 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
}

export default function MapView({ sendCoordinate, receivedCoords }) {
  const [ myPin, setMyPin ] = useState(null);

  const handleMapClick = (latlng) => {
    setMyPin(latlng);
    sendCoordinate(latlng);
  };

  return (
    <MapContainer center={[35.68, 139.76]} zoom={5} style={{ height: '400px' }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onClick={handleMapClick} />
      {myPin && <Marker position={myPin} icon={pinIcon} />}
      {receivedCoords && <Marker position={receivedCoords} icon={pinIcon} />}
    </MapContainer>
  )
}