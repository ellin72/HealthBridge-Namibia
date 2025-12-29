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
  Handshake as PartnershipIcon
} from '@mui/icons-material';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: 'Healthcare Appointments',
      description: 'Book and manage appointments with qualified healthcare providers',
      icon: <CalendarIcon sx={{ fontSize: 48 }} />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Wellness Hub',
      description: 'Access wellness content, nutrition tips, and fitness resources',
      icon: <FitnessIcon sx={{ fontSize: 48 }} />,
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Learning Zone',
      description: 'Educational resources and assignments for healthcare students',
      icon: <SchoolIcon sx={{ fontSize: 48 }} />,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      title: 'Consultation Notes',
      description: 'Secure access to your medical consultation records',
      icon: <HealthIcon sx={{ fontSize: 48 }} />,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    }
  ];

  const features = [
    'Secure and confidential patient data management',
    'Easy appointment scheduling and management',
    'Access to qualified healthcare professionals',
    'Wellness and health education resources',
    'Student learning and assignment management',
    'Real-time consultation notes and records'
  ];

  const documentation = [
    { title: 'User Guide', description: 'Learn how to use HealthBridge Namibia', link: '#' },
    { title: 'Privacy Policy', description: 'How we protect your data', link: '#' },
    { title: 'Terms of Service', description: 'Terms and conditions of use', link: '#' },
    { title: 'API Documentation', description: 'Technical documentation for developers', link: '#' }
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
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
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
          <Box sx={{ display: 'flex', gap: 2 }}>
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
          </Box>
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
                Bridging Healthcare
                <br />
                <Box component="span" sx={{ color: '#fbbf24' }}>
                  Across Namibia
                </Box>
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
                Connecting patients with healthcare providers, wellness coaches, and educational
                resources to improve health outcomes across Namibia.
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
                  Get Started
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
            About HealthBridge Namibia
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
            HealthBridge Namibia is a comprehensive healthcare platform designed to improve access
            to healthcare services, wellness resources, and educational opportunities across
            Namibia. We connect patients, healthcare providers, wellness coaches, and students in
            a unified digital ecosystem.
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
              Our Services
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#64748b',
                maxWidth: '700px',
                mx: 'auto',
              }}
            >
              Comprehensive healthcare solutions tailored to meet your needs
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    border: '1px solid #e2e8f0',
                    borderRadius: 3,
                    p: 3,
                    textAlign: 'center',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                    },
                  }}
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
            <Typography variant="h6" sx={{ color: '#64748b', maxWidth: '600px', mx: 'auto' }}>
              Access essential information, guides, and resources to help you get the most out of
              HealthBridge Namibia
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
                    component={Link}
                    to={doc.link}
                    sx={{
                      height: '100%',
                      border: 'none',
                      borderRadius: 3,
                      overflow: 'hidden',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease-in-out',
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                      position: 'relative',
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
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={4}>
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

