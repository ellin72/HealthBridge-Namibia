import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  alpha,
  useTheme,
  useMediaQuery,
  Container
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  HealthAndSafety as HealthIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  FitnessCenter as WellnessIcon,
  School as LearningIcon,
  Receipt as BillingIcon,
  LocalHospital as HospitalIcon,
  Psychology as MentalHealthIcon,
  MonitorHeart as ChronicDiseaseIcon,
  Healing as SpecialtyCareIcon,
  Emergency as EmergencyIcon,
  VideoCall as VideoCallIcon,
  Healing as SymptomIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';

const logoPath = '/healthbridge-logo.png';

interface NavItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

const TopNavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [anchorEls, setAnchorEls] = useState<{ [key: string]: HTMLElement | null }>({});

  // Navigation structure similar to Teladoc
  const getNavItems = (): NavItem[] => {
    if (user) {
      // Authenticated user navigation
      const baseItems: NavItem[] = [
        {
          label: 'Home',
          path: '/dashboard',
          icon: <DashboardIcon />
        }
      ];

      // Role-based navigation
      if (user.role === 'PATIENT') {
        return [
          ...baseItems,
          {
            label: 'Healthcare',
            children: [
              { label: 'Book Appointment', path: '/select-provider', icon: <CalendarIcon /> },
              { label: 'My Appointments', path: '/appointments', icon: <CalendarIcon /> },
              { label: 'Urgent Care', path: '/urgent-care', icon: <EmergencyIcon /> },
              { label: 'Primary Care', path: '/primary-care', icon: <HospitalIcon /> },
              { label: 'Telehealth Pro', path: '/telehealth-pro', icon: <VideoCallIcon /> },
              { label: 'Symptom Checker', path: '/symptom-checker', icon: <SymptomIcon /> },
              { label: 'Mental Health', path: '/mental-health', icon: <MentalHealthIcon /> },
              { label: 'Chronic Disease', path: '/chronic-disease-management', icon: <ChronicDiseaseIcon /> },
              { label: 'Specialty Care', path: '/specialty-care', icon: <SpecialtyCareIcon /> }
            ]
          },
          {
            label: 'Wellness',
            children: [
              { label: 'Wellness Hub', path: '/wellness', icon: <WellnessIcon /> },
              { label: 'Wellness Tools', path: '/wellness-tools', icon: <WellnessIcon /> }
            ]
          },
          {
            label: 'Billing',
            path: '/billing',
            icon: <BillingIcon />
          }
        ];
      }

      if (user.role === 'HEALTHCARE_PROVIDER') {
        return [
          ...baseItems,
          {
            label: 'Clinical',
            children: [
              { label: 'Appointments', path: '/appointments', icon: <CalendarIcon /> },
              { label: 'Telehealth Pro', path: '/telehealth-pro', icon: <VideoCallIcon /> },
              { label: 'Urgent Care', path: '/urgent-care', icon: <EmergencyIcon /> },
              { label: 'Primary Care', path: '/primary-care', icon: <HospitalIcon /> },
              { label: 'Mental Health', path: '/mental-health', icon: <MentalHealthIcon /> },
              { label: 'Chronic Disease', path: '/chronic-disease-management', icon: <ChronicDiseaseIcon /> },
              { label: 'Specialty Care', path: '/specialty-care', icon: <SpecialtyCareIcon /> }
            ]
          },
          {
            label: 'Billing',
            children: [
              { label: 'Billing Dashboard', path: '/billing', icon: <BillingIcon /> },
              { label: 'Provider Earnings', path: '/provider-earnings', icon: <BillingIcon /> }
            ]
          }
        ];
      }

      if (user.role === 'WELLNESS_COACH') {
        return [
          ...baseItems,
          {
            label: 'Wellness',
            children: [
              { label: 'Wellness Hub', path: '/wellness', icon: <WellnessIcon /> },
              { label: 'Wellness Tools', path: '/wellness-tools', icon: <WellnessIcon /> }
            ]
          }
        ];
      }

      if (user.role === 'STUDENT') {
        return [
          ...baseItems,
          {
            label: 'Learning',
            children: [
              { label: 'Learning Zone', path: '/learning', icon: <LearningIcon /> },
              { label: 'Research Support', path: '/research', icon: <LearningIcon /> }
            ]
          }
        ];
      }

      if (user.role === 'ADMIN') {
        return [
          ...baseItems,
          {
            label: 'Administration',
            children: [
              { label: 'User Management', path: '/users', icon: <PeopleIcon /> },
              { label: 'System Monitoring', path: '/monitoring', icon: <PeopleIcon /> }
            ]
          }
        ];
      }
    }

    // Unauthenticated navigation (public)
    return [
      {
        label: '24/7 Care',
        children: [
          { label: 'Get Care Now', path: '/select-provider' },
          { label: 'Urgent Care', path: '/urgent-care' },
          { label: 'Primary Care', path: '/primary-care' },
          { label: 'Symptom Checker', path: '/symptom-checker' }
        ]
      },
      {
        label: 'Mental Health',
        path: '/mental-health'
      },
      {
        label: 'Wellness',
        children: [
          { label: 'Wellness Hub', path: '/wellness' },
          { label: 'Wellness Tools', path: '/wellness-tools' }
        ]
      },
      {
        label: 'Learning',
        children: [
          { label: 'Learning Zone', path: '/learning' },
          { label: 'Research Support', path: '/research' }
        ]
      },
      {
        label: 'Specialty Care',
        children: [
          { label: 'Chronic Disease Management', path: '/chronic-disease-management' },
          { label: 'Specialty Care', path: '/specialty-care' }
        ]
      }
    ];
  };

  const navItems = getNavItems();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, label: string) => {
    setAnchorEls({ ...anchorEls, [label]: event.currentTarget });
  };

  const handleMenuClose = (label: string) => {
    setAnchorEls({ ...anchorEls, [label]: null });
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    Object.keys(anchorEls).forEach(key => handleMenuClose(key));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getCTALabel = () => {
    if (!user) return 'Get Care Now';
    if (user.role === 'PATIENT') return 'Book Appointment';
    if (user.role === 'HEALTHCARE_PROVIDER') return 'View Appointments';
    return 'Dashboard';
  };

  const getCTAPath = () => {
    if (!user) return '/select-provider';
    if (user.role === 'PATIENT') return '/select-provider';
    if (user.role === 'HEALTHCARE_PROVIDER') return '/appointments';
    return '/dashboard';
  };

  // Mobile menu drawer
  const mobileDrawer = (
    <Box sx={{ width: 280, height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <HealthIcon sx={{ fontSize: 28, color: '#2563eb' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.125rem' }}>
            HealthBridge
          </Typography>
        </Box>
        <IconButton onClick={() => setMobileMenuOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ py: 2 }}>
        {navItems.map((item) => (
          <React.Fragment key={item.label}>
            {item.children ? (
              <>
                <ListItem>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9375rem' }}
                  />
                </ListItem>
                {item.children.map((child) => (
                  <ListItem
                    key={child.label}
                    button
                    onClick={() => child.path && handleNavigation(child.path)}
                    sx={{ pl: 4 }}
                  >
                    <ListItemText
                      primary={child.label}
                      primaryTypographyProps={{ fontSize: '0.875rem', color: '#64748b' }}
                    />
                  </ListItem>
                ))}
              </>
            ) : (
              <ListItem
                button
                onClick={() => item.path && handleNavigation(item.path)}
                selected={location.pathname === item.path}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 600 : 500 }}
                />
              </ListItem>
            )}
            <Divider sx={{ my: 1 }} />
          </React.Fragment>
        ))}
        {user && (
          <>
            <ListItem button onClick={() => handleNavigation('/profile')}>
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" primaryTypographyProps={{ color: '#ef4444' }} />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'white',
        color: '#1e293b',
        borderBottom: '1px solid #e2e8f0',
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1, minHeight: '64px !important' }}>
          {/* Logo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              cursor: 'pointer',
              textDecoration: 'none',
              color: 'inherit'
            }}
            onClick={() => handleNavigation(user ? '/dashboard' : '/')}
          >
            <Box
              component="img"
              src={logoPath}
              alt="HealthBridge Logo"
              onError={(e: any) => {
                e.target.style.display = 'none';
              }}
              sx={{
                height: 40,
                width: 'auto',
                objectFit: 'contain',
                display: { xs: 'none', sm: 'block' }
              }}
            />
            <HealthIcon sx={{ fontSize: { xs: 28, sm: 32 }, color: '#2563eb', display: { sm: 'none' } }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.125rem', sm: '1.25rem' },
                color: '#1e293b',
              }}
            >
              HealthBridge Namibia
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'center', mx: 4 }}>
              {navItems.map((item) => (
                <Box key={item.label}>
                  {item.children ? (
                    <>
                      <Button
                        endIcon={<ArrowDropDownIcon />}
                        onClick={(e) => handleMenuOpen(e, item.label)}
                        sx={{
                          color: '#1e293b',
                          fontWeight: 500,
                          textTransform: 'none',
                          fontSize: '0.9375rem',
                          px: 2,
                          '&:hover': {
                            backgroundColor: alpha('#2563eb', 0.05),
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                      <Menu
                        anchorEl={anchorEls[item.label]}
                        open={Boolean(anchorEls[item.label])}
                        onClose={() => handleMenuClose(item.label)}
                        PaperProps={{
                          elevation: 4,
                          sx: {
                            mt: 1.5,
                            borderRadius: 2,
                            minWidth: 220,
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                          },
                        }}
                      >
                        {item.children.map((child) => (
                          <MenuItem
                            key={child.label}
                            onClick={() => child.path && handleNavigation(child.path)}
                            sx={{
                              py: 1.5,
                              px: 2,
                              '&:hover': {
                                backgroundColor: alpha('#2563eb', 0.08),
                              },
                            }}
                          >
                            {child.icon && <Box sx={{ mr: 1.5, display: 'flex', alignItems: 'center' }}>{child.icon}</Box>}
                            <Typography variant="body2">{child.label}</Typography>
                          </MenuItem>
                        ))}
                      </Menu>
                    </>
                  ) : (
                    <Button
                      onClick={() => item.path && handleNavigation(item.path)}
                      sx={{
                        color: location.pathname === item.path ? '#2563eb' : '#1e293b',
                        fontWeight: location.pathname === item.path ? 600 : 500,
                        textTransform: 'none',
                        fontSize: '0.9375rem',
                        px: 2,
                        '&:hover': {
                          backgroundColor: alpha('#2563eb', 0.05),
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* Right side actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {user ? (
              <>
                <LanguageSelector />
                <Button
                  variant="contained"
                  onClick={() => handleNavigation(getCTAPath())}
                  sx={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 3,
                    display: { xs: 'none', sm: 'flex' },
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                    },
                  }}
                >
                  {getCTALabel()}
                </Button>
                <IconButton
                  onClick={(e) => handleMenuOpen(e, 'user')}
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha('#2563eb', 0.08),
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  >
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </Box>
                </IconButton>
                <Menu
                  anchorEl={anchorEls['user']}
                  open={Boolean(anchorEls['user'])}
                  onClose={() => handleMenuClose('user')}
                  PaperProps={{
                    elevation: 4,
                    sx: {
                      mt: 1.5,
                      borderRadius: 2,
                      minWidth: 200,
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e2e8f0' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'capitalize' }}>
                      {user.role?.toLowerCase().replace('_', ' ')}
                    </Typography>
                  </Box>
                  <MenuItem
                    onClick={() => {
                      handleNavigation('/profile');
                      handleMenuClose('user');
                    }}
                    sx={{
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: alpha('#2563eb', 0.08),
                      },
                    }}
                  >
                    <PersonIcon sx={{ mr: 1.5, fontSize: 20, color: '#64748b' }} />
                    <Typography variant="body2">Profile</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: alpha('#ef4444', 0.08),
                      },
                    }}
                  >
                    <LogoutIcon sx={{ mr: 1.5, fontSize: 20, color: '#ef4444' }} />
                    <Typography variant="body2" sx={{ color: '#ef4444' }}>
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => handleNavigation('/login')}
                  sx={{
                    fontWeight: 500,
                    color: '#64748b',
                    textTransform: 'none',
                    display: { xs: 'none', sm: 'flex' },
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleNavigation('/register')}
                  sx={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 3,
                    display: { xs: 'none', sm: 'flex' },
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
                    },
                  }}
                >
                  Register
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleNavigation('/select-provider')}
                  sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 3,
                    display: { xs: 'none', md: 'flex' },
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    },
                  }}
                >
                  Get Care Now
                </Button>
              </>
            )}

            {/* Mobile menu button */}
            <IconButton
              sx={{
                display: { xs: 'flex', md: 'none' },
                color: '#1e293b',
              }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
          },
        }}
      >
        {mobileDrawer}
      </Drawer>
    </AppBar>
  );
};

export default TopNavigationBar;
