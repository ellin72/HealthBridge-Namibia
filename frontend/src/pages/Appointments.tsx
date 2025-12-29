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
  CardContent,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Avatar
} from '@mui/material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const Appointments: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    providerId: '',
    appointmentDate: '',
    notes: ''
  });
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery(
    'appointments',
    () => api.get('/appointments').then(res => res.data)
  );

  const { data: providers, isLoading: providersLoading, error: providersError } = useQuery(
    'providers',
    async () => {
      try {
        const response = await api.get('/users/providers');
        console.log('Providers API response:', response);
        console.log('Providers data:', response.data);
        console.log('Providers count:', Array.isArray(response.data) ? response.data.length : 'Not an array');
        return response.data;
      } catch (error: any) {
        console.error('Error fetching providers:', error);
        console.error('Error response:', error.response);
        throw error;
      }
    },
    { 
      enabled: user?.role === 'PATIENT',
      retry: 1,
      onError: (error: any) => {
        console.error('Providers query error:', error);
        if (error.response) {
          console.error('Error status:', error.response.status);
          console.error('Error data:', error.response.data);
        }
      }
    }
  );

  const createMutation = useMutation(
    (data: any) => api.post('/appointments', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('appointments');
        setOpen(false);
        setFormData({ providerId: '', appointmentDate: '', notes: '' });
      }
    }
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: any }) => api.put(`/appointments/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('appointments');
      }
    }
  );

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleStatusChange = (id: string, status: string) => {
    updateMutation.mutate({ id, data: { status } });
  };

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
                Appointments
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Manage your healthcare appointments
              </Typography>
            </Box>
            {user?.role === 'PATIENT' && (
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
                Book Appointment
              </Button>
            )}
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : appointments?.length > 0 ? (
            <Grid container spacing={3}>
              {appointments.map((appointment: any) => (
                <Grid item xs={12} md={6} lg={4} key={appointment.id}>
                  <Card
                    sx={{
                      height: '100%',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 56,
                            height: 56,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            mr: 2,
                            fontWeight: 600,
                          }}
                        >
                          {user?.role === 'PATIENT'
                            ? `${appointment.provider.firstName?.[0]}${appointment.provider.lastName?.[0]}`
                            : `${appointment.patient.firstName?.[0]}${appointment.patient.lastName?.[0]}`}
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
                            {user?.role === 'PATIENT'
                              ? `Dr. ${appointment.provider.firstName} ${appointment.provider.lastName}`
                              : `${appointment.patient.firstName} ${appointment.patient.lastName}`}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#64748b',
                            }}
                          >
                            {new Date(appointment.appointmentDate).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
                          backgroundColor:
                            appointment.status === 'CONFIRMED'
                              ? 'rgba(16, 185, 129, 0.1)'
                              : appointment.status === 'PENDING'
                              ? 'rgba(245, 158, 11, 0.1)'
                              : 'rgba(100, 116, 139, 0.1)',
                          color:
                            appointment.status === 'CONFIRMED'
                              ? '#059669'
                              : appointment.status === 'PENDING'
                              ? '#d97706'
                              : '#64748b',
                          fontWeight: 600,
                          fontSize: '0.8125rem',
                          mb: 2,
                        }}
                      >
                        {appointment.status}
                      </Box>
                      {appointment.notes && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#64748b',
                            mt: 1,
                            p: 1.5,
                            backgroundColor: '#f1f5f9',
                            borderRadius: 2,
                          }}
                        >
                          {appointment.notes}
                        </Typography>
                      )}
                      {user?.role === 'HEALTHCARE_PROVIDER' && appointment.status === 'PENDING' && (
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleStatusChange(appointment.id, 'CONFIRMED')}
                            sx={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              fontWeight: 600,
                              '&:hover': {
                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                              },
                            }}
                          >
                            Confirm Appointment
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                No appointments found
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                {user?.role === 'PATIENT'
                  ? 'Book your first appointment to get started!'
                  : 'No appointments scheduled yet.'}
              </Typography>
            </Card>
          )}

          <Dialog
            open={open}
            onClose={() => setOpen(false)}
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
              Book New Appointment
            </DialogTitle>
            <DialogContent>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Provider</InputLabel>
                {providersLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : providersError ? (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    Failed to load providers. Please try again.
                  </Alert>
                ) : (
                  <Select
                    value={formData.providerId}
                    label="Provider"
                    onChange={(e) => setFormData({ ...formData, providerId: e.target.value })}
                  >
                    {providers && Array.isArray(providers) && providers.length > 0 ? (
                      providers.map((provider: any) => (
                        <MenuItem key={provider.id} value={provider.id}>
                          Dr. {provider.firstName} {provider.lastName}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        {providersLoading ? 'Loading...' : 'No providers available'}
                      </MenuItem>
                    )}
                  </Select>
                )}
              </FormControl>
              {providersError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Error loading providers: {providersError.message || 'Unknown error'}
                </Alert>
              )}
              {providers && Array.isArray(providers) && providers.length === 0 && !providersLoading && !providersError && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No healthcare providers found. Please contact an administrator.
                </Alert>
              )}
              {user?.role !== 'PATIENT' && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Only patients can book appointments. Current role: {user?.role}
                </Alert>
              )}
              <TextField
                fullWidth
                type="datetime-local"
                label="Appointment Date & Time"
                sx={{ mt: 2 }}
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Notes (optional)"
                sx={{ mt: 2 }}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional information about your appointment..."
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
                onClick={handleCreate}
                variant="contained"
                disabled={!formData.providerId || !formData.appointmentDate}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  },
                }}
              >
                Book Appointment
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Layout>
  );
};

export default Appointments;

