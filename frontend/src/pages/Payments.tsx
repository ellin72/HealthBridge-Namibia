import React, { useState } from 'react';
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
  Chip,
  Button,
  Alert
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  CheckCircle as SuccessIcon,
  Pending as PendingIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

interface Payment {
  id: string;
  amount: number;
  currency: string;
  method: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  transactionId?: string;
  paymentReference?: string;
  createdAt: string;
  completedAt?: string;
  invoice?: {
    id: string;
    invoiceNumber: string;
    total: number;
  };
}

const Payments: React.FC = () => {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const { data: paymentsData, isLoading } = useQuery(
    'payments',
    () => api.get('/payments').then(res => res.data),
    { enabled: !!user }
  );

  const payments = paymentsData?.payments || [];

  const filteredPayments = payments.filter((payment: Payment) => {
    if (filterStatus === 'all') return true;
    return payment.status === filterStatus;
  });

  const getStatusIcon = (status: string): JSX.Element | undefined => {
    switch (status) {
      case 'COMPLETED':
        return <SuccessIcon color="success" />;
      case 'PENDING':
        return <PendingIcon color="warning" />;
      case 'FAILED':
        return <ErrorIcon color="error" />;
      default:
        return undefined;
    }
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  const totalAmount = payments.reduce((sum: number, p: Payment) => {
    if (p.status === 'COMPLETED') return sum + p.amount;
    return sum;
  }, 0);

  const pendingAmount = payments.reduce((sum: number, p: Payment) => {
    if (p.status === 'PENDING') return sum + p.amount;
    return sum;
  }, 0);

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
            Payment History
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <PaymentIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Paid
                    </Typography>
                    <Typography variant="h5">NAD {totalAmount.toFixed(2)}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <PendingIcon color="warning" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Pending
                    </Typography>
                    <Typography variant="h5">NAD {pendingAmount.toFixed(2)}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <ReceiptIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Payments
                    </Typography>
                    <Typography variant="h5">{payments.length}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
              <Button
                variant={filterStatus === 'all' ? 'contained' : 'outlined'}
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'COMPLETED' ? 'contained' : 'outlined'}
                onClick={() => setFilterStatus('COMPLETED')}
              >
                Completed
              </Button>
              <Button
                variant={filterStatus === 'PENDING' ? 'contained' : 'outlined'}
                onClick={() => setFilterStatus('PENDING')}
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === 'FAILED' ? 'contained' : 'outlined'}
                onClick={() => setFilterStatus('FAILED')}
              >
                Failed
              </Button>
            </Box>

            {filteredPayments.length === 0 ? (
              <Alert severity="info">No payments found.</Alert>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Reference</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Invoice</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPayments.map((payment: Payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {payment.paymentReference || payment.transactionId || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" fontWeight="medium">
                            {payment.currency} {payment.amount.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={payment.method.replace(/_/g, ' ')} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(payment.status)}
                            label={payment.status}
                            color={getStatusColor(payment.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {payment.invoice ? (
                            <Typography variant="body2">
                              {payment.invoice.invoiceNumber}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              N/A
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default Payments;

