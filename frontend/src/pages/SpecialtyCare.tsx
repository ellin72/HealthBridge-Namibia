import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  Avatar,
} from '@mui/material';
import {
  LocalHospital as HospitalIcon,
  Face as FaceIcon,
  Favorite as HeartIcon,
  Visibility as EyeIcon,
  Healing as HealingIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  VideoCall as VideoCallIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const SpecialtyCare: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const specialties = [
    {
      title: 'Dermatology',
      description: 'Skin conditions, acne treatment, and dermatological consultations',
      icon: <FaceIcon sx={{ fontSize: 40 }} />,
      color: '#f59e0b',
    },
    {
      title: 'Cardiology',
      description: 'Heart health, cardiovascular assessments, and cardiac care',
      icon: <HeartIcon sx={{ fontSize: 40 }} />,
      color: '#ef4444',
    },
    {
      title: 'Expert Medical Opinions',
      description: 'Second opinions and expert consultations for complex cases',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      color: '#2563eb',
    },
  ];

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <HospitalIcon sx={{ fontSize: 48, color: '#2563eb' }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Specialty Care
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                Access to specialists including dermatology, cardiology, and expert medical opinions
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {specialties.map((specialty, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  border: `2px solid ${specialty.color}20`,
                  '&:hover': {
                    borderColor: specialty.color,
                    transform: 'translateY(-4px)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: `${specialty.color}15`,
                      color: specialty.color,
                      mb: 2,
                    }}
                  >
                    {specialty.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {specialty.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    {specialty.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Book a Specialty Consultation
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                  Connect with board-certified specialists for expert care. Consultations available
                  in-person or via telehealth.
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<CalendarIcon />}
                    onClick={() => navigate('/appointments')}
                  >
                    Schedule Appointment
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<VideoCallIcon />}
                    onClick={() => navigate('/telehealth-pro')}
                  >
                    Video Consultation
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Available Specialties
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <FaceIcon sx={{ fontSize: 32, color: '#f59e0b', mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Dermatology
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <HeartIcon sx={{ fontSize: 32, color: '#ef4444', mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Cardiology
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <EyeIcon sx={{ fontSize: 32, color: '#2563eb', mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Ophthalmology
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <HealingIcon sx={{ fontSize: 32, color: '#10b981', mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        General Medicine
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <SchoolIcon sx={{ fontSize: 32, color: '#8b5cf6', mb: 1 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Expert Opinions
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  How It Works
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#2563eb', width: 32, height: 32 }}>1</Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Choose Specialty
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Select the type of specialist you need
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#2563eb', width: 32, height: 32 }}>2</Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Book Appointment
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Schedule in-person or video consultation
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#2563eb', width: 32, height: 32 }}>3</Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Consult & Follow-up
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Receive expert care and ongoing support
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default SpecialtyCare;
