import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, CircularProgress, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocumentationViewerProps {
  title: string;
  content: string;
  loading?: boolean;
}

const DocumentationViewer: React.FC<DocumentationViewerProps> = ({
  title,
  content,
  loading = false,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 3, color: '#64748b' }}
      >
        Back to Home
      </Button>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: '1px solid #e2e8f0',
          borderRadius: 3,
          backgroundColor: '#ffffff',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: '#1e293b',
            mb: 4,
            pb: 2,
            borderBottom: '2px solid #e2e8f0',
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            '& h1': {
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1e293b',
              mt: 4,
              mb: 2,
            },
            '& h2': {
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#1e293b',
              mt: 3,
              mb: 1.5,
            },
            '& h3': {
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1e293b',
              mt: 2,
              mb: 1,
            },
            '& h4': {
              fontSize: '1.125rem',
              fontWeight: 600,
              color: '#1e293b',
              mt: 2,
              mb: 1,
            },
            '& p': {
              fontSize: '1rem',
              lineHeight: 1.8,
              color: '#475569',
              mb: 1.5,
            },
            '& ul, & ol': {
              mb: 2,
              pl: 3,
            },
            '& li': {
              fontSize: '1rem',
              lineHeight: 1.8,
              color: '#475569',
              mb: 0.5,
            },
            '& code': {
              backgroundColor: '#f1f5f9',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              color: '#e11d48',
            },
            '& pre': {
              backgroundColor: '#1e293b',
              color: '#f1f5f9',
              padding: '1rem',
              borderRadius: '8px',
              overflow: 'auto',
              mb: 2,
              '& code': {
                backgroundColor: 'transparent',
                padding: 0,
                color: '#f1f5f9',
              },
            },
            '& blockquote': {
              borderLeft: '4px solid #667eea',
              pl: 2,
              ml: 0,
              fontStyle: 'italic',
              color: '#64748b',
              mb: 2,
            },
            '& table': {
              width: '100%',
              borderCollapse: 'collapse',
              mb: 2,
            },
            '& th, & td': {
              border: '1px solid #e2e8f0',
              padding: '0.75rem',
              textAlign: 'left',
            },
            '& th': {
              backgroundColor: '#f8fafc',
              fontWeight: 600,
              color: '#1e293b',
            },
            '& a': {
              color: '#667eea',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            '& strong': {
              fontWeight: 600,
              color: '#1e293b',
            },
            '& em': {
              fontStyle: 'italic',
            },
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </Box>
      </Paper>
    </Container>
  );
};

export default DocumentationViewer;

