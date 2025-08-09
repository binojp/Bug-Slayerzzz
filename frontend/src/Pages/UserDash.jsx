import React, { useState } from "react";
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
} from "lucide-react";

function UserDash() {
  const [mapToggle, setMapToggle] = useState("heatmap");

  // Mock data
  const userStats = {
    name: "Alex Johnson",
    city: "Kochi",
    rank: 5,
    totalUsers: 2847,
    totalPoints: 1250,
    monthlyPoints: 340,
  };

  const recentPoints = [
    {
      id: "1",
      action: "Reported illegal dumping",
      points: 50,
      date: "2 hours ago",
      type: "report",
    },
    {
      id: "2",
      action: "Verified cleanup completion",
      points: 30,
      date: "1 day ago",
      type: "verification",
    },
    {
      id: "3",
      action: "Participated in cleanup drive",
      points: 100,
      date: "3 days ago",
      type: "cleanup",
    },
    {
      id: "4",
      action: "Reported overflowing bin",
      points: 25,
      date: "5 days ago",
      type: "report",
    },
  ];

  const reportStatuses = [
    {
      id: "1",
      title: "Overflowing waste bin",
      location: "MG Road, Kochi",
      status: "resolved",
      points: 50,
      date: "2024-01-15",
    },
    {
      id: "2",
      title: "Illegal dumping site",
      location: "Marine Drive, Kochi",
      status: "verified",
      points: 75,
      date: "2024-01-12",
    },
    {
      id: "3",
      title: "Broken waste container",
      location: "Panampilly Nagar",
      status: "pending",
      points: 0,
      date: "2024-01-10",
    },
    {
      id: "4",
      title: "Street litter accumulation",
      location: "Fort Kochi",
      status: "rejected",
      points: 0,
      date: "2024-01-08",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "verified":
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
      case "verified":
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Card (Replaces Header and Ranking Card) */}
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
                    283 * (1 - userStats.rank / userStats.totalUsers)
                  }
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-emerald-600">
                  #{userStats.rank}
                </span>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {userStats.name}
              </h2>
              <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1 mt-1">
                <MapPin className="w-4 h-4" /> {userStats.city}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Top {Math.round((userStats.rank / userStats.totalUsers) * 100)}%
                of {userStats.totalUsers.toLocaleString()} users
              </p>
            </div>
            <div className="flex flex-col items-center sm:items-end">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span className="text-lg font-semibold text-gray-800">
                  {userStats.totalPoints} Points
                </span>
              </div>
              <p className="text-xs text-emerald-600 mt-1">
                +{userStats.monthlyPoints} this month
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Reporting Section */}
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
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 shadow-md text-sm sm:text-base">
                Report an Issue
              </button>
            </div>
          </div>
        </div>

        {/* Map Section */}
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

          {/* Mock Map */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg h-48 sm:h-64 flex items-center justify-center border border-emerald-100">
            <div className="text-center">
              <Map className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-emerald-600 font-medium">
                {mapToggle === "heatmap"
                  ? "Waste Issue Heatmap"
                  : "Bin Location Map"}
              </p>
              <p className="text-emerald-500 text-xs sm:text-sm mt-1">
                Interactive map coming soon
              </p>
            </div>
          </div>
        </div>

        {/* Stats Sections */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Points */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              Recent Points
            </h2>
            <div className="space-y-3">
              {recentPoints.map((point) => (
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
              ))}
            </div>
          </div>

          {/* Report Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
              Report Status
            </h2>
            <div className="space-y-3">
              {reportStatuses.map((report) => (
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
                      <ChevronRight className="w-4 h-4 text-gray-400 mt-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDash;
