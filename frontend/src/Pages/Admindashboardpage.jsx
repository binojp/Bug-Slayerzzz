import React, { useState } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Container, 
  ToggleButtonGroup, 
  ToggleButton, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  Chip,
  Box,
  Button
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

// --- Section 1: Image Feed Component ---

// Mock data for the Image Feed
const allImages = [
  { id: 1, status: 'recent', location: 'Near Swaraj Round, Thrissur', url: 'https://i.imgur.com/Qz8aH8I.jpeg' },
  { id: 2, status: 'pending', location: 'Pattom, Thiruvananthapuram', url: 'https://i.imgur.com/YizHS4y.jpeg' },
  { id: 3, status: 'completed', location: 'Marine Drive, Kochi', url: 'https://i.imgur.com/r62j27m.jpeg' },
  { id: 4, status: 'pending', location: 'SM Street, Kozhikode', url: 'https://i.imgur.com/g0t6S6w.jpeg' },
  { id: 5, status: 'recent', location: 'Alappuzha Beach', url: 'https://i.imgur.com/2sU1x7L.jpeg' },
  { id: 6, status: 'completed', location: 'Fort Kochi', url: 'https://i.imgur.com/Kknk34s.jpeg' },
];

const ImageFeed = () => {
  const [filter, setFilter] = useState('recent');

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const filteredImages = allImages.filter(image => image.status === filter);

  const getStatusChip = (status) => {
    switch (status) {
      case 'recent':
        return <Chip label="Recent" color="primary" size="small" />;
      case 'pending':
        return <Chip label="Pending Action" color="warning" size="small" />;
      case 'completed':
        return <Chip label="Cleaned" color="success" size="small" />;
      default:
        return null;
    }
  };

  return (
    <>
      <Typography variant="h6" component="h2" gutterBottom>
        Reported Images
      </Typography>
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={handleFilterChange}
        aria-label="image filter"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="recent" aria-label="recent reports">Recent</ToggleButton>
        <ToggleButton value="pending" aria-label="pending reports">Pending</ToggleButton>
        <ToggleButton value="completed" aria-label="completed reports">Completed</ToggleButton>
      </ToggleButtonGroup>
      <Grid container spacing={2}>
        {filteredImages.map((image) => (
          <Grid item xs={12} sm={6} md={4} key={image.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={image.url}
                alt={image.location}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {image.location}
                </Typography>
                {getStatusChip(image.status)}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

// --- Section 2: Map Section Component ---

const MapSection = () => {
  const [mapView, setMapView] = useState('heatmap');

  const handleMapViewChange = (event, newView) => {
    if (newView !== null) {
      setMapView(newView);
    }
  };

  return (
    <>
      <Typography variant="h6" component="h2" gutterBottom>
        Live Maps
      </Typography>
      <ToggleButtonGroup
        value={mapView}
        exclusive
        onChange={handleMapViewChange}
        aria-label="map view"
        fullWidth
        sx={{ mb: 2 }}
      >
        <ToggleButton value="heatmap">Trash Heatmap</ToggleButton>
        <ToggleButton value="dustbins">Full Dustbins</ToggleButton>
      </ToggleButtonGroup>
      
      <Box sx={{ height: 250, backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1 }}>
        {mapView === 'heatmap' ? (
          <Typography>// TODO: Integrate your Trash Heatmap component here</Typography>
        ) : (
          <Typography>// TODO: Integrate your Full Dustbins map here</Typography>
        )}
      </Box>
    </>
  );
};

// --- Section 3: Fault Review Component ---

const FaultReview = () => {
  const faultReport = {
    id: 101,
    offenderImg: 'https://i.imgur.com/L12sE4s.jpeg',
    location: 'East Fort Bus Stop, TVM',
    reportedBy: 'User_Alex',
    timestamp: 'Aug 9, 2025 01:45 AM',
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <WarningIcon color="error" sx={{ mr: 1 }} />
        <Typography variant="h6" component="h2">
          Fault Review
        </Typography>
      </Box>
      <Card>
        <CardMedia
          component="img"
          height="160"
          image={faultReport.offenderImg}
          alt="Fault report"
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            <b>Location:</b> {faultReport.location}<br/>
            <b>Reported by:</b> {faultReport.reportedBy}<br/>
            <b>Time:</b> {faultReport.timestamp}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" variant="contained" color="error">Issue Fine</Button>
          <Button size="small">Reject</Button>
        </CardActions>
      </Card>
    </>
  );
};


// --- Main Admin Dashboard Page Component ---

const AdminDashboardPage = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, backgroundColor: '#f4f6f8', borderRadius: 2, p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Section 1: Image Feed (Takes up 2/3 of the width) */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ImageFeed />
          </Paper>
        </Grid>

        {/* Sections 2 & 3 (Side Column) */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            {/* Section 2: Map Section */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <MapSection />
              </Paper>
            </Grid>
            {/* Section 3: Fault Review */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <FaultReview />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboardPage;