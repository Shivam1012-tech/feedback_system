# College Feedback System

A web application that allows students to submit feedback for college events and club activities, with sentiment analysis and an admin dashboard.

## Features

- Student feedback submission form
- Real-time sentiment analysis using VADER
- Admin dashboard with feedback statistics
- Modern and responsive UI
- Secure admin authentication

## Admin Credentials

- Email: admin@feedback.com
- Password: admin123

## Setup Instructions

### Backend Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the backend server:
```bash
python app.py
```

### Frontend Setup

1. Install Node.js dependencies:
```bash
cd src
npm install
```

2. Start the development server:
```bash
npm start
```

## Project Structure

```
├── src/
│   ├── components/      # React components
│   ├── styles/          # CSS/Style files
│   ├── App.js           # Main React component
│   └── index.js         # React entry point
├── app.py               # Flask backend
└── requirements.txt     # Python dependencies
```

## Technologies Used

- Frontend: React, Material-UI
- Backend: Flask
- NLP: VADER Sentiment Analysis
- Database: MongoDB
- Authentication: Bcrypt
