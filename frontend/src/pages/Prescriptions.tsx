import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Chip,
  Divider,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  LocalPharmacy as PharmacyIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  MedicalServices as MedicalIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const Prescriptions: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all consultation notes for the patient (which contain prescriptions)
  const { data: consultationNotes, isLoading } = useQuery(
    'patient-prescriptions',
    () => api.get('/consultations').then(res => res.data),
    { enabled: !!user && user.role === 'PATIENT' }
  );

  // Filter prescriptions that have prescription data
  const prescriptions = consultationNotes?.filter((note: any) => note.prescription) || [];

  // Filter by search term
  const filteredPrescriptions = prescriptions.filter((note: any) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      note.prescription?.toLowerCase().includes(searchLower) ||
      note.diagnosis?.toLowerCase().includes(searchLower) ||
      note.provider?.firstName?.toLowerCase().includes(searchLower) ||
      note.provider?.lastName?.toLowerCase().includes(searchLower)
    );
  });

  if (user?.role !== 'PATIENT') {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="warning">
            This page is only accessible to patients.
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PharmacyIcon sx={{ fontSize: 40, color: '#2563eb', mr: 2 }} />
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#1e293b',
                    mb: 0.5,
                  }}
                >
                  My Prescriptions
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#64748b',
                    fontSize: '1.0625rem',
                  }}
                >
                  View and manage all your prescriptions from completed appointments
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Search Bar */}
          <Box sx={{ mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Search prescriptions by medication, diagnosis, or doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#64748b' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: 'white',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.9,
                          fontWeight: 500,
                          mb: 1,
                        }}
                      >
                        Total Prescriptions
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          fontSize: '2.5rem',
                        }}
                      >
                        {prescriptions.length}
                      </Typography>
                    </Box>
                    <PharmacyIcon sx={{ fontSize: 56, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.9,
                          fontWeight: 500,
                          mb: 1,
                        }}
                      >
                        Active Prescriptions
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          fontSize: '2.5rem',
                        }}
                      >
                        {prescriptions.filter((p: any) => {
                          // Consider prescriptions from last 90 days as active
                          const date = new Date(p.createdAt);
                          const daysSince = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
                          return daysSince <= 90;
                        }).length}
                      </Typography>
                    </Box>
                    <MedicalIcon sx={{ fontSize: 56, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
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
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.9,
                          fontWeight: 500,
                          mb: 1,
                        }}
                      >
                        This Month
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          fontSize: '2.5rem',
                        }}
                      >
                        {prescriptions.filter((p: any) => {
                          const date = new Date(p.createdAt);
                          const now = new Date();
                          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                        }).length}
                      </Typography>
                    </Box>
                    <CalendarIcon sx={{ fontSize: 56, opacity: 0.3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Prescriptions List */}
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#1e293b',
                mb: 3,
              }}
            >
              All Prescriptions
            </Typography>

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : filteredPrescriptions.length > 0 ? (
              <Grid container spacing={3}>
                {filteredPrescriptions.map((note: any) => (
                  <Grid item xs={12} key={note.id}>
                    <Card
                      sx={{
                        border: '1px solid #e2e8f0',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <PersonIcon sx={{ fontSize: 20, color: '#64748b', mr: 1 }} />
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                Dr. {note.provider?.firstName} {note.provider?.lastName}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarIcon sx={{ fontSize: 16, color: '#64748b' }} />
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                  {new Date(note.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </Typography>
                              </Box>
                              {note.appointment?.appointmentDate && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <CalendarIcon sx={{ fontSize: 16, color: '#64748b' }} />
                                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                                    Appointment: {new Date(note.appointment.appointmentDate).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                          <Chip
                            label={new Date(note.createdAt) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) ? 'Active' : 'Past'}
                            color={new Date(note.createdAt) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) ? 'success' : 'default'}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {note.diagnosis && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: '#64748b' }}>
                              Diagnosis:
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#1e293b' }}>
                              {note.diagnosis}
                            </Typography>
                          </Box>
                        )}

                        <Box sx={{ mb: 2, p: 2, backgroundColor: '#f0f9ff', borderRadius: 2, border: '1px solid #bae6fd' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PharmacyIcon sx={{ fontSize: 20, color: '#2563eb', mr: 1 }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e40af' }}>
                              Prescription:
                            </Typography>
                          </Box>
                          <Typography
                            variant="body1"
                            sx={{
                              whiteSpace: 'pre-wrap',
                              color: '#1e293b',
                              fontFamily: 'monospace',
                              lineHeight: 1.8,
                            }}
                          >
                            {note.prescription}
                          </Typography>
                        </Box>

                        {note.followUpDate && (
                          <Box sx={{ mt: 2, p: 1.5, backgroundColor: '#fef3c7', borderRadius: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#92400e' }}>
                              Follow-up Date: {new Date(note.followUpDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card sx={{ p: 6, textAlign: 'center' }}>
                <PharmacyIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                  {searchTerm ? 'No prescriptions found matching your search' : 'No prescriptions yet'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  {searchTerm
                    ? 'Try adjusting your search terms'
                    : 'Prescriptions will appear here after your healthcare provider adds them to your consultation notes.'}
                </Typography>
              </Card>
            )}
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default Prescriptions;

