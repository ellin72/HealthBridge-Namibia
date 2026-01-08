import React from 'react';
import { useQuery } from 'react-query';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import api from '../services/authService';
import { format } from 'date-fns';

const RemoteMonitoring: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useQuery(
    'monitoring-stats',
    () => api.get('/monitoring/stats?days=7').then(res => res.data.stats)
  );

  const { data: recentData, isLoading: dataLoading } = useQuery(
    'recent-monitoring',
    () => api.get('/monitoring?alertsOnly=true').then(res => res.data.data.slice(0, 5))
  );

  if (statsLoading || dataLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Remote Patient Monitoring
      </Typography>

      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ border: '1px solid #e2e8f0' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Total Readings
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats.totalReadings}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Last 7 days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ border: '1px solid #e2e8f0' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Alerts
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>
                  {stats.alertCount}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Requires attention
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ border: '1px solid #e2e8f0' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Latest Reading
                </Typography>
                {stats.latestData && (
                  <>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stats.latestData.value} {stats.latestData.unit}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(stats.latestData.recordedAt), 'MMM dd, HH:mm')}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ border: '1px solid #e2e8f0' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Average Value
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {stats.averageValue.toFixed(1)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stats.period}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {recentData && recentData.length > 0 && (
        <Card sx={{ border: '1px solid #e2e8f0' }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Recent Alerts
            </Typography>
            {recentData.map((reading: any) => (
              <Alert
                key={reading.id}
                severity={reading.alertLevel === 'CRITICAL' ? 'error' : 'warning'}
                sx={{ mb: 1 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {reading.metricType.replace(/_/g, ' ')}
                    </Typography>
                    <Typography variant="body2">
                      {reading.value} {reading.unit} • {format(new Date(reading.recordedAt), 'MMM dd, HH:mm')}
                    </Typography>
                  </Box>
                  <Chip
                    label={reading.alertLevel}
                    size="small"
                    color={reading.alertLevel === 'CRITICAL' ? 'error' : 'warning'}
                  />
                </Box>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default RemoteMonitoring;

