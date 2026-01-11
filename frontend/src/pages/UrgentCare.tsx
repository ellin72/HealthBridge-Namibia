import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  MedicalServices as EmergencyIcon,
  AccessTime as AccessTimeIcon,
  LocalHospital as HospitalIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const UrgentCare: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    symptoms: '',
    urgency: 'MEDIUM',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post('/urgent-care/request', {
        ...formData,
        patientId: user?.id,
      });
      setSubmitted(true);
      setOpen(false);
      setFormData({ symptoms: '', urgency: 'MEDIUM', description: '' });
    } catch (error: any) {
      console.error('Error submitting urgent care request:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <EmergencyIcon sx={{ fontSize: 48, color: '#ef4444' }} />
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Urgent Care
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b' }}>
                24/7 access to general practitioners
              </Typography>
            </Box>
          </Box>
        </Box>

        {submitted && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSubmitted(false)}>
            Your urgent care request has been submitted. A provider will contact you shortly.
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Request Urgent Care
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                  Submit your symptoms and urgency level. Our 24/7 team of general practitioners will
                  respond based on priority.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<EmergencyIcon />}
                  onClick={() => setOpen(true)}
                  sx={{
                    backgroundColor: '#ef4444',
                    '&:hover': { backgroundColor: '#dc2626' },
                  }}
                >
                  Request Care Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  How It Works
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <CheckCircleIcon sx={{ color: '#10b981', mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Submit Your Request
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Describe your symptoms and select urgency level
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <CheckCircleIcon sx={{ color: '#10b981', mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Provider Review
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        A general practitioner reviews your request based on priority
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <CheckCircleIcon sx={{ color: '#10b981', mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Connect & Consult
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Video consultation or in-person visit scheduled
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <AccessTimeIcon sx={{ color: '#2563eb' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Available 24/7
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Our urgent care service is available around the clock for your healthcare needs.
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <HospitalIcon sx={{ color: '#10b981' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    General Practitioners
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Experienced GPs ready to address your urgent healthcare concerns.
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Emergency?
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                  For life-threatening emergencies, call emergency services immediately.
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<PhoneIcon />}
                  fullWidth
                  href="tel:10111"
                  sx={{ borderColor: '#ef4444', color: '#ef4444' }}
                >
                  Call Emergency: 10111
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Request Urgent Care</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TextField
                label="Symptoms"
                multiline
                rows={3}
                fullWidth
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                placeholder="Describe your symptoms..."
              />
              <TextField
                select
                label="Urgency Level"
                fullWidth
                SelectProps={{ native: true }}
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
              >
                <option value="LOW">Low - Can wait a few hours</option>
                <option value="MEDIUM">Medium - Should be seen today</option>
                <option value="HIGH">High - Needs attention soon</option>
                <option value="URGENT">Urgent - Needs immediate attention</option>
                <option value="EMERGENCY">Emergency - Life-threatening</option>
              </TextField>
              <TextField
                label="Additional Details"
                multiline
                rows={3}
                fullWidth
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Any additional information..."
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading || !formData.symptoms}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{ backgroundColor: '#ef4444', '&:hover': { backgroundColor: '#dc2626' } }}
            >
              Submit Request
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default UrgentCare;
