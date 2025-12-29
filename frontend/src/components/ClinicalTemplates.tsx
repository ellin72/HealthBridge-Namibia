import React from 'react';
import { useQuery } from 'react-query';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
} from '@mui/material';
import {
  Description as TemplateIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import api from '../services/authService';
import { useNavigate } from 'react-router-dom';

const ClinicalTemplates: React.FC = () => {
  const navigate = useNavigate();
  const { data: templates, isLoading } = useQuery(
    'clinical-templates',
    () => api.get('/clinical-templates').then(res => res.data.templates)
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const recentTemplates = templates?.slice(0, 6) || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Clinical Templates
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/clinical-templates')}
        >
          New Template
        </Button>
      </Box>

      {recentTemplates.length > 0 ? (
        <Grid container spacing={2}>
          {recentTemplates.map((template: any) => (
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
          <Button variant="contained" startIcon={<AddIcon />}>
            Create Template
          </Button>
        </Card>
      )}
    </Box>
  );
};

export default ClinicalTemplates;

