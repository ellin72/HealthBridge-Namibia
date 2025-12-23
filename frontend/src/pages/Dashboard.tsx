import React from 'react';
import { useQuery } from 'react-query';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress
} from '@mui/material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: appointments, isLoading: appointmentsLoading } = useQuery(
    'appointments',
    () => api.get('/appointments').then(res => res.data),
    { enabled: !!user }
  );

  const { data: wellnessContent, isLoading: wellnessLoading } = useQuery(
    'wellness',
    () => api.get('/wellness?publishedOnly=true').then(res => res.data),
    { enabled: !!user }
  );

  const stats = [
    {
      title: 'Upcoming Appointments',
      value: appointments?.filter((a: any) => a.status === 'PENDING' || a.status === 'CONFIRMED').length || 0,
      color: '#1976d2'
    },
    {
      title: 'Wellness Articles',
      value: wellnessContent?.length || 0,
      color: '#2e7d32'
    },
    {
      title: 'Role',
      value: user?.role || 'N/A',
      color: '#ed6c02'
    }
  ];

  return (
    <Layout>
      <Container>
        <Typography variant="h4" gutterBottom>
          Welcome, {user?.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Here's your HealthBridge dashboard overview
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Recent Appointments
          </Typography>
          {appointmentsLoading ? (
            <CircularProgress />
          ) : appointments?.length > 0 ? (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {appointments.slice(0, 3).map((appointment: any) => (
                <Grid item xs={12} key={appointment.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">
                        {appointment.provider.firstName} {appointment.provider.lastName}
                      </Typography>
                      <Typography color="text.secondary">
                        {new Date(appointment.appointmentDate).toLocaleString()}
                      </Typography>
                      <Typography>
                        Status: {appointment.status}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No appointments found</Typography>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default Dashboard;

