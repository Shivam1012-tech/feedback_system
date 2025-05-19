import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Modern theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
      light: '#66b2ff',
      dark: '#0056b3',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    h4: {
      fontWeight: 700,
      color: '#333333',
    },
    h6: {
      fontWeight: 500,
      color: '#333333',
    },
    body1: {
      color: '#333333',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
          padding: '16px 32px',
          minWidth: '250px',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
  },
});

const LandingPage = () => {
  const navigate = useNavigate();

  const handleCollegeFeedback = () => {
    navigate('/college-feedback');
  };

  const handleEventFeedback = () => {
    navigate('/event-feedback');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ 
        mt: 8, 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: '#ffffff'
      }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{
          fontSize: '3rem',
          fontWeight: 700,
          mb: 6
        }}>
          Choose Your Feedback Type
        </Typography>
        
        <Box sx={{ 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          alignItems: 'center'
        }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleCollegeFeedback}
            sx={{
              bgcolor: '#007bff',
              '&:hover': {
                bgcolor: '#0056b3'
              }
            }}
          >
            College Feedback
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleEventFeedback}
            sx={{
              bgcolor: '#007bff',
              '&:hover': {
                bgcolor: '#0056b3'
              }
            }}
          >
            Event Feedback
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default LandingPage;
