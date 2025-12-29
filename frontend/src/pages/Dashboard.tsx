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
  Avatar,
  LinearProgress
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Article as ArticleIcon,
  Badge as BadgeIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import MedicationReminders from '../components/MedicationReminders';
import BillingOverview from '../components/BillingOverview';
import ClinicalTemplates from '../components/ClinicalTemplates';
import RemoteMonitoring from '../components/RemoteMonitoring';

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
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: <CalendarIcon />,
    },
    {
      title: 'Wellness Articles',
      value: wellnessContent?.length || 0,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: <ArticleIcon />,
    },
    {
      title: 'Your Role',
      value: user?.role || 'N/A',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: <BadgeIcon />,
    }
  ];

  return (
    <Layout>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                mb: 1,
              }}
            >
              Welcome back, {user?.firstName}! 👋
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#64748b',
                fontSize: '1.0625rem',
              }}
            >
              Here's your HealthBridge dashboard overview
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    background: stat.gradient,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '100px',
                      height: '100px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '50%',
                      transform: 'translate(30px, -30px)',
                    },
                  }}
                >
                  <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            opacity: 0.9,
                            fontWeight: 500,
                            mb: 1,
                          }}
                        >
                          {stat.title}
                        </Typography>
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 700,
                            fontSize: '2.5rem',
                          }}
                        >
                          {stat.value}
                        </Typography>
                      </Box>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Role-specific dashboard sections */}
          {user?.role === 'PATIENT' && (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} lg={6}>
                <MedicationReminders />
              </Grid>
              <Grid item xs={12} lg={6}>
                <RemoteMonitoring />
              </Grid>
            </Grid>
          )}

          {user?.role === 'HEALTHCARE_PROVIDER' && (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <BillingOverview />
              </Grid>
              <Grid item xs={12}>
                <ClinicalTemplates />
              </Grid>
              <Grid item xs={12}>
                <RemoteMonitoring />
              </Grid>
            </Grid>
          )}

          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#1e293b',
                mb: 3,
              }}
            >
              Recent Appointments
            </Typography>
            {appointmentsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : appointments?.length > 0 ? (
              <Grid container spacing={3}>
                {appointments.slice(0, 3).map((appointment: any) => (
                  <Grid item xs={12} md={6} lg={4} key={appointment.id}>
                    <Card
                      sx={{
                        height: '100%',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            sx={{
                              width: 48,
                              height: 48,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              mr: 2,
                            }}
                          >
                            {appointment.provider?.firstName?.[0]}
                            {appointment.provider?.lastName?.[0]}
                          </Avatar>
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: '#1e293b',
                                mb: 0.5,
                              }}
                            >
                              {user?.role === 'PATIENT' 
                                ? `Dr. ${appointment.provider?.firstName} ${appointment.provider?.lastName}`
                                : `${appointment.patient?.firstName} ${appointment.patient?.lastName}`
                              }
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#64748b',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              <TimeIcon sx={{ fontSize: 16 }} />
                              {new Date(appointment.appointmentDate).toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            backgroundColor:
                              appointment.status === 'CONFIRMED'
                                ? 'rgba(16, 185, 129, 0.1)'
                                : appointment.status === 'PENDING'
                                ? 'rgba(245, 158, 11, 0.1)'
                                : 'rgba(100, 116, 139, 0.1)',
                            color:
                              appointment.status === 'CONFIRMED'
                                ? '#059669'
                                : appointment.status === 'PENDING'
                                ? '#d97706'
                                : '#64748b',
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                          }}
                        >
                          {appointment.status}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No appointments found. Book your first appointment to get started!
                </Typography>
              </Card>
            )}
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default Dashboard;

