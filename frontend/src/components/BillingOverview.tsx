import React from 'react';
import { useQuery } from 'react-query';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import api from '../services/authService';
import { useNavigate } from 'react-router-dom';

const BillingOverview: React.FC = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useQuery(
    'billing-stats',
    () => api.get('/billing/stats').then(res => res.data.stats)
  );

  const { data: invoices } = useQuery(
    'recent-invoices',
    () => api.get('/billing?status=PENDING').then(res => res.data.invoices.slice(0, 5))
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `NAD ${stats?.totalRevenue.toFixed(2) || '0.00'}`,
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Billing Overview
        </Typography>
        <Button variant="contained" onClick={() => navigate('/billing')}>
          View All
        </Button>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
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
                      width: 40,
                      height: 40,
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

      {invoices && invoices.length > 0 && (
        <Card sx={{ border: '1px solid #e2e8f0' }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Pending Invoices
            </Typography>
            {invoices.map((invoice: any) => (
              <Box
                key={invoice.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1.5,
                  borderBottom: '1px solid #e2e8f0',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {invoice.invoiceNumber}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {invoice.patient?.firstName} {invoice.patient?.lastName}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    NAD {invoice.total.toFixed(2)}
                  </Typography>
                  <Chip
                    label={invoice.status}
                    size="small"
                    color={invoice.status === 'OVERDUE' ? 'error' : 'warning'}
                  />
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default BillingOverview;

