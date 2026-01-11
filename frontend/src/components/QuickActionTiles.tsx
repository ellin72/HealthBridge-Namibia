import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  alpha
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Healing as SymptomIcon,
  FitnessCenter as WellnessIcon,
  Receipt as BillingIcon,
  Assignment as AssignmentIcon,
  School as LearningIcon,
  Psychology as ResearchIcon,
  Create as CreateIcon,
  TrendingUp as AnalyticsIcon,
  People as PeopleIcon,
  MonitorHeart as MonitorIcon,
  Security as SecurityIcon,
  Upload as UploadIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';

interface QuickAction {
  title: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  gradient: string;
}

interface QuickActionTilesProps {
  role: string;
}

const QuickActionTiles: React.FC<QuickActionTilesProps> = ({ role }) => {
  const navigate = useNavigate();

  const getQuickActions = (): QuickAction[] => {
    switch (role) {
      case 'PATIENT':
        return [
          {
            title: 'Book Appointment Now',
            icon: <CalendarIcon />,
            path: '/select-provider',
            color: '#667eea',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          },
          {
            title: 'Symptom Checker',
            icon: <SymptomIcon />,
            path: '/symptom-checker',
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          },
          {
            title: 'Wellness Hub',
            icon: <WellnessIcon />,
            path: '/wellness',
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          },
          {
            title: 'Pay Invoice',
            icon: <BillingIcon />,
            path: '/billing',
            color: '#ef4444',
            gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          },
        ];

      case 'HEALTHCARE_PROVIDER':
        return [
          {
            title: 'Manage Appointments',
            icon: <CalendarIcon />,
            path: '/appointments',
            color: '#667eea',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          },
          {
            title: 'Consultation Notes',
            icon: <CreateIcon />,
            path: '/telehealth-pro',
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          },
          {
            title: 'Patient History',
            icon: <PeopleIcon />,
            path: '/telehealth-pro',
            color: '#3b82f6',
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          },
          {
            title: 'View Earnings',
            icon: <PaymentIcon />,
            path: '/provider-earnings',
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          },
        ];

      case 'WELLNESS_COACH':
        return [
          {
            title: 'Create Content',
            icon: <CreateIcon />,
            path: '/wellness',
            color: '#667eea',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          },
          {
            title: 'Launch Challenge',
            icon: <WellnessIcon />,
            path: '/wellness-tools',
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          },
          {
            title: 'Engagement Analytics',
            icon: <AnalyticsIcon />,
            path: '/wellness',
            color: '#3b82f6',
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          },
        ];

      case 'STUDENT':
        return [
          {
            title: 'Learning Zone',
            icon: <LearningIcon />,
            path: '/learning',
            color: '#667eea',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          },
          {
            title: 'Upload Assignment',
            icon: <UploadIcon />,
            path: '/learning',
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          },
          {
            title: 'Research Tools',
            icon: <ResearchIcon />,
            path: '/research',
            color: '#3b82f6',
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          },
        ];

      case 'ADMIN':
        return [
          {
            title: 'User Management',
            icon: <PeopleIcon />,
            path: '/users',
            color: '#667eea',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          },
          {
            title: 'System Monitoring',
            icon: <MonitorIcon />,
            path: '/monitoring',
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          },
          {
            title: 'Fraud Detection',
            icon: <SecurityIcon />,
            path: '/monitoring',
            color: '#ef4444',
            gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          },
        ];

      default:
        return [];
    }
  };

  const actions = getQuickActions();

  if (actions.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          color: '#1e293b',
          mb: 3,
        }}
      >
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        {actions.map((action, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              onClick={() => navigate(action.path)}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                border: '1px solid #e2e8f0',
                background: 'white',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  borderColor: action.color,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    background: action.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    color: 'white',
                  }}
                >
                  {action.icon}
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#1e293b',
                    fontSize: '1rem',
                  }}
                >
                  {action.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuickActionTiles;
