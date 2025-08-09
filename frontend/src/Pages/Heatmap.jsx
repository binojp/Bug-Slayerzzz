import React, { useState, useEffect, Component } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Red icon for high-severity reports
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

// Default icon for other reports
const defaultIcon = new L.Icon({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center", padding: "20px", color: "#b91c1c" }}>
          Something went wrong while rendering the map. Please try again later.
        </div>
      );
    }
    return this.props.children;
  }
}

const TrashMap = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const mapCenter = [10.5276, 76.2144]; // Thrissur, Kerala

  // Fetch reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view reports.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/reports`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Filter out reports with invalid coordinates
        const validReports = response.data.filter(
          (report) =>
            typeof report.latitude === "number" &&
            typeof report.longitude === "number" &&
            !isNaN(report.latitude) &&
            !isNaN(report.longitude)
        );
        setReports(validReports);
        if (validReports.length < response.data.length) {
          setError(
            "Some reports have invalid locations and were not displayed."
          );
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError(
            err.response?.data?.message ||
              "Failed to fetch reports. Please try again."
          );
        }
      }
    };

    fetchReports();
  }, [navigate]);

  return (
    <ErrorBoundary>
      <div style={{ position: "relative", height: "100vh", width: "100%" }}>
        {error && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
              padding: "8px 16px",
              borderRadius: "4px",
              zIndex: 1000,
            }}
          >
            {error}
          </div>
        )}
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%", zIndex: 1 }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {reports.map((report) => (
            <Marker
              key={report._id}
              position={[report.latitude, report.longitude]}
              icon={
                report.severity === "High" ? getSeverityIcon() : defaultIcon
              }
            >
              <Popup>
                <div style={{ fontFamily: "sans-serif" }}>
                  <h3>{report.title}</h3>
                  <p>
                    <strong>Description:</strong> {report.description}
                  </p>
                  <p>
                    <strong>Type:</strong> {report.type}
                  </p>
                  <p>
                    <strong>Severity:</strong>{" "}
                    {report.severity || "Not specified"}
                  </p>
                  <p>
                    <strong>Status:</strong> {report.status || "Reported"}
                  </p>
                  {report.mediaUrls && report.mediaUrls.length > 0 && (
                    <div>
                      <strong>Media:</strong>
                      {report.mediaUrls[0].includes(".mp4") ||
                      report.mediaUrls[0].includes(".webm") ? (
                        <video
                          src={`${import.meta.env.VITE_API_URL}${
                            report.mediaUrls[0]
                          }`}
                          controls
                          style={{
                            width: "100%",
                            maxHeight: "150px",
                            marginTop: "8px",
                          }}
                        />
                      ) : (
                        <img
                          src={`${import.meta.env.VITE_API_URL}${
                            report.mediaUrls[0]
                          }`}
                          alt="Report media"
                          style={{
                            width: "100%",
                            maxHeight: "150px",
                            marginTop: "8px",
                          }}
                        />
                      )}
                    </div>
                  )}
                  <button
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "none",
                      backgroundColor: "#E53935",
                      color: "white",
                      cursor: "pointer",
                      marginTop: "8px",
                      borderRadius: "4px",
                    }}
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </ErrorBoundary>
  );
};

export default TrashMap;
