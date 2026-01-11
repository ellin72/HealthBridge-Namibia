import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import PatientDashboard from '../components/dashboards/PatientDashboard';
import ProviderDashboard from '../components/dashboards/ProviderDashboard';
import CoachDashboard from '../components/dashboards/CoachDashboard';
import StudentDashboard from '../components/dashboards/StudentDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Route to role-based dashboard
  // Note: Role-based dashboards render their own content, Layout is already applied in App.tsx
  switch (user.role) {
    case 'PATIENT':
      return <PatientDashboard />;
    case 'HEALTHCARE_PROVIDER':
      return <ProviderDashboard />;
    case 'WELLNESS_COACH':
      return <CoachDashboard />;
    case 'STUDENT':
      return <StudentDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    default:
      return <PatientDashboard />;
  }
};

export default Dashboard;
