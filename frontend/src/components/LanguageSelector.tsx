import React from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';
import api from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const { user } = useAuth();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'af', name: 'Afrikaans' },
    { code: 'ng', name: 'Oshiwambo' },
  ];

  const handleLanguageChange = async (event: any) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);

    // Update user preference in backend
    if (user) {
      try {
        await api.put(`/users/${user.id}`, {
          preferredLanguage: newLanguage.toUpperCase(),
        });
      } catch (error) {
        console.error('Failed to update language preference:', error);
      }
    }
  };

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel>Language</InputLabel>
      <Select
        value={i18n.language}
        label="Language"
        onChange={handleLanguageChange}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            {lang.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;

