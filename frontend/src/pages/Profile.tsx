import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert
} from '@mui/material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: ''
  });
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: profile } = useQuery(
    'profile',
    () => api.get('/auth/profile').then(res => res.data),
    {
      onSuccess: (data) => {
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || ''
        });
      }
    }
  );

  const updateMutation = useMutation(
    (data: any) => api.put(`/users/${user?.id}`, data),
    {
      onSuccess: () => {
        setMessage('Profile updated successfully');
        queryClient.invalidateQueries('profile');
      },
      onError: () => {
        setMessage('Failed to update profile');
      }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <Layout>
      <Container>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          {message && (
            <Alert severity={message.includes('success') ? 'success' : 'error'} sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              value={user?.email || ''}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Role"
              value={user?.role || ''}
              disabled
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained">
              Update Profile
            </Button>
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
};

export default Profile;

