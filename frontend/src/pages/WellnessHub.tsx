import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress
} from '@mui/material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const WellnessHub: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('ALL');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'NUTRITION',
    content: '',
    imageUrl: '',
    videoUrl: ''
  });
  const queryClient = useQueryClient();

  const { data: wellnessContent, isLoading } = useQuery(
    'wellness',
    () => api.get('/wellness?publishedOnly=true').then(res => res.data)
  );

  const createMutation = useMutation(
    (data: any) => api.post('/wellness', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('wellness');
        setOpen(false);
        setFormData({
          title: '',
          description: '',
          category: 'NUTRITION',
          content: '',
          imageUrl: '',
          videoUrl: ''
        });
      }
    }
  );

  const filteredContent = category === 'ALL'
    ? wellnessContent
    : wellnessContent?.filter((item: any) => item.category === category);

  const canCreate = user?.role === 'WELLNESS_COACH' || user?.role === 'ADMIN';

  return (
    <Layout>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#1e293b',
                  mb: 0.5,
                }}
              >
                Wellness Hub
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Discover health and wellness content
              </Typography>
            </Box>
            {canCreate && (
              <Button
                variant="contained"
                onClick={() => setOpen(true)}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  px: 3,
                  py: 1.5,
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  },
                }}
              >
                Create Content
              </Button>
            )}
          </Box>

          <Box sx={{ mb: 4 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
                sx={{
                  borderRadius: 2,
                }}
              >
                <MenuItem value="ALL">All Categories</MenuItem>
                <MenuItem value="NUTRITION">Nutrition</MenuItem>
                <MenuItem value="FITNESS">Fitness</MenuItem>
                <MenuItem value="STRESS_MANAGEMENT">Stress Management</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : filteredContent?.length > 0 ? (
            <Grid container spacing={3}>
              {filteredContent.map((item: any) => (
                <Grid item xs={12} md={6} lg={4} key={item.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '1px solid #e2e8f0',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    {item.imageUrl && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.imageUrl}
                        alt={item.title}
                        sx={{
                          objectFit: 'cover',
                        }}
                      />
                    )}
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1.5 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: '#1e293b',
                            flex: 1,
                            mr: 1,
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Chip
                          label={item.category.replace('_', ' ')}
                          size="small"
                          sx={{
                            backgroundColor:
                              item.category === 'NUTRITION'
                                ? 'rgba(16, 185, 129, 0.1)'
                                : item.category === 'FITNESS'
                                ? 'rgba(37, 99, 235, 0.1)'
                                : 'rgba(245, 158, 11, 0.1)',
                            color:
                              item.category === 'NUTRITION'
                                ? '#059669'
                                : item.category === 'FITNESS'
                                ? '#2563eb'
                                : '#d97706',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748b',
                          mb: 2,
                          flex: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.description}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#94a3b8',
                          fontSize: '0.8125rem',
                          mt: 'auto',
                        }}
                      >
                        By {item.author.firstName} {item.author.lastName}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                No wellness content found
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                {category === 'ALL'
                  ? 'Check back later for new wellness content!'
                  : `No content available in ${category.replace('_', ' ')} category.`}
              </Typography>
            </Card>
          )}

          <Dialog
            open={open}
            onClose={() => setOpen(false)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
              },
            }}
          >
            <DialogTitle
              sx={{
                fontWeight: 600,
                fontSize: '1.5rem',
                color: '#1e293b',
                pb: 1,
              }}
            >
              Create Wellness Content
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Title"
                sx={{ mt: 2 }}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                sx={{ mt: 2 }}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the content..."
              />
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <MenuItem value="NUTRITION">Nutrition</MenuItem>
                  <MenuItem value="FITNESS">Fitness</MenuItem>
                  <MenuItem value="STRESS_MANAGEMENT">Stress Management</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Content"
                multiline
                rows={6}
                sx={{ mt: 2 }}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Main content of the wellness article..."
              />
              <TextField
                fullWidth
                label="Image URL (optional)"
                sx={{ mt: 2 }}
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              <TextField
                fullWidth
                label="Video URL (optional)"
                sx={{ mt: 2 }}
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://example.com/video.mp4"
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={() => setOpen(false)}
                sx={{
                  color: '#64748b',
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => createMutation.mutate({ ...formData, isPublished: true })}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  },
                }}
              >
                Create Content
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Layout>
  );
};

export default WellnessHub;

