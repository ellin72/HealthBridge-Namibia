import React from 'react';
import { useQuery } from 'react-query';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

interface EarningsData {
  totalEarnings: number;
  thisMonth: number;
  lastMonth: number;
  pendingPayments: number;
  earnings: Array<{
    id: string;
    amount: number;
    appointmentId: string;
    status: 'PENDING' | 'PAID';
    createdAt: string;
    paidAt?: string;
  }>;
}

const ProviderEarnings: React.FC = () => {
  const { user } = useAuth();

  const { data: earningsData, isLoading } = useQuery(
    'provider-earnings',
    () => api.get('/provider-earnings').then(res => res.data.data),
    {
      enabled: !!user && user.role === 'HEALTHCARE_PROVIDER'
    }
  );

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

  if (!earningsData) {
    return (
      <Layout>
        <Container>
          <Typography variant="h6" color="error">
            You don't have permission to view earnings data.
          </Typography>
        </Container>
      </Layout>
    );
  }

  const data = earningsData as EarningsData;

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Provider Earnings
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <MoneyIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Earnings
                    </Typography>
                    <Typography variant="h5">NAD {data.totalEarnings?.toFixed(2) || '0.00'}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <CalendarIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      This Month
                    </Typography>
                    <Typography variant="h5">NAD {data.thisMonth?.toFixed(2) || '0.00'}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <TrendingUpIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Month
                    </Typography>
                    <Typography variant="h5">NAD {data.lastMonth?.toFixed(2) || '0.00'}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <MoneyIcon color="warning" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Pending
                    </Typography>
                    <Typography variant="h5">NAD {data.pendingPayments?.toFixed(2) || '0.00'}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Earnings History
            </Typography>
            {data.earnings && data.earnings.length > 0 ? (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Appointment ID</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Paid Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.earnings.map((earning) => (
                      <TableRow key={earning.id}>
                        <TableCell>
                          {new Date(earning.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{earning.appointmentId}</TableCell>
                        <TableCell>
                          <Typography variant="body1" fontWeight="medium">
                            NAD {earning.amount.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={earning.status}
                            color={earning.status === 'PAID' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {earning.paidAt
                            ? new Date(earning.paidAt).toLocaleDateString()
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No earnings history available.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default ProviderEarnings;

