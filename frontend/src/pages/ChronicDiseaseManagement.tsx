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
} from '@mui/material';
import {
  MonitorHeart as MonitorHeartIcon,
  LocalHospital as HospitalIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  Medication as MedicationIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const ChronicDiseaseManagement: React.FC = () => {
  const navigate = useNavigate();

  const conditions = [
    {
      title: 'Diabetes',
      description: 'Blood sugar monitoring, medication management, and lifestyle support',
      icon: <MonitorHeartIcon sx={{ fontSize: 40 }} />,
      color: '#ef4444',
    },
    {
      title: 'Hypertension',
      description: 'Blood pressure tracking and cardiovascular health management',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: '#f59e0b',
    },
    {
      title: 'Weight Management',
      description: 'Livongo integration for comprehensive weight and health tracking',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      color: '#10b981',
    },
  ];

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <MonitorHeartIcon sx={{ fontSize: 48, color: '#ef4444' }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Chronic Disease Management
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                Comprehensive care for diabetes, hypertension, and weight management
              </Typography>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {conditions.map((condition, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  border: `2px solid ${condition.color}20`,
                  '&:hover': {
                    borderColor: condition.color,
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
                      backgroundColor: `${condition.color}15`,
                      color: condition.color,
                      mb: 2,
                    }}
                  >
                    {condition.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {condition.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    {condition.description}
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
                  Comprehensive Care Management
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                  Our chronic disease management program provides ongoing support, monitoring, and
                  personalized care plans to help you manage your condition effectively.
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<CalendarIcon />}
                    onClick={() => navigate('/appointments')}
                    sx={{ backgroundColor: '#ef4444', '&:hover': { backgroundColor: '#dc2626' } }}
                  >
                    Schedule Consultation
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<MedicationIcon />}
                    onClick={() => navigate('/prescriptions')}
                  >
                    View Medications
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Features
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Regular Monitoring
                      </Typography>
                      <Chip label="Available" size="small" color="success" />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Track your vital signs and health metrics regularly
                    </Typography>
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Livongo Integration
                      </Typography>
                      <Chip label="Available" size="small" color="success" />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Seamless integration with Livongo for weight and health tracking
                    </Typography>
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Medication Management
                      </Typography>
                      <Chip label="Available" size="small" color="success" />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Digital prescriptions and medication reminders
                    </Typography>
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Care Plans
                      </Typography>
                      <Chip label="Available" size="small" color="success" />
                    </Box>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Personalized care plans tailored to your condition
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <HospitalIcon sx={{ color: '#10b981' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Support Team
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                  Our multidisciplinary team includes physicians, nurses, dietitians, and care
                  coordinators working together for your health.
                </Typography>
                <Stack spacing={1}>
                  <Chip label="Primary Care Physicians" size="small" />
                  <Chip label="Specialists" size="small" />
                  <Chip label="Care Coordinators" size="small" />
                  <Chip label="Nutritionists" size="small" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default ChronicDiseaseManagement;
