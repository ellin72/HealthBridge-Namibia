import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall">Profile</Text>
          <Text variant="bodyLarge" style={styles.info}>
            Name: {user?.firstName} {user?.lastName}
          </Text>
          <Text variant="bodyLarge" style={styles.info}>
            Email: {user?.email}
          </Text>
          <Text variant="bodyLarge" style={styles.info}>
            Role: {user?.role}
          </Text>
          <Button mode="contained" onPress={logout} style={styles.button}>
            Logout
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
  info: {
    marginTop: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default ProfileScreen;

