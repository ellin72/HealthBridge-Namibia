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
  Psychology as PsychologyIcon,
  Support as SupportIcon,
  Medication as MedicationIcon,
  SelfImprovement as SelfImprovementIcon,
  VideoCall as VideoCallIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

const MentalHealth: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const services = [
    {
      title: 'Therapy',
      description: 'Individual and group therapy sessions with licensed therapists',
      icon: <SupportIcon sx={{ fontSize: 40 }} />,
      color: '#667eea',
    },
    {
      title: 'Psychiatry',
      description: 'Psychiatric evaluations and medication management',
      icon: <MedicationIcon sx={{ fontSize: 40 }} />,
      color: '#10b981',
    },
    {
      title: 'Stress Management',
      description: 'Tools and techniques for managing stress and anxiety',
      icon: <SelfImprovementIcon sx={{ fontSize: 40 }} />,
      color: '#f59e0b',
    },
  ];

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <PsychologyIcon sx={{ fontSize: 48, color: '#8b5cf6' }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Mental Health Services
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                Therapy, psychiatry, and stress management support
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {services.map((service, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  border: `2px solid ${service.color}20`,
                  '&:hover': {
                    borderColor: service.color,
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
                      backgroundColor: `${service.color}15`,
                      color: service.color,
                      mb: 2,
                    }}
                  >
                    {service.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    {service.description}
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
                  Get Started
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                  Connect with mental health professionals who can help you on your wellness journey.
                  All consultations are confidential and secure.
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<CalendarIcon />}
                    onClick={() => navigate('/appointments')}
                    sx={{ backgroundColor: '#8b5cf6', '&:hover': { backgroundColor: '#7c3aed' } }}
                  >
                    Book Appointment
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
                  Why Choose Our Mental Health Services
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#8b5cf6', width: 40, height: 40 }}>
                      <SupportIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Licensed Professionals
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        All therapists and psychiatrists are licensed and experienced
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#8b5cf6', width: 40, height: 40 }}>
                      <VideoCallIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Flexible Options
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        In-person or telehealth sessions available
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#8b5cf6', width: 40, height: 40 }}>
                      <PsychologyIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Comprehensive Care
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Therapy, psychiatry, and wellness support in one place
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Available Services
                </Typography>
                <Stack spacing={1}>
                  <Chip label="Individual Therapy" size="small" />
                  <Chip label="Group Therapy" size="small" />
                  <Chip label="Psychiatric Evaluation" size="small" />
                  <Chip label="Medication Management" size="small" />
                  <Chip label="Stress Management" size="small" />
                  <Chip label="Anxiety Support" size="small" />
                  <Chip label="Depression Treatment" size="small" />
                  <Chip label="Crisis Support" size="small" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default MentalHealth;
