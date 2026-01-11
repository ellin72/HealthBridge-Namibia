import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Avatar,
  Divider,
  Tabs,
  Tab,
  alpha,
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  PlayArrow as PlayIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import TopNavigationBar from '../components/TopNavigationBar';
import LogoIcon from '../components/LogoIcon';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`home-tabpanel-${index}`}
      aria-labelledby={`home-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 4 }}>{children}</Box>}
    </div>
  );
}

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const services = [
    {
      title: 'Urgent Care',
      description: 'Get immediate care for urgent health concerns. Connect with healthcare providers quickly when you need it most.',
      image: '/api/placeholder/400/250',
      link: '/urgent-care',
      color: '#ef4444',
    },
    {
      title: 'Primary Care',
      description: 'Ongoing patient-doctor relationships for comprehensive care, checkups, and preventive health management.',
      image: '/api/placeholder/400/250',
      link: '/primary-care',
      color: '#3b82f6',
    },
    {
      title: 'Mental Health',
      description: 'Access licensed therapists and psychiatrists for therapy, counseling, and mental health support.',
      image: '/api/placeholder/400/250',
      link: '/mental-health',
      color: '#8b5cf6',
    },
    {
      title: 'Chronic Disease Management',
      description: 'Personalized care plans for diabetes, hypertension, and other chronic conditions with connected devices.',
      image: '/api/placeholder/400/250',
      link: '/chronic-disease-management',
      color: '#10b981',
    },
    {
      title: 'Specialty Care',
      description: 'Consult with specialists for expert medical opinions, dermatology, and specialized healthcare needs.',
      image: '/api/placeholder/400/250',
      link: '/specialty-care',
      color: '#f59e0b',
    },
    {
      title: 'Wellness Hub',
      description: 'Access nutrition plans, fitness routines, stress management tools, and wellness coaching.',
      image: '/api/placeholder/400/250',
      link: '/wellness',
      color: '#43e97b',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Mwangi',
      role: 'General Practitioner, Windhoek',
      content: 'HealthBridge has transformed how I manage my practice. The telehealth features allow me to reach patients in remote areas I never could before.',
      image: '/api/placeholder/400/400',
      videoUrl: '',
    },
    {
      name: 'John Kambonde',
      role: 'Patient, Otjiwarongo',
      content: 'As someone in a remote area, having access to quality healthcare through this platform has been life-changing.',
      image: '/api/placeholder/400/400',
      videoUrl: '',
    },
    {
      name: 'Maria Shikongo',
      role: 'Medical Student, UNAM',
      content: 'The research support tools and educational resources have been invaluable for my studies.',
      image: '/api/placeholder/400/400',
      videoUrl: '',
    },
  ];

  const medicalAidPartners = [
    { name: 'NAMMED', logo: '/api/placeholder/200/100' },
    { name: 'Medical Aid Fund', logo: '/api/placeholder/200/100' },
    { name: 'Prosana', logo: '/api/placeholder/200/100' },
  ];

  const tabContent = [
    {
      title: 'A high-quality care experience—anywhere, anytime',
      description: 'Create meaningful health outcomes for patients across Namibia. HealthBridge delivers comprehensive care, anticipating health needs and guiding targeted actions that drive impact.',
      metrics: [
        { value: '1,000+', label: 'Active Patients' },
        { value: '50+', label: 'Healthcare Providers' },
      ],
      image: '/api/placeholder/600/600',
    },
    {
      title: 'Great health outcomes for greater value',
      description: 'Build a comprehensive healthcare solution that puts better health within reach for your organization, while containing costs. HealthBridge provides complete and personalized care.',
      metrics: [
        { value: '95%', label: 'Satisfaction Rate' },
        { value: '#1', label: 'Digital Health Platform in Namibia' },
      ],
      image: '/api/placeholder/600/600',
    },
    {
      title: 'Connected care solutions for smarter healthcare systems',
      description: 'Expand capacity, deliver a unified patient experience, and empower clinical teams. HealthBridge\'s purpose-built technology helps institutions streamline operations and improve care.',
      metrics: [
        { value: '24/7', label: 'Care Availability' },
        { value: '100%', label: 'POPIA & HIPAA Compliant' },
      ],
      image: '/api/placeholder/600/600',
    },
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Top Navigation Bar (Teladoc-style) */}
      <TopNavigationBar />

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 14 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: '900px', mx: 'auto' }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '4rem' },
                mb: 3,
                lineHeight: 1.1,
              }}
            >
              Connecting you to better health
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 5,
                opacity: 0.95,
                fontWeight: 400,
                lineHeight: 1.6,
                fontSize: { xs: '1.1rem', md: '1.35rem' },
              }}
            >
              HealthBridge Namibia connects patients and care providers for medical care, mental health, chronic condition management and more.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ justifyContent: 'center' }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  backgroundColor: 'white',
                  color: '#667eea',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: '#f8f9fa',
                  },
                }}
                endIcon={<ArrowForwardIcon />}
              >
                Get care now
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/register?role=provider')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
                endIcon={<ArrowForwardIcon />}
              >
                Join as Provider
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Services Grid */}
      <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#EFEFF1' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: '#1e293b',
                fontSize: { xs: '2rem', md: '2.75rem' },
              }}
            >
              The care you need, all in one place
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                  onClick={() => navigate(service.link)}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      height: 200,
                      backgroundColor: alpha(service.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: service.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      <LogoIcon fontSize={40} />
                    </Box>
                  </CardMedia>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                      {service.description}
                    </Typography>
                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        mt: 2,
                        color: service.color,
                        fontWeight: 600,
                        textTransform: 'none',
                      }}
                    >
                      Learn more
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                px: 4,
                py: 1.5,
              }}
            >
              Get care now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Tabs Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: '#1e293b',
                fontSize: { xs: '2rem', md: '2.75rem' },
              }}
            >
              Transforming virtual care into a catalyst for better health
            </Typography>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                },
              }}
            >
              <Tab label="Patients" />
              <Tab label="Healthcare Providers" />
              <Tab label="Institutions" />
            </Tabs>
          </Box>
          {tabContent.map((content, index) => (
            <TabPanel value={tabValue} index={index} key={index}>
              <Grid container spacing={6} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: '#1e293b',
                      fontSize: { xs: '1.75rem', md: '2.25rem' },
                    }}
                  >
                    {content.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: '#64748b', mb: 4, lineHeight: 1.7, fontSize: '1.1rem' }}
                  >
                    {content.description}
                  </Typography>
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    {content.metrics.map((metric, idx) => (
                      <Grid item xs={6} key={idx}>
                        <Typography
                          variant="h4"
                          sx={{ fontWeight: 700, color: '#667eea', mb: 0.5 }}
                        >
                          {metric.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>
                          {metric.label}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{
                      borderColor: '#667eea',
                      color: '#667eea',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        borderColor: '#5568d3',
                        backgroundColor: alpha('#667eea', 0.04),
                      },
                    }}
                    endIcon={<ArrowForwardIcon />}
                  >
                    Learn more
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      height: 400,
                      borderRadius: 3,
                      backgroundColor: alpha('#667eea', 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <LogoIcon fontSize={120} sx={{ opacity: 0.3 }} />
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>
          ))}
        </Container>
      </Box>

      {/* Testimonials Carousel */}
      <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#764ba2', color: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.75rem' },
              }}
            >
              Helping people live their healthiest lives
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      backgroundColor: 'rgba(255,255,255,0.15)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 250,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        fontSize: '2.5rem',
                      }}
                    >
                      {testimonial.name[0]}
                    </Avatar>
                    {testimonial.videoUrl && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 16,
                          right: 16,
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          backgroundColor: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#764ba2',
                        }}
                      >
                        <PlayIcon />
                      </Box>
                    )}
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                      {testimonial.role}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.95, lineHeight: 1.7 }}>
                      "{testimonial.content}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Medical Aid Partners Marquee */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: '#1e293b',
                fontSize: { xs: '1.75rem', md: '2.25rem' },
              }}
            >
              Trusted by top healthcare partners across Namibia—and accepted by all major medical aid schemes
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 6,
              flexWrap: 'wrap',
            }}
          >
            {medicalAidPartners.map((partner, index) => (
              <Box
                key={index}
                sx={{
                  height: 80,
                  width: 200,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#64748b' }}>
                  {partner.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Final CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Making better health possible—everywhere
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ justifyContent: 'center', mt: 4 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  backgroundColor: 'white',
                  color: '#667eea',
                  fontWeight: 600,
                  px: 5,
                  py: 1.5,
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: '#f8f9fa',
                  },
                }}
                endIcon={<ArrowForwardIcon />}
              >
                Get started
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 600,
                  px: 5,
                  py: 1.5,
                  fontSize: '1rem',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
                endIcon={<ArrowForwardIcon />}
              >
                Download the app
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#1e293b', color: 'white', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <LogoIcon fontSize={32} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  HealthBridge Namibia
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3, lineHeight: 1.7 }}>
                Connecting healthcare, wellness, and learning for all Namibians. Access quality care
                anytime, anywhere.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton
                  sx={{ color: '#94a3b8', '&:hover': { color: '#667eea' } }}
                  component="a"
                  href="https://facebook.com"
                  target="_blank"
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  sx={{ color: '#94a3b8', '&:hover': { color: '#667eea' } }}
                  component="a"
                  href="https://twitter.com"
                  target="_blank"
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  sx={{ color: '#94a3b8', '&:hover': { color: '#667eea' } }}
                  component="a"
                  href="https://linkedin.com"
                  target="_blank"
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  sx={{ color: '#94a3b8', '&:hover': { color: '#667eea' } }}
                  component="a"
                  href="https://instagram.com"
                  target="_blank"
                >
                  <InstagramIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Patients
              </Typography>
              <Stack spacing={1}>
                <Button
                  color="inherit"
                  sx={{ justifyContent: 'flex-start', color: '#94a3b8', textTransform: 'none' }}
                  onClick={() => navigate('/urgent-care')}
                >
                  Urgent Care
                </Button>
                <Button
                  color="inherit"
                  sx={{ justifyContent: 'flex-start', color: '#94a3b8', textTransform: 'none' }}
                  onClick={() => navigate('/primary-care')}
                >
                  Primary Care
                </Button>
                <Button
                  color="inherit"
                  sx={{ justifyContent: 'flex-start', color: '#94a3b8', textTransform: 'none' }}
                  onClick={() => navigate('/mental-health')}
                >
                  Mental Health
                </Button>
                <Button
                  color="inherit"
                  sx={{ justifyContent: 'flex-start', color: '#94a3b8', textTransform: 'none' }}
                  onClick={() => navigate('/chronic-disease-management')}
                >
                  Chronic Disease
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Contact Info
              </Typography>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <EmailIcon sx={{ fontSize: 20, color: '#94a3b8' }} />
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    info@healthbridge.namibia.org
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <PhoneIcon sx={{ fontSize: 20, color: '#94a3b8' }} />
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    +264 61 123 4567
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <LocationIcon sx={{ fontSize: 20, color: '#94a3b8' }} />
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    Windhoek, Namibia
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Helpful Links
              </Typography>
              <Stack spacing={1}>
                <Button
                  color="inherit"
                  sx={{ justifyContent: 'flex-start', color: '#94a3b8', textTransform: 'none' }}
                  onClick={() => navigate('/docs/user-guide')}
                >
                  Documentation
                </Button>
                <Button
                  color="inherit"
                  sx={{ justifyContent: 'flex-start', color: '#94a3b8', textTransform: 'none' }}
                  onClick={() => navigate('/docs/privacy-policy')}
                >
                  Privacy Policy
                </Button>
                <Button
                  color="inherit"
                  sx={{ justifyContent: 'flex-start', color: '#94a3b8', textTransform: 'none' }}
                  onClick={() => navigate('/docs/terms-of-service')}
                >
                  Terms of Service
                </Button>
              </Stack>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, borderColor: '#334155' }} />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              © {new Date().getFullYear()} HealthBridge Namibia. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
