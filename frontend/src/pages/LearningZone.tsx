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
  Alert
} from '@mui/material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const LearningZone: React.FC = () => {
  const { user } = useAuth();
  const [openResource, setOpenResource] = useState(false);
  const [openAssignment, setOpenAssignment] = useState(false);
  const [openSubmit, setOpenSubmit] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { data: resources, isLoading: resourcesLoading } = useQuery(
    'learning-resources',
    () => api.get('/learning/resources').then(res => res.data)
  );

  const { data: assignments, isLoading: assignmentsLoading } = useQuery(
    'assignments',
    () => api.get('/learning/assignments').then(res => res.data)
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
      }
    }
  );

  const createAssignmentMutation = useMutation(
    (data: any) => api.post('/learning/assignments', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('assignments');
        setOpenAssignment(false);
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
      }
    }
  );

  const handleUploadResource = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', (document.getElementById('resource-title') as HTMLInputElement).value);
    formData.append('description', (document.getElementById('resource-description') as HTMLInputElement).value);
    formData.append('isPublished', 'true');
    uploadResourceMutation.mutate(formData);
  };

  const handleSubmitAssignment = () => {
    if (!file || !selectedAssignment) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assignmentId', selectedAssignment);
    submitAssignmentMutation.mutate(formData);
  };

  const isStudent = user?.role === 'STUDENT';
  const isInstructor = user?.role === 'HEALTHCARE_PROVIDER' || user?.role === 'ADMIN';

  return (
    <Layout>
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Learning Zone</Typography>
          <Box>
            {isInstructor && (
              <>
                <Button variant="contained" onClick={() => setOpenResource(true)} sx={{ mr: 1 }}>
                  Upload Resource
                </Button>
                <Button variant="contained" onClick={() => setOpenAssignment(true)}>
                  Create Assignment
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Learning Resources
          </Typography>
          {resourcesLoading ? (
            <Typography>Loading...</Typography>
          ) : resources?.length > 0 ? (
            <Grid container spacing={2}>
              {resources.map((resource: any) => (
                <Grid item xs={12} md={6} key={resource.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{resource.title}</Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {resource.description}
                      </Typography>
                      <Button
                        variant="outlined"
                        href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${resource.fileUrl}`}
                        target="_blank"
                      >
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No resources available</Typography>
          )}
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>
            Assignments
          </Typography>
          {assignmentsLoading ? (
            <Typography>Loading...</Typography>
          ) : assignments?.length > 0 ? (
            <Grid container spacing={2}>
              {assignments.map((assignment: any) => (
                <Grid item xs={12} key={assignment.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{assignment.title}</Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {assignment.description}
                      </Typography>
                      <Typography variant="body2">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </Typography>
                      {isStudent && (
                        <Button
                          variant="contained"
                          sx={{ mt: 2 }}
                          onClick={() => {
                            setSelectedAssignment(assignment.id);
                            setOpenSubmit(true);
                          }}
                        >
                          Submit Assignment
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No assignments available</Typography>
          )}
        </Box>

        {/* Upload Resource Dialog */}
        <Dialog open={openResource} onClose={() => setOpenResource(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Upload Learning Resource</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              id="resource-title"
              label="Title"
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              id="resource-description"
              label="Description"
              multiline
              rows={3}
              sx={{ mt: 2 }}
            />
            <Button variant="outlined" component="label" sx={{ mt: 2 }}>
              Upload File
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </Button>
            {file && <Typography sx={{ mt: 1 }}>{file.name}</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenResource(false)}>Cancel</Button>
            <Button onClick={handleUploadResource} variant="contained" disabled={!file}>
              Upload
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Assignment Dialog */}
        <Dialog open={openAssignment} onClose={() => setOpenAssignment(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create Assignment</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              id="assignment-title"
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              id="assignment-description"
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="Due Date"
              id="assignment-due"
              sx={{ mt: 2 }}
              InputLabelProps={{ shrink: true }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAssignment(false)}>Cancel</Button>
            <Button
              onClick={() => {
                const title = (document.getElementById('assignment-title') as HTMLInputElement).value;
                const description = (document.getElementById('assignment-description') as HTMLInputElement).value;
                const dueDate = (document.getElementById('assignment-due') as HTMLInputElement).value;
                createAssignmentMutation.mutate({ title, description, dueDate });
              }}
              variant="contained"
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>

        {/* Submit Assignment Dialog */}
        <Dialog open={openSubmit} onClose={() => setOpenSubmit(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Submit Assignment</DialogTitle>
          <DialogContent>
            <Button variant="outlined" component="label" sx={{ mt: 2 }}>
              Upload File
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </Button>
            {file && <Typography sx={{ mt: 1 }}>{file.name}</Typography>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenSubmit(false)}>Cancel</Button>
            <Button onClick={handleSubmitAssignment} variant="contained" disabled={!file}>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default LearningZone;

