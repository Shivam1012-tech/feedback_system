import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';

// Netflix-inspired theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#e50914',
      light: '#ff4500',
      dark: '#b22222',
    },
    background: {
      default: '#000000',
      paper: '#141414',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    h4: {
      fontWeight: 700,
      color: '#ffffff',
    },
    h6: {
      fontWeight: 500,
      color: '#ffffff',
    },
    body1: {
      color: '#ffffff',
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
          backgroundColor: '#141414',
          color: '#ffffff',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: '#141414',
          color: '#ffffff',
        },
      },
    },
  },
});

const AdminDashboard = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total_feedbacks: 0,
    sentiment_stats: {
      positive: 0,
      neutral: 0,
      negative: 0
    },
    emoji_stats: {
      '😊': 0,
      '😐': 0,
      '😢': 0
    },
    feedbacks: []
  });
  const [passwordAttempts, setPasswordAttempts] = useState(0);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Reset password error when password changes
  useEffect(() => {
    setPasswordError('');
    setShowPasswordError(false);
  }, [password]);

  const handleBackToMain = () => {
    // Reset state and redirect to main dashboard
    setIsLoggedIn(false);
    setPasswordAttempts(0);
    setError(null);
    setPasswordError('');
    setShowPasswordError(false);
    window.location.href = '/';
  };

  const getChartData = (stats) => {
    if (!stats) return null;

    // Transform sentiment data
    const sentimentChartData = [
      { category: 'Positive', value: stats.sentiment_stats?.positive || 0 },
      { category: 'Neutral', value: stats.sentiment_stats?.neutral || 0 },
      { category: 'Negative', value: stats.sentiment_stats?.negative || 0 }
    ];

    // Transform emoji data
    const emojiChartData = [
      { emoji: '😊', count: stats.emoji_stats?.['😊'] || 0 },
      { emoji: '😐', count: stats.emoji_stats?.['😐'] || 0 },
      { emoji: '😢', count: stats.emoji_stats?.['😢'] || 0 }
    ];

    // Transform feedback data for table
    const feedbackData = stats?.feedbacks?.map((feedback) => ({
      ...feedback,
      timestamp: new Date(feedback.timestamp).toLocaleString()
    })) || [];

    return {
      sentimentChartData,
      emojiChartData,
      feedbackData
    };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        email,
        password
      });
      
      if (response.data.success) {
        setIsLoggedIn(true);
        const statsResponse = await axios.get('http://localhost:5000/api/admin/stats');
        if (statsResponse.data) {
          setStats(statsResponse.data);
          setPasswordAttempts(0); // Reset attempts on successful login
        } else {
          setError('Failed to fetch statistics. Please try again.');
        }
      } else {
        setPasswordAttempts(prev => prev + 1);
        if (passwordAttempts >= 2) {
          handleBackToMain();
        } else {
          setPasswordError('Wrong password. Please try again.');
          setShowPasswordError(true);
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Failed to connect to the server. Please check if the backend is running.');
      setPasswordError('Failed to connect to the server. Please try again.');
      setShowPasswordError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Snackbar
        open={showPasswordError}
        autoHideDuration={3000}
        onClose={() => {
          setShowPasswordError(false);
          setPasswordError('');
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => {
          setShowPasswordError(false);
          setPasswordError('');
        }} severity="error" sx={{ width: '100%' }}>
          {passwordError}
        </Alert>
      </Snackbar>
      <Container maxWidth="md" sx={{ 
        mt: 4, 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: '#000000'
      }}>
        {!isLoggedIn ? (
          <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Admin Login
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Paper>
        ) : (
          <Box sx={{ width: '100%' }}>
            <Grid container spacing={4} sx={{ mt: 4 }}>
              <Grid item xs={12}>
                <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#ffffff' }}>
                  Admin Dashboard
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Sentiment Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      {stats && getChartData(stats) && (
                        <BarChart data={getChartData(stats).sentimentChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#e50914" />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                    {stats && getChartData(stats) && (
                      <Typography variant="caption" sx={{ mt: 2, color: '#ffffff' }}>
                        Total Feedbacks: {stats.total_feedbacks}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Emoji Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      {stats && getChartData(stats) && (
                        <BarChart data={getChartData(stats).emojiChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="emoji" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#e50914" />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                    {stats && getChartData(stats) && (
                      <Typography variant="caption" sx={{ mt: 2, color: '#ffffff' }}>
                        Total Emojis: {stats.emoji_stats['😊'] + stats.emoji_stats['😐'] + stats.emoji_stats['😢']}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
                All Feedbacks
              </Typography>
              {stats && getChartData(stats) && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Event</TableCell>
                        <TableCell>Feedback</TableCell>
                        <TableCell>Emoji</TableCell>
                        <TableCell>Sentiment</TableCell>
                        <TableCell>Timestamp</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getChartData(stats).feedbackData.map((feedback, index) => (
                        <TableRow key={index}>
                          <TableCell>{feedback.event}</TableCell>
                          <TableCell>{feedback.feedback}</TableCell>
                          <TableCell>{feedback.emoji}</TableCell>
                          <TableCell>{feedback.category}</TableCell>
                          <TableCell>{feedback.timestamp}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default AdminDashboard;
