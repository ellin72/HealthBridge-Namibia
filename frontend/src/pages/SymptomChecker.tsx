import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Warning, Error, Info } from '@mui/icons-material';
import Layout from '../components/Layout';
import api from '../services/authService';

const SymptomChecker: React.FC = () => {
  const { t } = useTranslation();
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState<any>(null);

  const commonSymptoms = [
    'Fever',
    'Headache',
    'Cough',
    'Sore throat',
    'Fatigue',
    'Nausea',
    'Dizziness',
    'Chest pain',
    'Difficulty breathing',
    'Abdominal pain',
  ];

  const addSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom('');
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter((s) => s !== symptom));
  };

  const handleCheckSymptoms = async () => {
    if (symptoms.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/triage/assess', {
        symptoms,
        description,
      });
      setAssessment(response.data.assessment);
    } catch (error: any) {
      console.error('Triage assessment error:', error);
      alert('Failed to assess symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'EMERGENCY':
        return 'error';
      case 'URGENT':
        return 'warning';
      case 'HIGH':
        return 'info';
      default:
        return 'success';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'EMERGENCY':
        return <Error />;
      case 'URGENT':
        return <Warning />;
      case 'HIGH':
        return <Info />;
      default:
        return <CheckCircle />;
    }
  };

  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          {t('symptomChecker')}
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {t('describeSymptoms')}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Add symptom"
                value={currentSymptom}
                onChange={(e) => setCurrentSymptom(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addSymptom();
                  }
                }}
                sx={{ mb: 1 }}
              />
              <Button
                variant="outlined"
                onClick={addSymptom}
                disabled={!currentSymptom.trim()}
              >
                Add Symptom
              </Button>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                Common symptoms:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {commonSymptoms.map((symptom) => (
                  <Chip
                    key={symptom}
                    label={symptom}
                    onClick={() => {
                      if (!symptoms.includes(symptom)) {
                        setSymptoms([...symptoms, symptom]);
                      }
                    }}
                    color={symptoms.includes(symptom) ? 'primary' : 'default'}
                  />
                ))}
              </Box>
            </Box>

            {symptoms.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Selected symptoms:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {symptoms.map((symptom) => (
                    <Chip
                      key={symptom}
                      label={symptom}
                      onDelete={() => removeSymptom(symptom)}
                      color="primary"
                    />
                  ))}
                </Box>
              </Box>
            )}

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Additional description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={handleCheckSymptoms}
              disabled={symptoms.length === 0 || loading}
              size="large"
            >
              {loading ? <CircularProgress size={24} /> : t('checkSymptoms')}
            </Button>
          </CardContent>
        </Card>

        {assessment && (
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Alert
                    severity={getUrgencyColor(assessment.urgency)}
                    icon={getUrgencyIcon(assessment.urgency)}
                    sx={{ mb: 2 }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {t('urgency')}: {assessment.urgency}
                    </Typography>
                  </Alert>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {t('recommendedAction')}:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {assessment.recommendedAction}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    AI Recommendation:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {assessment.aiRecommendation}
                  </Typography>
                </Grid>

                {assessment.followUpDate && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Recommended follow-up: {new Date(assessment.followUpDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}

                {assessment.aiConfidence && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      AI Confidence: {Math.round(assessment.aiConfidence * 100)}%
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>
    </Layout>
  );
};

export default SymptomChecker;

