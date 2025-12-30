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
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  InputAdornment,
  LinearProgress,
  Avatar,
  Divider,
  Paper,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Grade as GradeIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
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
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`learning-tabpanel-${index}`}
      aria-labelledby={`learning-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const LearningZone: React.FC = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [openResource, setOpenResource] = useState(false);
  const [openAssignment, setOpenAssignment] = useState(false);
  const [openSubmit, setOpenSubmit] = useState(false);
  const [openGrade, setOpenGrade] = useState(false);
  const [openSubmissions, setOpenSubmissions] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [resourceFormData, setResourceFormData] = useState({
    title: '',
    description: '',
  });
  const [assignmentFormData, setAssignmentFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });
  const [gradeFormData, setGradeFormData] = useState({
    grade: '',
    feedback: '',
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuResourceId, setMenuResourceId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: resources, isLoading: resourcesLoading, error: resourcesError } = useQuery(
    'learning-resources',
    () => api.get('/learning/resources').then(res => res.data),
    {
      onError: (error: any) => {
        console.error('Error fetching resources:', error);
      }
    }
  );

  const { data: assignments, isLoading: assignmentsLoading, error: assignmentsError } = useQuery(
    'assignments',
    () => api.get('/learning/assignments').then(res => res.data),
    {
      onError: (error: any) => {
        console.error('Error fetching assignments:', error);
      }
    }
  );

  const { data: assignmentDetails, refetch: refetchAssignmentDetails } = useQuery(
    ['assignment', selectedAssignment?.id],
    () => api.get(`/learning/assignments/${selectedAssignment?.id}`).then(res => res.data),
    {
      enabled: !!selectedAssignment && openSubmissions,
      onError: (error: any) => {
        console.error('Error fetching assignment details:', error);
      }
    }
  );

  const uploadResourceMutation = useMutation(
    (formData: FormData) => {
      return api.post('/learning/resources', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('learning-resources');
        setOpenResource(false);
        setResourceFormData({ title: '', description: '' });
        setFile(null);
      },
      onError: (error: any) => {
        console.error('Upload resource error:', error);
        alert(error.response?.data?.message || 'Failed to upload resource');
      }
    }
  );

  const createAssignmentMutation = useMutation(
    (data: any) => api.post('/learning/assignments', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('assignments');
        setOpenAssignment(false);
        setAssignmentFormData({ title: '', description: '', dueDate: '' });
      },
      onError: (error: any) => {
        console.error('Create assignment error:', error);
        alert(error.response?.data?.message || 'Failed to create assignment');
      }
    }
  );

  const submitAssignmentMutation = useMutation(
    (formData: FormData) => {
      return api.post('/learning/assignments/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('assignments');
        setOpenSubmit(false);
        setFile(null);
        setSelectedAssignment(null);
      },
      onError: (error: any) => {
        console.error('Submit assignment error:', error);
        alert(error.response?.data?.message || 'Failed to submit assignment');
      }
    }
  );

  const gradeAssignmentMutation = useMutation(
    ({ submissionId, data }: { submissionId: string; data: any }) => 
      api.put(`/learning/assignments/submissions/${submissionId}/grade`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('assignments');
        queryClient.invalidateQueries(['assignment', selectedAssignment?.id]);
        setOpenGrade(false);
        setGradeFormData({ grade: '', feedback: '' });
        setSelectedSubmission(null);
        // Reopen submissions dialog if assignment is selected
        if (selectedAssignment) {
          setTimeout(() => {
            refetchAssignmentDetails();
            setOpenSubmissions(true);
          }, 500);
        }
      },
      onError: (error: any) => {
        console.error('Grade assignment error:', error);
        alert(error.response?.data?.message || 'Failed to grade assignment');
      }
    }
  );

  const deleteResourceMutation = useMutation(
    (id: string) => api.delete(`/learning/resources/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('learning-resources');
        setAnchorEl(null);
        setMenuResourceId(null);
      },
      onError: (error: any) => {
        console.error('Delete resource error:', error);
        alert(error.response?.data?.message || 'Failed to delete resource');
      }
    }
  );

  const handleUploadResource = () => {
    if (!file || !resourceFormData.title) {
      alert('Please provide a title and select a file');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', resourceFormData.title);
    formData.append('description', resourceFormData.description || '');
    formData.append('isPublished', 'true');
    uploadResourceMutation.mutate(formData);
  };

  const handleCreateAssignment = () => {
    if (!assignmentFormData.title || !assignmentFormData.description || !assignmentFormData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }
    createAssignmentMutation.mutate(assignmentFormData);
  };

  const handleSubmitAssignment = () => {
    if (!file || !selectedAssignment) {
      alert('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assignmentId', selectedAssignment.id);
    submitAssignmentMutation.mutate(formData);
  };

  const handleGradeAssignment = () => {
    if (!selectedSubmission || !gradeFormData.grade) {
      alert('Please enter a grade');
      return;
    }
    gradeAssignmentMutation.mutate({
      submissionId: selectedSubmission.id,
      data: {
        grade: parseFloat(gradeFormData.grade),
        feedback: gradeFormData.feedback || ''
      }
    });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, resourceId: string) => {
    setAnchorEl(event.currentTarget);
    setMenuResourceId(resourceId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuResourceId(null);
  };

  const handleDeleteResource = () => {
    if (menuResourceId && window.confirm('Are you sure you want to delete this resource?')) {
      deleteResourceMutation.mutate(menuResourceId);
    }
    handleMenuClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = due.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const isStudent = user?.role === 'STUDENT';
  const isInstructor = user?.role === 'HEALTHCARE_PROVIDER' || user?.role === 'ADMIN';

  // Filter resources and assignments based on search query
  const filteredResources = resources?.filter((resource: any) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredAssignments = assignments?.filter((assignment: any) =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <Layout>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#1e293b',
                  mb: 0.5,
                }}
              >
                Learning Zone
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Access educational resources and manage assignments
              </Typography>
            </Box>
            <Box>
              {isInstructor && (
                <>
                  <Button
                    variant="contained"
                    startIcon={<UploadIcon />}
                    onClick={() => setOpenResource(true)}
                    sx={{
                      mr: 1,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                      },
                    }}
                  >
                    Upload Resource
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<AssignmentIcon />}
                    onClick={() => setOpenAssignment(true)}
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      px: 3,
                      py: 1.5,
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      },
                    }}
                  >
                    Create Assignment
                  </Button>
                </>
              )}
            </Box>
          </Box>

          <Paper sx={{ mb: 3, p: 2 }}>
            <TextField
              fullWidth
              placeholder="Search resources and assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#64748b' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                },
              }}
            />
          </Paper>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DescriptionIcon />
                    <span>Resources</span>
                    {filteredResources.length > 0 && (
                      <Chip label={filteredResources.length} size="small" sx={{ ml: 1 }} />
                    )}
                  </Box>
                }
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentIcon />
                    <span>Assignments</span>
                    {filteredAssignments.length > 0 && (
                      <Chip label={filteredAssignments.length} size="small" sx={{ ml: 1 }} />
                    )}
                  </Box>
                }
              />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            {resourcesLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : resourcesError ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to load resources. Please try again.
              </Alert>
            ) : filteredResources.length > 0 ? (
              <Grid container spacing={3}>
                {filteredResources.map((resource: any) => (
                  <Grid item xs={12} md={6} lg={4} key={resource.id}>
                    <Card
                      sx={{
                        height: '100%',
                        border: '1px solid #e2e8f0',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Avatar
                            sx={{
                              width: 48,
                              height: 48,
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              mr: 2,
                            }}
                          >
                            <DescriptionIcon />
                          </Avatar>
                          {isInstructor && (
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuOpen(e, resource.id)}
                              sx={{ color: '#64748b' }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          )}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: '#1e293b',
                            mb: 1,
                          }}
                        >
                          {resource.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#64748b',
                            mb: 2,
                            minHeight: 40,
                          }}
                        >
                          {resource.description || 'No description available'}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            {formatFileSize(resource.fileSize)}
                          </Typography>
                          <Chip
                            label={resource.isPublished ? 'Published' : 'Draft'}
                            size="small"
                            color={resource.isPublished ? 'success' : 'default'}
                          />
                        </Box>
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<DownloadIcon />}
                          href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${resource.fileUrl}`}
                          target="_blank"
                          sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontWeight: 600,
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                            },
                          }}
                        >
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card sx={{ p: 6, textAlign: 'center' }}>
                <DescriptionIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                  {searchQuery ? 'No resources found' : 'No resources available'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  {isInstructor
                    ? 'Upload your first learning resource to get started!'
                    : 'No learning resources have been published yet.'}
                </Typography>
              </Card>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {assignmentsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : assignmentsError ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                Failed to load assignments. Please try again.
              </Alert>
            ) : filteredAssignments.length > 0 ? (
              <Grid container spacing={3}>
                {filteredAssignments.map((assignment: any) => {
                  const daysUntilDue = getDaysUntilDue(assignment.dueDate);
                  const isOverdue = daysUntilDue < 0;
                  const isDueSoon = daysUntilDue >= 0 && daysUntilDue <= 3;
                  const submission = assignment.submissions?.[0];
                  const hasSubmission = !!submission;

                  return (
                    <Grid item xs={12} key={assignment.id}>
                      <Card
                        sx={{
                          border: '1px solid #e2e8f0',
                          transition: 'all 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                          },
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                <Avatar
                                  sx={{
                                    width: 48,
                                    height: 48,
                                    background: isOverdue
                                      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                                      : isDueSoon
                                      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                      : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                  }}
                                >
                                  <AssignmentIcon />
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: 600,
                                      color: '#1e293b',
                                      mb: 0.5,
                                    }}
                                  >
                                    {assignment.title}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <PersonIcon sx={{ fontSize: 16, color: '#64748b' }} />
                                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                                      {assignment.instructor.firstName} {assignment.instructor.lastName}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#64748b',
                                  mb: 2,
                                }}
                              >
                                {assignment.description}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                <Chip
                                  icon={<ScheduleIcon />}
                                  label={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                                  color={isOverdue ? 'error' : isDueSoon ? 'warning' : 'default'}
                                  size="small"
                                />
                                {hasSubmission && (
                                  <Chip
                                    icon={<CheckCircleIcon />}
                                    label={submission.status === 'GRADED' ? 'Graded' : 'Submitted'}
                                    color={submission.status === 'GRADED' ? 'success' : 'info'}
                                    size="small"
                                  />
                                )}
                                {submission?.grade !== null && submission?.grade !== undefined && (
                                  <Chip
                                    icon={<GradeIcon />}
                                    label={`Grade: ${submission.grade}%`}
                                    color="primary"
                                    size="small"
                                  />
                                )}
                              </Box>
                            </Box>
                          </Box>
                          <Divider sx={{ my: 2 }} />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {isStudent && (
                              <Button
                                variant={hasSubmission ? 'outlined' : 'contained'}
                                startIcon={hasSubmission ? <CheckCircleIcon /> : <UploadIcon />}
                                onClick={() => {
                                  setSelectedAssignment(assignment);
                                  setOpenSubmit(true);
                                }}
                                disabled={hasSubmission}
                                sx={{
                                  ...(hasSubmission
                                    ? {}
                                    : {
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        fontWeight: 600,
                                        '&:hover': {
                                          background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                                        },
                                      }),
                                }}
                              >
                                {hasSubmission ? 'Already Submitted' : 'Submit Assignment'}
                              </Button>
                            )}
                            {isInstructor && assignment.submissions && assignment.submissions.length > 0 && (
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  variant="outlined"
                                  startIcon={<PersonIcon />}
                                  onClick={() => {
                                    setSelectedAssignment(assignment);
                                    setOpenSubmissions(true);
                                    refetchAssignmentDetails();
                                  }}
                                >
                                  View {assignment.submissions.length} Submission{assignment.submissions.length !== 1 ? 's' : ''}
                                </Button>
                              </Box>
                            )}
                            {assignment.fileUrl && (
                              <Button
                                variant="text"
                                startIcon={<DownloadIcon />}
                                href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${assignment.fileUrl}`}
                                target="_blank"
                              >
                                Download Instructions
                              </Button>
                            )}
                          </Box>
                          {submission?.feedback && (
                            <Alert severity="info" sx={{ mt: 2 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                Instructor Feedback:
                              </Typography>
                              <Typography variant="body2">{submission.feedback}</Typography>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Card sx={{ p: 6, textAlign: 'center' }}>
                <AssignmentIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                  {searchQuery ? 'No assignments found' : 'No assignments available'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  {isInstructor
                    ? 'Create your first assignment to get started!'
                    : 'No assignments have been created yet.'}
                </Typography>
              </Card>
            )}
          </TabPanel>

          {/* Resource Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                borderRadius: 2,
                minWidth: 200,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <MenuItem onClick={handleDeleteResource} sx={{ color: '#ef4444' }}>
              <DeleteIcon sx={{ mr: 1.5, fontSize: 20 }} />
              Delete
            </MenuItem>
          </Menu>

          {/* Upload Resource Dialog */}
          <Dialog
            open={openResource}
            onClose={() => setOpenResource(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
              },
            }}
          >
            <DialogTitle
              sx={{
                fontWeight: 600,
                fontSize: '1.5rem',
                color: '#1e293b',
                pb: 1,
              }}
            >
              Upload Learning Resource
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Title"
                value={resourceFormData.title}
                onChange={(e) => setResourceFormData({ ...resourceFormData, title: e.target.value })}
                sx={{ mt: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Description"
                value={resourceFormData.description}
                onChange={(e) => setResourceFormData({ ...resourceFormData, description: e.target.value })}
                multiline
                rows={3}
                sx={{ mt: 2 }}
              />
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
                sx={{ mt: 2 }}
              >
                {file ? 'Change File' : 'Select File'}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </Button>
              {file && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#f1f5f9', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {file.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {formatFileSize(file.size)}
                      </Typography>
                    </Box>
                    <IconButton size="small" onClick={() => setFile(null)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={() => {
                  setOpenResource(false);
                  setResourceFormData({ title: '', description: '' });
                  setFile(null);
                }}
                sx={{
                  color: '#64748b',
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUploadResource}
                variant="contained"
                disabled={!file || !resourceFormData.title || uploadResourceMutation.isLoading}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  },
                }}
              >
                {uploadResourceMutation.isLoading ? <CircularProgress size={24} /> : 'Upload'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Create Assignment Dialog */}
          <Dialog
            open={openAssignment}
            onClose={() => setOpenAssignment(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
              },
            }}
          >
            <DialogTitle
              sx={{
                fontWeight: 600,
                fontSize: '1.5rem',
                color: '#1e293b',
                pb: 1,
              }}
            >
              Create Assignment
            </DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Title"
                value={assignmentFormData.title}
                onChange={(e) => setAssignmentFormData({ ...assignmentFormData, title: e.target.value })}
                sx={{ mt: 2 }}
                required
              />
              <TextField
                fullWidth
                label="Description"
                value={assignmentFormData.description}
                onChange={(e) => setAssignmentFormData({ ...assignmentFormData, description: e.target.value })}
                multiline
                rows={4}
                sx={{ mt: 2 }}
                required
              />
              <TextField
                fullWidth
                type="datetime-local"
                label="Due Date"
                value={assignmentFormData.dueDate}
                onChange={(e) => setAssignmentFormData({ ...assignmentFormData, dueDate: e.target.value })}
                sx={{ mt: 2 }}
                InputLabelProps={{ shrink: true }}
                required
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={() => {
                  setOpenAssignment(false);
                  setAssignmentFormData({ title: '', description: '', dueDate: '' });
                }}
                sx={{
                  color: '#64748b',
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateAssignment}
                variant="contained"
                disabled={
                  !assignmentFormData.title ||
                  !assignmentFormData.description ||
                  !assignmentFormData.dueDate ||
                  createAssignmentMutation.isLoading
                }
                sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  },
                }}
              >
                {createAssignmentMutation.isLoading ? <CircularProgress size={24} /> : 'Create'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Submit Assignment Dialog */}
          <Dialog
            open={openSubmit}
            onClose={() => setOpenSubmit(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
              },
            }}
          >
            <DialogTitle
              sx={{
                fontWeight: 600,
                fontSize: '1.5rem',
                color: '#1e293b',
                pb: 1,
              }}
            >
              Submit Assignment
            </DialogTitle>
            <DialogContent>
              {selectedAssignment && (
                <Box sx={{ mb: 2, p: 2, backgroundColor: '#f1f5f9', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {selectedAssignment.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Due: {new Date(selectedAssignment.dueDate).toLocaleString()}
                  </Typography>
                </Box>
              )}
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
                sx={{ mt: 2 }}
              >
                {file ? 'Change File' : 'Select File'}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </Button>
              {file && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#f1f5f9', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {file.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {formatFileSize(file.size)}
                      </Typography>
                    </Box>
                    <IconButton size="small" onClick={() => setFile(null)}>
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={() => {
                  setOpenSubmit(false);
                  setFile(null);
                  setSelectedAssignment(null);
                }}
                sx={{
                  color: '#64748b',
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitAssignment}
                variant="contained"
                disabled={!file || submitAssignmentMutation.isLoading}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  },
                }}
              >
                {submitAssignmentMutation.isLoading ? <CircularProgress size={24} /> : 'Submit'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* View Submissions Dialog */}
          <Dialog
            open={openSubmissions}
            onClose={() => {
              setOpenSubmissions(false);
              setSelectedAssignment(null);
            }}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
              },
            }}
          >
            <DialogTitle
              sx={{
                fontWeight: 600,
                fontSize: '1.5rem',
                color: '#1e293b',
                pb: 1,
              }}
            >
              Submissions - {selectedAssignment?.title}
            </DialogTitle>
            <DialogContent>
              {(() => {
                const submissions = assignmentDetails?.submissions || selectedAssignment?.submissions || [];
                return submissions.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    {submissions.map((submission: any) => (
                      <Card key={submission.id} sx={{ mb: 2, border: '1px solid #e2e8f0' }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                {submission.student?.firstName} {submission.student?.lastName}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#64748b', mb: 1 }}>
                                Submitted: {new Date(submission.submittedAt).toLocaleString()}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                <Chip
                                  label={submission.status === 'GRADED' ? 'Graded' : 'Pending'}
                                  color={submission.status === 'GRADED' ? 'success' : 'warning'}
                                  size="small"
                                />
                                {submission.grade !== null && submission.grade !== undefined && (
                                  <Chip
                                    icon={<GradeIcon />}
                                    label={`Grade: ${submission.grade}%`}
                                    color="primary"
                                    size="small"
                                  />
                                )}
                              </Box>
                              {submission.feedback && (
                                <Alert severity="info" sx={{ mb: 2 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                                    Feedback:
                                  </Typography>
                                  <Typography variant="body2">{submission.feedback}</Typography>
                                </Alert>
                              )}
                              <Button
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${submission.fileUrl}`}
                                target="_blank"
                                sx={{ mr: 1 }}
                              >
                                Download Submission
                              </Button>
                            </Box>
                          </Box>
                          {submission.status !== 'GRADED' && (
                            <Button
                              variant="contained"
                              startIcon={<GradeIcon />}
                              onClick={() => {
                                setSelectedSubmission(submission);
                                setOpenGrade(true);
                                setOpenSubmissions(false);
                              }}
                              sx={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                fontWeight: 600,
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                },
                              }}
                            >
                              Grade Assignment
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" sx={{ color: '#64748b' }}>
                      No submissions yet
                    </Typography>
                  </Box>
                );
              })()}
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={() => {
                  setOpenSubmissions(false);
                  setSelectedAssignment(null);
                }}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Grade Assignment Dialog */}
          <Dialog
            open={openGrade}
            onClose={() => {
              setOpenGrade(false);
              setSelectedSubmission(null);
              setGradeFormData({ grade: '', feedback: '' });
            }}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
              },
            }}
          >
            <DialogTitle
              sx={{
                fontWeight: 600,
                fontSize: '1.5rem',
                color: '#1e293b',
                pb: 1,
              }}
            >
              Grade Assignment
            </DialogTitle>
            <DialogContent>
              {selectedSubmission && (
                <Box sx={{ mb: 2, p: 2, backgroundColor: '#f1f5f9', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Student: {selectedSubmission.student?.firstName} {selectedSubmission.student?.lastName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Submitted: {new Date(selectedSubmission.submittedAt).toLocaleString()}
                  </Typography>
                </Box>
              )}
              <TextField
                fullWidth
                label="Grade (%)"
                type="number"
                value={gradeFormData.grade}
                onChange={(e) => setGradeFormData({ ...gradeFormData, grade: e.target.value })}
                sx={{ mt: 2 }}
                inputProps={{ min: 0, max: 100, step: 0.1 }}
                required
              />
              <TextField
                fullWidth
                label="Feedback"
                value={gradeFormData.feedback}
                onChange={(e) => setGradeFormData({ ...gradeFormData, feedback: e.target.value })}
                multiline
                rows={4}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button
                onClick={() => {
                  setOpenGrade(false);
                  setGradeFormData({ grade: '', feedback: '' });
                  setSelectedSubmission(null);
                }}
                sx={{
                  color: '#64748b',
                  fontWeight: 500,
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGradeAssignment}
                variant="contained"
                disabled={!gradeFormData.grade || gradeAssignmentMutation.isLoading}
                sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  },
                }}
              >
                {gradeAssignmentMutation.isLoading ? <CircularProgress size={24} /> : 'Grade'}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Layout>
  );
};

export default LearningZone;
