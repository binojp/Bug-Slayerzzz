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
  Eye,
  Users,
  Calendar,
  DollarSign,
  Crown,
  Medal,
  Trophy,
  Target,
  Activity,
  BarChart3,
  User,
} from "lucide-react";
import TrashMap from "./Heatmap"; // Adjust the import path based on your file structure

function AdminDash() {
  const navigate = useNavigate();
  const [reportFilter, setReportFilter] = useState("all");
  const [mapToggle, setMapToggle] = useState("heatmap");
  const [dashboardStats, setDashboardStats] = useState({});
  const [recentReports, setRecentReports] = useState([]);
  const [fineDetails, setFineDetails] = useState([]);
  const [topMembers, setTopMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        // Fetch dashboard stats
        const statsResponse = await axios.get(
          "https://192.168.82.139:5000/api/dashboard-stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Stats Response:", statsResponse.data);
        setDashboardStats(statsResponse.data);

        // Fetch reports
        const reportsResponse = await axios.get(
          `https://192.168.82.139:5000/api/reports${
            reportFilter !== "all" ? `?status=${reportFilter}` : ""
          }`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Reports Response:", reportsResponse.data);
        const transformedReports = reportsResponse.data.map((report) => ({
          id: report._id,
          title: report.title,
          location:
            report.location || `${report.latitude}, ${report.longitude}`,
          reportedBy: report.user
            ? report.user.name || report.user.email || "Unknown User"
            : "Unknown User",
          status: report.status.toLowerCase(),
          priority: report.severity.toLowerCase(),
          date: new Date(report.createdAt).toLocaleDateString(),
        }));
        setRecentReports(transformedReports);

        // Fetch fine details
        const finesResponse = await axios.get(
          "https://192.168.82.139:5000/api/fines",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fines Response:", finesResponse.data);
        setFineDetails(finesResponse.data);

        // Fetch top members
        const membersResponse = await axios.get(
          "https://192.168.82.139:5000/api/top-members",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Members Response:", membersResponse.data);
        setTopMembers(membersResponse.data);

        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, [token, reportFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "reported":
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Trophy className="w-5 h-5 text-amber-600" />;
      default:
        return <Star className="w-5 h-5 text-blue-500" />;
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                Welcome, Chairman
              </h1>
              <p className="text-xs text-gray-500">
                Thrissur Municipality - Waste Management
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-800">
                {new Date().toLocaleDateString()}
              </span>
            </div>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              Real-time
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
              <div className="bg-orange-100 p-2 rounded-md">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">
                  {dashboardStats.reportsToday || 0}
                </p>
                <p className="text-xs text-gray-600">Reports Today</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
              <div className="bg-yellow-100 p-2 rounded-md">
                <Eye className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">
                  {dashboardStats.needReview || 0}
                </p>
                <p className="text-xs text-gray-600">Need Review</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
              <div className="bg-green-100 p-2 rounded-md">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">
                  {dashboardStats.resolvedToday || 0}
                </p>
                <p className="text-xs text-gray-600">Resolved Today</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
              <div className="bg-purple-100 p-2 rounded-md">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-800">
                  {(dashboardStats.totalActiveUsers || 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-600">Active Users</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col gap-3 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Reports
            </h2>
            <div className="flex items-center justify-between gap-2">
              <div className="flex overflow-x-auto gap-1 whitespace-nowrap">
                <button
                  onClick={() => setReportFilter("all")}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                    reportFilter === "all"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setReportFilter("pending")}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                    reportFilter === "pending"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setReportFilter("review")}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                    reportFilter === "review"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Review
                </button>
                <button
                  onClick={() => setReportFilter("resolved")}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
                    reportFilter === "resolved"
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Resolved
                </button>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {recentReports.length ? (
              recentReports.map((report) => (
                <div
                  key={report.id}
                  className="p-3 border border-gray-200 rounded-md hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-2">
                    {getStatusIcon(report.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1 mb-1">
                        <h3 className="font-medium text-sm text-gray-800 truncate">
                          {report.title}
                        </h3>
                        <span
                          className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {report.status}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 text-xs font-medium rounded border ${getPriorityColor(
                            report.priority
                          )}`}
                        >
                          {report.priority}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {report.location}
                        </span>
                        <span>By: {report.reportedBy}</span>
                        <span>{report.date}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/admin/report/${report.id}`)}
                      className="text-blue-600 hover:text-blue-700 p-1 rounded-md hover:bg-blue-50"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No reports available</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col gap-3 mb-3">
            <h2 className="text-lg font-semibold text-gray-800">
              City Overview
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setMapToggle("heatmap")}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                  mapToggle === "heatmap"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Thermometer className="w-3 h-3" /> Heatmap
              </button>
              <button
                onClick={() => setMapToggle("bins")}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                  mapToggle === "bins"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Trash2 className="w-3 h-3" /> Bins
              </button>
            </div>
          </div>
          {mapToggle === "heatmap" ? (
            <div className="rounded-md h-48 border border-blue-100">
              <div className="rounded-lg h-48 sm:h-64 border border-emerald-100 overflow-hidden">
                <TrashMap className="w-full h-full" />
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-md h-48 flex items-center justify-center border border-blue-100">
              <div className="text-center">
                <Map className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-blue-600 text-sm font-medium">
                  Dustbin Status
                </p>
                <p className="text-blue-500 text-xs mt-1">
                  Real-time dashboard
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Fine Details
              </h2>
            </div>
            <div className="space-y-2">
              {fineDetails.length ? (
                fineDetails.map((fine) => (
                  <div key={fine.id} className="p-3 bg-gray-50 rounded-md">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <h3 className="font-medium text-sm text-gray-800">
                          {fine.violationType}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          {fine.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600 text-sm">
                          ₹{fine.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Issued: {fine.issuedToday}</span>
                      <span>₹{fine.totalCollected.toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No fines available</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Top Contributors
              </h2>
            </div>
            <div className="space-y-2">
              {topMembers.length ? (
                topMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {getRankIcon(member.rank)}
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {member.name.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-800">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {member.reportsThisMonth} reports
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600 text-sm">
                        {member.points} pts
                      </p>
                      <p className="text-xs text-gray-500">#{member.rank}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  No contributors available
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-semibold text-gray-800">
                Weekly Trends
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Reports</span>
                <span className="text-xs font-medium text-green-600">+12%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Resolution Rate</span>
                <span className="text-xs font-medium text-green-600">+8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">User Engagement</span>
                <span className="text-xs font-medium text-green-600">+15%</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-red-600" />
              <h3 className="text-sm font-semibold text-gray-800">
                Priority Areas
              </h3>
            </div>
            <div className="space-y-2">
              <div className="text-xs">
                <span className="text-gray-600">Wadakkańcherry</span>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-red-500 h-1.5 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
              <div className="text-xs">
                <span className="text-gray-600">cheruthuruthy</span>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-yellow-500 h-1.5 rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>
              <div className="text-xs">
                <span className="text-gray-600">Thrissur</span>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-green-500 h-1.5 rounded-full"
                    style={{ width: "35%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-800">
                Quick Stats
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Avg Response Time</span>
                <span className="text-xs font-medium">2.4 hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Satisfaction Rate</span>
                <span className="text-xs font-medium text-green-600">94%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Active Bins</span>
                <span className="text-xs font-medium">847/892</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDash;
