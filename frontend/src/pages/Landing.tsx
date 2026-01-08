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
  AppBar,
  Toolbar,
  Chip,
  IconButton,
  Collapse,
  Stack,
  Avatar,
  Divider,
  Paper,
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
  VideoCall as VideoCallIcon,
  Security as SecurityIcon,
  School as SchoolIcon,
  FitnessCenter as FitnessIcon,
  Payment as PaymentIcon,
  VerifiedUser as VerifiedIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [expandedFaq, setExpandedFaq] = React.useState<number | null>(null);

  const coreFeatures = [
    {
      title: 'Telehealth',
      description: 'Book consultations and connect with healthcare providers via secure video calls.',
      icon: <VideoCallIcon sx={{ fontSize: 40 }} />,
      color: '#667eea',
    },
    {
      title: 'Wellness Hub',
      description: 'Access nutrition plans, fitness tracking, and stress management tools.',
      icon: <FitnessIcon sx={{ fontSize: 40 }} />,
      color: '#43e97b',
    },
    {
      title: 'Learning Zone',
      description: 'Educational resources, assignments, and research tools for students.',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      color: '#4facfe',
    },
    {
      title: 'Billing & Medical Aid',
      description: 'Secure payments and seamless integration with NAMMED, Medical Aid Fund, and Prosana.',
      icon: <PaymentIcon sx={{ fontSize: 40 }} />,
      color: '#fa709a',
    },
  ];

  const rolePathways = [
    {
      title: 'Patients',
      description: 'Access care and wellness tools',
      icon: <PersonIcon sx={{ fontSize: 32 }} />,
      color: '#667eea',
      cta: 'Sign Up as Patient',
    },
    {
      title: 'Providers',
      description: 'Manage appointments and consultations',
      icon: <HospitalIcon sx={{ fontSize: 32 }} />,
      color: '#43e97b',
      cta: 'Join as Provider',
    },
    {
      title: 'Wellness Coaches',
      description: 'Create and share wellness plans',
      icon: <FitnessIcon sx={{ fontSize: 32 }} />,
      color: '#4facfe',
      cta: 'Become a Coach',
    },
    {
      title: 'Students',
      description: 'Learn and research with digital resources',
      icon: <SchoolIcon sx={{ fontSize: 32 }} />,
      color: '#fa709a',
      cta: 'Access Learning',
    },
    {
      title: 'Admins',
      description: 'Monitor compliance and system health',
      icon: <BusinessIcon sx={{ fontSize: 32 }} />,
      color: '#30cfd0',
      cta: 'Admin Portal',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Mwangi',
      role: 'General Practitioner, Windhoek',
      content: 'HealthBridge has transformed how I manage my practice. The telehealth features allow me to reach patients in remote areas I never could before.',
      rating: 5,
      avatar: 'SM',
    },
    {
      name: 'John Kambonde',
      role: 'Patient, Otjiwarongo',
      content: 'As someone in a remote area, having access to quality healthcare through this platform has been life-changing. I can now manage my diabetes without traveling hours to the city.',
      rating: 5,
      avatar: 'JK',
    },
    {
      name: 'Maria Shikongo',
      role: 'Medical Student, UNAM',
      content: 'The research support tools and educational resources have been invaluable for my studies. It\'s like having a digital library and mentor in one.',
      rating: 5,
      avatar: 'MS',
    },
  ];

  const faqs = [
    {
      question: 'How do I get started?',
      answer: 'Simply click "Sign Up as Patient" or "Join as Provider" to create your account. You can then book appointments, access services, and connect with healthcare providers immediately.',
    },
    {
      question: 'Is my information secure?',
      answer: 'Yes, absolutely. We use end-to-end encryption, comply with POPIA and HIPAA regulations, and follow industry best practices for data security. Your health data is protected and private.',
    },
    {
      question: 'Can I use my medical aid?',
      answer: 'Yes! We support NAMMED, Medical Aid Fund, and Prosana. More providers are being added regularly. Check with your medical aid provider for coverage details.',
    },
    {
      question: 'Do you have a mobile app?',
      answer: 'Yes! HealthBridge Namibia is available as a mobile app for both iOS and Android devices with offline capabilities, so you can access your health information even without internet.',
    },
    {
      question: 'How do video consultations work?',
      answer: 'Book a video consultation through our platform. You\'ll receive a link to join the video call at your appointment time. No additional software is required—just click and connect.',
    },
    {
      question: 'What if I need urgent care?',
      answer: 'Our urgent care feature allows you to submit requests with your symptoms and urgency level. Providers will respond based on priority, and you can be connected to emergency services if needed.',
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
                HealthBridge Namibia
              </Typography>
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
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
                <Button fullWidth variant="outlined" onClick={() => navigate('/login')} sx={{ mt: 1 }}>
                  Sign In
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate('/register')}
                  sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
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
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
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
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  mb: 3,
                  lineHeight: 1.1,
                }}
              >
                Healthcare, Wellness, and Learning — Connected for Namibia
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
                Book appointments, access wellness tools, and empower students — all in one trusted hub.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register?role=patient')}
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
                  Sign Up as Patient
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
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/register?role=institution')}
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
                  Request Demo (Institutions)
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Trust & Impact Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: '#1e293b',
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                Trusted by Thousands Across Namibia
              </Typography>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea', mb: 0.5 }}>
                    1,000+
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Active Patients
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea', mb: 0.5 }}>
                    50+
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Healthcare Providers
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea', mb: 0.5 }}>
                    95%
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Satisfaction Rate
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea', mb: 0.5 }}>
                    24/7
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Care Availability
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <Chip
                  icon={<VerifiedIcon />}
                  label="POPIA Compliant"
                  sx={{ backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: 600 }}
                />
                <Chip
                  icon={<VerifiedIcon />}
                  label="HIPAA Certified"
                  sx={{ backgroundColor: '#dcfce7', color: '#166534', fontWeight: 600 }}
                />
                <Chip
                  icon={<VerifiedIcon />}
                  label="Ministry of Health Partner"
                  sx={{ backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 600 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {testimonials.map((testimonial, index) => (
                  <Card key={index} elevation={2} sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: '#667eea', width: 48, height: 48 }}>
                          {testimonial.avatar}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                            {testimonial.role}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <StarIcon key={i} sx={{ fontSize: 16, color: '#fbbf24' }} />
                            ))}
                          </Box>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.7 }}>
                        "{testimonial.content}"
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Core Features Section */}
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
              Everything You Need in One Platform
            </Typography>
            <Typography variant="h6" sx={{ color: '#64748b', maxWidth: '600px', mx: 'auto' }}>
              Comprehensive healthcare services designed for Namibia's unique needs
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {coreFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    border: '1px solid #f1f5f9',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                      borderColor: feature.color,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: `${feature.color}15`,
                        color: feature.color,
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Role-Specific Pathways */}
      <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: '#f8f9fa' }}>
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
              Choose Your Path
            </Typography>
            <Typography variant="h6" sx={{ color: '#64748b', maxWidth: '600px', mx: 'auto' }}>
              Tailored experiences for every role in the healthcare ecosystem
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {rolePathways.map((role, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    border: '1px solid #f1f5f9',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      borderColor: role.color,
                    },
                  }}
                  onClick={() => navigate(`/register?role=${role.title.toLowerCase()}`)}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: `${role.color}15`,
                        color: role.color,
                        mb: 2,
                      }}
                    >
                      {role.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#1e293b' }}>
                      {role.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2, minHeight: '40px' }}>
                      {role.description}
                    </Typography>
                    <Button
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        color: role.color,
                        fontWeight: 600,
                        textTransform: 'none',
                      }}
                    >
                      {role.cta}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Security & Compliance Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  mb: 3,
                }}
              >
                <SecurityIcon sx={{ fontSize: 40 }} />
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: '#1e293b',
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                Your Data is Encrypted and Protected
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', mb: 3, lineHeight: 1.7 }}>
                We take your privacy seriously. HealthBridge Namibia complies with POPIA (Protection of Personal Information Act) and HIPAA regulations, ensuring your health information is secure and confidential.
              </Typography>
              <Stack spacing={2}>
                {[
                  'End-to-end encryption for all data',
                  'Regular security audits and compliance checks',
                  'Secure payment processing',
                  'HIPAA and POPIA compliant infrastructure',
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircleIcon sx={{ color: '#10b981', fontSize: 24 }} />
                    <Typography variant="body1" sx={{ color: '#475569' }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 3,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 3,
                    minWidth: '150px',
                    backgroundColor: '#f8f9fa',
                  }}
                >
                  <VerifiedIcon sx={{ fontSize: 48, color: '#10b981', mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    POPIA Compliant
                  </Typography>
                </Paper>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 3,
                    minWidth: '150px',
                    backgroundColor: '#f8f9fa',
                  }}
                >
                  <VerifiedIcon sx={{ fontSize: 48, color: '#10b981', mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    HIPAA Certified
                  </Typography>
                </Paper>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 3,
                    minWidth: '150px',
                    backgroundColor: '#f8f9fa',
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 48, color: '#667eea', mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    SSL Encrypted
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: '#1e293b',
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography variant="h6" sx={{ color: '#64748b' }}>
              Everything you need to know about HealthBridge Namibia
            </Typography>
          </Box>
          <Stack spacing={2}>
            {faqs.map((faq, index) => (
              <Card key={index} elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: 2 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', pr: 2 }}>
                      {faq.question}
                    </Typography>
                    <IconButton size="small">
                      <ExpandMoreIcon
                        sx={{
                          transform: expandedFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.3s',
                        }}
                      />
                    </IconButton>
                  </Box>
                  <Collapse in={expandedFaq === index}>
                    <Typography
                      variant="body1"
                      sx={{ color: '#64748b', mt: 2, lineHeight: 1.7 }}
                    >
                      {faq.answer}
                    </Typography>
                  </Collapse>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Conversion Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
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
              Join HealthBridge Namibia Today
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 5,
                opacity: 0.95,
                fontWeight: 400,
                fontSize: { xs: '1.1rem', md: '1.35rem' },
              }}
            >
              Empowering healthcare for all — patients, providers, and institutions working together
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
                  px: 5,
                  py: 1.5,
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: '#f8f9fa',
                  },
                }}
                endIcon={<ArrowForwardIcon />}
              >
                Sign Up Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/register?role=institution')}
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
                Partner With Us
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
                <HealthIcon sx={{ fontSize: 32, color: '#667eea' }} />
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
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Link to="/docs/user-guide" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Documentation
                </Link>
                <Link to="/about" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  About Us
                </Link>
                <Link to="/contact" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Contact
                </Link>
                <Link to="/privacy" style={{ color: '#94a3b8', textDecoration: 'none' }}>
                  Privacy Policy
                </Link>
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
                Newsletter
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>
                Stay updated with the latest healthcare news and platform updates.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Box
                  component="input"
                  placeholder="Your email"
                  sx={{
                    flex: 1,
                    p: 1.5,
                    border: '1px solid #334155',
                    borderRadius: 1,
                    backgroundColor: '#0f172a',
                    color: 'white',
                    fontSize: '0.875rem',
                    '&::placeholder': { color: '#64748b' },
                    '&:focus': { outline: 'none', borderColor: '#667eea' },
                  }}
                />
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#667eea',
                    '&:hover': { backgroundColor: '#5568d3' },
                  }}
                >
                  Subscribe
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
