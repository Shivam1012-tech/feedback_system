from flask import Flask, request, jsonify
from flask_cors import CORS
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from pymongo import MongoClient
from dotenv import load_dotenv
import os
from bson import ObjectId
from datetime import datetime
from flask_bcrypt import Bcrypt

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
analyzer = SentimentIntensityAnalyzer()
bcrypt = Bcrypt(app)

# MongoDB connection
client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/'))
db = client['feedback_system']
feedbacks = db['feedbacks']
users = db['users']

@app.route('/')
def home():
    return "Welcome to the Feedback System API! Available endpoints: /api/submit-feedback, /api/admin/login, /api/admin/stats"

# Admin credentials
ADMIN_EMAIL = "shiva1012@gmail.com"
ADMIN_PASSWORD = bcrypt.generate_password_hash("Shivam1012").decode('utf-8')

@app.route('/api/submit-feedback', methods=['POST'])
def submit_feedback():
    try:
        print("Received feedback submission request")
        data = request.json
        print("Received data:", data)
        
        # Validate required fields
        if not all(key in data for key in ['feedback', 'event', 'emoji']):
            return jsonify({'error': 'Feedback, event, and emoji are required'}), 400
        
        # Validate emoji
        if emoji not in ['😊', '😐', '😢']:
            return jsonify({'error': 'Invalid emoji. Please use 😊, 😐, or 😢'}), 400
        
        feedback = data['feedback']
        event = data['event']
        emoji = data['emoji']
        
        # Perform sentiment analysis
        sentiment = analyzer.polarity_scores(feedback)
        print("Sentiment analysis result:", sentiment)
        
        # Create feedback document
        feedback_doc = {
            'feedback': feedback,
            'event': event,
            'emoji': emoji,
            'sentiment': sentiment,
            'timestamp': datetime.utcnow(),
            'category': get_feedback_category(sentiment['compound'])
        }
        
        # Save to MongoDB
        result = feedbacks.insert_one(feedback_doc)
        print(f"Feedback saved with ID: {result.inserted_id}")
        print("Saved feedback document:", feedback_doc)
        
        return jsonify({'message': 'Feedback submitted successfully', 'id': str(result.inserted_id)}), 200
        
    except Exception as e:
        print(f"Error in feedback submission: {str(e)}")
        return jsonify({'error': 'Failed to submit feedback'}), 500

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if email == ADMIN_EMAIL and bcrypt.check_password_hash(ADMIN_PASSWORD, password):
        return jsonify({'success': True, 'message': 'Login successful'}), 200
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/api/admin/stats', methods=['GET'])
def get_admin_stats():
    try:
        print("Fetching admin stats")
        
        # Get total feedbacks
        total_feedbacks = feedbacks.count_documents({})
        print(f"Total feedbacks found: {total_feedbacks}")
        
        # Calculate sentiment distribution
        sentiment_stats = {
            'positive': feedbacks.count_documents({'category': 'positive'}),
            'neutral': feedbacks.count_documents({'category': 'neutral'}),
            'negative': feedbacks.count_documents({'category': 'negative'})
        }
        print("Sentiment stats:", sentiment_stats)
        
        # Get emoji distribution
        emoji_stats = {
            '😊': feedbacks.count_documents({'emoji': '😊'}),
            '😐': feedbacks.count_documents({'emoji': '😐'}),
            '😢': feedbacks.count_documents({'emoji': '😢'})
        }
        print("Emoji stats:", emoji_stats)
        
        # Get all feedbacks with proper sorting
        all_feedbacks = list(feedbacks.find({}, {'_id': 0}).sort('timestamp', -1))
        print(f"Retrieved {len(all_feedbacks)} feedback documents")
        
        return jsonify({
            'total_feedbacks': total_feedbacks,
            'sentiment_stats': sentiment_stats,
            'emoji_stats': emoji_stats,
            'feedbacks': all_feedbacks
        }), 200
        
    except Exception as e:
        print(f"Error fetching stats: {str(e)}")
        return jsonify({'error': 'Failed to fetch statistics'}), 500

def get_feedback_category(compound_score):
    if compound_score >= 0.05:
        return 'positive'
    elif compound_score <= -0.05:
        return 'negative'
    return 'neutral'

if __name__ == '__main__':
    app.run(debug=True, port=5000)
