import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Description as TemplateIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const ClinicalTemplates: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    templateData: '',
    isDefault: false,
  });
  const [error, setError] = useState('');

  const { data: templates, isLoading } = useQuery(
    'clinical-templates',
    () => api.get('/clinical-templates').then(res => res.data.templates || []),
    { enabled: !id }
  );

  // Get single template from the list
  const { data: allTemplates } = useQuery(
    'clinical-templates',
    () => api.get('/clinical-templates').then(res => res.data.templates || []),
    { enabled: !!id }
  );

  const template = id ? allTemplates?.find((t: any) => t.id === id) : null;
  const templateLoading = !!id && !allTemplates;

  const createMutation = useMutation(
    (data: any) => api.post('/clinical-templates', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clinical-templates');
        setOpen(false);
        setFormData({ name: '', category: '', content: '', isDefault: false });
        setError('');
      },
      onError: (err: any) => {
        setError(err.response?.data?.message || 'Failed to create template');
      },
    }
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: any }) => api.put(`/clinical-templates/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clinical-templates');
        queryClient.invalidateQueries(['clinical-template', id]);
        setOpen(false);
        setError('');
        if (id) {
          navigate('/clinical-templates');
        }
      },
      onError: (err: any) => {
        setError(err.response?.data?.message || 'Failed to update template');
      },
    }
  );

  const deleteMutation = useMutation(
    (id: string) => api.delete(`/clinical-templates/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('clinical-templates');
        navigate('/clinical-templates');
      },
    }
  );

  const handleOpen = () => {
    setOpen(true);
    setFormData({ name: '', category: '', templateData: '', isDefault: false });
    setError('');
  };

  const handleEdit = (templateToEdit: any) => {
    // Convert templateData object to string if it's an object
    let templateDataStr = '';
    if (templateToEdit.templateData) {
      if (typeof templateToEdit.templateData === 'object') {
        templateDataStr = JSON.stringify(templateToEdit.templateData, null, 2);
      } else {
        templateDataStr = templateToEdit.templateData;
      }
    }
    
    setFormData({
      name: templateToEdit.name || '',
      category: templateToEdit.category || '',
      templateData: templateDataStr,
      isDefault: templateToEdit.isDefault || false,
    });
    setOpen(true);
    setError('');
  };

  const handleDelete = async (templateId: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      deleteMutation.mutate(templateId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Convert templateData string to object
    let templateDataObj;
    try {
      templateDataObj = JSON.parse(formData.templateData);
    } catch {
      // If not valid JSON, treat as plain text
      templateDataObj = { content: formData.templateData };
    }

    const submitData = {
      name: formData.name,
      category: formData.category,
      templateData: templateDataObj,
      isDefault: formData.isDefault,
    };

    if (id && template) {
      updateMutation.mutate({ id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  // If viewing a single template
  if (id) {
    if (templateLoading) {
      return (
        <Layout>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          </Container>
        </Layout>
      );
    }

    if (!template) {
      return (
        <Layout>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Alert severity="error">Template not found</Alert>
            <Button sx={{ mt: 2 }} onClick={() => navigate('/clinical-templates')}>
              Back to Templates
            </Button>
          </Container>
        </Layout>
      );
    }

    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/clinical-templates')}
              sx={{ mb: 2, color: '#64748b' }}
            >
              Back to Templates
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {template.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip label={template.category} size="small" />
                  {template.isDefault && <Chip label="Default" size="small" color="primary" />}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => handleEdit(template)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDelete(template.id)}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Box>

          <Card sx={{ border: '1px solid #e2e8f0' }}>
            <CardContent>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {template.templateData 
                  ? (typeof template.templateData === 'object' 
                      ? JSON.stringify(template.templateData, null, 2)
                      : template.templateData)
                  : 'No content available'}
              </Typography>
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
            <DialogTitle>Edit Template</DialogTitle>
            <form onSubmit={handleSubmit}>
              <DialogContent>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                <TextField
                  fullWidth
                  label="Template Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category"
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <MenuItem value="CONSULTATION">Consultation</MenuItem>
                    <MenuItem value="ASSESSMENT">Assessment</MenuItem>
                    <MenuItem value="TREATMENT">Treatment</MenuItem>
                    <MenuItem value="FOLLOW_UP">Follow-up</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Template Content (JSON or plain text)"
                  value={formData.templateData}
                  onChange={(e) => setFormData({ ...formData, templateData: e.target.value })}
                  multiline
                  rows={10}
                  required
                  placeholder='Enter template content as JSON object or plain text...'
                  helperText="You can enter JSON format like: { 'sections': [...] } or plain text"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" variant="contained">
                  Update Template
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        </Container>
      </Layout>
    );
  }

  // List view
  if (isLoading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ mb: 2, color: '#64748b' }}
          >
            Back to Dashboard
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Clinical Templates
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
              New Template
            </Button>
          </Box>
        </Box>

        {templates && templates.length > 0 ? (
          <Grid container spacing={3}>
            {templates.map((template: any) => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <Card
                  sx={{
                    border: '1px solid #e2e8f0',
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s',
                    },
                  }}
                  onClick={() => navigate(`/clinical-templates/${template.id}`)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TemplateIcon sx={{ mr: 1, color: '#2563eb' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                        {template.name}
                      </Typography>
                      {template.isDefault && (
                        <Chip label="Default" size="small" color="primary" />
                      )}
                    </Box>
                    <Chip
                      label={template.category}
                      size="small"
                      variant="outlined"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card sx={{ p: 4, textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              No templates yet. Create your first clinical template to get started!
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
              Create Template
            </Button>
          </Card>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{id ? 'Edit Template' : 'Create New Template'}</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                fullWidth
                label="Template Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <MenuItem value="CONSULTATION">Consultation</MenuItem>
                  <MenuItem value="ASSESSMENT">Assessment</MenuItem>
                  <MenuItem value="TREATMENT">Treatment</MenuItem>
                  <MenuItem value="FOLLOW_UP">Follow-up</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                multiline
                rows={10}
                required
                placeholder="Enter template content here..."
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">
                {id ? 'Update' : 'Create'} Template
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default ClinicalTemplates;

