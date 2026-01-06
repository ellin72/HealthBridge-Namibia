import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  AppBar,
  Toolbar,
  Chip,
  IconButton,
  Collapse,
  Stack,
} from '@mui/material';
import {
  HealthAndSafety as HealthIcon,
  LocalHospital as HospitalIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon,
  AccessTime as AccessTimeIcon,
  Psychology as PsychologyIcon,
  MonitorWeight as WeightIcon,
  LocalPharmacy as PharmacyIcon,
  Favorite as HeartIcon,
  Spa as SpaIcon,
  MedicalServices as MedicalServicesIcon,
  ArrowForward as ArrowForwardIcon,
  Security as SecurityIcon,
  VideoCall as VideoCallIcon,
  Smartphone as SmartphoneIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  const services = [
    {
      title: '24/7 Care',
      description: 'Access healthcare professionals anytime, anywhere for common conditions.',
      icon: <AccessTimeIcon />,
      color: '#667eea',
    },
    {
      title: 'Mental Health',
      description: 'Licensed therapists providing talk therapy, diagnosis, and medication support.',
      icon: <PsychologyIcon />,
      color: '#f093fb',
    },
    {
      title: 'Weight Management',
      description: 'Personalized weight loss programs with nutrition guidance and fitness tracking.',
      icon: <WeightIcon />,
      color: '#4facfe',
    },
    {
      title: 'Diabetes Management',
      description: 'Track blood sugar, manage medications, and receive lifestyle coaching.',
      icon: <PharmacyIcon />,
      color: '#43e97b',
    },
    {
      title: 'Hypertension',
      description: 'Monitor and manage your blood pressure with digital tools and provider support.',
      icon: <HeartIcon />,
      color: '#fa709a',
    },
    {
      title: 'Specialty Care',
      description: 'Dermatology, expert medical opinions, and sleep health services.',
      icon: <SpaIcon />,
      color: '#30cfd0',
    },
    {
      title: 'Primary Care',
      description: 'Comprehensive primary care services for all your health needs.',
      icon: <MedicalServicesIcon />,
      color: '#a8edea',
    },
    {
      title: 'AI Symptom Checker',
      description: 'Get instant guidance on your health concerns with AI-powered triage.',
      icon: <HealthIcon />,
      color: '#ff9a9e',
    },
  ];

  const features = [
    { icon: <AccessTimeIcon />, text: '24/7 Access' },
    { icon: <VideoCallIcon />, text: 'Video Consultations' },
    { icon: <SecurityIcon />, text: 'Secure & Encrypted' },
    { icon: <SmartphoneIcon />, text: 'Mobile App' },
    { icon: <LanguageIcon />, text: 'Multilingual' },
    { icon: <HealthIcon />, text: 'AI-Powered' },
  ];

  const stats = [
    { value: '100K+', label: 'Active Members' },
    { value: '40K+', label: 'Healthcare Providers' },
    { value: '95%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'Care Availability' },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Mwangi',
      role: 'General Practitioner',
      content: 'HealthBridge has transformed how I manage my practice. The telehealth features are exceptional.',
      rating: 5,
    },
    {
      name: 'John Kambonde',
      role: 'Patient',
      content: 'As someone in a remote area, having access to quality healthcare through this platform has been life-changing.',
      rating: 5,
    },
    {
      name: 'Maria Shikongo',
      role: 'Medical Student',
      content: 'The research support tools and educational resources have been invaluable for my studies.',
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: 'How do I get started?',
      answer: 'Simply click "Get Started" to create your account. You can then book appointments, access services, and connect with healthcare providers immediately.',
    },
    {
      question: 'What services are available?',
      answer: 'We offer 24/7 care, mental health support, chronic disease management (diabetes, hypertension, weight), primary care, specialty services, and AI-powered symptom checking.',
    },
    {
      question: 'Is my information secure?',
      answer: 'Yes, absolutely. We use end-to-end encryption, comply with POPIA and HIPAA regulations, and follow industry best practices for data security.',
    },
    {
      question: 'Can I use my medical aid?',
      answer: 'Yes! We support NAMMED, Medical Aid Fund, and Prosana. More providers are being added regularly.',
    },
    {
      question: 'Do you have a mobile app?',
      answer: 'Yes! HealthBridge Namibia is available as a mobile app for both iOS and Android devices with offline capabilities.',
    },
    {
      question: 'How do video consultations work?',
      answer: 'Book a video consultation through our platform. You\'ll receive a link to join the video call at your appointment time. No additional software is required.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Navigation */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: 'white',
          color: '#1e293b',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <HealthIcon sx={{ fontSize: 32, color: '#667eea' }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1.25rem',
                  color: '#1e293b',
              }}
            >
                HealthBridge
            </Typography>
          </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
              <Link to="/docs/user-guide" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
                Docs
              </Link>
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
                sx={{ fontWeight: 500, color: '#64748b' }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 600,
                  px: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                },
              }}
            >
              Get Started
            </Button>
            </Box>
            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#1e293b' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Toolbar>
          <Collapse in={mobileMenuOpen}>
            <Box sx={{ pb: 2, display: { xs: 'block', md: 'none' } }}>
              <Stack spacing={1}>
                <Link to="/docs/user-guide" style={{ color: '#64748b', textDecoration: 'none', padding: '8px 16px', display: 'block' }}>
                  Documentation
                </Link>
                <Button fullWidth variant="outlined" onClick={() => navigate('/login')} sx={{ mt: 1 }}>
                  Sign In
            </Button>
                <Button fullWidth variant="contained" onClick={() => navigate('/register')} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  Get Started
                </Button>
              </Stack>
          </Box>
          </Collapse>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
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
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip
                label="Namibia's Leading Digital Healthcare Platform"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  mb: 3,
                  fontWeight: 500,
                }}
              />
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.75rem' },
                  mb: 3,
                  lineHeight: 1.2,
                }}
              >
                Healthcare that comes to you
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                }}
              >
                Connect with healthcare providers, manage chronic conditions, and access wellness resources—all in one place, anytime, anywhere.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    backgroundColor: 'white',
                    color: '#667eea',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                  }}
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
                >
                  Learn More
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    width: { xs: 250, md: 350 },
                    height: { xs: 250, md: 350 },
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <HospitalIcon sx={{ fontSize: { xs: 120, md: 180 }, color: 'white' }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, backgroundColor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
            <Typography
                    variant="h3"
              sx={{
                fontWeight: 700,
                      color: '#667eea',
                      mb: 1,
                      fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
                    {stat.value}
            </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                    {stat.label}
          </Typography>
        </Box>
          </Grid>
            ))}
        </Grid>
      </Container>
      </Box>

      {/* Services Section */}
      <Box id="services" sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                mb: 2,
                fontSize: { xs: '2rem', md: '2.75rem' },
              }}
            >
              Comprehensive Healthcare Services
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#64748b',
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.125rem' },
              }}
            >
              Everything you need for your health and wellness, all in one platform
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    border: '1px solid #f1f5f9',
                    borderRadius: 3,
                    p: 3,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                      borderColor: service.color,
                    },
                  }}
                  onClick={() => navigate('/register')}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      backgroundColor: `${service.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      color: service.color,
                    }}
                  >
                    {React.cloneElement(service.icon, { sx: { fontSize: 28 } })}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>
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

      {/* Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: '#1e293b',
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.75rem' },
            }}
          >
                Why Choose HealthBridge?
          </Typography>
            <Typography
                variant="body1"
              sx={{
                  color: '#64748b',
                  mb: 4,
                  lineHeight: 1.8,
                  fontSize: '1.125rem',
                }}
              >
                We're committed to making quality healthcare accessible to all Namibians through innovative technology and compassionate care.
            </Typography>
              <Grid container spacing={2}>
              {features.map((feature, index) => (
                  <Grid item xs={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          backgroundColor: '#667eea15',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#667eea',
                        }}
                      >
                        {React.cloneElement(feature.icon, { sx: { fontSize: 20 } })}
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
                        {feature.text}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
              <Box
              sx={{
                p: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}
            >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                Join Thousands of Users
              </Typography>
                <Typography variant="body1" sx={{ mb: 4, opacity: 0.95, lineHeight: 1.8 }}>
                  HealthBridge Namibia is trusted by healthcare providers, patients, and students across the country. Start your health journey today.
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
          </Box>
                </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: '#1e293b',
              mb: 2,
                fontSize: { xs: '2rem', md: '2.75rem' },
            }}
          >
            What Our Users Say
          </Typography>
            <Typography variant="h6" sx={{ color: '#64748b', maxWidth: '600px', mx: 'auto' }}>
              Real feedback from patients, providers, and students
          </Typography>
        </Box>

        <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                    border: '1px solid #f1f5f9',
                  borderRadius: 3,
                  p: 3,
                    transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
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
                      {testimonial.role}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                mb: 2,
                fontSize: { xs: '2rem', md: '2.75rem' },
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography variant="h6" sx={{ color: '#64748b', maxWidth: '600px', mx: 'auto' }}>
              Everything you need to know about HealthBridge Namibia
            </Typography>
          </Box>

          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            {faqs.map((faq, index) => (
              <Card
                key={index}
                sx={{
                  mb: 2,
                  border: '1px solid #f1f5f9',
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
                  <ExpandMoreIcon
                    sx={{
                      transform: expandedFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s',
                    }}
                  />
                </Box>
                <Collapse in={expandedFaq === index}>
                  <Box sx={{ p: 3, pt: 0, backgroundColor: 'white' }}>
                    <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.8 }}>
                      {faq.answer}
                    </Typography>
                  </Box>
                </Collapse>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', maxWidth: '700px', mx: 'auto' }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                fontSize: { xs: '2rem', md: '2.75rem' },
                }}
              >
              Ready to Get Started?
              </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.95, lineHeight: 1.8 }}>
              Join thousands of Namibians who are taking control of their health with HealthBridge.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  backgroundColor: 'white',
                  color: '#667eea',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Get Started Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  window.location.href = 'mailto:partnerships@healthbridge-namibia.com';
                }}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Partner With Us
              </Button>
            </Stack>
                  </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#1e293b', color: 'white', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <HealthIcon sx={{ fontSize: 32, color: '#667eea' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  HealthBridge Namibia
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
                Bridging healthcare across Namibia through innovative digital solutions.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton
                  component="a"
                  href="https://facebook.com"
                  target="_blank"
                  sx={{ color: '#94a3b8', '&:hover': { color: '#667eea' } }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://twitter.com"
                  target="_blank"
                  sx={{ color: '#94a3b8', '&:hover': { color: '#667eea' } }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://linkedin.com"
                  target="_blank"
                  sx={{ color: '#94a3b8', '&:hover': { color: '#667eea' } }}
                >
                  <LinkedInIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Home
                </Link>
                <Link to="/register" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Sign Up
                </Link>
                <Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Sign In
                </Link>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Documentation
              </Typography>
              <Stack spacing={1}>
                <Link to="/docs/user-guide" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>
                  User Guide
                </Link>
                <Link to="/docs/privacy-policy" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Privacy Policy
                </Link>
                <Link to="/docs/terms-of-service" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Terms of Service
                </Link>
                <Link to="/docs/api" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>
                  API Docs
                </Link>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Contact
              </Typography>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ fontSize: 20, color: '#94a3b8' }} />
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    info@healthbridge-namibia.com
              </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PhoneIcon sx={{ fontSize: 20, color: '#94a3b8' }} />
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    +264 XX XXX XXXX
              </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationIcon sx={{ fontSize: 20, color: '#94a3b8' }} />
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                Windhoek, Namibia
              </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: '1px solid #334155', mt: 4, pt: 4, textAlign: 'center' }}>
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
