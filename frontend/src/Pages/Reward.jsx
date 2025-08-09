import React, { useState, useEffect } from 'react';

// --- CSS for Animations & Google Font ---
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

  @keyframes popper-blast-animation {
    0% {
      opacity: 1;
      transform: translate(0, 0) rotate(0deg);
    }
    100% {
      opacity: 0;
      transform: translate(var(--x-end), var(--y-end)) rotate(720deg);
    }
  }
`;

// --- Mock Data ---
const initialUserPoints = 1650;
const rewardsData = [
  { points: 50, title: 'Paper Pen', description: 'An eco-friendly pen made from recycled paper.', icon: '✍️' },
  { points: 500, title: 'Vegetable Seeds', description: 'A starter pack of seasonal seeds.', icon: '🌱' },
  { points: 1000, title: '5 Grow Bags', description: 'Durable bags for your new saplings.', icon: '🛍️' },
  { points: 1500, title: '5 Saplings', description: 'A selection of five young fruit trees.', icon: '🌳' },
  { points: 2000, title: 'Amazon Gift Voucher', description: 'A ₹500 voucher for your next purchase.', icon: '🎁' },
  { points: 2500, title: 'Fitness Band', description: 'Track your activity and stay healthy.', icon: '⌚' },
];

// --- Sub-Components ---

const PopperBlast = () => (
  <div style={styles.popperContainer}>
    {Array.from({ length: 60 }).map((_, index) => {
      const size = Math.random() * 10 + 5;
      const xEnd = (Math.random() - 0.5) * 500 + 'px';
      const yEnd = (Math.random() - 0.5) * 500 + 'px';
      const delay = Math.random() * 0.2 + 's';
      const colors = ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#9c27b0'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      return <div key={index} style={{ ...styles.popper, '--x-end': xEnd, '--y-end': yEnd, width: `${size}px`, height: `${size}px`, backgroundColor: color, animationDelay: delay }} />;
    })}
  </div>
);

// --- Main Rewards Page Component ---

function RewardsPage() {
  const [userPoints, setUserPoints] = useState(initialUserPoints);
  const [redeemedItems, setRedeemedItems] = useState([]);
  const [showPopper, setShowPopper] = useState(false);

  const nextReward = rewardsData.find(reward => reward.points > userPoints && !redeemedItems.some(item => item.points === reward.points));
  const progressPercentage = nextReward ? (userPoints / nextReward.points) * 100 : 100;

  useEffect(() => {
    if (showPopper) {
      const timer = setTimeout(() => setShowPopper(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showPopper]);

  const handleRedeemClick = (rewardToRedeem) => {
    if (userPoints >= rewardToRedeem.points && !redeemedItems.some(item => item.points === rewardToRedeem.points)) {
      setUserPoints(prevPoints => prevPoints - rewardToRedeem.points);
      setRedeemedItems(prevItems => [...prevItems, rewardToRedeem]);
      setShowPopper(true);
    }
  };

  return (
    <>
      <style>{globalStyles}</style>
      {showPopper && <PopperBlast />}
      <div style={styles.rewardsContainer}>
        <header style={styles.header}>
          <div style={styles.pointsDisplay}>
            <span style={styles.pointsLabel}>Your Points Balance</span>
            <span style={styles.pointsValue}>{userPoints}</span>
          </div>
          <div style={styles.progressSection}>
            <div style={styles.progressBarBackground}>
              <div style={{ ...styles.progressBarFill, width: `${progressPercentage}%` }}></div>
            </div>
            {nextReward ? (
              <span style={styles.progressText}>
                {nextReward.points - userPoints} points to your next reward!
              </span>
            ) : ( <span style={styles.progressText}>You can redeem all available rewards!</span> )}
          </div>
        </header>

        <main style={styles.rewardsList}>
          <h2 style={styles.sectionTitle}>Available Rewards</h2>
          {rewardsData.map((reward) => {
            const canRedeem = userPoints >= reward.points;
            const isRedeemed = redeemedItems.some(item => item.points === reward.points);
            
            return (
              <div key={reward.points} style={{...styles.rewardItem, ...((!canRedeem || isRedeemed) && styles.rewardItemDisabled)}}>
                <div style={styles.rewardIconWrapper}><div style={styles.rewardIcon}>{reward.icon}</div></div>
                <div style={styles.rewardDetails}>
                  <h3 style={styles.rewardTitle}>{reward.title}</h3>
                  <span style={styles.rewardPoints}>{reward.points} Points</span>
                </div>
                <button
                  style={{...styles.redeemButton, ...(isRedeemed && styles.redeemedButton)}}
                  onClick={() => handleRedeemClick(reward)}
                  disabled={!canRedeem || isRedeemed}
                >
                  {isRedeemed ? 'Claimed' : 'Redeem'}
                </button>
              </div>
            );
          })}
        </main>
        
        {redeemedItems.length > 0 && (
            <footer style={styles.redeemedSection}>
                <h2 style={styles.sectionTitle}>My Rewards</h2>
                <div style={styles.redeemedList}>
                    {redeemedItems.map((reward, index) => (
                        <div key={index} style={{...styles.redeemedItem, background: ['#4285F4', '#34A853', '#FBBC05', '#EA4335'][index % 4]}}>
                            <div style={styles.redeemedCheck}>✔</div>
                            <div style={styles.redeemedIcon}>{reward.icon}</div>
                            <span style={styles.redeemedTitle}>{reward.title}</span>
                        </div>
                    ))}
                </div>
            </footer>
        )}
      </div>
    </>
  );
}

// --- STYLES OBJECT (White Theme) ---
const styles = {
  // Main container now has a light grey background
  rewardsContainer: { fontFamily: "'Roboto', sans-serif", backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' },
  // Header is now a white card
  header: { 
    width: '100%', maxWidth: '700px', margin: '0 auto 25px auto', 
    backgroundColor: 'white', borderRadius: '12px', padding: '20px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderBottom: '1px solid #dee2e6'
  },
  // Text colors updated for light background
  pointsLabel: { fontSize: '18px', color: '#555' },
  pointsValue: { fontSize: '48px', fontWeight: 'bold', color: '#28a745' },
  progressText: { marginTop: '8px', fontSize: '14px', color: '#666', display: 'block', textAlign: 'center' },
  sectionTitle: { margin: '0 0 15px 5px', color: '#333', textAlign: 'left', fontSize: '22px', fontWeight: '500' },
  // Progress bar styles are fine for a light theme
  progressSection: { marginTop: '15px' },
  progressBarBackground: { height: '8px', width: '100%', backgroundColor: '#e9ecef', borderRadius: '4px', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#28a745', borderRadius: '4px', transition: 'width 0.5s ease-in-out' },
  // Rewards List styles
  rewardsList: { width: '100%', maxWidth: '700px', margin: '0 auto' },
  rewardItem: { display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '15px', borderRadius: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', marginBottom: '15px', transition: 'all 0.3s ease' },
  rewardItemDisabled: { opacity: 0.6 },
  rewardIconWrapper: { width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#f1f3f4', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '15px', flexShrink: 0 },
  rewardIcon: { fontSize: '24px' },
  rewardDetails: { flexGrow: 1, textAlign: 'left' },
  rewardTitle: { margin: '0 0 4px 0', fontSize: '16px', fontWeight: '500', color: '#202124' },
  rewardPoints: { fontSize: '14px', fontWeight: '700', color: '#1a73e8' },
  redeemButton: { padding: '8px 20px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '20px', transition: 'background-color 0.2s ease' },
  redeemedButton: { backgroundColor: '#28a745', cursor: 'not-allowed' },
  // Popper Animation Styles (no changes needed)
  popperContainer: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' },
  popper: { position: 'absolute', top: '50%', left: '50%', animation: 'popper-blast-animation 1.5s forwards ease-out' },
  // Redeemed Rewards Section Styles (no changes needed)
  redeemedSection: { width: '100%', maxWidth: '700px', margin: '20px auto 0' },
  redeemedList: { display: 'flex', overflowX: 'auto', padding: '10px 5px 20px 5px', gap: '15px', scrollbarWidth: 'none', 'msOverflowStyle': 'none' },
  redeemedItem: {
    flex: '0 0 120px', height: '120px',
    borderRadius: '18px', display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center', textAlign: 'center',
    padding: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    position: 'relative', overflow: 'hidden'
  },
  redeemedIcon: { fontSize: '30px', marginBottom: '8px', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))' },
  redeemedTitle: { fontSize: '14px', fontWeight: '500', color: 'white' },
  redeemedCheck: {
    position: 'absolute', top: '8px', right: '8px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#1e8e3e',
    fontWeight: 'bold', width: '24px', height: '24px',
    borderRadius: '50%', display: 'flex',
    justifyContent: 'center', alignItems: 'center',
    fontSize: '16px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
  },
};

export default RewardsPage;