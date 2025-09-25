"""
CropConnect AI Services (FastAPI)
Provides price prediction and chatbot functionality
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import uvicorn
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import json
import random
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder

app = FastAPI(title="CropConnect AI Services", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class PricePredictionRequest(BaseModel):
    crop_name: str
    location: str
    quantity: float
    season: Optional[str] = None
    quality: Optional[str] = "standard"
    organic: Optional[bool] = False

class PricePredictionResponse(BaseModel):
    suggested_price: float
    confidence: float
    market_trend: str
    factors: List[str]
    historical_data: List[Dict]

class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en"
    context: Optional[Dict] = None

class ChatResponse(BaseModel):
    response: str
    suggestions: List[str]
    language: str

# Mock historical price data (In production, connect to real market data)
MOCK_PRICE_DATA = {
    'tomatoes': {'base_price': 45, 'volatility': 0.15, 'seasonal_factor': 1.2},
    'onions': {'base_price': 28, 'volatility': 0.20, 'seasonal_factor': 1.1},
    'chillies': {'base_price': 80, 'volatility': 0.25, 'seasonal_factor': 1.3},
    'potatoes': {'base_price': 25, 'volatility': 0.12, 'seasonal_factor': 1.0},
    'carrots': {'base_price': 35, 'volatility': 0.18, 'seasonal_factor': 1.1},
    'spinach': {'base_price': 40, 'volatility': 0.22, 'seasonal_factor': 1.4},
}

# Location multipliers
LOCATION_MULTIPLIERS = {
    'maharashtra': 1.1,
    'gujarat': 1.05,
    'karnataka': 1.08,
    'tamil nadu': 1.12,
    'punjab': 0.95,
    'uttar pradesh': 0.92,
}

# Quality multipliers
QUALITY_MULTIPLIERS = {
    'premium': 1.3,
    'grade a': 1.15,
    'grade b': 1.05,
    'standard': 1.0,
}

# Chatbot responses by language
CHATBOT_RESPONSES = {
    'en': {
        'greeting': [
            "Hello! I'm here to help with your farming and market questions.",
            "Hi there! How can I assist you with your crops today?",
            "Welcome! I can help with pricing, market trends, and farming advice."
        ],
        'pricing': [
            "For better pricing, consider these factors: crop quality, market timing, and seasonal demand.",
            "Price optimization depends on your location, crop variety, and current market conditions.",
            "I recommend checking local market rates and adjusting based on your crop's unique qualities."
        ],
        'market': [
            "Current market trends show high demand for organic vegetables and seasonal fruits.",
            "The market is favorable for quality produce with proper certification and freshness.",
            "Focus on building relationships with buyers and maintaining consistent supply."
        ],
        'general': [
            "I can help with crop pricing, market analysis, and farming best practices.",
            "For specific advice, please share details about your crops, location, and goals.",
            "Would you like information about pricing strategies, market trends, or farming tips?"
        ]
    },
    'hi': {
        'greeting': [
            "नमस्ते! मैं आपके खेती और बाजार के सवालों में मदद कर सकता हूं।",
            "हैलो! आज आपकी फसल के बारे में कैसे मदद कर सकता हूं?",
            "स्वागत है! मैं मूल्य निर्धारण, बाजार के रुझान और खेती की सलाह दे सकता हूं।"
        ],
        'pricing': [
            "बेहतर मूल्य के लिए इन कारकों पर विचार करें: फसल की गुणवत्ता, बाजार का समय, और मौसमी मांग।",
            "मूल्य अनुकूलन आपके स्थान, फसल की किस्म, और वर्तमान बाजार स्थितियों पर निर्भर करता है।",
            "मैं स्थानीय बाजार दरों की जांच करने और अपनी फसल की अनूठी गुणों के आधार पर समायोजन करने की सलाह देता हूं।"
        ],
        'market': [
            "वर्तमान बाजार के रुझान जैविक सब्जियों और मौसमी फलों की उच्च मांग दिखाते हैं।",
            "उचित प्रमाणन और ताजगी के साथ गुणवत्तापूर्ण उत्पादन के लिए बाजार अनुकूल है।",
            "खरीदारों के साथ संबंध बनाने और लगातार आपूर्ति बनाए रखने पर ध्यान दें।"
        ],
        'general': [
            "मैं फसल मूल्य निर्धारण, बाजार विश्लेषण, और खेती की सर्वोत्तम प्रथाओं में मदद कर सकता हूं।",
            "विशिष्ट सलाह के लिए, कृपया अपनी फसलों, स्थान और लक्ष्यों के बारे में विवरण साझा करें।",
            "क्या आप मूल्य निर्धारण रणनीतियों, बाजार के रुझान, या खेती के टिप्स के बारे में जानकारी चाहते हैं?"
        ]
    }
}

def generate_mock_historical_data(crop_name: str, days: int = 30) -> List[Dict]:
    """Generate mock historical price data for visualization"""
    base_price = MOCK_PRICE_DATA.get(crop_name.lower(), {'base_price': 50, 'volatility': 0.15})['base_price']
    volatility = MOCK_PRICE_DATA.get(crop_name.lower(), {'base_price': 50, 'volatility': 0.15})['volatility']
    
    data = []
    for i in range(days):
        date = (datetime.now() - timedelta(days=days-i)).strftime('%Y-%m-%d')
        # Generate price with random walk and volatility
        price_change = np.random.normal(0, volatility * base_price)
        price = base_price + price_change
        price = max(price, base_price * 0.5)  # Minimum price floor
        
        data.append({
            'date': date,
            'price': round(price, 2),
            'volume': random.randint(100, 1000)
        })
    
    return data

@app.get("/")
async def root():
    return {
        "service": "CropConnect AI Services",
        "version": "1.0.0",
        "status": "running",
        "endpoints": ["/predict-price", "/chat", "/health"]
    }

@app.post("/predict-price", response_model=PricePredictionResponse)
async def predict_price(request: PricePredictionRequest):
    """
    Predict crop price based on various factors
    """
    try:
        crop_name = request.crop_name.lower()
        location = request.location.lower()
        
        # Get base price data
        if crop_name not in MOCK_PRICE_DATA:
            # Default pricing for unknown crops
            base_price = 50
            volatility = 0.15
        else:
            crop_data = MOCK_PRICE_DATA[crop_name]
            base_price = crop_data['base_price']
            volatility = crop_data['volatility']
        
        # Apply location multiplier
        location_multiplier = 1.0
        for loc, multiplier in LOCATION_MULTIPLIERS.items():
            if loc in location:
                location_multiplier = multiplier
                break
        
        # Apply quality multiplier
        quality_multiplier = QUALITY_MULTIPLIERS.get(request.quality.lower(), 1.0)
        
        # Apply organic premium
        organic_multiplier = 1.2 if request.organic else 1.0
        
        # Seasonal adjustments (mock)
        seasonal_multiplier = 1.0
        current_month = datetime.now().month
        if request.season:
            if request.season.lower() == 'peak':
                seasonal_multiplier = 1.15
            elif request.season.lower() == 'off':
                seasonal_multiplier = 0.85
        
        # Calculate final price
        suggested_price = base_price * location_multiplier * quality_multiplier * organic_multiplier * seasonal_multiplier
        
        # Add some randomness for market conditions
        market_factor = np.random.normal(1.0, volatility/2)
        suggested_price *= market_factor
        
        # Round to reasonable precision
        suggested_price = round(suggested_price, 2)
        
        # Determine market trend
        trend_factor = np.random.random()
        if trend_factor > 0.6:
            market_trend = "up"
        elif trend_factor < 0.4:
            market_trend = "down"
        else:
            market_trend = "stable"
        
        # Calculate confidence based on data availability and market stability
        confidence = max(70, 95 - (volatility * 100))
        confidence = round(confidence, 1)
        
        # Generate factors that influenced the price
        factors = [
            f"Base market price for {request.crop_name}",
            f"Location adjustment for {request.location}",
            f"Quality grade: {request.quality}",
        ]
        
        if request.organic:
            factors.append("Organic certification premium")
        
        if request.season:
            factors.append(f"Seasonal demand: {request.season}")
        
        factors.extend([
            "Current market volatility",
            "Supply-demand balance",
            "Historical price trends"
        ])
        
        # Generate historical data for visualization
        historical_data = generate_mock_historical_data(crop_name)
        
        return PricePredictionResponse(
            suggested_price=suggested_price,
            confidence=confidence,
            market_trend=market_trend,
            factors=factors,
            historical_data=historical_data
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Price prediction failed: {str(e)}")

@app.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """
    Process chat messages and provide farming advice
    """
    try:
        message = request.message.lower()
        language = request.language
        
        # Get responses for the language (default to English if not available)
        responses = CHATBOT_RESPONSES.get(language, CHATBOT_RESPONSES['en'])
        
        # Simple keyword-based response selection
        if any(word in message for word in ['price', 'cost', 'rate', 'मूल्य', 'दाम']):
            category = 'pricing'
        elif any(word in message for word in ['market', 'demand', 'trend', 'बाजार', 'मांग']):
            category = 'market'
        elif any(word in message for word in ['hello', 'hi', 'hey', 'नमस्ते', 'हैलो']):
            category = 'greeting'
        else:
            category = 'general'
        
        # Select a random response from the category
        response = random.choice(responses[category])
        
        # Generate contextual suggestions
        suggestions = [
            "What's the current price for tomatoes?",
            "Tell me about market trends",
            "How to improve crop quality?",
            "Best time to sell my harvest"
        ]
        
        if language == 'hi':
            suggestions = [
                "टमाटर का वर्तमान मूल्य क्या है?",
                "बाजार के रुझान के बारे में बताएं",
                "फसल की गुणवत्ता कैसे सुधारें?",
                "अपनी फसल बेचने का सबसे अच्छा समय"
            ]
        
        return ChatResponse(
            response=response,
            suggestions=suggestions[:3],  # Return only 3 suggestions
            language=language
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat service failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "CropConnect AI Services",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

# Market analysis endpoint
@app.get("/market-analysis/{crop_name}")
async def get_market_analysis(crop_name: str, location: Optional[str] = None):
    """
    Get comprehensive market analysis for a specific crop
    """
    try:
        crop_data = MOCK_PRICE_DATA.get(crop_name.lower(), {
            'base_price': 50, 
            'volatility': 0.15, 
            'seasonal_factor': 1.0
        })
        
        # Generate mock analysis data
        analysis = {
            'crop_name': crop_name,
            'current_price_range': {
                'min': crop_data['base_price'] * 0.9,
                'max': crop_data['base_price'] * 1.1,
                'average': crop_data['base_price']
            },
            'demand_level': random.choice(['high', 'medium', 'low']),
            'supply_status': random.choice(['surplus', 'balanced', 'deficit']),
            'price_volatility': crop_data['volatility'],
            'seasonal_pattern': 'Peak demand in winter months',
            'top_markets': [
                'Maharashtra - Mumbai',
                'Karnataka - Bangalore',
                'Gujarat - Ahmedabad'
            ],
            'quality_factors': [
                'Freshness and appearance',
                'Size uniformity',
                'Organic certification',
                'Packaging quality'
            ],
            'recommendations': [
                f'Current market conditions favor selling {crop_name}',
                'Focus on quality to achieve premium pricing',
                'Consider direct buyer relationships for better margins'
            ]
        }
        
        return {"success": True, "data": analysis}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Market analysis failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "ai_services:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )