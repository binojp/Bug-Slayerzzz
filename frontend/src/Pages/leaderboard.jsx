import React from 'react';

// --- INITIAL MOCK DATA ---
// This will be the starting point for our state.
const initialLeaderboardData = [
  { rank: 1, name: 'EcoWarrior22', points: 4500, avatar: 'https://i.pravatar.cc/150?img=1' },
  { rank: 2, name: 'GreenThumb', points: 4150, avatar: 'https://i.pravatar.cc/150?img=2' },
  { rank: 3, name: 'CaptainPlanet', points: 3800, avatar: 'https://i.pravatar.cc/150?img=3' },
  { rank: 4, name: 'Anjali S.', points: 3200, avatar: 'https://i.pravatar.cc/150?img=4' },
  { rank: 5, name: 'RecycleRanger', points: 2850, avatar: 'https://i.pravatar.cc/150?img=5' },
  { rank: 6, name: 'TrashTagPro', points: 2500, avatar: 'https://i.pravatar.cc/150?img=6' },
  { rank: 7, name: 'You (DevUser)', points: 2100, avatar: 'https://i.pravatar.cc/150?img=7' }, 
  { rank: 8, name: 'EnviroHero', points: 1800, avatar: 'https://i.pravatar.cc/150?img=8' },
];

const currentUser = {
  name: 'You (DevUser)',
  points: 2100,
  rank: 7,
};
// --- END MOCK DATA ---

const RewardsPage = () => {
  // Use state to hold the leaderboard data so we can update it.
  const [leaders, setLeaders] = React.useState(initialLeaderboardData);

  // This useEffect hook will run once when the component mounts to start the simulation.
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLeaders(prevLeaders => {
        // 1. Create a deep copy of the previous state to avoid direct mutation.
        const newLeaders = JSON.parse(JSON.stringify(prevLeaders));
        
        // 2. Pick a random user to give points to. We avoid the top 3 to keep the podium stable for the demo.
        const randomIndex = Math.floor(3 + Math.random() * (newLeaders.length - 3));
        
        // 3. Add 50 points to simulate a "Report Trash" action.
        if (newLeaders[randomIndex]) {
            newLeaders[randomIndex].points += 50;
        }

        // 4. Re-sort the array based on the new points.
        newLeaders.sort((a, b) => b.points - a.points);
        
        // 5. Re-assign ranks to every user after sorting. This is a crucial step!
        return newLeaders.map((user, index) => ({ ...user, rank: index + 1 }));
      });
    }, 3000); // The simulation runs every 3 seconds.

    // This is a cleanup function. It stops the interval when you navigate away from the page.
    return () => clearInterval(interval);
  }, []); // The empty array [] ensures this effect runs only once.

  const getRankMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  // Find the current user's latest stats from the live data.
  const myLiveStats = leaders.find(user => user.name === currentUser.name) || currentUser;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Leaderboard</h1>
      <p style={styles.subHeader}>See who's making the biggest impact this month in our community!</p>

      {/* --- Your Stats Section --- */}
      <div style={styles.myStatsContainer}>
        <div style={styles.myStatsItem}>
          <span style={styles.myStatsLabel}>Your Monthly Points</span>
          <span style={styles.myStatsValue}>{myLiveStats.points.toLocaleString()}</span>
        </div>
        <div style={styles.myStatsItem}>
          <span style={styles.myStatsLabel}>Your Rank</span>
          <span style={styles.myStatsValue}>#{myLiveStats.rank}</span>
        </div>
      </div>
      
      {/* --- Leaderboard Section --- */}
      <div style={styles.leaderboardHeader}>
        <h2 style={styles.sectionHeader}>August Leaderboard</h2>
        <div style={styles.liveIndicator}>
            <span style={styles.liveDot}></span>
            LIVE
        </div>
      </div>
      <div style={styles.leaderboard}>
        {/* We map over the 'leaders' state variable now, not the initial data. */}
        {leaders.map((user) => (
          <div key={user.name} style={user.name === currentUser.name ? styles.userRowHighlight : styles.userRow}>
            <div style={styles.rank}>{getRankMedal(user.rank)}</div>
            <img src={user.avatar} alt={user.name} style={styles.avatar} />
            <div style={styles.name}>{user.name}</div>
            <div style={styles.pointsValue}>{user.points.toLocaleString()} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#f0f4f8',
    color: '#333',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    color: '#1a202c',
    marginBottom: '5px',
  },
  subHeader: {
    textAlign: 'center',
    color: '#4a5568',
    marginBottom: '30px',
  },
  leaderboardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #e2e8f0',
    marginBottom: '10px',
  },
  sectionHeader: {
    color: '#2d3748',
    paddingBottom: '10px',
    margin: 0, // Reset margin
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    color: '#c53030',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  liveDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#ef4444',
    borderRadius: '50%',
    marginRight: '6px',
    animation: 'pulse 1.5s infinite',
  },
  myStatsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '30px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  myStatsItem: {
    textAlign: 'center',
  },
  myStatsLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#718096',
    marginBottom: '5px',
  },
  myStatsValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c5282',
  },
  leaderboard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  userRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    borderBottom: '1px solid #edf2f7',
    transition: 'background-color 0.3s',
  },
  userRowHighlight: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    borderBottom: '1px solid #edf2f7',
    backgroundColor: '#ebf8ff',
    borderLeft: '4px solid #3182ce',
    transition: 'background-color 0.3s',
  },
  rank: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#4a5568',
    width: '50px',
    textAlign: 'center',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '15px',
  },
  name: {
    flex: 1,
    fontWeight: '600',
    color: '#2d3748',
  },
  pointsValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2c5282',
  },
  // Add keyframes for the pulsing dot animation
  '@keyframes pulse': {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  }
};

// To use the keyframes, you might need a CSS-in-JS library like styled-components or emotion.
// For a quick hackathon fix, you can add this style to your main index.css file:
/*
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
*/


export default RewardsPage;