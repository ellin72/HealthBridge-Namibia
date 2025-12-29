import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  History as HistoryIcon,
  Analytics as AnalyticsIcon,
  Add as AddIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TelehealthPro: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [formData, setFormData] = useState({
    appointmentId: '',
    provider: 'ZOOM',
    meetingUrl: '',
    meetingId: '',
    meetingPassword: ''
  });

  const { data: appointments } = useQuery(
    'appointments',
    () => api.get('/appointments').then(res => res.data),
    { enabled: !!user }
  );

  const { data: analytics, isLoading: analyticsLoading } = useQuery(
    'provider-analytics',
    () => api.get('/telehealth-pro/analytics').then(res => res.data),
    { enabled: !!user && (user?.role === 'HEALTHCARE_PROVIDER' || user?.role === 'ADMIN') }
  );

  const { data: patientHistory } = useQuery(
    ['patient-history', user?.id],
    () => api.get(`/telehealth-pro/patient-history/${user?.id}`).then(res => res.data),
    { enabled: !!user && user?.role === 'PATIENT' }
  );

  const createVideoMutation = useMutation(
    (data: any) => api.post('/telehealth-pro/video-consultations', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('appointments');
        setVideoDialogOpen(false);
        setFormData({
          appointmentId: '',
          provider: 'ZOOM',
          meetingUrl: '',
          meetingId: '',
          meetingPassword: ''
        });
      }
    }
  );

  const createHistoryMutation = useMutation(
    (data: any) => api.post('/telehealth-pro/patient-history', { ...data, patientId: user?.id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['patient-history', user?.id]);
        setHistoryDialogOpen(false);
      }
    }
  );

  const handleCreateVideo = () => {
    createVideoMutation.mutate(formData);
  };

  const handleCreateHistory = (historyData: any) => {
    createHistoryMutation.mutate(historyData);
  };

  const upcomingAppointments = appointments?.filter((a: any) => 
    a.status === 'PENDING' || a.status === 'CONFIRMED'
  ) || [];

  return (
    <Layout>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              Telehealth Pro
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Manage video consultations, patient history, and analytics
            </Typography>
          </Box>

          <Card sx={{ mb: 3 }}>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
              <Tab icon={<VideoCallIcon />} label="Video Consultations" />
              <Tab icon={<HistoryIcon />} label="Patient History" />
              {(user?.role === 'HEALTHCARE_PROVIDER' || user?.role === 'ADMIN') && (
                <Tab icon={<AnalyticsIcon />} label="Analytics" />
              )}
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Video Consultations</Typography>
                {(user?.role === 'HEALTHCARE_PROVIDER' || user?.role === 'ADMIN') && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setVideoDialogOpen(true)}
                  >
                    Create Video Consultation
                  </Button>
                )}
              </Box>

              <Grid container spacing={3}>
                {upcomingAppointments.map((appointment: any) => (
                  <Grid item xs={12} md={6} key={appointment.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {user?.role === 'PATIENT' 
                            ? `Dr. ${appointment.provider.firstName} ${appointment.provider.lastName}`
                            : `${appointment.patient.firstName} ${appointment.patient.lastName}`
                          }
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {new Date(appointment.appointmentDate).toLocaleString()}
                        </Typography>
                        {appointment.videoConsultation ? (
                          <Box sx={{ mt: 2 }}>
                            <Button
                              variant="contained"
                              fullWidth
                              href={appointment.videoConsultation.meetingUrl}
                              target="_blank"
                            >
                              Join Video Call
                            </Button>
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                              Meeting ID: {appointment.videoConsultation.meetingId || 'N/A'}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No video consultation scheduled
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Patient History</Typography>
                {user?.role === 'PATIENT' && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setHistoryDialogOpen(true)}
                  >
                    Add History Entry
                  </Button>
                )}
              </Box>

              {patientHistory?.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Medical History</TableCell>
                        <TableCell>Allergies</TableCell>
                        <TableCell>Medications</TableCell>
                        <TableCell>Notes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {patientHistory.map((history: any) => (
                        <TableRow key={history.id}>
                          <TableCell>{new Date(history.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>{history.medicalHistory ? 'Yes' : 'No'}</TableCell>
                          <TableCell>
                            {history.allergies ? JSON.parse(history.allergies).join(', ') : 'None'}
                          </TableCell>
                          <TableCell>
                            {history.medications ? JSON.parse(history.medications).join(', ') : 'None'}
                          </TableCell>
                          <TableCell>{history.notes || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">No patient history records found.</Alert>
              )}
            </TabPanel>

            {(user?.role === 'HEALTHCARE_PROVIDER' || user?.role === 'ADMIN') && (
              <TabPanel value={tabValue} index={2}>
                <Typography variant="h6" gutterBottom>Provider Analytics</Typography>
                {analyticsLoading ? (
                  <CircularProgress />
                ) : analytics ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4">{analytics.totalAppointments}</Typography>
                          <Typography variant="body2" color="text.secondary">Total Appointments</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4">{analytics.completedAppointments}</Typography>
                          <Typography variant="body2" color="text.secondary">Completed</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4">{analytics.videoConsultations}</Typography>
                          <Typography variant="body2" color="text.secondary">Video Consultations</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card>
                        <CardContent>
                          <Typography variant="h4">{analytics.completionRate}</Typography>
                          <Typography variant="body2" color="text.secondary">Completion Rate</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                ) : null}
              </TabPanel>
            )}
          </Card>
        </Container>
      </Box>

      {/* Create Video Consultation Dialog */}
      <Dialog open={videoDialogOpen} onClose={() => setVideoDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Video Consultation</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
            <InputLabel>Appointment</InputLabel>
            <Select
              value={formData.appointmentId}
              onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })}
            >
              {upcomingAppointments.map((apt: any) => (
                <MenuItem key={apt.id} value={apt.id}>
                  {new Date(apt.appointmentDate).toLocaleString()} - {apt.patient.firstName} {apt.patient.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Provider</InputLabel>
            <Select
              value={formData.provider}
              onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
            >
              <MenuItem value="ZOOM">Zoom</MenuItem>
              <MenuItem value="GOOGLE_MEET">Google Meet</MenuItem>
              <MenuItem value="CUSTOM">Custom</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Meeting URL"
            value={formData.meetingUrl}
            onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Meeting ID (Optional)"
            value={formData.meetingId}
            onChange={(e) => setFormData({ ...formData, meetingId: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Meeting Password (Optional)"
            value={formData.meetingPassword}
            onChange={(e) => setFormData({ ...formData, meetingPassword: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVideoDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateVideo} variant="contained" disabled={!formData.appointmentId || !formData.meetingUrl}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create History Dialog */}
      <Dialog open={historyDialogOpen} onClose={() => setHistoryDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Patient History Entry</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Medical History"
            multiline
            rows={4}
            sx={{ mb: 2, mt: 2 }}
          />
          <TextField
            fullWidth
            label="Allergies (comma-separated)"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Medications (comma-separated)"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => handleCreateHistory({})} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default TelehealthPro;

