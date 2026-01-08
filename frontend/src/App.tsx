import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import SelectProvider from './pages/SelectProvider';
import TelehealthPro from './pages/TelehealthPro';
import WellnessHub from './pages/WellnessHub';
import WellnessTools from './pages/WellnessTools';
import LearningZone from './pages/LearningZone';
import ResearchSupport from './pages/ResearchSupport';
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';
import SymptomChecker from './pages/SymptomChecker';
import Billing from './pages/Billing';
import ClinicalTemplates from './pages/ClinicalTemplates';
import Prescriptions from './pages/Prescriptions';
import UserGuide from './pages/UserGuide';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import APIDocumentation from './pages/APIDocumentation';
import Surveys from './pages/Surveys';
import Policies from './pages/Policies';
import MedicalAid from './pages/MedicalAid';
import Payments from './pages/Payments';
import Monitoring from './pages/Monitoring';
import ProviderEarnings from './pages/ProviderEarnings';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1e40af',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    success: {
      main: '#10b981',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
    info: {
      main: '#3b82f6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '0.9375rem',
        },
        contained: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/select-provider"
              element={
                <PrivateRoute>
                  <SelectProvider />
                </PrivateRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <PrivateRoute>
                  <Appointments />
                </PrivateRoute>
              }
            />
            <Route
              path="/telehealth-pro"
              element={
                <PrivateRoute>
                  <TelehealthPro />
                </PrivateRoute>
              }
            />
            <Route
              path="/wellness"
              element={
                <PrivateRoute>
                  <WellnessHub />
                </PrivateRoute>
              }
            />
            <Route
              path="/wellness-tools"
              element={
                <PrivateRoute>
                  <WellnessTools />
                </PrivateRoute>
              }
            />
            <Route
              path="/learning"
              element={
                <PrivateRoute>
                  <LearningZone />
                </PrivateRoute>
              }
            />
            <Route
              path="/research"
              element={
                <PrivateRoute>
                  <ResearchSupport />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <UserManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/symptom-checker"
              element={
                <PrivateRoute>
                  <SymptomChecker />
                </PrivateRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <PrivateRoute>
                  <Billing />
                </PrivateRoute>
              }
            />
            <Route
              path="/clinical-templates"
              element={
                <PrivateRoute>
                  <ClinicalTemplates />
                </PrivateRoute>
              }
            />
            <Route
              path="/clinical-templates/:id"
              element={
                <PrivateRoute>
                  <ClinicalTemplates />
                </PrivateRoute>
              }
            />
            <Route
              path="/prescriptions"
              element={
                <PrivateRoute>
                  <Prescriptions />
                </PrivateRoute>
              }
            />
            <Route path="/docs/user-guide" element={<UserGuide />} />
            <Route path="/docs/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/docs/terms-of-service" element={<TermsOfService />} />
            <Route path="/docs/api" element={<APIDocumentation />} />
            <Route
              path="/surveys"
              element={
                <PrivateRoute>
                  <Surveys />
                </PrivateRoute>
              }
            />
            <Route
              path="/policies"
              element={
                <PrivateRoute>
                  <Policies />
                </PrivateRoute>
              }
            />
            <Route
              path="/medical-aid"
              element={
                <PrivateRoute>
                  <MedicalAid />
                </PrivateRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <PrivateRoute>
                  <Payments />
                </PrivateRoute>
              }
            />
            <Route
              path="/monitoring"
              element={
                <PrivateRoute>
                  <Monitoring />
                </PrivateRoute>
              }
            />
            <Route
              path="/provider-earnings"
              element={
                <PrivateRoute>
                  <ProviderEarnings />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

