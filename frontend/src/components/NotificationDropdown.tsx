import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Popover,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  IconButton,
  Button,
  Badge,
  alpha,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  Receipt as ReceiptIcon,
  LocalPharmacy as PharmacyIcon,
  Assignment as AssignmentIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../services/authService';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'ARCHIVED';
  link?: string;
  metadata?: string;
  readAt?: string;
  createdAt: string;
}

const NotificationDropdown: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notificationsData, isLoading } = useQuery(
    'notifications',
    () => api.get('/notifications?limit=20').then(res => res.data),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const notifications = notificationsData?.notifications || [];
  const unreadCount = notificationsData?.unreadCount || 0;

  // Mark as read mutation
  const markAsReadMutation = useMutation(
    (id: string) => api.put(`/notifications/${id}/read`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
      },
    }
  );

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation(
    () => api.put('/notifications/mark-all-read'),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
      },
    }
  );

  // Delete notification mutation
  const deleteNotificationMutation = useMutation(
    (id: string) => api.delete(`/notifications/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
      },
    }
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.status === 'UNREAD') {
      markAsReadMutation.mutate(notification.id);
    }
    
    if (notification.link) {
      navigate(notification.link);
      handleClose();
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotificationMutation.mutate(id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'APPOINTMENT':
      case 'APPOINTMENT_REMINDER':
      case 'APPOINTMENT_CANCELLED':
        return <CalendarIcon sx={{ fontSize: 20 }} />;
      case 'PAYMENT':
      case 'PAYMENT_SUCCESS':
      case 'PAYMENT_FAILED':
      case 'BILLING':
      case 'INVOICE':
        return <ReceiptIcon sx={{ fontSize: 20 }} />;
      case 'PRESCRIPTION':
        return <PharmacyIcon sx={{ fontSize: 20 }} />;
      case 'ASSIGNMENT':
      case 'ASSIGNMENT_GRADED':
        return <AssignmentIcon sx={{ fontSize: 20 }} />;
      case 'URGENT_CARE':
        return <WarningIcon sx={{ fontSize: 20 }} />;
      default:
        return <InfoIcon sx={{ fontSize: 20 }} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'APPOINTMENT_REMINDER':
        return '#3b82f6';
      case 'PAYMENT_SUCCESS':
        return '#10b981';
      case 'PAYMENT_FAILED':
      case 'URGENT_CARE':
        return '#ef4444';
      case 'ASSIGNMENT_GRADED':
        return '#8b5cf6';
      default:
        return '#64748b';
    }
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: '#64748b',
          '&:hover': {
            backgroundColor: alpha('#2563eb', 0.05),
          },
        }}
      >
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 380,
            maxWidth: '90vw',
            maxHeight: '80vh',
            mt: 1,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            borderRadius: 2,
            overflow: 'hidden',
          },
        }}
      >
        <Paper
          sx={{
            p: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.125rem' }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={handleMarkAllAsRead}
                disabled={markAllAsReadMutation.isLoading}
                sx={{
                  color: 'white',
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                Mark all as read
              </Button>
            )}
          </Box>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </Typography>
        </Paper>

        <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <NotificationsIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                No notifications yet
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {notifications.map((notification: Notification, index: number) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    disablePadding
                    sx={{
                      backgroundColor: notification.status === 'UNREAD' ? alpha('#2563eb', 0.05) : 'transparent',
                      borderLeft: notification.status === 'UNREAD' ? '3px solid #2563eb' : 'none',
                      '&:hover': {
                        backgroundColor: alpha('#2563eb', 0.08),
                      },
                    }}
                  >
                    <ListItemButton
                      onClick={() => handleNotificationClick(notification)}
                      sx={{ py: 1.5, px: 2 }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          backgroundColor: alpha(getNotificationColor(notification.type), 0.1),
                          color: getNotificationColor(notification.type),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </Box>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: notification.status === 'UNREAD' ? 600 : 500,
                                fontSize: '0.875rem',
                                flex: 1,
                              }}
                            >
                              {notification.title}
                            </Typography>
                            {notification.status === 'UNREAD' && (
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: '50%',
                                  backgroundColor: '#2563eb',
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#64748b',
                                fontSize: '0.8125rem',
                                display: 'block',
                                mb: 0.5,
                              }}
                            >
                              {notification.message}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#94a3b8',
                                fontSize: '0.75rem',
                              }}
                            >
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </Typography>
                          </Box>
                        }
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => handleDelete(e, notification.id)}
                        sx={{
                          ml: 1,
                          color: '#94a3b8',
                          '&:hover': {
                            color: '#ef4444',
                            backgroundColor: alpha('#ef4444', 0.1),
                          },
                        }}
                      >
                        <CloseIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </ListItemButton>
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationDropdown;
