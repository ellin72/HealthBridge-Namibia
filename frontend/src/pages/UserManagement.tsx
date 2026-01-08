import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Card,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Avatar,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'PATIENT'
  });
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery(
    'users',
    () => api.get('/users').then(res => res.data),
    { enabled: user?.role === 'ADMIN' }
  );

  const createMutation = useMutation(
    (data: any) => api.post('/users', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        setOpen(false);
        setFormData({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phone: '',
          role: 'PATIENT'
        });
        setError('');
      },
      onError: (err: any) => {
        setError(err.response?.data?.message || 'Failed to create user');
      }
    }
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: any }) => api.put(`/users/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
        setOpen(false);
        setEditMode(false);
        setSelectedUser(null);
        setFormData({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phone: '',
          role: 'PATIENT'
        });
        setError('');
      },
      onError: (err: any) => {
        setError(err.response?.data?.message || 'Failed to update user');
      }
    }
  );

  const deleteMutation = useMutation(
    (id: string) => api.delete(`/users/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      }
    }
  );

  const handleOpen = () => {
    setOpen(true);
    setEditMode(false);
    setSelectedUser(null);
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      role: 'PATIENT'
    });
    setError('');
  };

  const handleEdit = (userToEdit: any) => {
    setSelectedUser(userToEdit);
    setEditMode(true);
    setOpen(true);
    setFormData({
      email: userToEdit.email,
      password: '',
      firstName: userToEdit.firstName,
      lastName: userToEdit.lastName,
      phone: userToEdit.phone || '',
      role: userToEdit.role
    });
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (editMode) {
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      updateMutation.mutate({ id: selectedUser.id, data: updateData });
    } else {
      if (!formData.password) {
        setError('Password is required');
        return;
      }
      createMutation.mutate(formData);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'HEALTHCARE_PROVIDER':
        return 'primary';
      case 'WELLNESS_COACH':
        return 'success';
      case 'STUDENT':
        return 'info';
      default:
        return 'default';
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <Layout>
        <Container>
          <Alert severity="error">Access denied. Admin privileges required.</Alert>
        </Container>
      </Layout>
    );
  }

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
                User Management
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Manage Healthcare Providers, Wellness Coaches, and other personnel
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpen}
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
              Add User
            </Button>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Card sx={{ border: '1px solid #e2e8f0', borderRadius: 3 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users?.map((userItem: any) => (
                      <TableRow key={userItem.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                fontWeight: 600,
                              }}
                            >
                              {userItem.firstName?.[0]}
                              {userItem.lastName?.[0]}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontWeight: 500 }}>
                                {userItem.firstName} {userItem.lastName}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmailIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                            <Typography variant="body2">{userItem.email}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {userItem.phone ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <PhoneIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                              <Typography variant="body2">{userItem.phone}</Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                              N/A
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={userItem.role.replace('_', ' ')}
                            color={getRoleColor(userItem.role) as any}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={userItem.isActive ? 'Active' : 'Inactive'}
                            color={userItem.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(userItem)}
                              sx={{
                                color: '#2563eb',
                                '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.08)' },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(userItem.id)}
                              disabled={deleteMutation.isLoading}
                              sx={{
                                color: '#ef4444',
                                '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.08)' },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}

          <Dialog
            open={open}
            onClose={() => {
              setOpen(false);
              setEditMode(false);
              setSelectedUser(null);
              setError('');
            }}
            maxWidth="sm"
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
              {editMode ? 'Edit User' : 'Add New User'}
            </DialogTitle>
            <DialogContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={editMode}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required={!editMode}
                      label={editMode ? 'New Password (leave blank to keep current)' : 'Password'}
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={formData.role}
                        label="Role"
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        disabled={editMode}
                      >
                        <MenuItem value="PATIENT">Patient</MenuItem>
                        <MenuItem value="HEALTHCARE_PROVIDER">Healthcare Provider</MenuItem>
                        <MenuItem value="WELLNESS_COACH">Wellness Coach</MenuItem>
                        <MenuItem value="STUDENT">Student</MenuItem>
                        {!editMode && <MenuItem value="ADMIN">Admin</MenuItem>}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={() => {
                  setOpen(false);
                  setEditMode(false);
                  setSelectedUser(null);
                  setError('');
                }}
                sx={{
                  color: '#64748b',
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={createMutation.isLoading || updateMutation.isLoading}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  },
                }}
              >
                {createMutation.isLoading || updateMutation.isLoading
                  ? 'Saving...'
                  : editMode
                  ? 'Update User'
                  : 'Create User'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Layout>
  );
};

export default UserManagement;

