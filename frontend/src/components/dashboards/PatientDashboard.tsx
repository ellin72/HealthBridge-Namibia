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
  Avatar
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  LocalPharmacy as PharmacyIcon,
  Receipt as ReceiptIcon,
  EventNote as EventNoteIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import api from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import MedicationReminders from '../MedicationReminders';
import RemoteMonitoring from '../RemoteMonitoring';
import QuickActionTiles from '../QuickActionTiles';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: appointments, isLoading: appointmentsLoading } = useQuery(
    'appointments',
    () => api.get('/appointments').then(res => res.data),
    { enabled: !!user }
  );

  const { data: billingStats } = useQuery(
    'billing-stats',
    () => api.get('/billing/stats').then(res => res.data.stats),
    { enabled: !!user }
  );

  const { data: consultationNotes } = useQuery(
    'patient-consultations',
    () => api.get('/consultations').then(res => res.data),
    { enabled: !!user }
  );

  const prescriptionsCount = consultationNotes?.filter((note: any) => note.prescription).length || 0;
  const upcomingAppointments = appointments?.filter((a: any) => a.status === 'PENDING' || a.status === 'CONFIRMED').length || 0;

  const stats = [
    {
      title: 'Upcoming Appointments',
      value: upcomingAppointments,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: <CalendarIcon />,
    },
    {
      title: 'My Prescriptions',
      value: prescriptionsCount,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      icon: <PharmacyIcon />,
    },
    {
      title: billingStats?.pendingInvoices ? 'Pending Bills' : 'Total Appointments',
      value: billingStats?.pendingInvoices || appointments?.length || 0,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: billingStats?.pendingInvoices ? <ReceiptIcon /> : <EventNoteIcon />,
    }
  ];

  return (
    <Box>
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
            Your HealthBridge dashboard - Book appointments, check symptoms, and manage your wellness
          </Typography>
        </Box>

        {/* Quick Actions */}
        <QuickActionTiles role="PATIENT" />

        {/* Stats Cards */}
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

        {/* Additional Sections */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} lg={6}>
            <MedicationReminders />
          </Grid>
          <Grid item xs={12} lg={6}>
            <RemoteMonitoring />
          </Grid>
        </Grid>

        {/* Recent Appointments */}
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
                          {`${appointment.provider?.firstName?.[0]}${appointment.provider?.lastName?.[0]}`}
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
                            Dr. {appointment.provider?.firstName} {appointment.provider?.lastName}
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
  );
};

export default PatientDashboard;
