import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  Avatar
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';
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
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
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
        setTimeout(() => setMessage(''), 3000);
      },
      onError: (error: any) => {
        setMessage(error.response?.data?.message || 'Failed to update profile');
      }
    }
  );

  const updatePasswordMutation = useMutation(
    (data: any) => api.put(`/users/${user?.id}`, { password: data.newPassword }),
    {
      onSuccess: () => {
        setPasswordMessage('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setPasswordMessage(''), 3000);
      },
      onError: (error: any) => {
        setPasswordMessage(error.response?.data?.message || 'Failed to update password');
      }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    updateMutation.mutate(formData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage('Password must be at least 6 characters long');
      return;
    }

    updatePasswordMutation.mutate(passwordData);
  };

  return (
    <Layout>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#1e293b',
              mb: 0.5,
            }}
          >
            Profile Settings
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>
            Manage your account information and login credentials
          </Typography>

          <Grid container spacing={3}>
            {/* Login Credentials Section */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 3,
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        mr: 2,
                      }}
                    >
                      <LockIcon />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#1e293b',
                        }}
                      >
                        Login Credentials
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        View and manage your login information
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {passwordMessage && (
                    <Alert
                      severity={passwordMessage.includes('success') ? 'success' : 'error'}
                      sx={{ mb: 3, borderRadius: 2 }}
                    >
                      {passwordMessage}
                    </Alert>
                  )}

                  {/* Email Display */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        mb: 1,
                        fontWeight: 500,
                      }}
                    >
                      Email Address
                    </Typography>
                    <TextField
                      fullWidth
                      value={user?.email || ''}
                      disabled
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#f8fafc',
                          '& fieldset': {
                            borderColor: '#e2e8f0',
                          },
                        },
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        color: '#94a3b8',
                        mt: 0.5,
                        display: 'block',
                      }}
                    >
                      Your email address cannot be changed
                    </Typography>
                  </Box>

                  {/* Password Change Form */}
                  <Box component="form" onSubmit={handlePasswordSubmit}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        mb: 2,
                        fontWeight: 500,
                      }}
                    >
                      Change Password
                    </Typography>

                    <TextField
                      fullWidth
                      type={showCurrentPassword ? 'text' : 'password'}
                      label="Current Password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              edge="end"
                              size="small"
                            >
                              {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      type={showNewPassword ? 'text' : 'password'}
                      label="New Password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              edge="end"
                              size="small"
                            >
                              {showNewPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      type={showConfirmPassword ? 'text' : 'password'}
                      label="Confirm New Password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      sx={{ mb: 3 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              edge="end"
                              size="small"
                            >
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={updatePasswordMutation.isLoading}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        fontWeight: 600,
                        py: 1.25,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                        },
                      }}
                    >
                      {updatePasswordMutation.isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Personal Information Section */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 3,
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        mr: 2,
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#1e293b',
                        }}
                      >
                        Personal Information
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Update your profile details
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {message && (
                    <Alert
                      severity={message.includes('success') ? 'success' : 'error'}
                      sx={{ mb: 3, borderRadius: 2 }}
                    >
                      {message}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      sx={{ mb: 2 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Role"
                      value={user?.role || ''}
                      disabled
                      sx={{ mb: 3 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeIcon sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={updateMutation.isLoading}
                      sx={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        fontWeight: 600,
                        py: 1.25,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        },
                      }}
                    >
                      {updateMutation.isLoading ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
};

export default Profile;

