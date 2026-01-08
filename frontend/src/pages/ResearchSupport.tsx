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
  Alert,
  List,
  ListItem,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Lightbulb as TopicIcon,
  Description as ProposalIcon,
  LibraryBooks as LibraryIcon,
  ConnectWithoutContact as SupervisorIcon,
  TrackChanges as TrackerIcon,
  Group as CollaborationIcon,
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

const ResearchSupport: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [topicDialogOpen, setTopicDialogOpen] = useState(false);
  const [proposalDialogOpen, setProposalDialogOpen] = useState(false);
  const [supervisorDialogOpen, setSupervisorDialogOpen] = useState(false);
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);
  const [collaborationDialogOpen, setCollaborationDialogOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [topicField, setTopicField] = useState('');
  const [supervisorField, setSupervisorField] = useState('');

  const { data: topics } = useQuery(
    'research-topics',
    () => api.get('/research/topics').then(res => res.data),
    { enabled: !!user && user?.role === 'STUDENT' }
  );

  const { data: proposals } = useQuery(
    'research-proposals',
    () => api.get('/research/proposals').then(res => res.data),
    { enabled: !!user && user?.role === 'STUDENT' }
  );

  const { data: resources } = useQuery(
    'research-resources',
    () => api.get('/research/resources').then(res => res.data),
    { enabled: !!user }
  );

  const { data: supervisorRequests } = useQuery(
    'supervisor-requests',
    () => api.get('/research/supervisors/requests').then(res => res.data),
    { enabled: !!user }
  );

  const generateTopicMutation = useMutation(
    (data: any) => api.post('/research/topics/generate', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('research-topics');
        setTopicDialogOpen(false);
      }
    }
  );

  const createProposalMutation = useMutation(
    (data: any) => api.post('/research/proposals', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('research-proposals');
        setProposalDialogOpen(false);
      }
    }
  );

  const requestSupervisorMutation = useMutation(
    (data: any) => api.post('/research/supervisors/request', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('supervisor-requests');
        setSupervisorDialogOpen(false);
      }
    }
  );

  const createMilestoneMutation = useMutation(
    (data: any) => api.post('/research/milestones', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['milestones', selectedProposal?.id]);
        setMilestoneDialogOpen(false);
      }
    }
  );

  const { data: milestones } = useQuery(
    ['milestones', selectedProposal?.id],
    () => api.get(`/research/milestones/${selectedProposal?.id}`).then(res => res.data),
    { enabled: !!selectedProposal }
  );

  const { data: collaborations } = useQuery(
    'collaborations',
    () => api.get('/research/collaborations').then(res => res.data),
    { enabled: !!user }
  );

  const handleGenerateTopic = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    generateTopicMutation.mutate({
      field: topicField,
      keywords: (formData.get('keywords') as string)?.split(',').map(k => k.trim()),
      description: formData.get('description') || null
    });
    setTopicField('');
  };

  const handleCreateProposal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createProposalMutation.mutate({
      topicId: formData.get('topicId') || null,
      title: formData.get('title'),
      abstract: formData.get('abstract'),
      objectives: (formData.get('objectives') as string).split(',').map(o => o.trim()),
      methodology: formData.get('methodology'),
      expectedOutcomes: formData.get('expectedOutcomes') || null
    });
  };

  const handleRequestSupervisor = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    requestSupervisorMutation.mutate({
      supervisorId: formData.get('supervisorId'),
      field: supervisorField,
      requestMessage: formData.get('requestMessage') || null
    });
    setSupervisorField('');
  };

  const handleCreateMilestone = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMilestoneMutation.mutate({
      proposalId: selectedProposal.id,
      milestoneType: formData.get('milestoneType'),
      title: formData.get('title'),
      description: formData.get('description') || null,
      dueDate: formData.get('dueDate') || null
    });
  };

  const milestonesSteps = [
    'Proposal',
    'Ethics Approval',
    'Data Collection',
    'Analysis',
    'Final Submission'
  ];

  return (
    <Layout>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              Research Support Section
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b' }}>
              Tools and resources for academic research
            </Typography>
          </Box>

          <Card>
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
              <Tab icon={<TopicIcon />} label="Topic Generator" />
              <Tab icon={<ProposalIcon />} label="Proposal Builder" />
              <Tab icon={<LibraryIcon />} label="Resource Library" />
              <Tab icon={<SupervisorIcon />} label="Supervisor Connect" />
              <Tab icon={<TrackerIcon />} label="Submission Tracker" />
              <Tab icon={<CollaborationIcon />} label="Collaboration" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Research Topics</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setTopicDialogOpen(true)}
                >
                  Generate Topic
                </Button>
              </Box>

              <Grid container spacing={3}>
                {topics?.map((topic: any) => (
                  <Grid item xs={12} md={6} key={topic.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Chip label={topic.field} size="small" color="primary" />
                          {topic.isGenerated && <Chip label="AI Generated" size="small" />}
                        </Box>
                        <Typography variant="h6" gutterBottom>{topic.topic}</Typography>
                        {topic.description && (
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {topic.description}
                          </Typography>
                        )}
                        {topic.keywords && topic.keywords.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            {topic.keywords.map((keyword: string, idx: number) => (
                              <Chip key={idx} label={keyword} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                            ))}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                {(!topics || topics.length === 0) && (
                  <Grid item xs={12}>
                    <Alert severity="info">No research topics yet. Generate your first topic!</Alert>
                  </Grid>
                )}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Research Proposals</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setProposalDialogOpen(true)}
                >
                  Create Proposal
                </Button>
              </Box>

              <Grid container spacing={3}>
                {proposals?.map((proposal: any) => (
                  <Grid item xs={12} key={proposal.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="h6">{proposal.title}</Typography>
                          <Chip
                            label={proposal.status}
                            color={
                              proposal.status === 'APPROVED' ? 'success' :
                              proposal.status === 'REJECTED' ? 'error' :
                              proposal.status === 'UNDER_REVIEW' ? 'warning' : 'default'
                            }
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {proposal.abstract}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>Objectives:</Typography>
                          <List dense>
                            {proposal.objectives?.map((obj: string, idx: number) => (
                              <ListItem key={idx} sx={{ py: 0 }}>
                                <ListItemText primary={`• ${obj}`} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                        <Button
                          variant="outlined"
                          sx={{ mt: 2 }}
                          onClick={() => {
                            setSelectedProposal(proposal);
                            setTabValue(4); // Switch to tracker tab
                          }}
                        >
                          View Milestones
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                {(!proposals || proposals.length === 0) && (
                  <Grid item xs={12}>
                    <Alert severity="info">No proposals yet. Create your first proposal!</Alert>
                  </Grid>
                )}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>Resource Library</Typography>
              <Grid container spacing={3}>
                {resources?.map((resource: any) => (
                  <Grid item xs={12} md={6} key={resource.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Chip label={resource.field} size="small" color="primary" />
                          <Chip label={resource.resourceType} size="small" />
                        </Box>
                        <Typography variant="h6" gutterBottom>{resource.title}</Typography>
                        {resource.description && (
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {resource.description}
                          </Typography>
                        )}
                        {resource.author && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            By {resource.author}
                          </Typography>
                        )}
                        {resource.url && (
                          <Button
                            variant="outlined"
                            size="small"
                            href={resource.url}
                            target="_blank"
                            sx={{ mt: 2 }}
                          >
                            View Resource
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                {(!resources || resources.length === 0) && (
                  <Grid item xs={12}>
                    <Alert severity="info">No resources available.</Alert>
                  </Grid>
                )}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Supervisor Connections</Typography>
                {user?.role === 'STUDENT' && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setSupervisorDialogOpen(true)}
                  >
                    Request Supervisor
                  </Button>
                )}
              </Box>

              {supervisorRequests?.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Supervisor/Student</TableCell>
                        <TableCell>Field</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {supervisorRequests.map((request: any) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            {user?.role === 'STUDENT'
                              ? `${request.supervisor.firstName} ${request.supervisor.lastName}`
                              : `${request.student.firstName} ${request.student.lastName}`
                            }
                          </TableCell>
                          <TableCell>{request.field}</TableCell>
                          <TableCell>
                            <Chip
                              label={request.status}
                              color={
                                request.status === 'ACCEPTED' ? 'success' :
                                request.status === 'REJECTED' ? 'error' : 'default'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">No supervisor requests found.</Alert>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={4}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Submission Tracker</Typography>
                {selectedProposal && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setMilestoneDialogOpen(true)}
                  >
                    Add Milestone
                  </Button>
                )}
              </Box>

              {selectedProposal ? (
                <Box>
                  <Typography variant="h6" gutterBottom>{selectedProposal.title}</Typography>
                  <Stepper activeStep={milestones?.filter((m: any) => m.status === 'COMPLETED').length || 0} sx={{ mb: 4, mt: 2 }}>
                    {milestonesSteps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>

                  {milestones && milestones.length > 0 ? (
                    <List>
                      {milestones.map((milestone: any) => (
                        <ListItem key={milestone.id}>
                          <ListItemText
                            primary={milestone.title}
                            secondary={
                              <>
                                {milestone.description && `${milestone.description} • `}
                                Due: {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : 'No due date'}
                              </>
                            }
                          />
                          <Chip
                            label={milestone.status}
                            color={
                              milestone.status === 'COMPLETED' ? 'success' :
                              milestone.status === 'IN_PROGRESS' ? 'warning' :
                              milestone.status === 'BLOCKED' ? 'error' : 'default'
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Alert severity="info">No milestones yet. Add your first milestone!</Alert>
                  )}
                </Box>
              ) : (
                <Alert severity="info">Select a proposal from the Proposal Builder tab to track milestones.</Alert>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Collaboration Tools</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setCollaborationDialogOpen(true)}
                >
                  Create Collaboration
                </Button>
              </Box>

              {collaborations?.length > 0 ? (
                <Grid container spacing={3}>
                  {collaborations.map((collab: any) => (
                    <Grid item xs={12} md={6} key={collab.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Chip label={collab.collaborationType} size="small" color="primary" />
                            {collab.isShared && <Chip label="Shared" size="small" />}
                          </Box>
                          <Typography variant="h6" gutterBottom>{collab.title}</Typography>
                          {collab.content && (
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {collab.content}
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                            By {collab.user.firstName} {collab.user.lastName} • {new Date(collab.createdAt).toLocaleDateString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">No collaboration items yet.</Alert>
              )}
            </TabPanel>
          </Card>
        </Container>
      </Box>

      {/* Generate Topic Dialog */}
      <Dialog open={topicDialogOpen} onClose={() => {
        setTopicDialogOpen(false);
        setTopicField('');
      }} maxWidth="sm" fullWidth>
        <form onSubmit={handleGenerateTopic}>
          <DialogTitle>Generate Research Topic</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
              <InputLabel>Research Field</InputLabel>
              <Select 
                name="field" 
                value={topicField}
                onChange={(e) => setTopicField(e.target.value)}
                required
              >
                <MenuItem value="HEALTH">Health</MenuItem>
                <MenuItem value="EDUCATION">Education</MenuItem>
                <MenuItem value="TECHNOLOGY">Technology</MenuItem>
                <MenuItem value="AGRICULTURE">Agriculture</MenuItem>
                <MenuItem value="BUSINESS">Business</MenuItem>
                <MenuItem value="SOCIAL_SCIENCES">Social Sciences</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              name="keywords"
              label="Keywords (comma-separated, optional)"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="description"
              label="Description (optional)"
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTopicDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Generate</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Create Proposal Dialog */}
      <Dialog open={proposalDialogOpen} onClose={() => setProposalDialogOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleCreateProposal}>
          <DialogTitle>Create Research Proposal</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
              <InputLabel>Topic (Optional)</InputLabel>
              <Select name="topicId">
                <MenuItem value="">None</MenuItem>
                {topics?.map((topic: any) => (
                  <MenuItem key={topic.id} value={topic.id}>{topic.topic}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              name="title"
              label="Title"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="abstract"
              label="Abstract"
              multiline
              rows={4}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="objectives"
              label="Objectives (comma-separated)"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="methodology"
              label="Methodology"
              multiline
              rows={4}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="expectedOutcomes"
              label="Expected Outcomes (Optional)"
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setProposalDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Request Supervisor Dialog */}
      <Dialog open={supervisorDialogOpen} onClose={() => {
        setSupervisorDialogOpen(false);
        setSupervisorField('');
      }} maxWidth="sm" fullWidth>
        <form onSubmit={handleRequestSupervisor}>
          <DialogTitle>Request Supervisor</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              name="supervisorId"
              label="Supervisor ID"
              required
              sx={{ mb: 2, mt: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Field</InputLabel>
              <Select 
                name="field" 
                value={supervisorField}
                onChange={(e) => setSupervisorField(e.target.value)}
                required
              >
                <MenuItem value="HEALTH">Health</MenuItem>
                <MenuItem value="EDUCATION">Education</MenuItem>
                <MenuItem value="TECHNOLOGY">Technology</MenuItem>
                <MenuItem value="AGRICULTURE">Agriculture</MenuItem>
                <MenuItem value="BUSINESS">Business</MenuItem>
                <MenuItem value="SOCIAL_SCIENCES">Social Sciences</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              name="requestMessage"
              label="Request Message (Optional)"
              multiline
              rows={4}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSupervisorDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Send Request</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Create Milestone Dialog */}
      <Dialog open={milestoneDialogOpen} onClose={() => setMilestoneDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleCreateMilestone}>
          <DialogTitle>Create Milestone</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
              <InputLabel>Milestone Type</InputLabel>
              <Select name="milestoneType" required>
                <MenuItem value="PROPOSAL">Proposal</MenuItem>
                <MenuItem value="ETHICS_APPROVAL">Ethics Approval</MenuItem>
                <MenuItem value="DATA_COLLECTION">Data Collection</MenuItem>
                <MenuItem value="ANALYSIS">Analysis</MenuItem>
                <MenuItem value="FINAL_SUBMISSION">Final Submission</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              name="title"
              label="Title"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="description"
              label="Description (Optional)"
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="dueDate"
              label="Due Date (Optional)"
              type="date"
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMilestoneDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Create Collaboration Dialog */}
      <Dialog open={collaborationDialogOpen} onClose={() => setCollaborationDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Collaboration Item</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2, mt: 2 }}>
            <InputLabel>Type</InputLabel>
            <Select defaultValue="NOTE">
              <MenuItem value="FOLDER">Folder</MenuItem>
              <MenuItem value="NOTE">Note</MenuItem>
              <MenuItem value="CHAT">Chat</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Title"
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Content"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCollaborationDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default ResearchSupport;

