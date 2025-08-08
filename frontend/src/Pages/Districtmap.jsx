import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/pings.css'; // CSS for the ping animation

// --- MOCK DATA ---
// You'll get this from your database. The key is the district name.
const trashHotspots = {
    Thrissur: [
        { pos: [10.5276, 76.2144], details: "Severe dump site near Sakthan Thampuran Stand", img: "https://i.imgur.com/example1.jpg" },
        { pos: [10.5310, 76.2155], details: "Moderate plastic waste near Vadakkunnathan Temple", img: "https://i.imgur.com/example2.jpg" },
    ],
    Ernakulam: [
        { pos: [9.9816, 76.2999], details: "Plastic bottles accumulation at Marine Drive", img: "https://i.imgur.com/example3.jpg" },
    ]
};

// Center coordinates for each district to zoom into
const districtCoords = {
    Thrissur: [10.52, 76.21],
    Ernakulam: [9.98, 76.29],
    // ... add all other districts
};

// This creates the custom animated ping icon
const pingIcon = new L.divIcon({
    className: 'ping',
    iconSize: [20, 20]
});

const DistrictFocusMap = ({ districtName, onBack }) => {
    const center = districtCoords[districtName] || [10.85, 76.27]; // Default to Kerala center
    const hotspots = trashHotspots[districtName] || [];

    return (
        <div className="district-map-container">
            <button onClick={onBack} className="back-button">← Back to Kerala Map</button>
            <MapContainer center={center} zoom={13} style={{ height: '600px', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Map over the hotspots for the selected district and create markers */}
                {hotspots.map((spot, index) => (
                    <Marker key={index} position={spot.pos} icon={pingIcon}>
                        <Popup>
                            <div className="popup-content">
                                <h3>Trash Hotspot</h3>
                                <p>{spot.details}</p>
                                {spot.img && <img src={spot.img} alt="Trash hotspot" style={{width: '100%'}}/>}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default DistrictFocusMap;