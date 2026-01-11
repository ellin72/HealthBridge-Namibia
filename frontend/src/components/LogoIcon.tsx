import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface LogoIconProps {
  sx?: SxProps<Theme>;
  fontSize?: number | string | { [key: string]: number | string };
}

const LogoIcon: React.FC<LogoIconProps> = ({ sx, fontSize = 24 }) => {
  // Handle responsive fontSize values
  const getSizeSx = () => {
    if (typeof fontSize === 'object' && fontSize !== null && !Array.isArray(fontSize)) {
      // Responsive object like { xs: 28, sm: 32 }
      const responsiveSx: any = {};
      Object.keys(fontSize).forEach((key) => {
        const value = fontSize[key];
        const size = typeof value === 'string' 
          ? { small: 20, medium: 24, large: 32 }[value] || 24
          : value;
        responsiveSx[key] = { width: size, height: size };
      });
      return responsiveSx;
    }
    
    // Single value
    const size = typeof fontSize === 'string' 
      ? { small: 20, medium: 24, large: 32 }[fontSize] || 24
      : fontSize;
    
    return { width: size, height: size };
  };

  return (
    <Box
      component="img"
      src="/healthbridge-logo.png"
      alt="HealthBridge Logo"
      sx={{
        objectFit: 'contain',
        display: 'inline-block',
        ...getSizeSx(),
        ...sx,
      }}
    />
  );
};

export default LogoIcon;
