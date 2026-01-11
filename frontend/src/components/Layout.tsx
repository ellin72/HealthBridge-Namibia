import React, { useState, useMemo } from 'react';
import {
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Avatar,
  Collapse,
  Divider,
  InputBase,
  Paper,
  Chip,
  alpha
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  FitnessCenter as FitnessIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  VideoCall as VideoCallIcon,
  Psychology as ResearchIcon,
  LocalPharmacy as PharmacyIcon,
  Assignment as SurveyIcon,
  Policy as PolicyIcon,
  LocalHospital as MedicalAidIcon,
  Payment as PaymentIcon,
  MonitorHeart as MonitorIcon,
  AttachMoney as EarningsIcon,
  Search as SearchIcon,
  ExpandLess,
  ExpandMore,
  Healing as SymptomIcon,
  Spa as WellnessToolsIcon,
  Receipt as BillingIcon,
  Assessment as ClinicalIcon,
  Close as CloseIcon,
  MedicalServices as EmergencyIcon,
  Support as MentalHealthIcon,
  MonitorHeart as ChronicDiseaseIcon,
  LocalHospital as SpecialtyCareIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GlobalNavBar from './GlobalNavBar';
import TopNavigationBar from './TopNavigationBar';

const logoPath = '/healthbridge-logo.png';
const drawerWidth = 280;

interface LayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
  defaultOpen?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const getMenuGroups = (): MenuGroup[] => {
    if (!user) return [];

    const baseGroups: MenuGroup[] = [
      {
        title: 'Overview',
        items: [{ text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' }],
        defaultOpen: true,
      },
    ];

    // PATIENT menu groups
    if (user.role === 'PATIENT') {
      return [
        ...baseGroups,
        {
          title: 'Healthcare',
          items: [
            { text: 'Choose Provider', icon: <PeopleIcon />, path: '/select-provider' },
            { text: 'Appointments', icon: <CalendarIcon />, path: '/appointments' },
            { text: 'Urgent Care', icon: <EmergencyIcon />, path: '/urgent-care' },
            { text: 'Primary Care', icon: <PersonIcon />, path: '/primary-care' },
            { text: 'Telehealth Pro', icon: <VideoCallIcon />, path: '/telehealth-pro' },
            { text: 'Prescriptions', icon: <PharmacyIcon />, path: '/prescriptions' },
            { text: 'Symptom Checker', icon: <SymptomIcon />, path: '/symptom-checker' },
          ],
          defaultOpen: true,
        },
        {
          title: 'Specialty Services',
          items: [
            { text: 'Mental Health', icon: <MentalHealthIcon />, path: '/mental-health' },
            { text: 'Chronic Disease', icon: <ChronicDiseaseIcon />, path: '/chronic-disease-management' },
            { text: 'Specialty Care', icon: <SpecialtyCareIcon />, path: '/specialty-care' },
          ],
          defaultOpen: false,
        },
        {
          title: 'Wellness',
          items: [
            { text: 'Wellness Hub', icon: <FitnessIcon />, path: '/wellness' },
            { text: 'Wellness Tools', icon: <WellnessToolsIcon />, path: '/wellness-tools' },
          ],
          defaultOpen: false,
        },
        {
          title: 'Learning',
          items: [{ text: 'Learning Zone', icon: <SchoolIcon />, path: '/learning' }],
          defaultOpen: false,
        },
        {
          title: 'Financial',
          items: [
            { text: 'Medical Aid', icon: <MedicalAidIcon />, path: '/medical-aid' },
            { text: 'Payments', icon: <PaymentIcon />, path: '/payments' },
          ],
          defaultOpen: false,
        },
        {
          title: 'Administrative',
          items: [
            { text: 'Surveys', icon: <SurveyIcon />, path: '/surveys' },
            { text: 'Policies', icon: <PolicyIcon />, path: '/policies' },
          ],
          defaultOpen: false,
        },
      ];
    }

    // HEALTHCARE_PROVIDER menu groups
    if (user.role === 'HEALTHCARE_PROVIDER') {
      return [
        ...baseGroups,
        {
          title: 'Clinical',
          items: [
            { text: 'Appointments', icon: <CalendarIcon />, path: '/appointments' },
            { text: 'Urgent Care', icon: <EmergencyIcon />, path: '/urgent-care' },
            { text: 'Primary Care', icon: <PersonIcon />, path: '/primary-care' },
            { text: 'Telehealth Pro', icon: <VideoCallIcon />, path: '/telehealth-pro' },
            { text: 'Clinical Templates', icon: <ClinicalIcon />, path: '/clinical-templates' },
            { text: 'Monitoring', icon: <MonitorIcon />, path: '/monitoring' },
          ],
          defaultOpen: true,
        },
        {
          title: 'Specialty Services',
          items: [
            { text: 'Mental Health', icon: <MentalHealthIcon />, path: '/mental-health' },
            { text: 'Chronic Disease', icon: <ChronicDiseaseIcon />, path: '/chronic-disease-management' },
            { text: 'Specialty Care', icon: <SpecialtyCareIcon />, path: '/specialty-care' },
          ],
          defaultOpen: false,
        },
        {
          title: 'Financial',
          items: [
            { text: 'Billing', icon: <BillingIcon />, path: '/billing' },
            { text: 'Provider Earnings', icon: <EarningsIcon />, path: '/provider-earnings' },
          ],
          defaultOpen: false,
        },
        {
          title: 'Learning',
          items: [{ text: 'Learning Zone', icon: <SchoolIcon />, path: '/learning' }],
          defaultOpen: false,
        },
        {
          title: 'Administrative',
          items: [
            { text: 'Surveys', icon: <SurveyIcon />, path: '/surveys' },
            { text: 'Policies', icon: <PolicyIcon />, path: '/policies' },
          ],
          defaultOpen: false,
        },
      ];
    }

    // WELLNESS_COACH menu groups
    if (user.role === 'WELLNESS_COACH') {
      return [
        ...baseGroups,
        {
          title: 'Wellness',
          items: [
            { text: 'Wellness Hub', icon: <FitnessIcon />, path: '/wellness' },
            { text: 'Wellness Tools', icon: <WellnessToolsIcon />, path: '/wellness-tools' },
          ],
          defaultOpen: true,
        },
      ];
    }

    // STUDENT menu groups
    if (user.role === 'STUDENT') {
      return [
        ...baseGroups,
        {
          title: 'Learning',
          items: [
            { text: 'Learning Zone', icon: <SchoolIcon />, path: '/learning' },
            { text: 'Research Support', icon: <ResearchIcon />, path: '/research' },
          ],
          defaultOpen: true,
        },
      ];
    }

    // ADMIN menu groups (full access)
    if (user.role === 'ADMIN') {
      return [
        ...baseGroups,
        {
          title: 'Healthcare',
          items: [
            { text: 'Appointments', icon: <CalendarIcon />, path: '/appointments' },
            { text: 'Urgent Care', icon: <EmergencyIcon />, path: '/urgent-care' },
            { text: 'Primary Care', icon: <PersonIcon />, path: '/primary-care' },
            { text: 'Telehealth Pro', icon: <VideoCallIcon />, path: '/telehealth-pro' },
            { text: 'Symptom Checker', icon: <SymptomIcon />, path: '/symptom-checker' },
          ],
          defaultOpen: false,
        },
        {
          title: 'Specialty Services',
          items: [
            { text: 'Mental Health', icon: <MentalHealthIcon />, path: '/mental-health' },
            { text: 'Chronic Disease', icon: <ChronicDiseaseIcon />, path: '/chronic-disease-management' },
            { text: 'Specialty Care', icon: <SpecialtyCareIcon />, path: '/specialty-care' },
          ],
          defaultOpen: false,
        },
        {
          title: 'Wellness',
          items: [
            { text: 'Wellness Hub', icon: <FitnessIcon />, path: '/wellness' },
            { text: 'Wellness Tools', icon: <WellnessToolsIcon />, path: '/wellness-tools' },
          ],
          defaultOpen: false,
        },
        {
          title: 'Learning',
          items: [
            { text: 'Learning Zone', icon: <SchoolIcon />, path: '/learning' },
            { text: 'Research Support', icon: <ResearchIcon />, path: '/research' },
          ],
          defaultOpen: false,
        },
        {
          title: 'Administration',
          items: [
            { text: 'User Management', icon: <PeopleIcon />, path: '/users' },
            { text: 'Monitoring', icon: <MonitorIcon />, path: '/monitoring' },
            { text: 'Surveys', icon: <SurveyIcon />, path: '/surveys' },
            { text: 'Policies', icon: <PolicyIcon />, path: '/policies' },
          ],
          defaultOpen: false,
        },
      ];
    }

    return baseGroups;
  };

  const menuGroups = useMemo(() => getMenuGroups(), [user]);

  // Initialize expanded groups
  React.useEffect(() => {
    const initialExpanded: { [key: string]: boolean } = {};
    menuGroups.forEach((group) => {
      initialExpanded[group.title] = group.defaultOpen ?? false;
    });
    setExpandedGroups(initialExpanded);
  }, [user]);

  // Filter menu items based on search
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return menuGroups;

    const query = searchQuery.toLowerCase();
    return menuGroups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.text.toLowerCase().includes(query) ||
            item.path.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [menuGroups, searchQuery]);

  const toggleGroup = (title: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
          color: 'white',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          minHeight: 72,
        }}
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
          }}
        />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.125rem', lineHeight: 1.2 }}>
            HealthBridge
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
            Namibia
          </Typography>
        </Box>
      </Box>

      {/* Search Bar */}
      <Box sx={{ p: 2, pb: 1 }}>
        <Paper
          component="div"
          sx={{
            p: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: alpha('#f1f5f9', 0.8),
            borderRadius: 2,
            border: '1px solid #e2e8f0',
            '&:hover': {
              backgroundColor: '#f8fafc',
              borderColor: '#cbd5e1',
            },
            transition: 'all 0.2s',
          }}
        >
          <SearchIcon sx={{ color: '#64748b', fontSize: 20, mr: 1 }} />
          <InputBase
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flex: 1,
              fontSize: '0.875rem',
              '& input': {
                padding: 0,
                '&::placeholder': {
                  opacity: 0.6,
                },
              },
            }}
          />
          {searchQuery && (
            <IconButton
              size="small"
              onClick={() => setSearchQuery('')}
              sx={{ p: 0.5, color: '#64748b' }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
        </Paper>
      </Box>

      {/* Navigation Groups */}
      <Box sx={{ flex: 1, overflow: 'auto', pt: 1 }}>
        <List sx={{ py: 0 }}>
          {filteredGroups.map((group) => {
            const isExpanded = expandedGroups[group.title] ?? false;
            const hasActiveItem = group.items.some((item) => location.pathname === item.path);

            return (
              <React.Fragment key={group.title}>
                {group.items.length > 1 ? (
                  <>
                    <ListItem
                      onClick={() => toggleGroup(group.title)}
                      sx={{
                        px: 2,
                        py: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: alpha('#2563eb', 0.04),
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="overline"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              letterSpacing: '0.5px',
                              color: hasActiveItem ? '#2563eb' : '#64748b',
                              textTransform: 'uppercase',
                            }}
                          >
                            {group.title}
                          </Typography>
                        }
                      />
                      {isExpanded ? (
                        <ExpandLess sx={{ color: '#64748b', fontSize: 20 }} />
                      ) : (
                        <ExpandMore sx={{ color: '#64748b', fontSize: 20 }} />
                      )}
                    </ListItem>
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {group.items.map((item) => {
                          const isSelected = location.pathname === item.path;
                          return (
                            <ListItem
                              key={item.text}
                              selected={isSelected}
                              onClick={() => handleNavigation(item.path)}
                              sx={{
                                pl: 4,
                                pr: 2,
                                py: 0.75,
                                mx: 1,
                                mb: 0.5,
                                borderRadius: 2,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                  backgroundColor: alpha('#2563eb', 0.08),
                                  transform: 'translateX(4px)',
                                },
                                '&.Mui-selected': {
                                  backgroundColor: alpha('#2563eb', 0.12),
                                  color: '#2563eb',
                                  '&:hover': {
                                    backgroundColor: alpha('#2563eb', 0.16),
                                  },
                                  '& .MuiListItemIcon-root': {
                                    color: '#2563eb',
                                  },
                                },
                              }}
                            >
                              <ListItemIcon
                                sx={{
                                  minWidth: 40,
                                  color: isSelected ? '#2563eb' : '#64748b',
                                }}
                              >
                                {item.icon}
                              </ListItemIcon>
                              <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                  fontWeight: isSelected ? 600 : 500,
                                  fontSize: '0.9375rem',
                                }}
                              />
                              {item.badge && (
                                <Chip
                                  label={item.badge}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                  }}
                                />
                              )}
                            </ListItem>
                          );
                        })}
                      </List>
                    </Collapse>
                  </>
                ) : (
                  // Single item groups (like Dashboard) don't need collapse
                  group.items.map((item) => {
                    const isSelected = location.pathname === item.path;
                    return (
                      <ListItem
                        key={item.text}
                        selected={isSelected}
                        onClick={() => handleNavigation(item.path)}
                        sx={{
                          px: 2,
                          py: 1.25,
                          mx: 1,
                          mb: 0.5,
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            backgroundColor: alpha('#2563eb', 0.08),
                            transform: 'translateX(4px)',
                          },
                          '&.Mui-selected': {
                            backgroundColor: alpha('#2563eb', 0.12),
                            color: '#2563eb',
                            '&:hover': {
                              backgroundColor: alpha('#2563eb', 0.16),
                            },
                            '& .MuiListItemIcon-root': {
                              color: '#2563eb',
                            },
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 40,
                            color: isSelected ? '#2563eb' : '#64748b',
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.text}
                          primaryTypographyProps={{
                            fontWeight: isSelected ? 600 : 500,
                            fontSize: '0.9375rem',
                          }}
                        />
                      </ListItem>
                    );
                  })
                )}
                {group.title !== filteredGroups[filteredGroups.length - 1].title && (
                  <Divider sx={{ my: 1, mx: 2 }} />
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Box>

      {/* User Info Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#1e293b',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#64748b',
                fontSize: '0.75rem',
                textTransform: 'capitalize',
              }}
            >
              {user?.role?.toLowerCase().replace('_', ' ')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navigation Bar (Teladoc-style) */}
      <TopNavigationBar />
      
      <Box sx={{ display: 'flex', flex: 1, mt: '64px' }}>
        <Box
          component="nav"
          sx={{
            width: { sm: drawerWidth },
            flexShrink: { sm: 0 },
            position: { sm: 'fixed' },
            height: { sm: 'calc(100vh - 64px)' },
            top: { sm: '64px' },
            left: 0,
            zIndex: (theme) => ({ xs: theme.zIndex.drawer + 10, sm: theme.zIndex.drawer }),
          }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              zIndex: (theme) => theme.zIndex.drawer + 10,
              '& .MuiBackdrop-root': {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: (theme) => theme.zIndex.drawer + 9,
              },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                borderRight: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                top: '64px',
                height: 'calc(100vh - 64px)',
                zIndex: (theme) => theme.zIndex.drawer + 10,
                boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                borderRight: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                overflow: 'hidden',
                top: '64px',
                height: 'calc(100vh - 64px)',
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            backgroundColor: '#f8fafc',
            minHeight: 'calc(100vh - 64px)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <GlobalNavBar />
          <Box sx={{ flex: 1, p: { xs: 2, sm: 3 } }}>
            <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>{children}</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;

