import React from 'react';
import { useQuery } from 'react-query';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Avatar
} from '@mui/material';
import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  EventNote as EventNoteIcon
} from '@mui/icons-material';
import api from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import QuickActionTiles from '../QuickActionTiles';
import NavigationGuide from '../NavigationGuide';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: appointments } = useQuery(
    'appointments',
    () => api.get('/appointments').then(res => res.data),
    { enabled: !!user }
  );

  const stats = [
    {
      title: 'Total Users',
      value: 'All',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: <PeopleIcon />,
    },
    {
      title: 'System Overview',
      value: 'Active',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: <TrendingUpIcon />,
    },
    {
      title: 'Total Appointments',
      value: appointments?.length || 0,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: <EventNoteIcon />,
    }
  ];

  return (
    <Box>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#1e293b',
              mb: 1,
            }}
          >
            Welcome back, {user?.firstName}! 👋
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              fontSize: '1.0625rem',
            }}
          >
            System administration - Manage users, monitor system health, and detect fraud
          </Typography>
        </Box>

        {/* Navigation Guide */}
        <NavigationGuide role="ADMIN" />

        {/* Quick Actions */}
        <QuickActionTiles role="ADMIN" />

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  background: stat.gradient,
                  color: 'white',
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
                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          opacity: 0.9,
                          fontWeight: 500,
                          mb: 1,
                        }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 700,
                          fontSize: '2.5rem',
                        }}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
