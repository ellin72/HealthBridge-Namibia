import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, Card, Menu } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

const RegisterScreen: React.FC = ({ navigation }: any) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'PATIENT'
  });
  const [loading, setLoading] = useState(false);
  const [roleMenuVisible, setRoleMenuVisible] = useState(false);
  const { register } = useAuth();

  const roles = [
    { label: 'Patient', value: 'PATIENT' },
    { label: 'Healthcare Provider', value: 'HEALTHCARE_PROVIDER' },
    { label: 'Wellness Coach', value: 'WELLNESS_COACH' },
    { label: 'Student', value: 'STUDENT' },
  ];

  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      // Navigation will happen automatically via AuthContext
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            Create Account
          </Text>
          <TextInput
            label="First Name"
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Last Name"
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            label="Phone"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TextInput
            label="Password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
          <Menu
            visible={roleMenuVisible}
            onDismiss={() => setRoleMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setRoleMenuVisible(true)}
                style={styles.input}
              >
                Role: {roles.find(r => r.value === formData.role)?.label}
              </Button>
            }
          >
            {roles.map((role) => (
              <Menu.Item
                key={role.value}
                onPress={() => {
                  setFormData({ ...formData, role: role.value });
                  setRoleMenuVisible(false);
                }}
                title={role.label}
              />
            ))}
          </Menu>
          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            style={styles.button}
          >
            Sign Up
          </Button>
          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.linkButton}
          >
            Already have an account? Sign In
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginTop: 20,
    padding: 10,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  linkButton: {
    marginTop: 10,
  },
});

export default RegisterScreen;

