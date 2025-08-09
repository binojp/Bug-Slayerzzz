import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // Import axios for API calls
import {
  Trash2,
  Camera,
  UploadCloud,
  MapPin,
  X,
  LoaderCircle,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

// Helper function to convert a file to a base64 string
const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); // Get only the base64 part
    reader.onerror = (error) => reject(error);
});

// Media Preview with Analysis Status
const MediaPreview = ({ file, onRemove, analysisStatus }) => {
  const fileType = file.type.split('/')[0];

  return (
    <div className="relative w-24 h-24 rounded-lg overflow-hidden group border border-gray-200">
      {fileType === 'image' ? (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <video
          src={URL.createObjectURL(file)}
          className="w-full h-full object-cover"
        />
      )}
      {/* Analysis Overlay */}
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">
        {analysisStatus === 'analyzing' && <LoaderCircle className="animate-spin" />}
        {analysisStatus === 'verified' && <ShieldCheck className="text-green-400" />}
        {analysisStatus === 'invalid' && <ShieldAlert className="text-red-400" />}
      </div>
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X size={12} />
      </button>
    </div>
  );
};

// File Uploader
const FileUploader = ({ onFilesSelected, maxFiles, mode }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    onFilesSelected(newFiles);
  };

  return (
    <div className="w-full p-6 bg-white rounded-2xl mt-6 border border-gray-200 shadow-sm">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-full h-40 border-2 border-dashed border-emerald-300 rounded-xl flex flex-col items-center justify-center text-emerald-600 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300"
      >
        <UploadCloud size={40} className="mb-2" />
        <p className="font-semibold">Tap to upload media</p>
        <p className="text-xs text-emerald-500">
          {mode === 'report' ? '1 Photo or Video' : 'Up to 2 Photos or Videos'}
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple={maxFiles > 1}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,video/*"
        capture="environment"
      />
    </div>
  );
};

export default function UploadImg() {
  const [mode, setMode] = useState('report');
  const [files, setFiles] = useState([]);
  const [analysisStatus, setAnalysisStatus] = useState('idle'); // idle, analyzing, verified, invalid
  const [analysisError, setAnalysisError] = useState('');
  const [location, setLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationError, setLocationError] = useState('');

  const maxFiles = mode === 'report' ? 1 : 2;

  const handleFileSelection = async (selectedFiles) => {
    if (files.length + selectedFiles.length > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} file(s).`);
      return;
    }

    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);
    setAnalysisStatus('analyzing');
    setAnalysisError('');

    // --- Gemini API Call for Garbage Detection ---
    try {
      const firstFile = newFiles[0];
      const base64Data = await fileToBase64(firstFile);
      
      const prompt = "Is this an image of trash, waste, litter, or garbage? Answer with a simple JSON object: {\"is_trash\": boolean}.";
      
      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              { inlineData: { mimeType: firstFile.type, data: base64Data } }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              is_trash: { type: "BOOLEAN" },
            },
          },
        },
      };

      const apiKey = "AIzaSyCjbRIxZPp_tpBnS-v9glJFCYoyL-CGbzs";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(`API request failed: ${errorBody.error.message}`);
      }

      const result = await response.json();
      
      if (!result.candidates || result.candidates.length === 0 || !result.candidates[0].content || !result.candidates[0].content.parts) {
          console.error("Invalid API response:", result);
          if (result.candidates && result.candidates[0].finishReason === 'SAFETY') {
              throw new Error("Image was blocked for safety reasons.");
          }
          throw new Error("API returned an empty or invalid response.");
      }

      const jsonText = result.candidates[0].content.parts[0].text;
      const parsedResult = JSON.parse(jsonText);

      if (parsedResult.is_trash) {
        setAnalysisStatus('verified');
      } else {
        setAnalysisStatus('invalid');
        setAnalysisError("This doesn't look like trash. Please upload a different photo.");
        setTimeout(() => setFiles([]), 3000);
      }
    } catch (error) {
      console.error("Gemini verification error:", error);
      setAnalysisStatus('invalid');
      setAnalysisError(`Verification failed: ${error.message}`);
      setTimeout(() => setFiles([]), 3000);
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    if (files.length - 1 === 0) {
      setAnalysisStatus('idle');
      setAnalysisError('');
    }
  };

  const handleTrackLocation = () => {
    setIsTracking(true);
    setLocationError('');
    setLocation(null);
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
  
  const handleSubmitReport = () => {
      console.log("Submitting verified report:", { files, location });
      alert("Report submitted successfully!");
      setFiles([]);
      setLocation(null);
      setAnalysisStatus('idle');
  }

  useEffect(() => {
    setFiles([]);
    setAnalysisStatus('idle');
    setAnalysisError('');
  }, [mode]);
  
  const isSubmittable = analysisStatus === 'verified' && location !== null;

  return (
    <div className="bg-emerald-50 min-h-screen text-gray-800 font-sans flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 text-emerald-700">
          Make a Report
        </h1>
        <p className="text-emerald-600 text-center mb-8">
          Upload a photo of waste to earn points.
        </p>

        <div className="flex w-full bg-emerald-100 rounded-full p-1.5 shadow-inner">
          <button
            onClick={() => setMode('report')}
            className={`w-1/2 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${mode === 'report' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-600 hover:bg-emerald-200'}`}
          >
            <Trash2 size={20} /><span>Report Waste</span>
          </button>
          <button
            onClick={() => setMode('cleanup')}
            className={`w-1/2 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${mode === 'cleanup' ? 'bg-emerald-600 text-white shadow-md' : 'text-emerald-600 hover:bg-emerald-200'}`}
          >
            <Camera size={20} /><span>Report Cleanup</span>
          </button>
        </div>

        <FileUploader
          onFilesSelected={handleFileSelection}
          maxFiles={maxFiles}
          mode={mode}
        />

        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold text-gray-700 mb-2">Verification Status:</h3>
            <div className="flex flex-wrap gap-4">
              {files.map((file, index) => (
                <MediaPreview
                  key={index}
                  file={file}
                  onRemove={() => handleRemoveFile(index)}
                  analysisStatus={analysisStatus}
                />
              ))}
            </div>
            {analysisError && (
              <p className="text-sm text-red-600">{analysisError}</p>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-4">
          <button
            onClick={handleTrackLocation}
            disabled={isTracking}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-bold py-3 rounded-full hover:bg-blue-700 transition-all shadow-lg disabled:bg-gray-400"
          >
            {isTracking ? <LoaderCircle className="animate-spin" /> : <MapPin />}
            <span>{location ? 'Location Acquired!' : 'Step 1: Get Location'}</span>
          </button>

          <button
            onClick={handleSubmitReport}
            disabled={!isSubmittable}
            className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white font-bold py-4 rounded-full hover:bg-emerald-700 transition-all shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Sparkles size={20} />
            <span>Step 2: Submit Verified Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
