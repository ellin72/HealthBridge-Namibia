import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

interface Survey {
  id: string;
  title: string;
  description: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED';
  isAnonymous: boolean;
  questions: any[];
  startDate?: string;
  endDate?: string;
  createdAt: string;
  _count?: {
    responses: number;
  };
}

const Surveys: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [newSurvey, setNewSurvey] = useState({
    title: '',
    description: '',
    isAnonymous: false,
    questions: [{ type: 'TEXT', question: '' }]
  });

  const { data: surveys, isLoading } = useQuery(
    'surveys',
    () => api.get('/surveys').then(res => res.data.data || []),
    { enabled: !!user }
  );

  const { data: adoptionMetrics } = useQuery(
    'survey-metrics',
    () => api.get('/surveys/metrics/adoption').then(res => res.data.data),
    { enabled: !!user && user?.role === 'ADMIN' }
  );

  const createSurveyMutation = useMutation(
    (data: any) => api.post('/surveys', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('surveys');
        setCreateDialogOpen(false);
        setNewSurvey({
          title: '',
          description: '',
          isAnonymous: false,
          questions: [{ type: 'TEXT', question: '' }]
        });
      }
    }
  );

  const updateStatusMutation = useMutation(
    ({ id, status }: { id: string; status: string }) =>
      api.patch(`/surveys/${id}/status`, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('surveys');
      }
    }
  );

  const handleCreateSurvey = () => {
    createSurveyMutation.mutate({
      ...newSurvey,
      questions: JSON.stringify(newSurvey.questions)
    });
  };

  const handleViewSurvey = (survey: Survey) => {
    setSelectedSurvey(survey);
    setViewDialogOpen(true);
  };

  const handleStatusChange = (surveyId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: surveyId, status: newStatus });
  };

  const filteredSurveys = surveys?.filter((survey: Survey) => {
    if (tabValue === 0) return survey.status === 'ACTIVE';
    if (tabValue === 1) return survey.status === 'DRAFT';
    if (tabValue === 2) return survey.status === 'COMPLETED';
    return true;
  }) || [];

  if (isLoading) {
    return (
      <Layout>
        <Container>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Surveys
          </Typography>
          {(user?.role === 'ADMIN' || user?.role === 'HEALTHCARE_PROVIDER') && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Create Survey
            </Button>
          )}
        </Box>

        {adoptionMetrics && user?.role === 'ADMIN' && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Survey Adoption Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Total Surveys
                  </Typography>
                  <Typography variant="h4">{adoptionMetrics.totalSurveys || 0}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Active Surveys
                  </Typography>
                  <Typography variant="h4">{adoptionMetrics.activeSurveys || 0}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">
                    Total Responses
                  </Typography>
                  <Typography variant="h4">{adoptionMetrics.totalResponses || 0}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
              <Tab label="Active" />
              <Tab label="Draft" />
              <Tab label="Completed" />
              <Tab label="All" />
            </Tabs>
          </Box>

          <CardContent>
            {filteredSurveys.length === 0 ? (
              <Alert severity="info">No surveys found in this category.</Alert>
            ) : (
              <Grid container spacing={3}>
                {filteredSurveys.map((survey: Survey) => (
                  <Grid item xs={12} md={6} key={survey.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                          <Typography variant="h6" component="h3">
                            {survey.title}
                          </Typography>
                          <Chip
                            label={survey.status}
                            color={
                              survey.status === 'ACTIVE'
                                ? 'success'
                                : survey.status === 'DRAFT'
                                ? 'warning'
                                : 'default'
                            }
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {survey.description}
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                          <Chip
                            label={survey.isAnonymous ? 'Anonymous' : 'Named'}
                            size="small"
                            variant="outlined"
                          />
                          {survey._count && (
                            <Chip
                              label={`${survey._count.responses} responses`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                        {survey.endDate && (
                          <Typography variant="caption" color="text.secondary">
                            Ends: {new Date(survey.endDate).toLocaleDateString()}
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          startIcon={<ViewIcon />}
                          onClick={() => handleViewSurvey(survey)}
                        >
                          View
                        </Button>
                        {(user?.role === 'ADMIN' || user?.role === 'HEALTHCARE_PROVIDER') && (
                          <>
                            {survey.status === 'DRAFT' && (
                              <Button
                                size="small"
                                color="success"
                                onClick={() => handleStatusChange(survey.id, 'ACTIVE')}
                              >
                                Activate
                              </Button>
                            )}
                            {survey.status === 'ACTIVE' && (
                              <Button
                                size="small"
                                color="warning"
                                onClick={() => handleStatusChange(survey.id, 'COMPLETED')}
                              >
                                Complete
                              </Button>
                            )}
                          </>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>

        {/* Create Survey Dialog */}
        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create New Survey</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={newSurvey.title}
              onChange={(e) => setNewSurvey({ ...newSurvey, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={newSurvey.description}
              onChange={(e) => setNewSurvey({ ...newSurvey, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
              required
            />
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                Questions
              </Typography>
              {newSurvey.questions.map((q, idx) => (
                <TextField
                  key={idx}
                  fullWidth
                  label={`Question ${idx + 1}`}
                  value={q.question}
                  onChange={(e) => {
                    const questions = [...newSurvey.questions];
                    questions[idx].question = e.target.value;
                    setNewSurvey({ ...newSurvey, questions });
                  }}
                  margin="normal"
                />
              ))}
              <Button
                size="small"
                onClick={() =>
                  setNewSurvey({
                    ...newSurvey,
                    questions: [...newSurvey.questions, { type: 'TEXT', question: '' }]
                  })
                }
              >
                Add Question
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCreateSurvey}
              variant="contained"
              disabled={!newSurvey.title || !newSurvey.description}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Survey Dialog */}
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{selectedSurvey?.title}</DialogTitle>
          <DialogContent>
            {selectedSurvey && (
              <>
                <Typography variant="body1" paragraph>
                  {selectedSurvey.description}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Questions:
                </Typography>
                {Array.isArray(selectedSurvey.questions) ? (
                  <ul>
                    {selectedSurvey.questions.map((q: any, idx: number) => (
                      <li key={idx}>{q.question || q}</li>
                    ))}
                  </ul>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {typeof selectedSurvey.questions === 'string'
                      ? JSON.parse(selectedSurvey.questions).map((q: any, idx: number) => (
                          <div key={idx}>{q.question || q}</div>
                        ))
                      : 'No questions'}
                  </Typography>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Surveys;

