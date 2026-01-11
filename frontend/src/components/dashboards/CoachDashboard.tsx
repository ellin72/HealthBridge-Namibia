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
  Article as ArticleIcon,
  Book as BookIcon
} from '@mui/icons-material';
import api from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import QuickActionTiles from '../QuickActionTiles';

const CoachDashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: myWellnessContent } = useQuery(
    'my-wellness',
    () => api.get('/wellness').then(res => res.data.filter((c: any) => c.authorId === user?.id)),
    { enabled: !!user }
  );

  const stats = [
    {
      title: 'Published Articles',
      value: myWellnessContent?.filter((c: any) => c.isPublished).length || 0,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: <ArticleIcon />,
    },
    {
      title: 'Total Articles',
      value: myWellnessContent?.length || 0,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: <BookIcon />,
    },
    {
      title: 'Draft Articles',
      value: myWellnessContent?.filter((c: any) => !c.isPublished).length || 0,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: <ArticleIcon />,
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
            Create wellness content, launch challenges, and track engagement analytics
          </Typography>
        </Box>

        {/* Quick Actions */}
        <QuickActionTiles role="WELLNESS_COACH" />

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

        {/* My Wellness Content */}
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: '#1e293b',
              mb: 3,
            }}
          >
            My Wellness Content
          </Typography>
          {myWellnessContent && myWellnessContent.length > 0 ? (
            <Grid container spacing={3}>
              {myWellnessContent.slice(0, 3).map((content: any) => (
                <Grid item xs={12} md={6} lg={4} key={content.id}>
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
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            mr: 2,
                          }}
                        >
                          <ArticleIcon />
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
                            {content.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#64748b',
                            }}
                          >
                            {content.category}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          backgroundColor: content.isPublished
                            ? 'rgba(16, 185, 129, 0.1)'
                            : 'rgba(245, 158, 11, 0.1)',
                          color: content.isPublished
                            ? '#059669'
                            : '#d97706',
                          fontWeight: 600,
                          fontSize: '0.8125rem',
                        }}
                      >
                        {content.isPublished ? 'Published' : 'Draft'}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No wellness content created yet. Start creating content to help others!
              </Typography>
            </Card>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default CoachDashboard;
