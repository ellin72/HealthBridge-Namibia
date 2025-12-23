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
  Alert
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

  const { data: providers } = useQuery(
    'providers',
    () => api.get('/users?role=HEALTHCARE_PROVIDER').then(res => res.data),
    { enabled: user?.role === 'PATIENT' }
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
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Appointments</Typography>
          {user?.role === 'PATIENT' && (
            <Button variant="contained" onClick={() => setOpen(true)}>
              Book Appointment
            </Button>
          )}
        </Box>

        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : appointments?.length > 0 ? (
          <Grid container spacing={2}>
            {appointments.map((appointment: any) => (
              <Grid item xs={12} key={appointment.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">
                      {user?.role === 'PATIENT'
                        ? `Dr. ${appointment.provider.firstName} ${appointment.provider.lastName}`
                        : `${appointment.patient.firstName} ${appointment.patient.lastName}`}
                    </Typography>
                    <Typography color="text.secondary">
                      {new Date(appointment.appointmentDate).toLocaleString()}
                    </Typography>
                    <Typography>Status: {appointment.status}</Typography>
                    {appointment.notes && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Notes: {appointment.notes}
                      </Typography>
                    )}
                    {user?.role === 'HEALTHCARE_PROVIDER' && appointment.status === 'PENDING' && (
                      <Box sx={{ mt: 2 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleStatusChange(appointment.id, 'CONFIRMED')}
                        >
                          Confirm
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No appointments found</Typography>
        )}

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Book New Appointment</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Provider</InputLabel>
              <Select
                value={formData.providerId}
                label="Provider"
                onChange={(e) => setFormData({ ...formData, providerId: e.target.value })}
              >
                {providers?.map((provider: any) => (
                  <MenuItem key={provider.id} value={provider.id}>
                    {provider.firstName} {provider.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
              label="Notes"
              sx={{ mt: 2 }}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} variant="contained" disabled={!formData.providerId || !formData.appointmentDate}>
              Book
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Appointments;

