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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Policy as PolicyIcon,
  CheckCircle as ActiveIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

interface Policy {
  id: string;
  policyType: string;
  title: string;
  content: string;
  version: number;
  isActive: boolean;
  effectiveDate: string;
  expiryDate?: string;
  createdAt: string;
}

const Policies: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tabValue, setTabValue] = useState(0);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [expandedPolicy, setExpandedPolicy] = useState<string | false>(false);
  const [newPolicy, setNewPolicy] = useState({
    policyType: '',
    title: '',
    content: '',
    effectiveDate: new Date().toISOString().split('T')[0]
  });

  const { data: policies, isLoading } = useQuery(
    'policies',
    () => api.get('/policies').then(res => res.data.data || []),
    { enabled: !!user }
  );

  const createPolicyMutation = useMutation(
    (data: any) => api.post('/policies', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('policies');
        setCreateDialogOpen(false);
        setNewPolicy({
          policyType: '',
          title: '',
          content: '',
          effectiveDate: new Date().toISOString().split('T')[0]
        });
      }
    }
  );

  const handleCreatePolicy = () => {
    createPolicyMutation.mutate(newPolicy);
  };

  const handleAccordionChange = (policyId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPolicy(isExpanded ? policyId : false);
  };

  const policyTypes = ['DATA_RETENTION', 'PRIVACY', 'TERMS_OF_SERVICE', 'REFUND', 'CANCELLATION', 'OTHER'];

  const filteredPolicies = policies?.filter((policy: Policy) => {
    if (tabValue === 0) return policy.isActive;
    if (tabValue === 1) return !policy.isActive;
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
            Policies
          </Typography>
          {user?.role === 'ADMIN' && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              Create Policy
            </Button>
          )}
        </Box>

        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Active" />
              <Tab label="Inactive" />
              <Tab label="All" />
            </Tabs>
          </Box>

          <CardContent>
            {filteredPolicies.length === 0 ? (
              <Alert severity="info">No policies found in this category.</Alert>
            ) : (
              <Box>
                {filteredPolicies.map((policy: Policy) => (
                  <Accordion
                    key={policy.id}
                    expanded={expandedPolicy === policy.id}
                    onChange={handleAccordionChange(policy.id)}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box display="flex" alignItems="center" gap={2} width="100%">
                        <PolicyIcon color="primary" />
                        <Box flex={1}>
                          <Typography variant="h6">{policy.title}</Typography>
                          <Box display="flex" gap={1} mt={1}>
                            <Chip label={policy.policyType} size="small" variant="outlined" />
                            <Chip
                              label={`Version ${policy.version}`}
                              size="small"
                              variant="outlined"
                            />
                            {policy.isActive && (
                              <Chip
                                label="Active"
                                color="success"
                                size="small"
                                icon={<ActiveIcon />}
                              />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Effective: {new Date(policy.effectiveDate).toLocaleDateString()}
                        {policy.expiryDate && ` - Expires: ${new Date(policy.expiryDate).toLocaleDateString()}`}
                      </Typography>
                      <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                        {policy.content}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Create Policy Dialog */}
        <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create New Policy</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              select
              label="Policy Type"
              value={newPolicy.policyType}
              onChange={(e) => setNewPolicy({ ...newPolicy, policyType: e.target.value })}
              margin="normal"
              required
              SelectProps={{
                native: true
              }}
            >
              <option value="">Select Policy Type</option>
              {policyTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </option>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Title"
              value={newPolicy.title}
              onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Content"
              value={newPolicy.content}
              onChange={(e) => setNewPolicy({ ...newPolicy, content: e.target.value })}
              margin="normal"
              multiline
              rows={10}
              required
            />
            <TextField
              fullWidth
              label="Effective Date"
              type="date"
              value={newPolicy.effectiveDate}
              onChange={(e) => setNewPolicy({ ...newPolicy, effectiveDate: e.target.value })}
              margin="normal"
              InputLabelProps={{
                shrink: true
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleCreatePolicy}
              variant="contained"
              disabled={!newPolicy.policyType || !newPolicy.title || !newPolicy.content}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Policies;

