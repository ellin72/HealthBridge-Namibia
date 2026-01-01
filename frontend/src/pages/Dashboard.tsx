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
  Article as ArticleIcon,
  EventNote as EventNoteIcon,
  AccessTime as TimeIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  Receipt as ReceiptIcon,
  Book as BookIcon,
  LocalPharmacy as PharmacyIcon
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

  // Queries for different roles
  const { data: appointments, isLoading: appointmentsLoading } = useQuery(
    'appointments',
    () => api.get('/appointments').then(res => res.data),
    { enabled: !!user && (user.role === 'PATIENT' || user.role === 'HEALTHCARE_PROVIDER' || user.role === 'ADMIN') }
  );


  const { data: myWellnessContent } = useQuery(
    'my-wellness',
    () => api.get('/wellness').then(res => res.data.filter((c: any) => c.authorId === user?.id)),
    { enabled: !!user && (user.role === 'WELLNESS_COACH' || user.role === 'ADMIN') }
  );

  const { data: assignments } = useQuery(
    'assignments',
    () => api.get('/learning/assignments').then(res => res.data),
    { enabled: !!user && (user.role === 'STUDENT' || user.role === 'HEALTHCARE_PROVIDER' || user.role === 'ADMIN') }
  );

  const { data: learningResources } = useQuery(
    'learning-resources',
    () => api.get('/learning/resources?publishedOnly=true').then(res => res.data),
    { enabled: !!user && (user.role === 'STUDENT' || user.role === 'ADMIN') }
  );

  const { data: billingStats } = useQuery(
    'billing-stats',
    () => api.get('/billing/stats').then(res => res.data.stats),
    { enabled: !!user && (user.role === 'PATIENT' || user.role === 'HEALTHCARE_PROVIDER' || user.role === 'ADMIN') }
  );

  const { data: analytics } = useQuery(
    'provider-analytics',
    () => api.get('/telehealth-pro/analytics').then(res => res.data),
    { enabled: !!user && (user.role === 'HEALTHCARE_PROVIDER' || user.role === 'ADMIN') }
  );

  const { data: consultationNotes } = useQuery(
    'patient-consultations',
    () => api.get('/consultations').then(res => res.data),
    { enabled: !!user && user.role === 'PATIENT' }
  );

  // Role-specific stats
  const getStats = () => {
    if (!user) return [];

    const prescriptionsCount = consultationNotes?.filter((note: any) => note.prescription).length || 0;

    switch (user.role) {
      case 'PATIENT':
        return [
          {
            title: 'Upcoming Appointments',
            value: appointments?.filter((a: any) => a.status === 'PENDING' || a.status === 'CONFIRMED').length || 0,
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
            title: billingStats?.pendingInvoices ? `Pending Bills` : 'Total Appointments',
            value: billingStats?.pendingInvoices || appointments?.length || 0,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            icon: billingStats?.pendingInvoices ? <ReceiptIcon /> : <EventNoteIcon />,
          }
        ];

      case 'HEALTHCARE_PROVIDER':
        return [
          {
            title: 'Today\'s Appointments',
            value: appointments?.filter((a: any) => {
              const today = new Date();
              const apptDate = new Date(a.appointmentDate);
              return apptDate.toDateString() === today.toDateString() && 
                     (a.status === 'PENDING' || a.status === 'CONFIRMED');
            }).length || 0,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            icon: <CalendarIcon />,
          },
          {
            title: 'Total Patients',
            value: analytics?.uniquePatients || 0,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            icon: <PeopleIcon />,
          },
          {
            title: 'Total Appointments',
            value: analytics?.totalAppointments || appointments?.length || 0,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            icon: <EventNoteIcon />,
          }
        ];

      case 'WELLNESS_COACH':
        return [
          {
            title: 'Published Articles',
            value: myWellnessContent?.filter((c: any) => c.isPublished).length || 0,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            icon: <ArticleIcon />,
          },
          {
            title: 'Total Articles',
            value: myWellnessContent?.length || 0,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            icon: <BookIcon />,
          },
          {
            title: 'Draft Articles',
            value: myWellnessContent?.filter((c: any) => !c.isPublished).length || 0,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            icon: <ArticleIcon />,
          }
        ];

      case 'STUDENT':
        return [
          {
            title: 'Pending Assignments',
            value: assignments?.filter((a: any) => {
              const submission = a.submissions?.[0];
              return !submission || submission.status === 'PENDING';
            }).length || 0,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            icon: <AssignmentIcon />,
          },
          {
            title: 'Total Assignments',
            value: assignments?.length || 0,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            icon: <SchoolIcon />,
          },
          {
            title: 'Learning Resources',
            value: learningResources?.length || 0,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            icon: <BookIcon />,
          }
        ];

      case 'ADMIN':
        return [
          {
            title: 'Total Users',
            value: 'All',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            icon: <PeopleIcon />,
          },
          {
            title: 'System Overview',
            value: 'Active',
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            icon: <TrendingUpIcon />,
          },
          {
            title: 'Total Appointments',
            value: appointments?.length || 0,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            icon: <EventNoteIcon />,
          }
        ];

      default:
        return [];
    }
  };

  const stats = getStats();

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

          {/* Appointments section - only for PATIENT, HEALTHCARE_PROVIDER, and ADMIN */}
          {(user?.role === 'PATIENT' || user?.role === 'HEALTHCARE_PROVIDER' || user?.role === 'ADMIN') && (
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
                              {user?.role === 'PATIENT'
                                ? `${appointment.provider?.firstName?.[0]}${appointment.provider?.lastName?.[0]}`
                                : `${appointment.patient?.firstName?.[0]}${appointment.patient?.lastName?.[0]}`
                              }
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
                    {user?.role === 'PATIENT' 
                      ? 'No appointments found. Book your first appointment to get started!'
                      : 'No appointments scheduled yet.'
                    }
                  </Typography>
                </Card>
              )}
            </Box>
          )}

          {/* Assignments section for STUDENT */}
          {user?.role === 'STUDENT' && (
            <Box sx={{ mt: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: '#1e293b',
                  mb: 3,
                }}
              >
                Recent Assignments
              </Typography>
              {assignments && assignments.length > 0 ? (
                <Grid container spacing={3}>
                  {assignments.slice(0, 3).map((assignment: any) => {
                    const submission = assignment.submissions?.[0];
                    return (
                      <Grid item xs={12} md={6} lg={4} key={assignment.id}>
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
                                <AssignmentIcon />
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 600,
                                    color: '#1e293b',
                                    mb: 0.5,
                                  }}
                                >
                                  {assignment.title}
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
                                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: 'inline-block',
                                px: 2,
                                py: 0.5,
                                borderRadius: 2,
                                backgroundColor: submission
                                  ? submission.status === 'GRADED'
                                    ? 'rgba(16, 185, 129, 0.1)'
                                    : 'rgba(245, 158, 11, 0.1)'
                                  : 'rgba(239, 68, 68, 0.1)',
                                color: submission
                                  ? submission.status === 'GRADED'
                                    ? '#059669'
                                    : '#d97706'
                                  : '#ef4444',
                                fontWeight: 600,
                                fontSize: '0.8125rem',
                              }}
                            >
                              {submission
                                ? submission.status === 'GRADED'
                                  ? `Graded: ${submission.grade}%`
                                  : 'Submitted'
                                : 'Not Submitted'
                              }
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No assignments found.
                  </Typography>
                </Card>
              )}
            </Box>
          )}

          {/* Wellness Content section for WELLNESS_COACH */}
          {user?.role === 'WELLNESS_COACH' && (
            <Box sx={{ mt: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: '#1e293b',
                  mb: 3,
                }}
              >
                My Wellness Content
              </Typography>
              {myWellnessContent && myWellnessContent.length > 0 ? (
                <Grid container spacing={3}>
                  {myWellnessContent.slice(0, 3).map((content: any) => (
                    <Grid item xs={12} md={6} lg={4} key={content.id}>
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
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                mr: 2,
                              }}
                            >
                              <ArticleIcon />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 600,
                                  color: '#1e293b',
                                  mb: 0.5,
                                }}
                              >
                                {content.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#64748b',
                                }}
                              >
                                {content.category}
                              </Typography>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: 'inline-block',
                              px: 2,
                              py: 0.5,
                              borderRadius: 2,
                              backgroundColor: content.isPublished
                                ? 'rgba(16, 185, 129, 0.1)'
                                : 'rgba(245, 158, 11, 0.1)',
                              color: content.isPublished
                                ? '#059669'
                                : '#d97706',
                              fontWeight: 600,
                              fontSize: '0.8125rem',
                            }}
                          >
                            {content.isPublished ? 'Published' : 'Draft'}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Card sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No wellness content created yet. Start creating content to help others!
                  </Typography>
                </Card>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </Layout>
  );
};

export default Dashboard;

