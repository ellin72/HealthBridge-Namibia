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
  Chip
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
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Wellness Hub</Typography>
          {canCreate && (
            <Button variant="contained" onClick={() => setOpen(true)}>
              Create Content
            </Button>
          )}
        </Box>

        <Box sx={{ mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="ALL">All Categories</MenuItem>
              <MenuItem value="NUTRITION">Nutrition</MenuItem>
              <MenuItem value="FITNESS">Fitness</MenuItem>
              <MenuItem value="STRESS_MANAGEMENT">Stress Management</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : filteredContent?.length > 0 ? (
          <Grid container spacing={3}>
            {filteredContent.map((item: any) => (
              <Grid item xs={12} md={6} lg={4} key={item.id}>
                <Card>
                  {item.imageUrl && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.imageUrl}
                      alt={item.title}
                    />
                  )}
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Typography variant="h6">{item.title}</Typography>
                      <Chip label={item.category} size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {item.description}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      By {item.author.firstName} {item.author.lastName}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No wellness content found</Typography>
        )}

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create Wellness Content</DialogTitle>
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
            />
            <TextField
              fullWidth
              label="Image URL"
              sx={{ mt: 2 }}
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
            <TextField
              fullWidth
              label="Video URL"
              sx={{ mt: 2 }}
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createMutation.mutate({ ...formData, isPublished: true })}
              variant="contained"
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default WellnessHub;

