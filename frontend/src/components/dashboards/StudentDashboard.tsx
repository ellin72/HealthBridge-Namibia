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
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Book as BookIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import api from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import QuickActionTiles from '../QuickActionTiles';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: assignments } = useQuery(
    'assignments',
    () => api.get('/learning/assignments').then(res => res.data),
    { enabled: !!user }
  );

  const { data: learningResources } = useQuery(
    'learning-resources',
    () => api.get('/learning/resources?publishedOnly=true').then(res => res.data),
    { enabled: !!user }
  );

  const pendingAssignments = assignments?.filter((a: any) => {
    const submission = a.submissions?.[0];
    return !submission || submission.status === 'PENDING';
  }).length || 0;

  const stats = [
    {
      title: 'Pending Assignments',
      value: pendingAssignments,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: <AssignmentIcon />,
    },
    {
      title: 'Total Assignments',
      value: assignments?.length || 0,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: <SchoolIcon />,
    },
    {
      title: 'Learning Resources',
      value: learningResources?.length || 0,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: <BookIcon />,
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
            Access learning resources, submit assignments, and use research tools
          </Typography>
        </Box>

        {/* Quick Actions */}
        <QuickActionTiles role="STUDENT" />

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

        {/* Recent Assignments */}
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: '#1e293b',
              mb: 3,
            }}
          >
            Recent Assignments
          </Typography>
          {assignments && assignments.length > 0 ? (
            <Grid container spacing={3}>
              {assignments.slice(0, 3).map((assignment: any) => {
                const submission = assignment.submissions?.[0];
                return (
                  <Grid item xs={12} md={6} lg={4} key={assignment.id}>
                    <Card
                      sx={{
                        height: '100%',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            sx={{
                              width: 48,
                              height: 48,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              mr: 2,
                            }}
                          >
                            <AssignmentIcon />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: '#1e293b',
                                mb: 0.5,
                              }}
                            >
                              {assignment.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#64748b',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              <TimeIcon sx={{ fontSize: 16 }} />
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            backgroundColor: submission
                              ? submission.status === 'GRADED'
                                ? 'rgba(16, 185, 129, 0.1)'
                                : 'rgba(245, 158, 11, 0.1)'
                              : 'rgba(239, 68, 68, 0.1)',
                            color: submission
                              ? submission.status === 'GRADED'
                                ? '#059669'
                                : '#d97706'
                              : '#ef4444',
                            fontWeight: 600,
                            fontSize: '0.8125rem',
                          }}
                        >
                          {submission
                            ? submission.status === 'GRADED'
                              ? `Graded: ${submission.grade}%`
                              : 'Submitted'
                            : 'Not Submitted'
                          }
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No assignments found.
              </Typography>
            </Card>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default StudentDashboard;
