import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- ICON SETUP ---
// This function returns the red icon for "High" severity.
const getSeverityIcon = () => {
  return new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
  });
};

// --- DATA GENERATION (20 High-Severity Reports) ---
// This code now generates 20 reports, all set to "High" severity.
const trashReports = [];
const centerPoint = { lat: 10.73, lng: 76.13 }; // Center of Cheruthuruthi
const numberOfSpots = 20;

for (let i = 0; i < numberOfSpots; i++) {
  trashReports.push({
    id: `report${i + 1}`,
    // Add a small random offset to scatter the points around the center
    location: {
      latitude: centerPoint.lat + (Math.random() - 0.5) * 0.05,
      longitude: centerPoint.lng + (Math.random() - 0.5) * 0.05,
    },
    severity: "High",
    description: `High severity alert #${i + 1}`,
    status: "Reported",
  });
}

// --- MAP COMPONENT ---
const TrashMap = () => {
  const mapCenter = [centerPoint.lat, centerPoint.lng];

  return (
    <MapContainer
      center={mapCenter}
      zoom={14}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Loop through the 20 generated reports and create a red marker for each */}
      {trashReports.map((report) => (
        <Marker
          key={report.id}
          position={[report.location.latitude, report.location.longitude]}
          icon={getSeverityIcon()}
        >
          <Popup>
            <div style={{ fontFamily: "sans-serif" }}>
              <h3>Trash Report</h3>
              <p>
                <strong>Description:</strong> {report.description}
              </p>
              <p>
                <strong>Severity:</strong> {report.severity}
              </p>
              <p>
                <strong>Status:</strong> {report.status}
              </p>
              <button
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "none",
                  backgroundColor: "#E53935",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                View Details
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default TrashMap;
