import React, { useState, useEffect } from 'react';

// --- CSS Keyframes for Animation ---
// We need a <style> tag for the @keyframes animation, as it can't be done with inline styles.
const animationStyles = `
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
  { points: 500, title: 'Vegetable Seeds', description: 'A starter pack of seasonal vegetable seeds.', icon: '🌱' },
  { points: 1000, title: '5 Grow Bags', description: 'Durable bags for your new saplings.', icon: '🛍️' },
  { points: 1500, title: '5 Saplings', description: 'A selection of five young fruit-bearing saplings.', icon: '🌳' },
  { points: 2000, title: 'Amazon Gift Voucher', description: 'A ₹500 voucher for your next purchase.', icon: '🎁' },
  { points: 2500, title: 'Fitness Band', description: 'Track your activity and stay healthy.', icon: '⌚' },
];

// --- Sub-Components (defined within the file) ---

const PopperBlast = () => (
  <div style={styles.popperContainer}>
    {Array.from({ length: 50 }).map((_, index) => {
      // Generate random values for each confetti piece
      const size = Math.random() * 8 + 4; // size between 4px and 12px
      const xEnd = (Math.random() - 0.5) * 400 + 'px'; // end position
      const yEnd = (Math.random() - 0.5) * 400 + 'px';
      const delay = Math.random() * 0.2 + 's';
      const colors = ['#ff4e4e', '#4caf50', '#007bff', '#ffeb3b', '#9c27b0'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      return (
        <div
          key={index}
          style={{
            ...styles.popper,
            '--x-end': xEnd, // Pass CSS variables to the keyframe animation
            '--y-end': yEnd,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            animationDelay: delay,
          }}
        ></div>
      );
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
      const timer = setTimeout(() => setShowPopper(false), 2000); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [showPopper]);

  const handleRedeemClick = (rewardToRedeem) => {
    if (userPoints >= rewardToRedeem.points) {
      setUserPoints(prevPoints => prevPoints - rewardToRedeem.points);
      setRedeemedItems(prevItems => [...prevItems, rewardToRedeem]);
      setShowPopper(true); // Trigger the popper animation
      alert(`Redeemed "${rewardToRedeem.title}"! Your new balance is ${userPoints - rewardToRedeem.points}.`);
    }
  };

  return (
    <>
      <style>{animationStyles}</style>
      {showPopper && <PopperBlast />}
      <div style={styles.rewardsContainer}>
        <header style={styles.header}>
          <div style={styles.pointsDisplay}>
            <span style={styles.pointsLabel}>Your Points</span>
            <span style={styles.pointsValue}>{userPoints}</span>
          </div>
          <div style={styles.progressSection}>
            <div style={styles.progressBarBackground}>
              <div style={{ ...styles.progressBarFill, width: `${progressPercentage}%` }}></div>
            </div>
            {nextReward ? (
              <span style={styles.progressText}>
                {nextReward.points - userPoints} points away from the {nextReward.title}!
              </span>
            ) : (
              <span style={styles.progressText}>You can redeem all available rewards!</span>
            )}
          </div>
        </header>

        <main style={styles.rewardsList}>
          <h2 style={styles.sectionTitle}>Available Rewards</h2>
          {rewardsData.map((reward) => {
            const canRedeem = userPoints >= reward.points;
            const isRedeemed = redeemedItems.some(item => item.points === reward.points);
            
            return (
              <div 
                key={reward.points} 
                style={{...styles.rewardItem, ...((!canRedeem || isRedeemed) && styles.rewardItemDisabled)}}
              >
                <div style={styles.rewardIcon}>{reward.icon}</div>
                <div style={styles.rewardDetails}>
                  <h3 style={styles.rewardTitle}>{reward.title}</h3>
                  <p style={styles.rewardDescription}>{reward.description}</p>
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
                    {redeemedItems.map((reward) => (
                        <div key={reward.points} style={styles.redeemedItem}>
                            <span style={styles.redeemedIcon}>{reward.icon}</span>
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

// --- STYLES OBJECT ---
const styles = {
  rewardsContainer: { fontFamily: '"Segoe UI", sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  header: { width: '100%', maxWidth: '700px', backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '25px' },
  pointsDisplay: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
  pointsLabel: { fontSize: '18px', color: '#555' },
  pointsValue: { fontSize: '28px', fontWeight: 'bold', color: '#007bff' },
  progressSection: {},
  progressBarBackground: { height: '10px', width: '100%', backgroundColor: '#e9ecef', borderRadius: '5px', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#28a745', borderRadius: '5px', transition: 'width 0.5s ease-in-out' },
  progressText: { marginTop: '5px', fontSize: '14px', color: '#666', textAlign: 'center', display: 'block' },
  rewardsList: { width: '100%', maxWidth: '700px' },
  sectionTitle: { margin: '0 0 15px 0', color: '#333', textAlign: 'left', fontSize: '22px' },
  rewardItem: { display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', marginBottom: '15px', transition: 'all 0.3s ease' },
  rewardItemDisabled: { opacity: 0.6, backgroundColor: '#f8f9fa' },
  rewardIcon: { fontSize: '36px', marginRight: '20px' },
  rewardDetails: { flexGrow: 1, textAlign: 'left' },
  rewardTitle: { margin: '0 0 5px 0', fontSize: '18px', fontWeight: '600', color: '#212529' },
  rewardDescription: { margin: '0 0 8px 0', fontSize: '14px', color: '#6c757d' },
  rewardPoints: { fontSize: '16px', fontWeight: 'bold', color: '#007bff' },
  redeemButton: { padding: '10px 20px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '20px', transition: 'background-color 0.2s ease' },
  redeemedButton: { backgroundColor: '#6c757d', cursor: 'not-allowed' },
  // Popper Animation Styles
  popperContainer: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' },
  popper: { position: 'absolute', top: '50%', left: '50%', animation: 'popper-blast-animation 2s forwards' },
  // Redeemed Rewards Section Styles
  redeemedSection: { width: '100%', maxWidth: '700px', marginTop: '20px' },
  redeemedList: { display: 'flex', overflowX: 'auto', padding: '10px 0 20px 0', gap: '15px' },
  redeemedItem: {
    flex: '0 0 120px',
    height: '120px',
    backgroundColor: '#d4edda',
    border: '2px dashed #28a745',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  redeemedIcon: { fontSize: '30px', marginBottom: '8px' },
  redeemedTitle: { fontSize: '14px', fontWeight: '600', color: '#155724' },
};

export default RewardsPage;