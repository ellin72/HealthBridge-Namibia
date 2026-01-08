import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  TextField,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Verified as VerifiedIcon,
  LocalHospital as HospitalIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

interface MedicalAidInfo {
  id: string;
  scheme: 'NAMMED' | 'MEDICAL_AID_FUND' | 'PROSANA' | 'OTHER';
  schemeName?: string;
  memberNumber: string;
  policyNumber?: string;
  isActive: boolean;
  verifiedAt?: string;
}

interface Claim {
  id: string;
  claimNumber: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  appointmentId?: string;
}

const MedicalAid: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [medicalAidData, setMedicalAidData] = useState({
    scheme: 'NAMMED' as MedicalAidInfo['scheme'],
    schemeName: '',
    memberNumber: '',
    policyNumber: ''
  });

  const { data: medicalAidInfo, isLoading: infoLoading } = useQuery(
    'medical-aid',
    () => api.get('/medical-aid').then(res => res.data.medicalAidInfo),
    { enabled: !!user }
  );

  const { data: claims, isLoading: claimsLoading } = useQuery(
    'medical-aid-claims',
    () => api.get('/medical-aid/claims').then(res => res.data.claims || []),
    { enabled: !!user && !!medicalAidInfo }
  );

  const upsertMutation = useMutation(
    (data: any) => api.post('/medical-aid', data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('medical-aid');
        setEditDialogOpen(false);
      }
    }
  );

  const verifyMutation = useMutation(
    () => api.post('/medical-aid/verify'),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('medical-aid');
        setVerifyDialogOpen(false);
      }
    }
  );

  const handleSave = () => {
    upsertMutation.mutate(medicalAidData);
  };

  const handleVerify = () => {
    verifyMutation.mutate();
  };

  React.useEffect(() => {
    if (medicalAidInfo) {
      setMedicalAidData({
        scheme: medicalAidInfo.scheme,
        schemeName: medicalAidInfo.schemeName || '',
        memberNumber: medicalAidInfo.memberNumber,
        policyNumber: medicalAidInfo.policyNumber || ''
      });
    }
  }, [medicalAidInfo]);

  if (infoLoading) {
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
            Medical Aid Information
          </Typography>
          <Button
            variant="contained"
            startIcon={medicalAidInfo ? <AddIcon /> : <AddIcon />}
            onClick={() => setEditDialogOpen(true)}
          >
            {medicalAidInfo ? 'Update' : 'Add'} Medical Aid
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <HospitalIcon color="primary" fontSize="large" />
                  <Typography variant="h5">Medical Aid Details</Typography>
                </Box>

                {medicalAidInfo ? (
                  <>
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        Scheme
                      </Typography>
                      <Typography variant="h6">{medicalAidInfo.scheme}</Typography>
                    </Box>
                    {medicalAidInfo.schemeName && (
                      <Box mb={2}>
                        <Typography variant="body2" color="text.secondary">
                          Scheme Name
                        </Typography>
                        <Typography variant="body1">{medicalAidInfo.schemeName}</Typography>
                      </Box>
                    )}
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        Member Number
                      </Typography>
                      <Typography variant="body1">{medicalAidInfo.memberNumber}</Typography>
                    </Box>
                    {medicalAidInfo.policyNumber && (
                      <Box mb={2}>
                        <Typography variant="body2" color="text.secondary">
                          Policy Number
                        </Typography>
                        <Typography variant="body1">{medicalAidInfo.policyNumber}</Typography>
                      </Box>
                    )}
                    <Box display="flex" gap={1} flexWrap="wrap" mt={3}>
                      <Chip
                        label={medicalAidInfo.isActive ? 'Active' : 'Inactive'}
                        color={medicalAidInfo.isActive ? 'success' : 'default'}
                      />
                      {medicalAidInfo.verifiedAt && (
                        <Chip
                          label="Verified"
                          color="success"
                          icon={<VerifiedIcon />}
                        />
                      )}
                    </Box>
                    {!medicalAidInfo.verifiedAt && (
                      <Button
                        variant="outlined"
                        startIcon={<VerifiedIcon />}
                        onClick={() => setVerifyDialogOpen(true)}
                        sx={{ mt: 2 }}
                      >
                        Verify Medical Aid
                      </Button>
                    )}
                  </>
                ) : (
                  <Alert severity="info">
                    No medical aid information found. Please add your medical aid details.
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <ReceiptIcon color="primary" fontSize="large" />
                  <Typography variant="h5">Claims History</Typography>
                </Box>

                {claimsLoading ? (
                  <CircularProgress />
                ) : claims && claims.length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Claim Number</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {claims.map((claim: Claim) => (
                          <TableRow key={claim.id}>
                            <TableCell>{claim.claimNumber}</TableCell>
                            <TableCell>NAD {claim.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <Chip
                                label={claim.status}
                                color={
                                  claim.status === 'APPROVED'
                                    ? 'success'
                                    : claim.status === 'REJECTED'
                                    ? 'error'
                                    : 'warning'
                                }
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {new Date(claim.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity="info">No claims found.</Alert>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Edit Medical Aid Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>{medicalAidInfo ? 'Update' : 'Add'} Medical Aid Information</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              select
              label="Scheme"
              value={medicalAidData.scheme}
              onChange={(e) => setMedicalAidData({ ...medicalAidData, scheme: e.target.value as MedicalAidInfo['scheme'] })}
              margin="normal"
              required
              SelectProps={{
                native: true
              }}
            >
              <option value="NAMMED">NAMMED</option>
              <option value="MEDICAL_AID_FUND">Medical Aid Fund</option>
              <option value="PROSANA">Prosana</option>
              <option value="OTHER">Other</option>
            </TextField>
            <TextField
              fullWidth
              label="Scheme Name (Optional)"
              value={medicalAidData.schemeName}
              onChange={(e) => setMedicalAidData({ ...medicalAidData, schemeName: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Member Number"
              value={medicalAidData.memberNumber}
              onChange={(e) => setMedicalAidData({ ...medicalAidData, memberNumber: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Policy Number (Optional)"
              value={medicalAidData.policyNumber}
              onChange={(e) => setMedicalAidData({ ...medicalAidData, policyNumber: e.target.value })}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={!medicalAidData.memberNumber}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Verify Dialog */}
        <Dialog open={verifyDialogOpen} onClose={() => setVerifyDialogOpen(false)}>
          <DialogTitle>Verify Medical Aid</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mb: 2 }}>
              This will verify your medical aid membership with the scheme provider.
            </Alert>
            <Typography>Are you sure you want to verify your medical aid information?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setVerifyDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleVerify} variant="contained" color="primary">
              Verify
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default MedicalAid;

