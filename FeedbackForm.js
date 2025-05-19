import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  CssBaseline,
  ThemeProvider,
  createTheme,
  Snackbar,
  Alert
} from '@mui/material';
import axios from 'axios';

const FeedbackForm = ({ feedbackType = "Event" }) => {
  // Theme configuration
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
            padding: '8px 24px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: '#ffffff',
            color: '#333333',
          },
        },
      },
    },
  });

  const [feedback, setFeedback] = useState('');
  const [event, setEvent] = useState('');
  const [emoji, setEmoji] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/api/submit-feedback', {
        feedback,
        event,
        emoji
      });
      
      if (response.status === 200) {
        setFeedback('');
        setEvent('');
        setEmoji('');
        setOpen(true);
        setSeverity('success');
        setMessage('Your feedback submitted successfully');
      } else {
        setOpen(true);
        setSeverity('error');
        setMessage('Try again with correct feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setOpen(true);
      setSeverity('error');
      setMessage('Try again with correct feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [message, setMessage] = useState('');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      <Container maxWidth="md" sx={{ 
        mt: 4, 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: '#ffffff',
        py: 4
      }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{
          fontSize: '2.5rem',
          fontWeight: 700,
          mb: 4,
          color: '#333333'
        }}>
          {feedbackType === 'College' ? 'College Feedback System' : 'HCL GUVI Hackathon Event Feedback System'}
        </Typography>
        <Paper elevation={3} sx={{ 
          p: 4,
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Submit Your Feedback
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Event/Activity Name"
              variant="outlined"
              value={event}
              onChange={(e) => setEvent(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Feedback"
              variant="outlined"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Button
                variant={emoji === '😊' ? 'contained' : 'outlined'}
                onClick={() => setEmoji('😊')}
                sx={{
                  m: 1,
                  minWidth: '40px',
                  minHeight: '40px',
                  fontSize: '24px'
                }}
              >
                😊
              </Button>
              <Button
                variant={emoji === '😐' ? 'contained' : 'outlined'}
                onClick={() => setEmoji('😐')}
                sx={{
                  m: 1,
                  minWidth: '40px',
                  minHeight: '40px',
                  fontSize: '24px'
                }}
              >
                😐
              </Button>
              <Button
                variant={emoji === '😢' ? 'contained' : 'outlined'}
                onClick={() => setEmoji('😢')}
                sx={{
                  m: 1,
                  minWidth: '40px',
                  minHeight: '40px',
                  fontSize: '24px'
                }}
              >
                😢
              </Button>
            </Box>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{
                mt: 2,
                bgcolor: '#221f1f',
                color: '#ffffff',
                '&:hover': {
                  bgcolor: '#2a2525'
                },
                '&:disabled': {
                  bgcolor: '#333333'
                }
              }}
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </Box>
        </form>

        {success && (
          <Typography variant="body1" color="success.main" align="center" sx={{ mt: 2 }}>
            Feedback submitted successfully!
          </Typography>
        )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default FeedbackForm;
