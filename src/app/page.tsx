"use client";

import dynamic from "next/dynamic";

// Dynamically import the Map component with SSR disabled
const Map = dynamic(() => import("@/components/MapComponent"), { ssr: false });

const HomePage = () => {
  // Pothole locations near RTO Pune
  const locations = [
    {
      id: "1",
      lat: 18.5312, 
      lng: 73.8619, 
      image: "/potholes/pothole1.jpg",
      timestamp: "2024-01-30 14:30:00",
    },
    {
      id: "2",
      lat: 18.5307, 
      lng: 73.8605, 
      image: "/potholes/pothole2.jpg",
      timestamp: "2024-01-30 15:10:00",
    },
    {
      id: "3",
      lat: 18.5321, 
      lng: 73.8593, 
      image: "/potholes/pothole3.jpg",
      timestamp: "2024-01-30 16:00:00",
    }
  ];
    
  
  

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Map center={{ lat: 18.5308, lng: 73.8616 }} zoom={17} locations={locations} />
    </div>
  );
};

export default HomePage;
