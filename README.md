# CropConnect - Digital Marketplace for Farmers and Buyers

CropConnect is a comprehensive digital marketplace that bridges the gap between farmers and buyers, featuring AI-powered price prediction, multilingual chatbot support, and secure payment processing.

## 🌟 Features

### For Farmers
- **Crop Listing Management**: Easy-to-use interface for posting crop details
- **AI Price Prediction**: Get intelligent pricing suggestions based on market data
- **Analytics Dashboard**: Track performance, views, and inquiries
- **Multilingual Support**: Available in English, Hindi, Marathi, Tamil, and Telugu
- **Real-time Notifications**: Stay updated on buyer inquiries and orders

### For Buyers
- **Advanced Search & Filtering**: Find crops by location, price, category, and quality
- **Direct Communication**: Connect directly with farmers
- **Secure Payments**: Escrow-based payment system with multiple payment options
- **Order Tracking**: Real-time updates on order status
- **Personalized Recommendations**: AI-powered crop suggestions

### AI-Powered Features
- **Price Prediction Engine**: Machine learning-based pricing optimization
- **Multilingual Chatbot**: 24/7 support in multiple regional languages
- **Market Trend Analysis**: Insights on demand, supply, and pricing trends
- **Quality Assessment**: AI-assisted crop quality evaluation

## 🛠 Tech Stack

### Frontend
- **Next.js 13+**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **Responsive Design**: Mobile-first approach

### Backend
- **Node.js + Express**: REST API server
- **FastAPI**: AI microservices (Python)
- **JWT Authentication**: Secure user authentication
- **Multer**: File upload handling
- **bcryptjs**: Password encryption

### Database & Storage
- **MongoDB**: Primary database (or PostgreSQL)
- **Redis**: Caching layer
- **Cloud Storage**: Images and file storage (AWS S3/Cloudinary)

### Payment Integration
- **Stripe**: International payments
- **Razorpay**: Local Indian payment gateway
- **Escrow System**: Secure transaction handling

### Deployment
- **Vercel**: Frontend deployment
- **Render/Railway**: Backend API deployment
- **MongoDB Atlas**: Cloud database
- **Docker**: Containerization support

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Python 3.8+
- MongoDB
- Redis (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cropconnect.git
   cd cropconnect
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Install Python dependencies for AI services**
   ```bash
   pip install -r server/requirements.txt
   ```

5. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

### Running the Application

1. **Start the frontend (Next.js)**
   ```bash
   npm run dev
   ```
   Frontend will be available at http://localhost:3000

2. **Start the backend API (Node.js)**
   ```bash
   cd server
   npm run dev
   ```
   API will be available at http://localhost:3001

3. **Start AI services (FastAPI)**
   ```bash
   cd server
   python ai_services.py
   ```
   AI API will be available at http://localhost:8000

## 📱 Mobile Experience

CropConnect is designed with a mobile-first approach:

- **Responsive Design**: Optimized for all screen sizes
- **Touch-friendly UI**: Large buttons and easy navigation
- **Mobile Navigation**: Bottom tab bar for easy access
- **Fast Loading**: Optimized images and lazy loading
- **Offline Support**: Basic functionality available offline

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: bcrypt hashing for user passwords
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Properly configured cross-origin policies
- **Helmet Security**: HTTP security headers

## 🎯 API Documentation

### Authentication Endpoints
```
POST /auth/register - User registration
POST /auth/login - User login
POST /auth/refresh - Refresh JWT token
```

### Crops Endpoints
```
GET /crops - Get all crops (with filtering)
POST /crops - Create new crop listing
GET /crops/:id - Get specific crop
PUT /crops/:id - Update crop
DELETE /crops/:id - Delete crop
```

### AI Services Endpoints
```
POST /ai/price-prediction - Get price predictions
POST /ai/chat - Chat with AI assistant
GET /ai/market-analysis/:crop - Get market analysis
```

### Payment Endpoints
```
POST /payments/create-order - Create payment order
POST /payments/verify - Verify payment
GET /payments/:id - Get payment status
```

## 🌍 Internationalization

CropConnect supports multiple languages:
- **English** (en)
- **Hindi** (hi) - हिंदी
- **Marathi** (mr) - मराठी
- **Tamil** (ta) - தமிழ்
- **Telugu** (te) - తెలుగు

## 🤖 AI/ML Features

### Price Prediction Model
- **Historical Data Analysis**: Analyzes past pricing trends
- **Seasonal Adjustments**: Accounts for seasonal variations
- **Location Factors**: Considers geographical price differences
- **Quality Multipliers**: Adjusts for crop quality grades
- **Market Sentiment**: Incorporates current market conditions

### Chatbot Capabilities
- **Natural Language Processing**: Understands farmer queries
- **Multilingual Support**: Responds in user's preferred language
- **Context Awareness**: Maintains conversation context
- **Farming Advice**: Provides expert agricultural guidance
- **Price Negotiations**: Assists in pricing strategies

## 📊 Analytics & Insights

- **Farmer Dashboard**: Sales performance, crop views, inquiries
- **Buyer Analytics**: Purchase history, savings, preferences
- **Market Insights**: Demand trends, price movements
- **Performance Metrics**: Platform usage statistics

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Build and deploy to Vercel
npm run build
vercel --prod
```

### Backend (Render/Railway)
```bash
# Deploy Node.js API
git push origin main  # Triggers automatic deployment
```

### AI Services (Python)
```bash
# Deploy FastAPI service
gunicorn -w 4 -k uvicorn.workers.UvicornWorker server.ai_services:app
```

## 🧪 Testing

```bash
# Run frontend tests
npm test

# Run backend tests
cd server
npm test

# Run Python tests
cd server
pytest
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: support@cropconnect.com
- 💬 Discord: [CropConnect Community]
- 📱 WhatsApp: +91-XXXXXXXXXX
- 🐛 Issues: GitHub Issues page

## 🙏 Acknowledgments

- **Farmers**: For their invaluable feedback and testing
- **Agricultural Experts**: For domain knowledge and guidance
- **Open Source Community**: For the amazing tools and libraries
- **Beta Users**: For early adoption and feature suggestions

---

**CropConnect** - *Empowering farmers, connecting communities* 🌱