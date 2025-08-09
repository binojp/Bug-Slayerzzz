import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Award,
  AlertTriangle,
  Map,
  Thermometer,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Star,
  ChevronRight,
  LogOut,
  Eye,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import TrashMap from "./Heatmap";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ReportForm({ token, onReportSubmitted }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("report");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationName, setLocationName] = useState("");
  const [severity, setSeverity] = useState("Low");
  const [media, setMedia] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !type || !media) {
      setError("All fields are required, including media");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("type", type);
    if (latitude) formData.append("latitude", latitude);
    if (longitude) formData.append("longitude", longitude);
    if (locationName) formData.append("location", locationName);
    if (type === "report") formData.append("severity", severity);
    formData.append("media", media);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/reports`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Report submission response:", response.data);
      setError(null);
      setTitle("");
      setDescription("");
      setType("report");
      setLatitude("");
      setLongitude("");
      setLocationName("");
      setSeverity("Low");
      setMedia(null);
      onReportSubmitted();
    } catch (err) {
      console.error(
        "Report submission error:",
        err.response?.data || err.message
      );
      setError(err.response?.data?.message || "Failed to submit report");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg p-2 text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg p-2 text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border rounded-lg p-2 text-sm"
        >
          <option value="report">Report</option>
          <option value="cleanup">Cleanup</option>
        </select>
      </div>
      {type === "report" && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Severity
          </label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="w-full border rounded-lg p-2 text-sm"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Latitude
        </label>
        <input
          type="number"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          className="w-full border rounded-lg p-2 text-sm"
          step="any"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Longitude
        </label>
        <input
          type="number"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          className="w-full border rounded-lg p-2 text-sm"
          step="any"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location Name
        </label>
        <input
          type="text"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          className="w-full border rounded-lg p-2 text-sm"
          placeholder="Enter location name or use geolocation"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Media</label>
        <input
          type="file"
          accept="image/jpeg,image/png,video/mp4,video/webm"
          onChange={(e) => setMedia(e.target.files[0])}
          className="w-full text-sm"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors text-sm"
      >
        Submit Report
      </button>
    </form>
  );
}

function UserDash() {
  const navigate = useNavigate();
  const [mapToggle, setMapToggle] = useState("heatmap");
  const [userStats, setUserStats] = useState({});
  const [recentPoints, setRecentPoints] = useState([]);
  const [reportStatuses, setReportStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    if (!token) {
      console.error("No token found in localStorage");
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    console.log("Fetching data with token:", token);
    console.log("Sending request with headers:", {
      Authorization: `Bearer ${token}`,
    });

    try {
      // Fetch user stats
      const userResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("User API response:", userResponse.data);
      setUserStats(userResponse.data);

      // Fetch reports
      const reportsResponse = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reports`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Reports API response:", reportsResponse.data);

      // Transform reports for recentPoints
      const pointsData = reportsResponse.data
        .filter((report) => report.user?._id === userResponse.data.id)
        .map((report) => ({
          id: report._id,
          action:
            report.type === "report"
              ? `Reported ${report.title}`
              : `Participated in ${report.title}`,
          points: report.severity === "High" ? 50 : 25,
          date: new Date(report.createdAt).toLocaleDateString(),
          type: report.type,
        }));
      setRecentPoints(pointsData);

      // Transform reports for reportStatuses
      const statusesData = reportsResponse.data
        .filter((report) => report.user?._id === userResponse.data.id)
        .map((report) => ({
          id: report._id,
          title: report.title,
          location: report.location || "Location not provided",
          status: report.status.toLowerCase(),
          points: report.severity === "High" ? 50 : 0,
          date: new Date(report.createdAt).toLocaleDateString(),
        }));
      setReportStatuses(statusesData);

      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("API fetch error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        console.error("Unauthorized, clearing token");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to connect to the server. Please check if the server is running."
        );
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "reported":
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-700";
      case "reported":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPointTypeIcon = (type) => {
    switch (type) {
      case "report":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case "cleanup":
        return <Trash2 className="w-5 h-5 text-green-500" />;
      case "verification":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Star className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading)
    return <div className="text-center text-gray-600">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="relative">
              <svg className="w-20 h-20 sm:w-24 sm:h-24">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="283"
                  strokeDashoffset={
                    283 *
                    (1 - (userStats.rank || 1) / (userStats.totalUsers || 100))
                  }
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-emerald-600">
                  #{userStats.rank || 1}
                </span>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {userStats.name || "User"}
              </h2>
              <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1 mt-1">
                <MapPin className="w-4 h-4" /> {userStats.city || "Unknown"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Top{" "}
                {Math.round(
                  ((userStats.rank || 1) / (userStats.totalUsers || 100)) * 100
                )}
                % of {(userStats.totalUsers || 100).toLocaleString()} users
              </p>
            </div>
            <div className="flex flex-col items-center sm:items-end gap-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span className="text-lg font-semibold text-gray-800">
                  {userStats.totalPoints || 0} Points
                </span>
              </div>
              <p className="text-xs text-emerald-600">
                +{userStats.monthlyPoints || 0} this month
              </p>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:underline flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                Report Waste Issues
              </h2>
              <p className="text-gray-600 text-sm sm:text-base mb-4">
                Spotted overflowing bins, illegal dumping, or other waste
                issues? Report them to help keep our city clean and earn points!
              </p>
              <button
                onClick={() => navigate("/report")}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 shadow-md text-sm sm:text-base"
              >
                Report an Issue
              </button>
            </div>
          </div>
        </div>

        {isReportModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-lg w-full">
              <h2 className="text-lg font-semibold mb-4">Report an Issue</h2>
              <ReportForm
                token={token}
                onReportSubmitted={() => {
                  setIsReportModalOpen(false);
                  fetchData();
                }}
              />
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="mt-4 text-gray-500 hover:underline text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Area Overview
            </h2>
            <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
              <button
                onClick={() => setMapToggle("heatmap")}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium flex-1 sm:flex-none ${
                  mapToggle === "heatmap"
                    ? "bg-white shadow-sm text-emerald-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Thermometer className="w-4 h-4" /> Heatmap
              </button>
              <button
                onClick={() => setMapToggle("bins")}
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium flex-1 sm:flex-none ${
                  mapToggle === "bins"
                    ? "bg-white shadow-sm text-emerald-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Trash2 className="w-4 h-4" /> Bin Locations
              </button>
            </div>
          </div>
          {mapToggle === "heatmap" ? (
            <div className="rounded-lg h-48 sm:h-64 border border-emerald-100 overflow-hidden">
              <TrashMap className="w-full h-full" />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg h-48 sm:h-64 flex items-center justify-center border border-emerald-100">
              <div className="text-center">
                <Map className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-emerald-600 font-medium">Bin Location Map</p>
                <p className="text-emerald-500 text-xs sm:text-sm mt-1">
                  Interactive map coming soon
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              Recent Points
            </h2>
            <div className="space-y-3">
              {recentPoints.length ? (
                recentPoints.map((point) => (
                  <div
                    key={point.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {getPointTypeIcon(point.type)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">
                        {point.action}
                      </p>
                      <p className="text-gray-500 text-xs">{point.date}</p>
                    </div>
                    <p className="font-bold text-emerald-600 text-sm">
                      +{point.points}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No recent points available
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              Report Status
            </h2>
            <div className="space-y-3">
              {reportStatuses.length ? (
                reportStatuses.map((report) => (
                  <div
                    key={report.id}
                    className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      {getStatusIcon(report.status)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-medium text-gray-800 text-sm truncate">
                            {report.title}
                          </p>
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                              report.status
                            )}`}
                          >
                            {report.status}
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {report.location}
                        </p>
                        <p className="text-gray-400 text-xs">{report.date}</p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <p
                          className={`text-sm font-medium ${
                            report.points > 0
                              ? "text-emerald-600"
                              : "text-gray-400"
                          }`}
                        >
                          {report.points > 0 ? `+${report.points}` : "0"} pts
                        </p>
                        <button
                          onClick={() => navigate(`/user/report/${report.id}`)}
                          className="text-blue-600 hover:text-blue-700 p-1 rounded-md hover:bg-blue-50 mt-1"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No reports available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDash;
