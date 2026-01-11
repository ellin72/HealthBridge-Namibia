import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Stack,
  alpha,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Close as CloseIcon,
  Menu as MenuIcon,
  ArrowForward as ArrowForwardIcon,
  Info as InfoIcon,
  NavigateNext as NavigateNextIcon
} from '@mui/icons-material';

interface NavigationGuideProps {
  role?: string;
}

const NavigationGuide: React.FC<NavigationGuideProps> = ({ role }) => {
  const [dismissed, setDismissed] = useState(() => {
    // Check if user has dismissed this guide before
    return localStorage.getItem('navigation-guide-dismissed') === 'true';
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('navigation-guide-dismissed', 'true');
  };

  if (dismissed) return null;

  const getRoleSpecificInfo = () => {
    switch (role) {
      case 'PATIENT':
        return {
          title: 'Find Everything in the Sidebar',
          description: 'Access all your healthcare services from the left sidebar menu. You can find appointments, urgent care, wellness programs, and more.',
          features: [
            'Healthcare services (Appointments, Urgent Care, Telehealth)',
            'Wellness Hub & Tools',
            'Billing & Payments',
            'Learning resources'
          ]
        };
      case 'HEALTHCARE_PROVIDER':
        return {
          title: 'Navigate with the Sidebar Menu',
          description: 'All your clinical tools and features are organized in the left sidebar. Use it to manage appointments, access patient records, and track earnings.',
          features: [
            'Clinical tools (Appointments, Telehealth Pro)',
            'Patient management & history',
            'Billing & earnings dashboard',
            'System monitoring'
          ]
        };
      case 'WELLNESS_COACH':
        return {
          title: 'Your Wellness Hub',
          description: 'Access all wellness management tools from the sidebar menu. Create content, manage challenges, and track engagement.',
          features: [
            'Wellness content creation',
            'Challenge management',
            'Community engagement tools',
            'Analytics dashboard'
          ]
        };
      case 'STUDENT':
        return {
          title: 'Learning Resources at Your Fingertips',
          description: 'All your learning tools and research support are available in the sidebar menu. Access assignments, resources, and collaboration tools.',
          features: [
            'Learning Zone & resources',
            'Assignment submission',
            'Research support tools',
            'Supervisor connections'
          ]
        };
      case 'ADMIN':
        return {
          title: 'Administrative Dashboard',
          description: 'Manage the entire HealthBridge platform from the sidebar menu. Access user management, system monitoring, and administrative tools.',
          features: [
            'User management',
            'System monitoring',
            'Analytics & reports',
            'Platform configuration'
          ]
        };
      default:
        return {
          title: 'Explore HealthBridge',
          description: 'All features and services are organized in the sidebar menu. Click on any section to explore available options.',
          features: [
            'Healthcare services',
            'Wellness programs',
            'Learning resources',
            'Account settings'
          ]
        };
    }
  };

  const info = getRoleSpecificInfo();

  return (
    <Card
      sx={{
        mb: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
        },
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <InfoIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  fontSize: '1.125rem',
                }}
              >
                {info.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  fontSize: '0.875rem',
                }}
              >
                {info.description}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleDismiss}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 2,
            p: 2,
            mb: 2,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <MenuIcon sx={{ fontSize: 20 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
              {isMobile ? 'Tap the menu icon (☰) in the top bar' : 'Look for the sidebar menu on the left'}
            </Typography>
          </Box>
          <Stack spacing={1}>
            {info.features.map((feature, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NavigateNextIcon sx={{ fontSize: 16, opacity: 0.8 }} />
                <Typography variant="body2" sx={{ fontSize: '0.8125rem', opacity: 0.95 }}>
                  {feature}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
            💡 Tip: Sections with multiple options can be expanded by clicking on them
          </Typography>
          <Button
            onClick={handleDismiss}
            endIcon={<ArrowForwardIcon />}
            sx={{
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
            size="small"
          >
            Got it!
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NavigationGuide;
