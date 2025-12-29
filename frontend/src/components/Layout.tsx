import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  CalendarToday as CalendarIcon,
  FitnessCenter as FitnessIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  People as PeopleIcon,
  VideoCall as VideoCallIcon,
  TrackChanges as TrackIcon,
  Psychology as ResearchIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';

// Import logo - update path based on your actual logo file name
// For Vite, you can use: import logoPath from '../assets/images/healthbridge-logo.png';
// Or use public folder: const logoPath = '/healthbridge-logo.png';
const logoPath = '/healthbridge-logo.png'; // Place logo in public folder, or use import above

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Appointments', icon: <CalendarIcon />, path: '/appointments' },
    { text: 'Telehealth Pro', icon: <VideoCallIcon />, path: '/telehealth-pro' },
    { text: 'Symptom Checker', icon: <TrackIcon />, path: '/symptom-checker' },
    { text: 'Wellness Hub', icon: <FitnessIcon />, path: '/wellness' },
    { text: 'Wellness Tools', icon: <TrackIcon />, path: '/wellness-tools' },
    { text: 'Learning Zone', icon: <SchoolIcon />, path: '/learning' },
    ...(user?.role === 'STUDENT'
      ? [{ text: 'Research Support', icon: <ResearchIcon />, path: '/research' }]
      : []),
    ...(user?.role === 'ADMIN'
      ? [{ text: 'User Management', icon: <PeopleIcon />, path: '/users' }]
      : []),
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        sx={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
          color: 'white',
          minHeight: '64px !important',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          component="img"
          src={logoPath}
          alt="HealthBridge Logo"
          onError={(e: any) => {
            // Fallback if image doesn't load
            e.target.style.display = 'none';
          }}
          sx={{
            height: 40,
            width: 'auto',
            objectFit: 'contain',
          }}
        />
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
          HealthBridge
        </Typography>
      </Toolbar>
      <Box sx={{ flex: 1, pt: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                  transform: 'translateX(4px)',
                },
                '&.Mui-selected': {
                  backgroundColor: 'rgba(37, 99, 235, 0.12)',
                  color: '#2563eb',
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.16)',
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
                  color: location.pathname === item.path ? '#2563eb' : 'inherit',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 500,
                  fontSize: '0.9375rem',
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          color: '#1e293b',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: 'none' },
              color: '#64748b',
              '&:hover': {
                backgroundColor: 'rgba(37, 99, 235, 0.08)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <Box
              component="img"
              src={logoPath}
              alt="HealthBridge Logo"
              onError={(e: any) => {
                e.target.style.display = 'none';
              }}
              sx={{
                height: 32,
                width: 'auto',
                objectFit: 'contain',
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 600,
                color: '#1e293b',
                fontSize: '1.125rem',
              }}
            >
              HealthBridge Namibia
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <LanguageSelector />
            <Typography
              variant="body2"
              sx={{
                display: { xs: 'none', sm: 'block' },
                color: '#64748b',
                fontWeight: 500,
              }}
            >
              {user?.firstName} {user?.lastName}
            </Typography>
            <IconButton
              onClick={handleMenuClick}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 4,
                sx: {
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 180,
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  navigate('/profile');
                  handleMenuClose();
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                  },
                }}
              >
                <PersonIcon sx={{ mr: 1.5, fontSize: 20 }} /> Profile
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                  },
                }}
              >
                <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} /> Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
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
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

