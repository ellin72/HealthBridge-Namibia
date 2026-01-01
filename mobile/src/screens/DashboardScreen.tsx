import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, FAB } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

const DashboardScreen: React.FC = ({ navigation }: any) => {
  const { user } = useAuth();

  const getQuickActions = () => {
    if (!user) return [];

    switch (user.role) {
      case 'PATIENT':
        return [
          { label: 'Appointments', screen: 'Appointments' },
          { label: 'Wellness Hub', screen: 'Wellness' },
          { label: 'Wellness Tools', screen: 'Wellness' },
          { label: 'Learning Zone', screen: 'Learning' },
        ];
      case 'HEALTHCARE_PROVIDER':
        return [
          { label: 'Appointments', screen: 'Appointments' },
          { label: 'Telehealth Pro', screen: 'Appointments' },
          { label: 'Billing', screen: 'Appointments' },
          { label: 'Learning Zone', screen: 'Learning' },
        ];
      case 'WELLNESS_COACH':
        return [
          { label: 'Wellness Hub', screen: 'Wellness' },
          { label: 'Wellness Tools', screen: 'Wellness' },
        ];
      case 'STUDENT':
        return [
          { label: 'Learning Zone', screen: 'Learning' },
          { label: 'Research Support', screen: 'Learning' },
        ];
      case 'ADMIN':
        return [
          { label: 'Appointments', screen: 'Appointments' },
          { label: 'Wellness Hub', screen: 'Wellness' },
          { label: 'Learning Zone', screen: 'Learning' },
          { label: 'User Management', screen: 'Profile' },
        ];
      default:
        return [];
    }
  };

  const getRoleDescription = () => {
    if (!user) return 'HealthBridge Dashboard';
    
    switch (user.role) {
      case 'PATIENT':
        return 'Manage your health appointments, wellness, and learning';
      case 'HEALTHCARE_PROVIDER':
        return 'Manage appointments, patients, and clinical resources';
      case 'WELLNESS_COACH':
        return 'Create and manage wellness content for the community';
      case 'STUDENT':
        return 'Access learning resources, assignments, and research support';
      case 'ADMIN':
        return 'System administration and management';
      default:
        return 'HealthBridge Dashboard';
    }
  };

  const quickActions = getQuickActions();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall">Welcome, {user?.firstName}!</Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              {getRoleDescription()}
            </Text>
            <Text variant="bodySmall" style={[styles.subtitle, { marginTop: 8, fontStyle: 'italic' }]}>
              Role: {user?.role?.replace('_', ' ')}
            </Text>
          </Card.Content>
        </Card>

        {quickActions.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Quick Actions
              </Text>
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  mode="contained"
                  onPress={() => {
                    // Navigate to the appropriate screen
                    // Note: Some screens may not exist in mobile yet
                    if (navigation.canGoBack() || action.screen) {
                      try {
                        navigation.navigate(action.screen);
                      } catch (e) {
                        // Screen might not be registered, show a message
                        console.log(`Screen ${action.screen} not available`);
                      }
                    }
                  }}
                  style={styles.actionButton}
                >
                  {action.label}
                </Button>
              ))}
            </Card.Content>
          </Card>
        )}

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Dashboard Overview
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              {user?.role === 'PATIENT' && 'View your appointments, medication reminders, and wellness tracking'}
              {user?.role === 'HEALTHCARE_PROVIDER' && 'Monitor your patients, appointments, and billing information'}
              {user?.role === 'WELLNESS_COACH' && 'Manage your wellness content and track engagement'}
              {user?.role === 'STUDENT' && 'Track your assignments, access learning resources, and research projects'}
              {user?.role === 'ADMIN' && 'Manage users, monitor system activity, and access all features'}
              {!user && 'Access your personalized dashboard'}
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
      <FAB
        icon="account"
        style={styles.fab}
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 10,
  },
  subtitle: {
    color: '#666',
    marginTop: 5,
  },
  actionButton: {
    marginTop: 10,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default DashboardScreen;

