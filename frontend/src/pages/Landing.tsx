import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Avatar
} from '@mui/material';
import {
  HealthAndSafety as HealthIcon,
  CalendarToday as CalendarIcon,
  FitnessCenter as FitnessIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  LocalHospital as HospitalIcon,
  CheckCircle as CheckIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Description as DocIcon,
  Handshake as PartnershipIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AccessTime as AccessTimeIcon,
  Psychology as PsychologyIcon,
  MonitorWeight as WeightIcon,
  LocalPharmacy as PharmacyIcon,
  Favorite as HeartIcon,
  Spa as SpaIcon,
  MedicalServices as MedicalServicesIcon,
  Bloodtype as BloodIcon,
  Bedtime as SleepIcon,
  Face as FaceIcon
} from '@mui/icons-material';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  const services = [
    {
      title: '24/7 Care',
      description: 'Skip the trip and get same-day care for common conditions. Access healthcare anytime, anywhere.',
      icon: <AccessTimeIcon sx={{ fontSize: 48 }} />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      category: 'Primary Services'
    },
    {
      title: 'Mental Health',
      description: 'Find therapy that works best for you. Comprehensive care including talk therapy, diagnosis and medication support.',
      icon: <PsychologyIcon sx={{ fontSize: 48 }} />,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      category: 'Primary Services'
    },
    {
      title: 'Weight Management',
      description: 'Weight loss and healthy living tailored to you. Personalized plans with nutrition guidance and fitness tracking.',
      icon: <WeightIcon sx={{ fontSize: 48 }} />,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      category: 'Chronic Care'
    },
    {
      title: 'Diabetes Management',
      description: 'A personalized way to manage and prevent diabetes. Track blood sugar, get medication support, and lifestyle coaching.',
      icon: <PharmacyIcon sx={{ fontSize: 48 }} />,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      category: 'Chronic Care'
    },
    {
      title: 'Hypertension Management',
      description: 'Lowering your blood pressure just got easier. Monitor, manage, and improve your cardiovascular health.',
      icon: <HeartIcon sx={{ fontSize: 48 }} />,
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      category: 'Chronic Care'
    },
    {
      title: 'Specialty & Wellness',
      description: 'Skin issues? Meal planning? Or need a second opinion? We\'ve got you covered with dermatology, expert medical opinions, and sleep support.',
      icon: <SpaIcon sx={{ fontSize: 48 }} />,
      color: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      category: 'Specialty Services'
    },
    {
      title: 'Primary Care',
      description: 'Looking for convenient, high-quality primary care? Welcome. Comprehensive primary care services for all your health needs.',
      icon: <MedicalServicesIcon sx={{ fontSize: 48 }} />,
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      category: 'Primary Services'
    },
    {
      title: 'AI Symptom Checker',
      description: 'AI-powered triage system to assess symptoms and urgency levels. Get instant guidance on your health concerns.',
      icon: <HealthIcon sx={{ fontSize: 48 }} />,
      color: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      category: 'Digital Tools'
    }
  ];

  const features = [
    '24/7 access to healthcare services - get care anytime, anywhere',
    'Mental health support with licensed therapists and medication management',
    'Chronic care management for diabetes, hypertension, and weight management',
    'Primary care services with same-day appointments',
    'Specialty care including dermatology and expert medical opinions',
    'AI-powered symptom checker for intelligent triage and guidance',
    'Secure and confidential patient data management with encryption',
    'Video consultations with high-quality telehealth technology',
    'Personalized wellness plans with habit tracking and challenges',
    'Multilingual support (English, Afrikaans, Oshiwambo)',
    'Namibian medical aid integration (NAMMED, Medical Aid Fund, Prosana)',
    'Offline-first capabilities with automatic sync',
    'Payment gateway integration (PayToday, SnapScan)'
  ];

  const documentation = [
    { 
      title: 'User Guide', 
      description: 'Complete guide covering all features: Telehealth, Wellness Tools, Symptom Checker, Research Support, and more', 
      link: '/docs/user-guide' 
    },
    { 
      title: 'Privacy Policy', 
      description: 'How we protect your data with encryption, POPIA/HIPAA compliance, and secure medical records', 
      link: '/docs/privacy-policy' 
    },
    { 
      title: 'Terms of Service', 
      description: 'Terms and conditions for using HealthBridge Namibia platform and services', 
      link: '/docs/terms-of-service' 
    },
    { 
      title: 'API Documentation', 
      description: 'Complete API reference for developers: endpoints, authentication, and integration guides', 
      link: '/docs/api' 
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Header/Navigation */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'white',
          color: '#1e293b',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1, position: 'relative' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              component="img"
              src="/healthbridge-logo.png"
              alt="HealthBridge Logo"
              onError={(e: any) => {
                e.target.style.display = 'none';
              }}
              sx={{
                height: 40,
                width: 'auto',
                objectFit: 'contain',
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1.25rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              HealthBridge Namibia
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            {/* Document Links - Inline with Sign In */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
              <Link
                to="/docs/user-guide"
                style={{
                  color: '#64748b',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#667eea';
                  e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#64748b';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Docs
              </Link>
              <Link
                to="/docs/privacy-policy"
                style={{
                  color: '#64748b',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#667eea';
                  e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#64748b';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Privacy
              </Link>
              <Link
                to="/docs/terms-of-service"
                style={{
                  color: '#64748b',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#667eea';
                  e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#64748b';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Terms
              </Link>
            </Box>
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              sx={{
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                },
              }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                },
              }}
            >
              Get Started
            </Button>
            <Button
              color="inherit"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              sx={{ display: { xs: 'flex', md: 'none' }, minWidth: 'auto' }}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </Button>
          </Box>
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <Box
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: 'white',
                borderTop: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                display: { xs: 'block', md: 'none' },
                p: 2,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link
                  to="/docs/user-guide"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    color: '#64748b',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    display: 'block',
                  }}
                >
                  User Guide
                </Link>
                <Link
                  to="/docs/privacy-policy"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    color: '#64748b',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    display: 'block',
                  }}
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/docs/terms-of-service"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    color: '#64748b',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    display: 'block',
                  }}
                >
                  Terms of Service
                </Link>
                <Link
                  to="/docs/api"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    color: '#64748b',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    display: 'block',
                  }}
                >
                  API Docs
                </Link>
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.1,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  mb: 3,
                  lineHeight: 1.2,
                }}
              >
                Transforming how better health happens
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                For your physical health. For your mental health. For clinicians. For hospitals. For all of it in one place. For life.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
                    fontSize: '1.0625rem',
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  Get Care Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    const element = document.getElementById('partnership');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.0625rem',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Request Partnership
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Avatar
                  sx={{
                    width: { xs: 200, md: 300 },
                    height: { xs: 200, md: 300 },
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <HospitalIcon sx={{ fontSize: { xs: 100, md: 150 }, color: 'white' }} />
                </Avatar>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* About Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                mb: 2,
              }}
            >
              A high-quality care experience—anywhere, anytime
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#64748b',
                maxWidth: '800px',
                mx: 'auto',
                lineHeight: 1.8,
              }}
            >
            It started with a simple yet revolutionary idea. That everyone should have access to the best healthcare anywhere in the world on their terms. That includes you. HealthBridge Namibia is a comprehensive digital healthcare platform designed to improve access
            to healthcare services, wellness resources, and educational opportunities across Namibia. 
            We offer 24/7 care, mental health support, chronic disease management, primary care, specialty services, 
            AI-powered symptom checking, video consultations, interactive wellness tools, medical aid integration, 
            multilingual support, and offline capabilities. We connect patients, healthcare providers, and wellness 
            professionals in a unified digital ecosystem.
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                textAlign: 'center',
                p: 3,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <PeopleIcon sx={{ fontSize: 64, color: '#667eea', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Our Mission
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.8 }}>
                To bridge the gap between healthcare services and communities, making quality
                healthcare accessible to all Namibians.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                textAlign: 'center',
                p: 3,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <HealthIcon sx={{ fontSize: 64, color: '#10b981', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Our Vision
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.8 }}>
                To become Namibia's leading digital healthcare platform, empowering communities
                through technology and innovation.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                textAlign: 'center',
                p: 3,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <CheckIcon sx={{ fontSize: 64, color: '#f59e0b', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Our Values
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.8 }}>
                Integrity, accessibility, innovation, and patient-centered care guide everything we
                do.
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Services Section */}
      <Box sx={{ backgroundColor: '#f8fafc', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                mb: 2,
              }}
            >
              Ways We Help
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#64748b',
                maxWidth: '700px',
                mx: 'auto',
              }}
            >
              Comprehensive healthcare solutions tailored to meet your needs - anytime, anywhere
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    border: '1px solid #e2e8f0',
                    borderRadius: 3,
                    p: 3,
                    textAlign: 'center',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                  onClick={() => navigate('/register')}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: service.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      color: 'white',
                    }}
                  >
                    {service.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                    {service.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Service Categories Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: '#1e293b',
              mb: 2,
            }}
          >
            Services
          </Typography>
        </Box>

        {/* 24/7 Care */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <AccessTimeIcon sx={{ fontSize: 40, color: '#667eea' }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b' }}>
              24/7 Care
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: '#64748b', mb: 3 }}>
            Skip the trip and get same-day care for common conditions.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Overview
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Access healthcare professionals 24/7 for common conditions. Get same-day care without leaving your home.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Get Care Now
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Book an appointment instantly or connect with a provider immediately for urgent care needs.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Mental Health */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <PsychologyIcon sx={{ fontSize: 40, color: '#f093fb' }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Mental Health
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: '#64748b', mb: 3 }}>
            Find therapy that works best for you. Comprehensive care including talk therapy, diagnosis and medication support.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Teladoc Health Mental Health
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Licensed therapists providing talk therapy, diagnosis, and medication management for mental health conditions.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  BetterHelp
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Find your perfect match in our network of therapists. Personalized therapy sessions tailored to your needs.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Weight Management */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <WeightIcon sx={{ fontSize: 40, color: '#4facfe' }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Weight Management
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: '#64748b', mb: 3 }}>
            Weight loss and healthy living tailored to you.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Overview
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Personalized weight management programs with nutrition guidance and fitness tracking.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Diabetes Prevention
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Prevent type 2 diabetes through lifestyle changes and weight management.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Nutrition
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Meal planning, nutrition counseling, and dietary guidance from certified nutritionists.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Diabetes Management */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <PharmacyIcon sx={{ fontSize: 40, color: '#43e97b' }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Diabetes Management
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: '#64748b', mb: 3 }}>
            A personalized way to manage and prevent diabetes.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Overview
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Comprehensive diabetes management with blood sugar tracking, medication support, and lifestyle coaching.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Diabetes Prevention
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Prevent or delay type 2 diabetes through evidence-based lifestyle interventions.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Continuous Monitoring
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Track blood glucose levels, medications, and lifestyle factors with digital tools.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Hypertension Management */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <HeartIcon sx={{ fontSize: 40, color: '#fa709a' }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Hypertension Management
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: '#64748b', mb: 3 }}>
            Lowering your blood pressure just got easier.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Overview
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Monitor, manage, and improve your cardiovascular health with personalized hypertension management programs.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Blood Pressure Tracking
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Regular monitoring with digital tools and medication management support from healthcare providers.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Specialty & Wellness */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <SpaIcon sx={{ fontSize: 40, color: '#30cfd0' }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Specialty & Wellness
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: '#64748b', mb: 3 }}>
            Skin issues? Meal planning? Or need a second opinion? We've got you covered.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Overview
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Comprehensive specialty care and wellness services for all your health needs.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Dermatology
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Virtual dermatology consultations for skin conditions, rashes, and skin health concerns.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Expert Medical Opinion
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Get second opinions from medical specialists for complex conditions and treatment plans.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  BetterSleep
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Improve your sleep quality with personalized sleep coaching and tracking tools. Try for $0.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Primary Care */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <MedicalServicesIcon sx={{ fontSize: 40, color: '#a8edea' }} />
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#1e293b' }}>
              Primary Care
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ color: '#64748b', mb: 3 }}>
            Looking for convenient, high-quality primary care? Welcome.
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Overview
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Comprehensive primary care services including preventive care, chronic disease management, and routine health checkups.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Continuous Care
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Build a relationship with your primary care provider for ongoing health management and coordination.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                mb: 3,
              }}
            >
              Why Choose HealthBridge Namibia?
            </Typography>
            <List>
              {features.map((feature, index) => (
                <ListItem key={index} sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckIcon sx={{ color: '#10b981', fontSize: 28 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={feature}
                    primaryTypographyProps={{
                      variant: 'h6',
                      sx: { fontWeight: 500, color: '#1e293b' },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
                Join Thousands of Users
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
                HealthBridge Namibia is trusted by healthcare providers, patients, and students
                across the country. Join our growing community today.
              </Typography>
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
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                  },
                }}
              >
                Create Your Account
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Documentation Section */}
      <Box sx={{ backgroundColor: '#f8fafc', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                mb: 2,
              }}
            >
              Important Documentation
            </Typography>
            <Typography variant="h6" sx={{ color: '#64748b', maxWidth: '700px', mx: 'auto' }}>
              Access comprehensive documentation covering all features including Telehealth Pro, Wellness Tools, 
              Symptom Checker, Research Support, Medical Aid integration, and more. Everything you need to 
              maximize your HealthBridge Namibia experience.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {documentation.map((doc, index) => {
              const gradients = [
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              ];
              const gradient = gradients[index % gradients.length];

              return (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    onClick={() => navigate(doc.link)}
                    sx={{
                      height: '100%',
                      border: 'none',
                      borderRadius: 3,
                      overflow: 'hidden',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease-in-out',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                      position: 'relative',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        '& .doc-icon-container': {
                          transform: 'scale(1.1) rotate(5deg)',
                        },
                        '& .doc-arrow': {
                          transform: 'translateX(4px)',
                        },
                      },
                    }}
                  >
                    {/* Gradient Header */}
                    <Box
                      sx={{
                        background: gradient,
                        p: 3,
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
                      <Box
                        className="doc-icon-container"
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.3s ease-in-out',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        <DocIcon sx={{ fontSize: 32, color: 'white' }} />
                      </Box>
                    </Box>

                    {/* Content */}
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: '#1e293b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        {doc.title}
                        <Box
                          className="doc-arrow"
                          component="span"
                          sx={{
                            fontSize: 20,
                            transition: 'transform 0.3s ease-in-out',
                            color: '#667eea',
                          }}
                        >
                          →
                        </Box>
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748b',
                          lineHeight: 1.6,
                          minHeight: '40px',
                        }}
                      >
                        {doc.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Additional Info */}
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ color: '#64748b', mb: 2 }}>
              Need help or have questions?
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                window.location.href = 'mailto:support@healthbridge-namibia.com';
              }}
              sx={{
                borderColor: '#667eea',
                color: '#667eea',
                fontWeight: 600,
                px: 4,
                '&:hover': {
                  borderColor: '#5568d3',
                  backgroundColor: 'rgba(102, 126, 234, 0.08)',
                },
              }}
            >
              Contact Support
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ backgroundColor: '#f8fafc', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#667eea',
                    mb: 1,
                    fontSize: { xs: '2rem', md: '3rem' },
                  }}
                >
                  #1
                </Typography>
                <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Most recognized virtual care brand in Namibia
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#667eea',
                    mb: 1,
                    fontSize: { xs: '2rem', md: '3rem' },
                  }}
                >
                  88%
                </Typography>
                <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Maintain or improve their blood pressure
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#667eea',
                    mb: 1,
                    fontSize: { xs: '2rem', md: '3rem' },
                  }}
                >
                  20+
                </Typography>
                <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Years of virtual care expertise
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#667eea',
                    mb: 1,
                    fontSize: { xs: '2rem', md: '3rem' },
                  }}
                >
                  100K+
                </Typography>
                <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Members in Namibia
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#667eea',
                    mb: 1,
                    fontSize: { xs: '2rem', md: '3rem' },
                  }}
                >
                  40k+
                </Typography>
                <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Providers, therapists & coaches
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#667eea',
                    mb: 1,
                    fontSize: { xs: '2rem', md: '3rem' },
                  }}
                >
                  76%
                </Typography>
                <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Feel better after third therapy visit
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#667eea',
                    mb: 1,
                    fontSize: { xs: '2rem', md: '3rem' },
                  }}
                >
                  600+
                </Typography>
                <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Partner hospitals & clinics
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: '#667eea',
                    mb: 1,
                    fontSize: { xs: '2rem', md: '3rem' },
                  }}
                >
                  95%
                </Typography>
                <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 500 }}>
                  Patient satisfaction rate
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: '#1e293b',
              mb: 2,
            }}
          >
            What Our Users Say
          </Typography>
          <Typography variant="h6" sx={{ color: '#64748b', maxWidth: '700px', mx: 'auto' }}>
            Real feedback from patients, healthcare providers, and students using HealthBridge Namibia
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            {
              name: 'Dr. Sarah Mwangi',
              role: 'General Practitioner',
              location: 'Windhoek',
              content:
                'HealthBridge has transformed how I manage my practice. The telehealth features and patient management tools are exceptional.',
              rating: 5,
            },
            {
              name: 'John Kambonde',
              role: 'Patient',
              location: 'Oshakati',
              content:
                'As someone living in a remote area, having access to quality healthcare through this platform has been life-changing.',
              rating: 5,
            },
            {
              name: 'Maria Shikongo',
              role: 'Medical Student',
              location: 'Windhoek',
              content:
                'The research support tools and educational resources have been invaluable for my studies. Highly recommended!',
              rating: 5,
            },
          ].map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  border: '1px solid #e2e8f0',
                  borderRadius: 3,
                  p: 3,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: '#fbbf24', fontSize: 20 }} />
                  ))}
                </Box>
                <Typography variant="body1" sx={{ color: '#64748b', mb: 3, fontStyle: 'italic', lineHeight: 1.8 }}>
                  "{testimonial.content}"
                </Typography>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {testimonial.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    {testimonial.role} • {testimonial.location}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FAQ Section */}
      <Box sx={{ backgroundColor: '#f8fafc', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                mb: 2,
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography variant="h6" sx={{ color: '#64748b', maxWidth: '700px', mx: 'auto' }}>
              Find answers to common questions about HealthBridge Namibia
            </Typography>
          </Box>

          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            {[
              {
                question: 'How do I get care?',
                answer:
                  'Click "Get Care Now" to access 24/7 healthcare services. You can book same-day appointments, connect with providers immediately, or use our AI symptom checker to assess your needs.',
              },
              {
                question: 'What mental health services do you offer?',
                answer:
                  'We offer comprehensive mental health care including talk therapy with licensed therapists, diagnosis, medication support, and access to our network of mental health professionals. You can find the therapist that works best for you.',
              },
              {
                question: 'Can you help with chronic conditions like diabetes and hypertension?',
                answer:
                  'Yes! We offer specialized management programs for diabetes and hypertension. Our services include blood sugar and blood pressure tracking, medication management, lifestyle coaching, and personalized care plans to help you maintain or improve your health.',
              },
              {
                question: 'Do you offer weight management programs?',
                answer:
                  'Yes, we provide personalized weight management programs tailored to you. This includes nutrition guidance, meal planning, fitness tracking, and lifestyle coaching. We also offer diabetes prevention programs.',
              },
              {
                question: 'What specialty services are available?',
                answer:
                  'We offer dermatology consultations, expert medical opinions for second opinions, and BetterSleep programs. Our specialty services cover a wide range of health needs beyond primary care.',
              },
              {
                question: 'How do I access primary care?',
                answer:
                  'Our primary care services provide convenient, high-quality care for all your health needs. You can build a relationship with a primary care provider for ongoing health management, preventive care, and routine checkups.',
              },
              {
                question: 'Is my medical information secure?',
                answer:
                  'Yes, absolutely. We use end-to-end encryption, comply with POPIA and HIPAA regulations, and follow industry best practices for data security. Your privacy is our top priority.',
              },
              {
                question: 'Can I use HealthBridge without internet?',
                answer:
                  'Yes! HealthBridge has offline-first capabilities. You can access many features offline, and your data will automatically sync when you reconnect to the internet.',
              },
              {
                question: 'Which medical aids are supported?',
                answer:
                  'We currently support NAMMED, Medical Aid Fund, and Prosana. We\'re continuously working to add more medical aid providers.',
              },
              {
                question: 'How do video consultations work?',
                answer:
                  'You can book a video consultation through our 24/7 Care or Primary Care services. Once scheduled, you\'ll receive a link to join the video call at the appointment time. No additional software is required.',
              },
              {
                question: 'Is there a mobile app?',
                answer:
                  'Yes! HealthBridge Namibia is available as a mobile app for both iOS and Android devices. You can download it from the App Store or Google Play Store.',
              },
            ].map((faq, index) => (
              <Card
                key={index}
                sx={{
                  mb: 2,
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <Box
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  sx={{
                    p: 3,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                    },
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {faq.question}
                  </Typography>
                  {expandedFaq === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
                {expandedFaq === index && (
                  <Box sx={{ p: 3, pt: 0, backgroundColor: 'white' }}>
                    <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.8 }}>
                      {faq.answer}
                    </Typography>
                  </Box>
                )}
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Partnership Section */}
      <Box id="partnership" sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <PartnershipIcon sx={{ fontSize: 80, color: '#667eea', mb: 3 }} />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  color: '#1e293b',
                  mb: 3,
                }}
              >
                Partner With Us
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#64748b',
                  mb: 4,
                  lineHeight: 1.8,
                }}
              >
                Are you a healthcare provider, wellness coach, or organization looking to expand
                your reach? Partner with HealthBridge Namibia to connect with more patients and
                grow your practice.
              </Typography>
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CheckIcon sx={{ color: '#10b981' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Expand your patient base"
                    primaryTypographyProps={{ variant: 'h6', sx: { fontWeight: 500 } }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CheckIcon sx={{ color: '#10b981' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Access to digital tools and resources"
                    primaryTypographyProps={{ variant: 'h6', sx: { fontWeight: 500 } }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CheckIcon sx={{ color: '#10b981' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Support and training for your team"
                    primaryTypographyProps={{ variant: 'h6', sx: { fontWeight: 500 } }}
                  />
                </ListItem>
              </List>
              <Button
                variant="contained"
                size="large"
                startIcon={<EmailIcon />}
                onClick={() => {
                  window.location.href = 'mailto:partnerships@healthbridge-namibia.com';
                }}
                sx={{
                  mt: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  },
                }}
              >
                Request Partnership
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 4,
                  border: '1px solid #e2e8f0',
                  borderRadius: 3,
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                  Contact Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <EmailIcon sx={{ color: '#667eea' }} />
                    <Typography variant="body1">
                      partnerships@healthbridge-namibia.com
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PhoneIcon sx={{ color: '#667eea' }} />
                    <Typography variant="body1">+264 XX XXX XXXX</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <LocationIcon sx={{ color: '#667eea' }} />
                    <Typography variant="body1">Windhoek, Namibia</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: '#1e293b',
          color: 'white',
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  component="img"
                  src="/healthbridge-logo.png"
                  alt="HealthBridge Logo"
                  onError={(e: any) => {
                    e.target.style.display = 'none';
                  }}
                  sx={{
                    height: 40,
                    width: 'auto',
                    objectFit: 'contain',
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  HealthBridge Namibia
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                Bridging healthcare across Namibia through innovative digital solutions.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Home
                </Link>
                <Link to="/register" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Sign Up
                </Link>
                <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Sign In
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
                Documentation
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Link
                  to="/docs/user-guide"
                  style={{
                    color: '#94a3b8',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s',
                    display: 'block',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  User Guide
                </Link>
                <Link
                  to="/docs/privacy-policy"
                  style={{
                    color: '#94a3b8',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s',
                    display: 'block',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/docs/terms-of-service"
                  style={{
                    color: '#94a3b8',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s',
                    display: 'block',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  Terms of Service
                </Link>
                <Link
                  to="/docs/api"
                  style={{
                    color: '#94a3b8',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s',
                    display: 'block',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  API Documentation
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Contact
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                Email: info@healthbridge-namibia.com
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                Phone: +264 XX XXX XXXX
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Windhoek, Namibia
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: '1px solid #334155', mt: 4, pt: 4 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  © {new Date().getFullYear()} HealthBridge Namibia. All rights reserved.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                  <Box
                    component="a"
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#94a3b8',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      border: '1px solid #334155',
                      '&:hover': {
                        color: '#667eea',
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      },
                    }}
                  >
                    <FacebookIcon sx={{ fontSize: 20 }} />
                  </Box>
                  <Box
                    component="a"
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#94a3b8',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      border: '1px solid #334155',
                      '&:hover': {
                        color: '#667eea',
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      },
                    }}
                  >
                    <TwitterIcon sx={{ fontSize: 20 }} />
                  </Box>
                  <Box
                    component="a"
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: '#94a3b8',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      border: '1px solid #334155',
                      '&:hover': {
                        color: '#667eea',
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      },
                    }}
                  >
                    <LinkedInIcon sx={{ fontSize: 20 }} />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;

