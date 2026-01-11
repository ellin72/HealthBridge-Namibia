import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Badge,
  alpha,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Home as HomeIcon,
  CalendarToday as AppointmentsIcon,
  FitnessCenter as WellnessIcon,
  School as LearningIcon,
  Receipt as BillingIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const GlobalNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!user) return null;

  const navItems = [
    { label: 'Home', icon: <HomeIcon />, path: '/dashboard' },
    { label: 'Appointments', icon: <AppointmentsIcon />, path: '/appointments' },
    { label: 'Wellness', icon: <WellnessIcon />, path: '/wellness' },
    { label: 'Learning', icon: <LearningIcon />, path: '/learning' },
    { label: 'Billing', icon: <BillingIcon />, path: '/billing' },
  ];

  // Filter nav items based on role
  const getVisibleNavItems = () => {
    if (user.role === 'STUDENT') {
      return navItems.filter(item => 
        ['Home', 'Learning', 'Billing'].includes(item.label)
      );
    }
    if (user.role === 'WELLNESS_COACH') {
      return navItems.filter(item => 
        ['Home', 'Wellness', 'Billing'].includes(item.label)
      );
    }
    if (user.role === 'HEALTHCARE_PROVIDER') {
      return navItems.filter(item => 
        ['Home', 'Appointments', 'Billing'].includes(item.label)
      );
    }
    if (user.role === 'PATIENT') {
      return navItems.filter(item => 
        ['Home', 'Appointments', 'Wellness', 'Billing'].includes(item.label)
      );
    }
    // ADMIN sees all
    return navItems;
  };

  const visibleItems = getVisibleNavItems();

  if (isMobile) {
    // Mobile: Show horizontal scrollable nav
    return (
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ px: 1, minHeight: '56px !important', overflowX: 'auto' }}>
          <Box sx={{ display: 'flex', gap: 1, minWidth: 'max-content' }}>
            {visibleItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path === '/dashboard' && location.pathname === '/dashboard');
              return (
                <Button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  startIcon={item.icon}
                  sx={{
                    minWidth: 'auto',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    color: isActive ? '#2563eb' : '#64748b',
                    backgroundColor: isActive ? alpha('#2563eb', 0.1) : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.875rem',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      backgroundColor: isActive ? alpha('#2563eb', 0.15) : alpha('#2563eb', 0.05),
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
            <Button
              onClick={() => navigate('/profile')}
              startIcon={<SettingsIcon />}
              sx={{
                minWidth: 'auto',
                px: 2,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                color: location.pathname === '/profile' ? '#2563eb' : '#64748b',
                backgroundColor: location.pathname === '/profile' ? alpha('#2563eb', 0.1) : 'transparent',
                fontWeight: location.pathname === '/profile' ? 600 : 500,
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                '&:hover': {
                  backgroundColor: location.pathname === '/profile' ? alpha('#2563eb', 0.15) : alpha('#2563eb', 0.05),
                },
              }}
            >
              Settings
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  // Desktop: Show full nav bar
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 72, // Below main app bar
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        zIndex: (theme) => theme.zIndex.drawer,
      }}
    >
      <Toolbar sx={{ px: 3, minHeight: '56px !important', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {visibleItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/dashboard' && location.pathname === '/dashboard');
            return (
              <Button
                key={item.label}
                onClick={() => navigate(item.path)}
                startIcon={item.icon}
                sx={{
                  minWidth: 'auto',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  color: isActive ? '#2563eb' : '#64748b',
                  backgroundColor: isActive ? alpha('#2563eb', 0.1) : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: isActive ? alpha('#2563eb', 0.15) : alpha('#2563eb', 0.05),
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            startIcon={<NotificationsIcon />}
            sx={{
              minWidth: 'auto',
              px: 2,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              color: '#64748b',
              '&:hover': {
                backgroundColor: alpha('#2563eb', 0.05),
              },
            }}
          >
            <Badge badgeContent={0} color="error">
              Notifications
            </Badge>
          </Button>
          <Button
            onClick={() => navigate('/profile')}
            startIcon={<SettingsIcon />}
            sx={{
              minWidth: 'auto',
              px: 2,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              color: location.pathname === '/profile' ? '#2563eb' : '#64748b',
              backgroundColor: location.pathname === '/profile' ? alpha('#2563eb', 0.1) : 'transparent',
              fontWeight: location.pathname === '/profile' ? 600 : 500,
              '&:hover': {
                backgroundColor: location.pathname === '/profile' ? alpha('#2563eb', 0.15) : alpha('#2563eb', 0.05),
              },
            }}
          >
            Settings
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default GlobalNavBar;
