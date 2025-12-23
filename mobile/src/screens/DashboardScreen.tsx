import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, FAB } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

const DashboardScreen: React.FC = ({ navigation }: any) => {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall">Welcome, {user?.firstName}!</Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              HealthBridge Dashboard
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Quick Actions</Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Appointments')}
              style={styles.actionButton}
            >
              Appointments
            </Button>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Wellness')}
              style={styles.actionButton}
            >
              Wellness Hub
            </Button>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Learning')}
              style={styles.actionButton}
            >
              Learning Zone
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Your Role</Text>
            <Text variant="bodyLarge">{user?.role}</Text>
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default DashboardScreen;

