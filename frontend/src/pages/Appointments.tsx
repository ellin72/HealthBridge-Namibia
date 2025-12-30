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
  Avatar,
  IconButton,
  Menu,
  Chip,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Cancel as CancelIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  MedicalServices as MedicalServicesIcon,
  Note as NoteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const Appointments: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [postponeOpen, setPostponeOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [viewConsultationOpen, setViewConsultationOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAppointmentId, setMenuAppointmentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    providerId: '',
    appointmentDate: '',
    notes: ''
  });
  const [rescheduleData, setRescheduleData] = useState({
    appointmentDate: '',
    notes: ''
  });
  const [consultationData, setConsultationData] = useState({
    notes: '',
    diagnosis: '',
    prescription: '',
    followUpDate: ''
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
        setRescheduleOpen(false);
        setPostponeOpen(false);
        setCancelOpen(false);
        setSelectedAppointment(null);
        setRescheduleData({ appointmentDate: '', notes: '' });
      },
      onError: (error: any) => {
        console.error('Update appointment error:', error);
        console.error('Error response:', error.response?.data);
        const errorMessage = error.response?.data?.message || 'Failed to update appointment';
        alert(errorMessage);
      }
    }
  );

  const { data: consultationNotes } = useQuery(
    ['consultation-notes', selectedAppointment?.id],
    () => api.get(`/consultations?appointmentId=${selectedAppointment?.id}`).then(res => res.data),
    {
      enabled: !!selectedAppointment && (consultationOpen || viewConsultationOpen),
    }
  );

  const createConsultationMutation = useMutation(
    (data: any) => api.post('/consultations', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('appointments');
        queryClient.invalidateQueries(['consultation-notes', selectedAppointment?.id]);
        setConsultationOpen(false);
        setConsultationData({ notes: '', diagnosis: '', prescription: '', followUpDate: '' });
        setSelectedAppointment(null);
      },
      onError: (error: any) => {
        console.error('Create consultation error:', error);
        alert(error.response?.data?.message || 'Failed to create consultation note');
      }
    }
  );

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleStatusChange = (id: string, status: string) => {
    updateMutation.mutate({ id, data: { status } });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, appointment: any) => {
    setAnchorEl(event.currentTarget);
    setMenuAppointmentId(appointment.id);
    setSelectedAppointment(appointment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuAppointmentId(null);
  };

  const handleCancel = (appointment: any) => {
    setSelectedAppointment(appointment);
    setCancelOpen(true);
    handleMenuClose();
  };

  const handlePostpone = (appointment: any) => {
    setSelectedAppointment(appointment);
    const currentDate = new Date(appointment.appointmentDate);
    const futureDate = new Date(currentDate);
    futureDate.setDate(futureDate.getDate() + 7); // Default to 7 days later
    setRescheduleData({
      appointmentDate: futureDate.toISOString().slice(0, 16),
      notes: appointment.notes || ''
    });
    setPostponeOpen(true);
    handleMenuClose();
  };

  const handleReschedule = (appointment: any) => {
    setSelectedAppointment(appointment);
    setRescheduleData({
      appointmentDate: new Date(appointment.appointmentDate).toISOString().slice(0, 16),
      notes: appointment.notes || ''
    });
    setRescheduleOpen(true);
    handleMenuClose();
  };

  const handleConfirmCancel = () => {
    if (selectedAppointment) {
      updateMutation.mutate({ 
        id: selectedAppointment.id, 
        data: { status: 'CANCELLED' } 
      });
    }
  };

  const handleConfirmPostpone = () => {
    if (selectedAppointment && rescheduleData.appointmentDate) {
      const newDate = new Date(rescheduleData.appointmentDate);
      const currentDate = new Date(selectedAppointment.appointmentDate);
      
      if (newDate <= currentDate) {
        alert('Postponed date must be later than the current appointment date');
        return;
      }

      updateMutation.mutate({ 
        id: selectedAppointment.id, 
        data: { 
          appointmentDate: rescheduleData.appointmentDate,
          notes: rescheduleData.notes
        } 
      });
    }
  };

  const handleConfirmReschedule = () => {
    if (selectedAppointment && rescheduleData.appointmentDate) {
      updateMutation.mutate({ 
        id: selectedAppointment.id, 
        data: { 
          appointmentDate: rescheduleData.appointmentDate,
          notes: rescheduleData.notes
        } 
      });
    }
  };

  const handleStartConsultation = (appointment: any) => {
    setSelectedAppointment(appointment);
    setConsultationOpen(true);
  };

  const handleViewConsultation = (appointment: any) => {
    setSelectedAppointment(appointment);
    setViewConsultationOpen(true);
  };

  const handleCreateConsultation = () => {
    if (!selectedAppointment || !consultationData.notes) {
      alert('Please provide consultation notes');
      return;
    }
    createConsultationMutation.mutate({
      appointmentId: selectedAppointment.id,
      ...consultationData,
      followUpDate: consultationData.followUpDate || undefined
    });
  };

  const canModifyAppointment = (appointment: any) => {
    if (appointment.status === 'COMPLETED' || appointment.status === 'CANCELLED') {
      return false;
    }
    return true;
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
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
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
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
                            {canModifyAppointment(appointment) && (
                              <IconButton
                                size="small"
                                onClick={(e) => handleMenuOpen(e, appointment)}
                                sx={{
                                  color: '#64748b',
                                  '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                  },
                                }}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            )}
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
                                  : appointment.status === 'CANCELLED'
                                  ? 'rgba(239, 68, 68, 0.1)'
                                  : 'rgba(100, 116, 139, 0.1)',
                              color:
                                appointment.status === 'CONFIRMED'
                                  ? '#059669'
                                  : appointment.status === 'PENDING'
                                  ? '#d97706'
                                  : appointment.status === 'CANCELLED'
                                  ? '#ef4444'
                                  : '#64748b',
                              fontWeight: 600,
                              fontSize: '0.8125rem',
                              mt: 1,
                              mb: 2,
                            }}
                          >
                            {appointment.status}
                          </Box>
                        </Box>
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
                      <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {user?.role === 'HEALTHCARE_PROVIDER' && appointment.status === 'PENDING' && (
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
                            Confirm
                          </Button>
                        )}
                        {user?.role === 'HEALTHCARE_PROVIDER' && appointment.status === 'CONFIRMED' && (
                          <>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<MedicalServicesIcon />}
                              onClick={() => handleStartConsultation(appointment)}
                              sx={{
                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                fontWeight: 600,
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                },
                              }}
                            >
                              Start Consultation
                            </Button>
                            {appointment.consultationNotes && appointment.consultationNotes.length > 0 && (
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<VisibilityIcon />}
                                onClick={() => handleViewConsultation(appointment)}
                                sx={{
                                  fontWeight: 600,
                                }}
                              >
                                View Consultation Notes
                              </Button>
                            )}
                          </>
                        )}
                        {appointment.status === 'COMPLETED' && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<NoteIcon />}
                            onClick={() => handleViewConsultation(appointment)}
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            View Consultation Notes
                          </Button>
                        )}
                      </Box>
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

          {/* Action Menu - Single menu for all appointments */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                borderRadius: 2,
                minWidth: 200,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            {selectedAppointment && (
              <>
                <MenuItem
                  onClick={() => handleReschedule(selectedAppointment)}
                  sx={{ py: 1.5 }}
                >
                  <ScheduleIcon sx={{ mr: 1.5, fontSize: 20, color: '#2563eb' }} />
                  Reschedule
                </MenuItem>
                <MenuItem
                  onClick={() => handlePostpone(selectedAppointment)}
                  sx={{ py: 1.5 }}
                >
                  <EventIcon sx={{ mr: 1.5, fontSize: 20, color: '#f59e0b' }} />
                  Postpone
                </MenuItem>
                <MenuItem
                  onClick={() => handleCancel(selectedAppointment)}
                  sx={{ py: 1.5, color: '#ef4444' }}
                >
                  <CancelIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  Cancel
                </MenuItem>
              </>
            )}
          </Menu>

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

          {/* Reschedule Dialog */}
          <Dialog
            open={rescheduleOpen}
            onClose={() => setRescheduleOpen(false)}
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
              Reschedule Appointment
            </DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Current appointment: {selectedAppointment && new Date(selectedAppointment.appointmentDate).toLocaleString()}
              </Typography>
              <TextField
                fullWidth
                type="datetime-local"
                label="New Date & Time"
                sx={{ mt: 1 }}
                value={rescheduleData.appointmentDate}
                onChange={(e) => setRescheduleData({ ...rescheduleData, appointmentDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes (optional)"
                sx={{ mt: 2 }}
                value={rescheduleData.notes}
                onChange={(e) => setRescheduleData({ ...rescheduleData, notes: e.target.value })}
                placeholder="Add any notes about the rescheduling..."
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={() => setRescheduleOpen(false)}
                sx={{
                  color: '#64748b',
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmReschedule}
                variant="contained"
                disabled={!rescheduleData.appointmentDate}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  },
                }}
              >
                Reschedule
              </Button>
            </DialogActions>
          </Dialog>

          {/* Postpone Dialog */}
          <Dialog
            open={postponeOpen}
            onClose={() => setPostponeOpen(false)}
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
              Postpone Appointment
            </DialogTitle>
            <DialogContent>
              <Alert severity="info" sx={{ mb: 2 }}>
                Postponing will move your appointment to a later date. The new date must be after the current appointment date.
              </Alert>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Current appointment: {selectedAppointment && new Date(selectedAppointment.appointmentDate).toLocaleString()}
              </Typography>
              <TextField
                fullWidth
                type="datetime-local"
                label="New Date & Time (must be later)"
                sx={{ mt: 1 }}
                value={rescheduleData.appointmentDate}
                onChange={(e) => setRescheduleData({ ...rescheduleData, appointmentDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Reason for Postponement (optional)"
                sx={{ mt: 2 }}
                value={rescheduleData.notes}
                onChange={(e) => setRescheduleData({ ...rescheduleData, notes: e.target.value })}
                placeholder="Why are you postponing this appointment?"
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={() => setPostponeOpen(false)}
                sx={{
                  color: '#64748b',
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmPostpone}
                variant="contained"
                disabled={!rescheduleData.appointmentDate}
                sx={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                  },
                }}
              >
                Postpone
              </Button>
            </DialogActions>
          </Dialog>

          {/* Cancel Dialog */}
          <Dialog
            open={cancelOpen}
            onClose={() => setCancelOpen(false)}
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
              Cancel Appointment
            </DialogTitle>
            <DialogContent>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Are you sure you want to cancel this appointment? This action cannot be undone.
              </Alert>
              <Box sx={{ p: 2, backgroundColor: '#f1f5f9', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Provider:</strong> {selectedAppointment && 
                    (user?.role === 'PATIENT' 
                      ? `Dr. ${selectedAppointment.provider.firstName} ${selectedAppointment.provider.lastName}`
                      : `${selectedAppointment.patient.firstName} ${selectedAppointment.patient.lastName}`)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Date & Time:</strong> {selectedAppointment && new Date(selectedAppointment.appointmentDate).toLocaleString()}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={() => setCancelOpen(false)}
                sx={{
                  color: '#64748b',
                  fontWeight: 500,
                }}
              >
                Keep Appointment
              </Button>
              <Button
                onClick={handleConfirmCancel}
                variant="contained"
                color="error"
                sx={{
                  fontWeight: 600,
                }}
              >
                Cancel Appointment
              </Button>
            </DialogActions>
          </Dialog>

          {/* Start Consultation Dialog */}
          <Dialog
            open={consultationOpen}
            onClose={() => {
              setConsultationOpen(false);
              setConsultationData({ notes: '', diagnosis: '', prescription: '', followUpDate: '' });
              setSelectedAppointment(null);
            }}
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
              Start Consultation
            </DialogTitle>
            <DialogContent>
              {selectedAppointment && (
                <Box sx={{ mb: 3, p: 2, backgroundColor: '#f1f5f9', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Patient Information
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                    <strong>Patient:</strong> {selectedAppointment.patient.firstName} {selectedAppointment.patient.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                    <strong>Appointment Date:</strong> {new Date(selectedAppointment.appointmentDate).toLocaleString()}
                  </Typography>
                  {selectedAppointment.notes && (
                    <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
                      <strong>Notes:</strong> {selectedAppointment.notes}
                    </Typography>
                  )}
                </Box>
              )}
              <TextField
                fullWidth
                label="Consultation Notes *"
                value={consultationData.notes}
                onChange={(e) => setConsultationData({ ...consultationData, notes: e.target.value })}
                multiline
                rows={6}
                sx={{ mt: 1 }}
                placeholder="Enter examination findings, patient complaints, observations..."
                required
              />
              <TextField
                fullWidth
                label="Diagnosis (Optional)"
                value={consultationData.diagnosis}
                onChange={(e) => setConsultationData({ ...consultationData, diagnosis: e.target.value })}
                sx={{ mt: 2 }}
                placeholder="Enter diagnosis..."
              />
              <TextField
                fullWidth
                label="Prescription (Optional)"
                value={consultationData.prescription}
                onChange={(e) => setConsultationData({ ...consultationData, prescription: e.target.value })}
                multiline
                rows={3}
                sx={{ mt: 2 }}
                placeholder="Enter medications, dosage, instructions..."
              />
              <TextField
                fullWidth
                type="datetime-local"
                label="Follow-up Date (Optional)"
                value={consultationData.followUpDate}
                onChange={(e) => setConsultationData({ ...consultationData, followUpDate: e.target.value })}
                sx={{ mt: 2 }}
                InputLabelProps={{ shrink: true }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={() => {
                  setConsultationOpen(false);
                  setConsultationData({ notes: '', diagnosis: '', prescription: '', followUpDate: '' });
                  setSelectedAppointment(null);
                }}
                sx={{
                  color: '#64748b',
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateConsultation}
                variant="contained"
                disabled={!consultationData.notes || createConsultationMutation.isLoading}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  },
                }}
              >
                {createConsultationMutation.isLoading ? <CircularProgress size={24} /> : 'Complete Consultation'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* View Consultation Notes Dialog */}
          <Dialog
            open={viewConsultationOpen}
            onClose={() => {
              setViewConsultationOpen(false);
              setSelectedAppointment(null);
            }}
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
              Consultation Notes
            </DialogTitle>
            <DialogContent>
              {selectedAppointment && (
                <Box sx={{ mb: 3, p: 2, backgroundColor: '#f1f5f9', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Appointment Information
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                    <strong>Patient:</strong> {selectedAppointment.patient.firstName} {selectedAppointment.patient.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                    <strong>Date:</strong> {new Date(selectedAppointment.appointmentDate).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    <strong>Status:</strong> {selectedAppointment.status}
                  </Typography>
                </Box>
              )}
              {consultationNotes && consultationNotes.length > 0 ? (
                <Box>
                  {consultationNotes.map((note: any, index: number) => (
                    <Card key={note.id} sx={{ mb: 2, border: '1px solid #e2e8f0' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Consultation #{index + 1}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            {new Date(note.createdAt).toLocaleString()}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: '#64748b' }}>
                            Notes:
                          </Typography>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                            {note.notes}
                          </Typography>
                        </Box>
                        {note.diagnosis && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: '#64748b' }}>
                              Diagnosis:
                            </Typography>
                            <Typography variant="body2">{note.diagnosis}</Typography>
                          </Box>
                        )}
                        {note.prescription && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: '#64748b' }}>
                              Prescription:
                            </Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                              {note.prescription}
                            </Typography>
                          </Box>
                        )}
                        {note.followUpDate && (
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, color: '#64748b' }}>
                              Follow-up Date:
                            </Typography>
                            <Typography variant="body2">
                              {new Date(note.followUpDate).toLocaleString()}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <NoteIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                  <Typography variant="body1" sx={{ color: '#64748b' }}>
                    No consultation notes available for this appointment.
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={() => {
                  setViewConsultationOpen(false);
                  setSelectedAppointment(null);
                }}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Layout>
  );
};

export default Appointments;

