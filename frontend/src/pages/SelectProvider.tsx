import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  MedicalServices as MedicalServicesIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const SelectProvider: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: providers, isLoading, error } = useQuery(
    ['providers', searchTerm],
    async () => {
      const params = searchTerm ? { search: searchTerm } : {};
      const response = await api.get('/users/providers', { params });
      return response.data;
    },
    {
      enabled: user?.role === 'PATIENT',
      retry: 1,
    }
  );

  const handleSelectProvider = (provider: any) => {
    // Navigate to appointment booking with provider pre-selected
    navigate('/appointments', {
      state: {
        selectedProvider: provider,
      },
    });
  };

  if (user?.role !== 'PATIENT') {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error">
            Only patients can book appointments. Your role: {user?.role}
          </Alert>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                mb: 1,
              }}
            >
              Choose Your Healthcare Provider
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Select a provider and see their consultation fees before booking
            </Typography>
          </Box>

          {/* Search Bar */}
          <Card sx={{ mb: 4, border: '1px solid #e2e8f0' }}>
            <CardContent>
              <TextField
                fullWidth
                placeholder="Search providers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#64748b' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Providers Grid */}
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 4 }}>
              Failed to load providers. Please try again.
            </Alert>
          ) : providers && providers.length > 0 ? (
            <Grid container spacing={3}>
              {providers.map((provider: any) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={provider.id}>
                  <Card
                    sx={{
                      height: '100%',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease-in-out',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        borderColor: '#667eea',
                      },
                    }}
                    onClick={() => handleSelectProvider(provider)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            mb: 2,
                            fontSize: '2rem',
                            fontWeight: 600,
                          }}
                        >
                          {provider.firstName[0]}{provider.lastName[0]}
                        </Avatar>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: '#1e293b',
                            textAlign: 'center',
                            mb: 0.5,
                          }}
                        >
                          Dr. {provider.firstName} {provider.lastName}
                        </Typography>
                        <Chip
                          label="Healthcare Provider"
                          size="small"
                          icon={<MedicalServicesIcon />}
                          sx={{
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            color: '#667eea',
                            fontWeight: 500,
                          }}
                        />
                      </Box>

                      {/* Provider Fee - Prominently Displayed */}
                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                          borderRadius: 2,
                          border: '2px solid #bae6fd',
                          mb: 2,
                          textAlign: 'center',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 0.5 }}>
                          <MoneyIcon sx={{ fontSize: 24, color: '#2563eb' }} />
                          <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e40af', textTransform: 'uppercase' }}>
                            Consultation Fee
                          </Typography>
                        </Box>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            color: '#1e293b',
                            mb: 0.5,
                          }}
                        >
                          {provider.currency} {provider.consultationFee.toFixed(2)}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          per appointment
                        </Typography>
                      </Box>

                      {/* Contact Information */}
                      <Box sx={{ mb: 2 }}>
                        {provider.email && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <EmailIcon sx={{ fontSize: 16, color: '#64748b' }} />
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8125rem' }}>
                              {provider.email}
                            </Typography>
                          </Box>
                        )}
                        {provider.phone && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PhoneIcon sx={{ fontSize: 16, color: '#64748b' }} />
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.8125rem' }}>
                              {provider.phone}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Service Fees if available */}
                      {provider.serviceFees && Object.keys(provider.serviceFees).length > 0 && (
                        <Box sx={{ mb: 2, p: 1.5, backgroundColor: '#f8fafc', borderRadius: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b', display: 'block', mb: 0.5 }}>
                            Additional Services:
                          </Typography>
                          {Object.entries(provider.serviceFees).map(([service, fee]: [string, any]) => (
                            <Box key={service} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption" sx={{ color: '#64748b' }}>
                                {service}:
                              </Typography>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                {provider.currency} {fee.toFixed(2)}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {/* Select Button */}
                      <Button
                        fullWidth
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          fontWeight: 600,
                          py: 1.5,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectProvider(provider);
                        }}
                      >
                        Book Appointment
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card sx={{ p: 6, textAlign: 'center' }}>
              <PersonIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                No providers found
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'No healthcare providers are currently available. Please check back later.'}
              </Typography>
            </Card>
          )}
        </Container>
      </Box>
    </Layout>
  );
};

export default SelectProvider;

