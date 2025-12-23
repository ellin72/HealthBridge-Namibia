import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

const AppointmentsScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall">Appointments</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Manage your healthcare appointments
          </Text>
          <Button mode="contained" style={styles.button}>
            Book Appointment
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 10,
  },
  subtitle: {
    color: '#666',
    marginTop: 5,
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
});

export default AppointmentsScreen;

