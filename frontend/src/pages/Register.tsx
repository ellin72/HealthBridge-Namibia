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
  Grid
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

// Import logo - Place logo in public folder as /healthbridge-logo.png
// Or use: import logoPath from '../assets/images/healthbridge-logo.png';
const logoPath = '/healthbridge-logo.png';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'PATIENT'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

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
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        py: 4,
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
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Paper
            elevation={24}
            sx={{
              padding: { xs: 3, sm: 5 },
              width: '100%',
              borderRadius: 4,
              backgroundColor: 'white',
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                component="img"
                src={logoPath}
                alt="HealthBridge Logo"
                onError={(e: any) => {
                  e.target.style.display = 'none';
                }}
                sx={{
                  height: 80,
                  width: 'auto',
                  objectFit: 'contain',
                  mb: 2,
                  mx: 'auto',
                }}
              />
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Create Account
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#64748b',
                }}
              >
                Join HealthBridge Namibia today
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#2563eb',
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: '#2563eb',
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#2563eb',
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                fullWidth
                id="phone"
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#2563eb',
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#2563eb',
                    },
                  },
                }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  label="Role"
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <MenuItem value="PATIENT">Patient</MenuItem>
                  <MenuItem value="HEALTHCARE_PROVIDER">Healthcare Provider</MenuItem>
                  <MenuItem value="WELLNESS_COACH">Wellness Coach</MenuItem>
                  <MenuItem value="STUDENT">Student</MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  },
                }}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
              <Box textAlign="center">
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#2563eb',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Already have an account? Sign In
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;

