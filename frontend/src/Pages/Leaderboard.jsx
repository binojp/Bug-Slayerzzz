import React from "react";

const initialLeaderboardData = [
  {
    rank: 1,
    name: "EcoWarrior22",
    points: 4500,
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    rank: 2,
    name: "GreenThumb",
    points: 4150,
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    rank: 3,
    name: "CaptainPlanet",
    points: 3800,
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    rank: 4,
    name: "Anjali S.",
    points: 3200,
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    rank: 5,
    name: "RecycleRanger",
    points: 2850,
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    rank: 6,
    name: "TrashTagPro",
    points: 2500,
    avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    rank: 7,
    name: "You (DevUser)",
    points: 2100,
    avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    rank: 8,
    name: "EnviroHero",
    points: 1800,
    avatar: "https://i.pravatar.cc/150?img=8",
  },
];

const currentUser = { name: "You (DevUser)", points: 2100, rank: 7 };

const RewardsPage = () => {
  const [leaders, setLeaders] = React.useState(initialLeaderboardData);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLeaders((prev) => {
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

  const myLiveStats =
    leaders.find((user) => user.name === currentUser.name) || currentUser;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-2">
        Leaderboard
      </h1>
      <p className="text-center text-gray-600 mb-8">
        See who's making the biggest impact this month in our community!
      </p>

      {/* Your Stats */}
      <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row justify-around gap-6 mb-8">
        <div className="text-center">
          <span className="block text-sm text-gray-500 mb-1">
            Your Monthly Points
          </span>
          <span className="text-2xl font-bold text-green-700">
            {myLiveStats.points.toLocaleString()}
          </span>
        </div>
        <div className="text-center">
          <span className="block text-sm text-gray-500 mb-1">Your Rank</span>
          <span className="text-2xl font-bold text-green-700">
            #{myLiveStats.rank}
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
        {leaders.map((user) => (
          <div
            key={user.name}
            className={`flex items-center p-4 transition ${
              user.name === currentUser.name
                ? "bg-green-50 border-l-4 border-green-500"
                : ""
            }`}
          >
            <div className="w-10 text-center font-bold text-gray-700">
              {getRankMedal(user.rank)}
            </div>
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full mr-4"
            />
            <div className="flex-1 font-medium text-gray-800">{user.name}</div>
            <div className="text-green-700 font-bold">
              {user.points.toLocaleString()} pts
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardsPage;
