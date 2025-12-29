import React from 'react';
import { useQuery } from 'react-query';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Medication as MedicationIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import api from '../services/authService';
import { format } from 'date-fns';

const MedicationReminders: React.FC = () => {
  const { data: medications, isLoading } = useQuery(
    'medications',
    () => api.get('/medications?activeOnly=true').then(res => res.data.medications),
    { refetchInterval: 60000 } // Refetch every minute
  );

  const { data: upcoming } = useQuery(
    'upcoming-medications',
    () => api.get('/medications/upcoming').then(res => res.data.reminders),
    { refetchInterval: 30000 } // Refetch every 30 seconds
  );

  const handleMarkTaken = async (reminderId: string, scheduledTime: string) => {
    try {
      await api.post('/medications/log', {
        reminderId,
        scheduledTime,
        takenTime: new Date().toISOString(),
        status: 'TAKEN',
      });
      // Refetch queries
      window.location.reload(); // Simple refresh for now
    } catch (error) {
      console.error('Failed to mark medication as taken:', error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const activeMedications = medications?.filter((m: any) => m.isActive && m.status === 'ACTIVE') || [];
  const upcomingReminders = upcoming?.slice(0, 5) || [];

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Medication Reminders
      </Typography>

      {upcomingReminders.length > 0 && (
        <Card sx={{ mb: 2, border: '1px solid #e2e8f0' }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Upcoming Today
            </Typography>
            <List>
              {upcomingReminders.map((reminder: any) => (
                <ListItem
                  key={reminder.id}
                  sx={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {reminder.medicationName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {reminder.dosage} • {reminder.time}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<CheckIcon />}
                    onClick={() => handleMarkTaken(reminder.id, reminder.reminderTime)}
                    sx={{ ml: 2 }}
                  >
                    Mark Taken
                  </Button>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      <Card sx={{ border: '1px solid #e2e8f0' }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Active Medications ({activeMedications.length})
          </Typography>
          {activeMedications.length > 0 ? (
            <List>
              {activeMedications.map((med: any) => {
                const times = Array.isArray(med.times) ? med.times : JSON.parse(med.times || '[]');
                return (
                  <ListItem
                    key={med.id}
                    sx={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 2,
                      mb: 1,
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                      <MedicationIcon sx={{ mr: 1, color: '#2563eb' }} />
                      <Typography variant="body1" sx={{ fontWeight: 600, flex: 1 }}>
                        {med.medicationName}
                      </Typography>
                      <Chip
                        label={med.status}
                        size="small"
                        color={med.status === 'ACTIVE' ? 'success' : 'default'}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {med.dosage} • {med.frequency.replace('_', ' ')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {times.map((time: string, idx: number) => (
                        <Chip
                          key={idx}
                          label={time}
                          size="small"
                          icon={<TimeIcon />}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Alert severity="info">No active medications. Add one to get started!</Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default MedicationReminders;

