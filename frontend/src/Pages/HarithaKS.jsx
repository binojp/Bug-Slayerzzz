import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Grid, 
  Chip,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Paper
} from '@mui/material';
import ReportIcon from '@mui/icons-material/Campaign';
import BinIcon from '@mui/icons-material/DeleteSweep';
import MapIcon from '@mui/icons-material/TravelExplore';

// --- MOCK DATA ---
const recentReports = [
  { id: 1, location: 'Pattom Junction, Thiruvananthapuram', severity: 'Severe', img: 'https://i.imgur.com/YizHS4y.jpeg', time: 'Reported 15 minutes ago' },
  { id: 2, location: 'Near Napier Museum, TVM', severity: 'Moderate', img: 'https://i.imgur.com/g0t6S6w.jpeg', time: 'Reported 45 minutes ago' },
  { id: 3, location: 'Kowdiar Park Entrance', severity: 'Light', img: 'https://i.imgur.com/2sU1x7L.jpeg', time: 'Reported 1 hour ago' },
];

const overflowingBins = [
  { id: 101, location: 'East Fort, Community Bin #1', fillLevel: 95 },
  { id: 102, location: 'Medical College, Bin #4', fillLevel: 80 },
  { id: 103, location: 'Technopark Phase 1, Bin #7', fillLevel: 98 },
];

// --- Main Portal Component ---

const SenaPortal = () => {
  
  const getSeverityChip = (severity) => {
    if (severity === 'Severe') return <Chip label="Severe" color="error" size="small" />;
    if (severity === 'Moderate') return <Chip label="Moderate" color="warning" size="small" />;
    return <Chip label="Light" color="info" size="small" />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Haritha Karma Sena Portal
      </Typography>
      
      {/* --- Section 1: Recent Reports --- */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ReportIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5">Recent Reports</Typography>
        </Box>
        <Grid container spacing={3}>
          {recentReports.map(report => (
            <Grid item xs={12} sm={6} md={4} key={report.id}>
              <Card>
                <CardMedia component="img" height="180" image={report.img} alt={report.location} />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {report.location}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {getSeverityChip(report.severity)}
                    <Typography variant="caption" color="text.secondary">{report.time}</Typography>
                  </Box>
                </CardContent>
                <Box sx={{ p: 2 }}>
                   <Button variant="contained" fullWidth>Assign Task</Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* --- Section 2: Overflowing Bins --- */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <BinIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5">Overflowing Bins</Typography>
        </Box>
        <List>
          {overflowingBins.sort((a,b) => b.fillLevel - a.fillLevel).map(bin => (
            <ListItem key={bin.id} secondaryAction={
              <Button edge="end" variant="outlined" size="small">Schedule Pickup</Button>
            }>
              <ListItemText 
                primary={bin.location}
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <LinearProgress variant="determinate" value={bin.fillLevel} sx={{ width: '80%', height: 8, borderRadius: 5, mr: 2 }} />
                    <Typography variant="body2" color="text.secondary">{`${bin.fillLevel}% Full`}</Typography>
                  </Box>
                } 
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      
      {/* --- Section 3: Live Heatmap --- */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <MapIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5">Live Heatmap</Typography>
        </Box>
        <Box sx={{ height: 500, backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 1 }}>
            <Typography>// Your Leaflet Heatmap Component Goes Here</Typography>
        </Box>
      </Paper>

    </Container>
  );
};

export default SenaPortal;