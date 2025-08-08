import React, { useState } from 'react';
import { ReactComponent as KeralaSvg } from './KeralaMap.svg'; // Import the SVG as a component
import Districtmap from './Districtmap'; // We will create this next
import '../styles/keralamap.css'; // We'll create this for styling

const districtNames = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 
    'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 
    'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
];

const InteractiveKeralaMap = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const handleDistrictClick = (districtName) => {
    console.log(`Zooming into ${districtName}`);
    setSelectedDistrict(districtName);
  };
  
  // If no district is selected, show the SVG map of Kerala
  if (!selectedDistrict) {
    return (
      <div className="kerala-map-container">
        <h2>Click on a District to See Trash Hotspots</h2>
        <KeralaSvg 
          onClick={(e) => {
              // The e.target.id will be the district name from the SVG path
              if (districtNames.includes(e.target.id)) {
                  handleDistrictClick(e.target.id);
              }
          }}
        />
      </div>
    );
  }

  // If a district IS selected, show the focused Leaflet map
  return (
    <DistrictFocusMap 
        districtName={selectedDistrict} 
        onBack={() => setSelectedDistrict(null)} // A function to go back
    />
  );
};

export default InteractiveKeralaMap;