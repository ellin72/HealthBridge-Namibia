import React from 'react';
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
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  MedicalServices as MedicalServicesIcon,
  History as HistoryIcon,
  VideoCall as VideoCallIcon,
  LocalHospital as HospitalIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const PrimaryCare: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <PersonIcon sx={{ fontSize: 48, color: '#2563eb' }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Primary Care
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                Ongoing patient-doctor relationships for comprehensive care
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Your Primary Care Provider
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                  Build a lasting relationship with a primary care provider who understands your health
                  history and provides personalized, continuous care.
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<PersonIcon />}
                    onClick={() => navigate('/select-provider')}
                  >
                    Choose Primary Care Provider
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CalendarIcon />}
                    onClick={() => navigate('/appointments')}
                  >
                    Schedule Appointment
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Benefits of Primary Care
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <MedicalServicesIcon sx={{ color: '#2563eb', mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Continuity of Care
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Your provider knows your medical history, medications, and health goals
                      </Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <HistoryIcon sx={{ color: '#2563eb', mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Preventive Care
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Regular check-ups, screenings, and health maintenance
                      </Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <VideoCallIcon sx={{ color: '#2563eb', mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Convenient Access
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        In-person and telehealth consultations available
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <HospitalIcon sx={{ color: '#10b981' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Comprehensive Care
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Primary care providers offer a wide range of services including routine check-ups,
                  chronic disease management, and preventive care.
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Services Included
                </Typography>
                <Stack spacing={1}>
                  <Chip label="Annual Physical Exams" size="small" />
                  <Chip label="Health Screenings" size="small" />
                  <Chip label="Chronic Disease Management" size="small" />
                  <Chip label="Vaccinations" size="small" />
                  <Chip label="Health Counseling" size="small" />
                  <Chip label="Referrals to Specialists" size="small" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default PrimaryCare;
