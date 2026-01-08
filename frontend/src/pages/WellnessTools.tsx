import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tab,
  Tabs,
  Chip,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  FitnessCenter as FitnessIcon,
  TrackChanges as TrackIcon,
  EmojiEvents as ChallengeIcon,
  Add as AddIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const WellnessTools: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [habitDialogOpen, setHabitDialogOpen] = useState(false);
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<any>(null);

  const { data: plans } = useQuery(
    'wellness-plans',
    () => api.get('/wellness-tools/plans').then(res => res.data),
    { enabled: !!user }
  );

  const { data: habits } = useQuery(
    'habit-trackers',
    () => api.get('/wellness-tools/habits').then(res => res.data),
    { enabled: !!user }
  );

  const { data: challenges } = useQuery(
    'challenges',
    () => api.get('/wellness-tools/challenges').then(res => res.data),
    { enabled: !!user }
  );

  const { data: myChallenges } = useQuery(
    'my-challenges',
    () => api.get('/wellness-tools/challenges/my-challenges').then(res => res.data),
    { enabled: !!user }
  );

  const createPlanMutation = useMutation(
    (data: any) => api.post('/wellness-tools/plans', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('wellness-plans');
        setPlanDialogOpen(false);
      }
    }
  );

  const createHabitMutation = useMutation(
    (data: any) => api.post('/wellness-tools/habits', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('habit-trackers');
        setHabitDialogOpen(false);
      }
    }
  );

  const addEntryMutation = useMutation(
    (data: any) => api.post('/wellness-tools/habits/entries', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('habit-trackers');
        setEntryDialogOpen(false);
      }
    }
  );

  const joinChallengeMutation = useMutation(
    (challengeId: string) => api.post(`/wellness-tools/challenges/${challengeId}/join`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('challenges');
        queryClient.invalidateQueries('my-challenges');
      }
    }
  );

  const handleCreatePlan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createPlanMutation.mutate({
      title: formData.get('title'),
      description: formData.get('description'),
      goals: (formData.get('goals') as string).split(',').map(g => g.trim()),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate') || null
    });
  };

  const handleCreateHabit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createHabitMutation.mutate({
      habitType: formData.get('habitType'),
      habitName: formData.get('habitName'),
      targetValue: formData.get('targetValue') ? parseFloat(formData.get('targetValue') as string) : null,
      unit: formData.get('unit') || null
    });
  };

  const handleAddEntry = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addEntryMutation.mutate({
      habitTrackerId: selectedHabit.id,
      value: parseFloat(formData.get('value') as string),
      notes: formData.get('notes') || null,
      date: formData.get('date') || new Date().toISOString()
    });
  };

  return (
    <Layout>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              Interactive Wellness Tools
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Personalized wellness plans, habit tracking, and community challenges
            </Typography>
          </Box>

          <Card>
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
              <Tab icon={<FitnessIcon />} label="Wellness Plans" />
              <Tab icon={<TrackIcon />} label="Habit Tracking" />
              <Tab icon={<ChallengeIcon />} label="Challenges" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">My Wellness Plans</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setPlanDialogOpen(true)}
                >
                  Create Plan
                </Button>
              </Box>

              <Grid container spacing={3}>
                {plans?.map((plan: any) => (
                  <Grid item xs={12} md={6} key={plan.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="h6">{plan.title}</Typography>
                          <Chip
                            label={plan.isActive ? 'Active' : 'Inactive'}
                            color={plan.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {plan.description}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>Goals:</Typography>
                          {plan.goals?.map((goal: string, idx: number) => (
                            <Chip key={idx} label={goal} size="small" sx={{ mr: 1, mb: 1 }} />
                          ))}
                        </Box>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2 }}>
                          Start: {new Date(plan.startDate).toLocaleDateString()}
                          {plan.endDate && ` • End: ${new Date(plan.endDate).toLocaleDateString()}`}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                {(!plans || plans.length === 0) && (
                  <Grid item xs={12}>
                    <Alert severity="info">No wellness plans yet. Create your first plan to get started!</Alert>
                  </Grid>
                )}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Habit Trackers</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setHabitDialogOpen(true)}
                >
                  Create Tracker
                </Button>
              </Box>

              <Grid container spacing={3}>
                {habits?.map((habit: any) => (
                  <Grid item xs={12} md={6} key={habit.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="h6">{habit.habitName}</Typography>
                          <Chip
                            label={habit.habitType}
                            size="small"
                            color="primary"
                          />
                        </Box>
                        {habit.targetValue && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              Target: {habit.targetValue} {habit.unit || ''}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={habit.entries?.[0]?.value ? (habit.entries[0].value / habit.targetValue) * 100 : 0}
                              sx={{ mt: 1 }}
                            />
                          </Box>
                        )}
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Current Streak</Typography>
                            <Typography variant="h6">{habit.currentStreak} days</Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Longest Streak</Typography>
                            <Typography variant="h6">{habit.longestStreak} days</Typography>
                          </Box>
                        </Box>
                        <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => {
                            setSelectedHabit(habit);
                            setEntryDialogOpen(true);
                          }}
                        >
                          Log Entry
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                {(!habits || habits.length === 0) && (
                  <Grid item xs={12}>
                    <Alert severity="info">No habit trackers yet. Create your first tracker!</Alert>
                  </Grid>
                )}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>Community Challenges</Typography>
              <Grid container spacing={3} sx={{ mb: 4 }}>
                {challenges?.filter((c: any) => c.status === 'ACTIVE' || c.status === 'UPCOMING').map((challenge: any) => {
                  const participation = myChallenges?.find((p: any) => p.challengeId === challenge.id);
                  return (
                    <Grid item xs={12} md={6} key={challenge.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6">{challenge.title}</Typography>
                            <Chip
                              label={challenge.status}
                              color={challenge.status === 'ACTIVE' ? 'success' : 'default'}
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {challenge.description}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
                            <strong>Goal:</strong> {challenge.targetGoal}
                          </Typography>
                          {participation ? (
                            <Box>
                              <LinearProgress
                                variant="determinate"
                                value={participation.progress}
                                sx={{ mb: 1 }}
                              />
                              <Typography variant="body2" color="text.secondary">
                                Progress: {participation.progress}%
                              </Typography>
                            </Box>
                          ) : (
                            <Button
                              variant="contained"
                              fullWidth
                              onClick={() => joinChallengeMutation.mutate(challenge.id)}
                              disabled={challenge.status !== 'ACTIVE' && challenge.status !== 'UPCOMING'}
                            >
                              Join Challenge
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>My Challenges</Typography>
              {myChallenges?.length > 0 ? (
                <List>
                  {myChallenges.map((participation: any) => (
                    <ListItem key={participation.id}>
                      <ListItemText
                        primary={participation.challenge.title}
                        secondary={`Progress: ${participation.progress}% • ${participation.completed ? 'Completed' : 'In Progress'}`}
                      />
                      <Chip
                        label={participation.completed ? 'Completed' : 'Active'}
                        color={participation.completed ? 'success' : 'primary'}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="info">You haven't joined any challenges yet.</Alert>
              )}
            </TabPanel>
          </Card>
        </Container>
      </Box>

      {/* Create Plan Dialog */}
      <Dialog open={planDialogOpen} onClose={() => setPlanDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleCreatePlan}>
          <DialogTitle>Create Wellness Plan</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              name="title"
              label="Title"
              required
              sx={{ mb: 2, mt: 2 }}
            />
            <TextField
              fullWidth
              name="description"
              label="Description"
              multiline
              rows={3}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="goals"
              label="Goals (comma-separated)"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="startDate"
              label="Start Date"
              type="date"
              required
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="endDate"
              label="End Date (Optional)"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPlanDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Create Habit Dialog */}
      <Dialog open={habitDialogOpen} onClose={() => setHabitDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleCreateHabit}>
          <DialogTitle>Create Habit Tracker</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
              <InputLabel>Habit Type</InputLabel>
              <Select name="habitType" required>
                <MenuItem value="NUTRITION">Nutrition</MenuItem>
                <MenuItem value="FITNESS">Fitness</MenuItem>
                <MenuItem value="SLEEP">Sleep</MenuItem>
                <MenuItem value="MEDITATION">Meditation</MenuItem>
                <MenuItem value="HYDRATION">Hydration</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              name="habitName"
              label="Habit Name"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="targetValue"
              label="Target Value (Optional)"
              type="number"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="unit"
              label="Unit (e.g., hours, liters)"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setHabitDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Add Entry Dialog */}
      <Dialog open={entryDialogOpen} onClose={() => setEntryDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleAddEntry}>
          <DialogTitle>Log Habit Entry - {selectedHabit?.habitName}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              name="date"
              label="Date"
              type="date"
              defaultValue={new Date().toISOString().split('T')[0]}
              InputLabelProps={{ shrink: true }}
              required
              sx={{ mb: 2, mt: 2 }}
            />
            <TextField
              fullWidth
              name="value"
              label="Value"
              type="number"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="notes"
              label="Notes (Optional)"
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEntryDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Add Entry</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Layout>
  );
};

export default WellnessTools;

