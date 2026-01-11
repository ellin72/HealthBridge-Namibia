import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  InputAdornment,
  Divider,
  Stack,
  LinearProgress,
  alpha
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import LogoIcon from '../components/LogoIcon';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'PATIENT' // Default to PATIENT, only PATIENT and STUDENT available for public signup
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.1,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh', py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            gap: 4,
            position: 'relative',
            zIndex: 1,
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          {/* Left Side - Welcome Section */}
          <Box
            sx={{
              flex: 1,
              display: { xs: 'none', lg: 'flex' },
              flexDirection: 'column',
              justifyContent: 'center',
              color: 'white',
              pr: 4,
            }}
          >
            <Box sx={{ mb: 4 }}>
              <LogoIcon fontSize={64} sx={{ mb: 2, filter: 'brightness(0) invert(1)' }} />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  mb: 2,
                  fontSize: { lg: '2.5rem', xl: '3rem' },
                  lineHeight: 1.2,
                }}
              >
                Join HealthBridge Today
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  fontWeight: 400,
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Start your journey to better health. Get access to telehealth services, wellness programs, and comprehensive healthcare resources.
              </Typography>
            </Box>
            <Stack spacing={2}>
              {[
                'Instant Access to Healthcare Providers',
                'Personalized Wellness Plans',
                'Secure Health Records Management',
                '24/7 Telehealth Services',
              ].map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <CheckCircleIcon sx={{ fontSize: 24, opacity: 0.9 }} />
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Right Side - Register Form */}
          <Box sx={{ flex: { xs: 1, lg: '0 0 520px' }, display: 'flex', alignItems: 'center' }}>
            <Paper
            elevation={24}
            sx={{
              padding: { xs: 3, sm: 5 },
              width: '100%',
              borderRadius: 4,
              backgroundColor: 'white',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              },
              }}
            >
              {/* Back Button */}
              <IconButton
                onClick={() => navigate('/')}
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  color: '#64748b',
                  '&:hover': {
                    backgroundColor: alpha('#667eea', 0.1),
                    color: '#667eea',
                  },
                }}
              >
                <ArrowBackIcon />
              </IconButton>

              <Box sx={{ textAlign: 'center', mb: 4, mt: { xs: 0, sm: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <LogoIcon fontSize={64} />
                </Box>
                <Typography
                  component="h1"
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                    fontSize: { xs: '1.75rem', sm: '2rem' },
                  }}
                >
                  Create Your Account
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#64748b',
                    fontWeight: 400,
                  }}
                >
                  Join HealthBridge and start your health journey
                </Typography>
              </Box>
            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                }}
              >
                {error}
              </Alert>
            )}
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        name="firstName"
                        autoFocus
                        value={formData.firstName}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: '#94a3b8' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: '#f8fafc',
                            transition: 'all 0.2s',
                            '&:hover': {
                              backgroundColor: '#f1f5f9',
                              '& fieldset': {
                                borderColor: '#667eea',
                              },
                            },
                            '&.Mui-focused': {
                              backgroundColor: 'white',
                              '& fieldset': {
                                borderColor: '#667eea',
                                borderWidth: 2,
                              },
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: '#94a3b8' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor: '#f8fafc',
                            transition: 'all 0.2s',
                            '&:hover': {
                              backgroundColor: '#f1f5f9',
                              '& fieldset': {
                                borderColor: '#667eea',
                              },
                            },
                            '&.Mui-focused': {
                              backgroundColor: 'white',
                              '& fieldset': {
                                borderColor: '#667eea',
                                borderWidth: 2,
                              },
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#94a3b8' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f8fafc',
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: '#f1f5f9',
                          '& fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                          '& fieldset': {
                            borderColor: '#667eea',
                            borderWidth: 2,
                          },
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    id="phone"
                    label="Phone Number (Optional)"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: '#94a3b8' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f8fafc',
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: '#f1f5f9',
                          '& fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                          '& fieldset': {
                            borderColor: '#667eea',
                            borderWidth: 2,
                          },
                        },
                      },
                    }}
                  />
                  <Box>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              size="small"
                              sx={{ color: '#94a3b8' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: '#f8fafc',
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: '#f1f5f9',
                            '& fieldset': {
                              borderColor: '#667eea',
                            },
                          },
                          '&.Mui-focused': {
                            backgroundColor: 'white',
                            '& fieldset': {
                              borderColor: '#667eea',
                              borderWidth: 2,
                            },
                          },
                        },
                      }}
                    />
                    {formData.password && (
                      <Box sx={{ mt: 1.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            Password Strength
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: strengthColors[passwordStrength - 1] || '#64748b',
                              fontWeight: 600,
                            }}
                          >
                            {strengthLabels[passwordStrength - 1] || 'Weak'}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(passwordStrength / 4) * 100}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#e2e8f0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: strengthColors[passwordStrength - 1] || '#ef4444',
                            },
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                  <FormControl
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f8fafc',
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: '#f1f5f9',
                          '& fieldset': {
                            borderColor: '#667eea',
                          },
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                          '& fieldset': {
                            borderColor: '#667eea',
                            borderWidth: 2,
                          },
                        },
                      },
                    }}
                  >
                    <InputLabel>I am a...</InputLabel>
                    <Select
                      value={formData.role}
                      label="I am a..."
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      startAdornment={
                        formData.role === 'STUDENT' ? (
                          <InputAdornment position="start" sx={{ ml: 1 }}>
                            <SchoolIcon sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ) : null
                      }
                    >
                      <MenuItem value="PATIENT">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon sx={{ fontSize: 20, color: '#94a3b8' }} />
                          Patient
                        </Box>
                      </MenuItem>
                      <MenuItem value="STUDENT">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SchoolIcon sx={{ fontSize: 20, color: '#94a3b8' }} />
                          Student
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748b',
                      display: 'block',
                      fontStyle: 'italic',
                      fontSize: '0.75rem',
                    }}
                  >
                    Healthcare Providers and Wellness Coaches must be added by an administrator
                  </Typography>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading || !formData.firstName || !formData.lastName || !formData.email || !formData.password}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.75,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                        boxShadow: '0 8px 20px 0 rgba(102, 126, 234, 0.5)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: '#cbd5e1',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                  
                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" sx={{ color: '#94a3b8', px: 2 }}>
                      OR
                    </Typography>
                  </Divider>

                  <Box textAlign="center">
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                      Already have an account?{' '}
                      <Link
                        to="/login"
                        style={{
                          color: '#667eea',
                          fontWeight: 600,
                          textDecoration: 'none',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#5568d3')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#667eea')}
                      >
                        Sign In
                      </Link>
                    </Typography>
                    <Link
                      to="/"
                      style={{
                        color: '#94a3b8',
                        textDecoration: 'none',
                        fontSize: '0.875rem',
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#64748b')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                    >
                      ← Back to Home
                    </Link>
                  </Box>
                </Stack>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;

