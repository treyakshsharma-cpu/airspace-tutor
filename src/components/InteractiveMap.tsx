"use client";
import * as React from "react";
import dynamic from "next/dynamic";

// Dynamically import react-map-gl to avoid SSR issues
const Map = dynamic(() => import("react-map-gl").then(mod => mod.Map), { ssr: false });

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1IjoiZGVtb3VzZXIiLCJhIjoiY2xkZ3Z2b2JwMDAwZzQwcGZ6b2Z6b2J2dSJ9.2vQw8vQw8vQw8vQw8vQw8vQw8vQw8vQw8vQw8vQ"; // Replace with your token

export default function InteractiveMap() {
  const [viewState, setViewState] = React.useState({
    longitude: -95.7129,
    latitude: 37.0902,
    zoom: 3.5,
  });

  // Example airspace zones (static for demo)
  const airspaceZones = [
    {
      id: 1,
      name: "Class B Airspace (JFK)",
      longitude: -73.7781,
      latitude: 40.6413,
      color: "#00f2ff",
    },
    {
      id: 2,
      name: "Class C Airspace (ORD)",
      longitude: -87.9073,
      latitude: 41.9742,
      color: "#ff00c8",
    },
  ];

  return (
    <div className="w-full h-72 rounded-xl overflow-hidden border border-blue-400 shadow-lg">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={viewState}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        style={{ width: "100%", height: "100%" }}
        onMove={evt => setViewState(evt.viewState)}
      >
        {airspaceZones.map(zone => (
          <div
            key={zone.id}
            style={{
              position: "absolute",
              left: `calc(50% + ${(zone.longitude - viewState.longitude) * 10}px)` ,
              top: `calc(50% - ${(zone.latitude - viewState.latitude) * 10}px)` ,
              color: zone.color,
              fontWeight: "bold",
              pointerEvents: "none",
            }}
          >
            ● {zone.name}
          </div>
        ))}
      </Map>
    </div>
  );
}
