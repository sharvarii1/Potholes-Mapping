'use client'; // Ensures it runs only on the client side

import { memo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  Popup,
  ZoomControl,
} from "react-leaflet";
import { Icon, LatLngLiteral, LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import Image from "next/image";


type MapType = "roadmap" | "satellite" | "hybrid" | "terrain";

type MapLocation = {
    id: string;
    lat: number;
    lng: number;
    image: string;  // Path to the pothole image
    timestamp: string;  // ISO date string or formatted date-time
  };

type MapProps = {
  center: LatLngLiteral;
  zoom: number;
  locations: MapLocation[];
};

const SelectedLocation: React.FC<{ center: LatLngLiteral }> = ({ center }) => {
  const map = useMap();
  map.panTo(center, { animate: true });
  return null;
};

// eslint-disable-next-line react/display-name
const MapComponent: React.FC<MapProps> = memo(({ center, zoom, locations }) => {
  const [mapType, setMapType] = useState<MapType>("roadmap");
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | undefined>();

  const getUrl = () => {
    const mapTypeUrls: Record<MapType, string> = {
      roadmap: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      satellite: "http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}",
      hybrid: "http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}",
      terrain: "http://mt0.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}",
    };
    return mapTypeUrls[mapType];
  };

  const mapMarkIcon = new Icon({
    iconUrl: "/map-marker.png", // Ensure this file is available in the public folder
    iconSize: [47, 55],
  });

  const mapMarkActiveIcon = new Icon({
    iconUrl: "/active-map-marker.png", // Ensure this file is available in the public folder
    iconSize: [57, 65],
  });

  // Restrict map movement to a small bounding box around RTO Pune
  const bounds = new LatLngBounds(
    { lat: 18.5280, lng: 73.8590 }, // Southwest corner
    { lat: 18.5335, lng: 73.8650 } // Northeast corner
  );

  const renderMarks = () =>
    locations.map((location) => (
        <Marker
  key={location.id}
  icon={location.id === selectedLocation?.id ? mapMarkActiveIcon : mapMarkIcon}
  position={{ lat: location.lat, lng: location.lng }}
  eventHandlers={{
    click: () => setSelectedLocation(location),
  }}
>
  {/* Display Image in Popup */}
  <Popup>
    <div style={{ textAlign: "center" }}>
      <Image
        src={location.image}
        alt="Pothole"
        width={200}
        height={150}
        style={{ borderRadius: "10px" }}
      />
      <p><b>Pothole ID:</b> {location.id}</p>
      <p><b>Timestamp:</b> {location.timestamp}</p>
    </div>
  </Popup>
</Marker>

    ));

  return (
    <>
      <div
        style={{
          width: "80%",
          height: "80vh",
          borderRadius: "20px",
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={center}
          zoom={zoom}
          minZoom={15} // Restrict zooming out too much
          maxZoom={19} // Allow close-up zooming
          maxBounds={bounds} // Keep map restricted within RTO Pune area
          zoomControl={true}
          attributionControl={false}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer url={getUrl()} />
          {selectedLocation && <SelectedLocation center={selectedLocation} />}
          {renderMarks()}
          <ZoomControl position="topright" />
        </MapContainer>
      </div>
      <div style={{ display: "flex", marginTop: "10px", gap: "20px" }}>
        <button onClick={() => setMapType("roadmap")}>Roadmap</button>
        <button onClick={() => setMapType("satellite")}>Satellite</button>
        <button onClick={() => setMapType("hybrid")}>Hybrid</button>
        <button onClick={() => setMapType("terrain")}>Terrain</button>
      </div>
    </>
  );
});

export default MapComponent;
