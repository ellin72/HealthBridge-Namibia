import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card } from 'react-native-paper';

const WellnessScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall">Wellness Hub</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Access nutrition, fitness, and stress management resources
          </Text>
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
  },
});

export default WellnessScreen;

