// @ts-nocheck
import React from 'react';
import { useQuery } from 'react-query';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  MonitorHeart as MonitorIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

interface MonitoringData {
  systemHealth: {
    status: string;
    uptime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
  apiMetrics: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
  };
  databaseMetrics: {
    connectionPool: number;
    activeConnections: number;
    queryPerformance: number;
  };
}

const Monitoring: React.FC = () => {
  const { user } = useAuth();

  const { data: monitoringData, isLoading } = useQuery(
    'monitoring',
    () => api.get('/monitoring').then(res => res.data.data),
    {
      enabled: !!user && (user.role === 'ADMIN' || user.role === 'HEALTHCARE_PROVIDER'),
      refetchInterval: 30000 // Refresh every 30 seconds
    }
  );

  if (isLoading) {
    return (
      <Layout>
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  if (!monitoringData) {
    return (
      <Layout>
        <Container>
          <Typography variant="h6" color="error">
            You don't have permission to view monitoring data.
          </Typography>
        </Container>
      </Layout>
    );
  }

  const data = monitoringData as MonitoringData;

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            System Monitoring
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* System Health */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <MonitorIcon color="primary" />
                  <Typography variant="h6">System Health</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={data.systemHealth?.status || 'UNKNOWN'}
                    color={data.systemHealth?.status === 'HEALTHY' ? 'success' : 'warning'}
                    sx={{ mt: 1 }}
                  />
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">
                    Uptime
                  </Typography>
                  <Typography variant="h6">
                    {data.systemHealth?.uptime
                      ? `${Math.floor(data.systemHealth.uptime / 3600)}h ${Math.floor((data.systemHealth.uptime % 3600) / 60)}m`
                      : 'N/A'}
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Memory Usage: {data.systemHealth?.memoryUsage?.toFixed(1) || 0}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={data.systemHealth?.memoryUsage || 0}
                    color={data.systemHealth?.memoryUsage && data.systemHealth.memoryUsage > 80 ? 'error' : 'primary'}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    CPU Usage: {data.systemHealth?.cpuUsage?.toFixed(1) || 0}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={data.systemHealth?.cpuUsage || 0}
                    color={data.systemHealth?.cpuUsage && data.systemHealth.cpuUsage > 80 ? 'error' : 'primary'}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* API Metrics */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <SpeedIcon color="primary" />
                  <Typography variant="h6">API Metrics</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Total Requests
                    </Typography>
                    <Typography variant="h6">{data.apiMetrics?.totalRequests || 0}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Successful
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {data.apiMetrics?.successfulRequests || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Failed
                    </Typography>
                    <Typography variant="h6" color="error.main">
                      {data.apiMetrics?.failedRequests || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Avg Response Time
                    </Typography>
                    <Typography variant="h6">
                      {data.apiMetrics?.averageResponseTime?.toFixed(0) || 0}ms
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Database Metrics */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <TrendingUpIcon color="primary" />
                  <Typography variant="h6">Database Metrics</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Connection Pool
                    </Typography>
                    <Typography variant="h6">{data.databaseMetrics?.connectionPool || 0}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Active Connections
                    </Typography>
                    <Typography variant="h6">{data.databaseMetrics?.activeConnections || 0}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Query Performance
                    </Typography>
                    <Typography variant="h6">
                      {data.databaseMetrics?.queryPerformance?.toFixed(0) || 0}ms
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Monitoring;

