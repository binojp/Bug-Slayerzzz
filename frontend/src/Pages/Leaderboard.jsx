import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Leaderboard() {
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
        const membersResponse = await axios.get(
          "https://192.168.82.139:5000/api/top-members",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTopMembers(membersResponse.data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTopMembers((prev) => {
        const updated = JSON.parse(JSON.stringify(prev));
        const randomIndex = Math.floor(
          3 + Math.random() * (updated.length - 3)
        );
        if (updated[randomIndex]) updated[randomIndex].points += 50;
        updated.sort((a, b) => b.points - a.points);
        return updated.map((u, i) => ({ ...u, rank: i + 1 }));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getRankMedal = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  const currentUser = topMembers.find(
    (member) => member.name === "You (DevUser)"
  ) || {
    name: "You (DevUser)",
    points: 2100,
    rank: 7,
  };

  if (loading)
    return <div className="text-center text-gray-600">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-2">
        Leaderboard
      </h1>
      <p className="text-center text-gray-600 mb-8">
        See who's making the biggest impact this month in our community!
      </p>

      {/* Current User Stats */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row justify-around gap-6 mb-8">
        <div className="text-center">
          <span className="block text-sm text-gray-500 mb-1">
            Your Monthly Points
          </span>
          <span className="text-2xl font-bold text-green-700">
            {currentUser.points.toLocaleString()}
          </span>
        </div>
        <div className="text-center">
          <span className="block text-sm text-gray-500 mb-1">Your Rank</span>
          <span className="text-2xl font-bold text-green-700">
            #{currentUser.rank}
          </span>
        </div>
      </div>

      {/* Leaderboard Header */}
      <div className="flex items-center justify-between border-b-2 border-gray-200 pb-2 mb-4">
        <h2 className="text-lg font-semibold text-green-800">
          August Leaderboard
        </h2>
        <div className="flex items-center bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></span>
          LIVE
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="bg-white rounded-lg shadow divide-y divide-gray-100">
        {topMembers.length ? (
          topMembers.map((member) => (
            <div
              key={member.id}
              className={`flex items-center p-4 transition ${
                member.name === currentUser.name
                  ? "bg-green-50 border-l-4 border-green-500"
                  : ""
              }`}
            >
              <div className="w-10 text-center font-bold text-gray-700">
                {getRankMedal(member.rank)}
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4">
                {member.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-gray-800">
                  {member.name}
                </p>
                <p className="text-xs text-gray-500">
                  {member.reportsThisMonth} reports
                </p>
              </div>
              <div className="text-green-700 font-bold">
                {member.points.toLocaleString()} pts
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm p-4">No contributors available</p>
        )}
      </div>
    </div>
  );
}
