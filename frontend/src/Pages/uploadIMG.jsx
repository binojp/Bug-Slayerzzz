import React, { useState, useRef, useEffect } from 'react';

// Assuming lucide-react is installed, as per your package.json
// npm install lucide-react
import { Trash2, Camera, UploadCloud, MapPin, Video, X, LoaderCircle } from 'lucide-react';

// Helper Component: Media Preview
// This component handles rendering a preview for selected images or videos.
const MediaPreview = ({ file, onRemove }) => {
  const fileType = file.type.split('/')[0];

  return (
    <div className="relative w-24 h-24 rounded-lg overflow-hidden group border-2 border-gray-300">
      {fileType === 'image' ? (
        <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
      ) : (
        <video src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
        <button
          onClick={onRemove}
          className="p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300"
          aria-label="Remove file"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};


// Helper Component: File Uploader
// A reusable component for the file upload area.
const FileUploader = ({ files, setFiles, maxFiles, mode }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    if (files.length + newFiles.length <= maxFiles) {
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    } else {
      alert(`You can only upload a maximum of ${maxFiles} file(s).`);
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  // Triggers the hidden file input when the upload area is clicked
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full p-6 bg-white rounded-2xl mt-6 border border-gray-200 shadow-sm">
      <div
        className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:border-indigo-500 hover:bg-gray-100 transition-all duration-300"
        onClick={triggerFileSelect}
      >
        <UploadCloud size={40} className="mb-2" />
        <p className="font-semibold">Tap to upload media</p>
        <p className="text-xs">
          {mode === 'report' ? '1 Photo or Video' : 'Up to 2 Photos or Videos'}
        </p>
      </div>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={maxFiles > 1}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*"
        // The 'capture' attribute suggests the OS to open the camera directly
        capture="environment"
      />
      {/* Previews of selected files */}
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700 mb-2">Selected Files:</h3>
          <div className="flex flex-wrap gap-4">
            {files.map((file, index) => (
              <MediaPreview key={index} file={file} onRemove={() => handleRemoveFile(index)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


// Main Page Component
const UploadPage = () => {
  // State to manage which option is selected: 'report' or 'cleanup'
  const [mode, setMode] = useState('report');
  
  // State for files for each mode
  const [reportFiles, setReportFiles] = useState([]);
  const [cleanupFiles, setCleanupFiles] = useState([]);
  
  // State for location tracking
  const [location, setLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationError, setLocationError] = useState('');
  
  // Handler for the location tracking button
  const handleTrackLocation = () => {
    setIsTracking(true);
    setLocationError('');
    setLocation(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsTracking(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        setIsTracking(false);
      },
      (error) => {
        setLocationError(`Error getting location: ${error.message}`);
        setIsTracking(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };
  
  // Reset files when mode changes
  useEffect(() => {
      setReportFiles([]);
      setCleanupFiles([]);
  }, [mode]);


  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Make a Report</h1>
        <p className="text-gray-500 text-center mb-8">Choose your report type and upload media.</p>

        {/* --- MODIFIED: Segmented Control Button --- */}
        <div className="flex w-full bg-gray-200 rounded-full p-1.5 shadow-inner">
            <button
                onClick={() => setMode('report')}
                className={`w-1/2 py-3 rounded-full text-center font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    mode === 'report' 
                    ? 'bg-red-500 text-white shadow-md ring-2 ring-red-300' 
                    : 'text-gray-500 hover:bg-gray-300'
                }`}
            >
                <Trash2 size={20} />
                <span>Report Waste</span>
            </button>
            <button
                onClick={() => setMode('cleanup')}
                className={`w-1/2 py-3 rounded-full text-center font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    mode === 'cleanup' 
                    ? 'bg-emerald-500 text-white shadow-md ring-2 ring-emerald-300' 
                    : 'text-gray-500 hover:bg-gray-300'
                }`}
            >
                <Camera size={20} />
                <span>Report Cleanup</span>
            </button>
        </div>
        {/* --- END OF MODIFICATION --- */}


        {/* Conditional Rendering for Uploaders */}
        <div className="mt-4">
          {mode === 'report' ? (
            <FileUploader files={reportFiles} setFiles={setReportFiles} maxFiles={1} mode="report" />
          ) : (
            <FileUploader files={cleanupFiles} setFiles={setCleanupFiles} maxFiles={2} mode="cleanup" />
          )}
        </div>
        
        {/* Location Button */}
        <div className="mt-8 flex flex-col items-center">
            <button 
                onClick={handleTrackLocation} 
                disabled={isTracking}
                className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white font-bold py-4 rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {isTracking ? (
                    <>
                        <LoaderCircle size={24} className="animate-spin" />
                        <span>Acquiring Location...</span>
                    </>
                ) : (
                   <>
                        <MapPin size={24} />
                        <span>Track Live Location</span>
                   </>
                )}
            </button>
            {location && (
                <div className="mt-4 text-center bg-indigo-100 p-3 rounded-lg text-indigo-700 text-sm font-medium">
                    Location Acquired: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                </div>
            )}
            {locationError && (
                 <div className="mt-4 text-center bg-red-100 p-3 rounded-lg text-red-700 text-sm font-medium">
                    {locationError}
                </div>
            )}
        </div>

      </div>
    </div>
  );
};


// This is the main App component that renders our page.
// In your actual project, you would import UploadPage and use it in your router.
export default function App() {
  return <UploadPage />;
}
