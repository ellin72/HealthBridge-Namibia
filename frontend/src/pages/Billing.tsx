import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Billing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery(
    'billing-stats',
    () => api.get('/billing/stats').then(res => res.data.stats)
  );

  const { data: invoicesData, isLoading: invoicesLoading } = useQuery(
    ['invoices', statusFilter],
    () => {
      const params = statusFilter !== 'ALL' ? { status: statusFilter } : {};
      return api.get('/billing', { params }).then(res => res.data);
    }
  );

  const invoices = invoicesData?.invoices || [];

  if (statsLoading || invoicesLoading) {
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

  const statCards = [
    {
      title: 'Total Revenue',
      value: `NAD ${stats?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: <MoneyIcon />,
      color: '#10b981',
    },
    {
      title: 'Total Invoices',
      value: stats?.totalInvoices || 0,
      icon: <ReceiptIcon />,
      color: '#2563eb',
    },
    {
      title: 'Pending',
      value: stats?.pendingInvoices || 0,
      icon: <ScheduleIcon />,
      color: '#f59e0b',
    },
    {
      title: 'Overdue',
      value: stats?.overdueInvoices || 0,
      icon: <WarningIcon />,
      color: '#ef4444',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'OVERDUE':
        return 'error';
      case 'CANCELLED':
        return 'default';
      default:
        return 'default';
    }
  };

  const handleViewDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setDetailOpen(true);
  };

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
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Billing & Invoices
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage invoices, track payments, and view billing statistics
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  border: '1px solid #e2e8f0',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        backgroundColor: `${stat.color}15`,
                        color: stat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {stat.value}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Filters and Actions */}
        <Card sx={{ mb: 3, border: '1px solid #e2e8f0' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FilterIcon color="action" />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="ALL">All Status</MenuItem>
                    <MenuItem value="PENDING">Pending</MenuItem>
                    <MenuItem value="PAID">Paid</MenuItem>
                    <MenuItem value="OVERDUE">Overdue</MenuItem>
                    <MenuItem value="CANCELLED">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card sx={{ border: '1px solid #e2e8f0' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Invoices
            </Typography>
            {invoices.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No invoices found
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Invoice #</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Patient</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.map((invoice: any) => (
                      <TableRow key={invoice.id} hover>
                        <TableCell>{invoice.invoiceNumber || `INV-${invoice.id.slice(0, 8)}`}</TableCell>
                        <TableCell>
                          {invoice.patient
                            ? `${invoice.patient.firstName} ${invoice.patient.lastName}`
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {invoice.createdAt
                            ? new Date(invoice.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          NAD {invoice.total?.toFixed(2) || '0.00'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={invoice.status || 'PENDING'}
                            size="small"
                            color={getStatusColor(invoice.status) as any}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            onClick={() => handleViewDetails(invoice)}
                            sx={{ textTransform: 'none' }}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Invoice Details Dialog */}
        <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Invoice Details - {selectedInvoice?.invoiceNumber || `INV-${selectedInvoice?.id?.slice(0, 8)}`}
          </DialogTitle>
          <DialogContent>
            {selectedInvoice && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Invoice Number
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                      {selectedInvoice.invoiceNumber || `INV-${selectedInvoice.id.slice(0, 8)}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={selectedInvoice.status || 'PENDING'}
                        size="small"
                        color={getStatusColor(selectedInvoice.status) as any}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Patient
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                      {selectedInvoice.patient
                        ? `${selectedInvoice.patient.firstName} ${selectedInvoice.patient.lastName}`
                        : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                      {selectedInvoice.createdAt
                        ? new Date(selectedInvoice.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {selectedInvoice.description || 'No description provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 2,
                        backgroundColor: '#f8fafc',
                        borderRadius: 2,
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Subtotal
                        </Typography>
                        <Typography variant="body1">
                          NAD {selectedInvoice.subtotal?.toFixed(2) || selectedInvoice.total?.toFixed(2) || '0.00'}
                        </Typography>
                      </Box>
                      {selectedInvoice.tax && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Tax
                          </Typography>
                          <Typography variant="body1">
                            NAD {selectedInvoice.tax.toFixed(2)}
                          </Typography>
                        </Box>
                      )}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          pt: 2,
                          borderTop: '1px solid #e2e8f0',
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Total
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          NAD {selectedInvoice.total?.toFixed(2) || '0.00'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailOpen(false)}>Close</Button>
            <Button variant="contained" startIcon={<DownloadIcon />}>
              Download PDF
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
};

export default Billing;

