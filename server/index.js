// CropConnect Backend Server (Node.js + Express)

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mock Database (In production, use MongoDB/PostgreSQL)
const mockDB = {
  users: [],
  crops: [],
  orders: [],
  payments: []
};

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Helper Functions
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Authentication Routes
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, role, location } = req.body;

    // Check if user already exists
    const existingUser = mockDB.users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      location,
      createdAt: new Date(),
      verified: false
    };

    mockDB.users.push(user);

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      data: {
        user: { ...user, password: undefined },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = mockDB.users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      success: true,
      data: {
        user: { ...user, password: undefined },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// Crops Routes
app.get('/crops', (req, res) => {
  try {
    const { category, location, priceMin, priceMax, organic } = req.query;
    let filteredCrops = [...mockDB.crops];

    // Apply filters
    if (category && category !== 'all') {
      filteredCrops = filteredCrops.filter(crop => crop.category === category);
    }
    if (location) {
      filteredCrops = filteredCrops.filter(crop => 
        crop.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (priceMin) {
      filteredCrops = filteredCrops.filter(crop => crop.price >= parseFloat(priceMin));
    }
    if (priceMax) {
      filteredCrops = filteredCrops.filter(crop => crop.price <= parseFloat(priceMax));
    }
    if (organic === 'true') {
      filteredCrops = filteredCrops.filter(crop => crop.organic);
    }

    res.json({ success: true, data: filteredCrops });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch crops' });
  }
});

app.get('/crops/:id', (req, res) => {
  try {
    const crop = mockDB.crops.find(c => c.id === req.params.id);
    if (!crop) {
      return res.status(404).json({ success: false, error: 'Crop not found' });
    }
    res.json({ success: true, data: crop });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch crop' });
  }
});

app.post('/crops', authenticateToken, (req, res) => {
  try {
    const cropData = req.body;
    const crop = {
      id: Date.now().toString(),
      ...cropData,
      farmerId: req.user.id,
      createdAt: new Date(),
      status: 'active'
    };

    mockDB.crops.push(crop);
    res.status(201).json({ success: true, data: crop });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create crop' });
  }
});

app.put('/crops/:id', authenticateToken, (req, res) => {
  try {
    const cropIndex = mockDB.crops.findIndex(c => c.id === req.params.id);
    if (cropIndex === -1) {
      return res.status(404).json({ success: false, error: 'Crop not found' });
    }

    const crop = mockDB.crops[cropIndex];
    if (crop.farmerId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    mockDB.crops[cropIndex] = { ...crop, ...req.body, updatedAt: new Date() };
    res.json({ success: true, data: mockDB.crops[cropIndex] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update crop' });
  }
});

app.delete('/crops/:id', authenticateToken, (req, res) => {
  try {
    const cropIndex = mockDB.crops.findIndex(c => c.id === req.params.id);
    if (cropIndex === -1) {
      return res.status(404).json({ success: false, error: 'Crop not found' });
    }

    const crop = mockDB.crops[cropIndex];
    if (crop.farmerId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    mockDB.crops.splice(cropIndex, 1);
    res.json({ success: true, message: 'Crop deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete crop' });
  }
});

// Orders Routes
app.post('/orders', authenticateToken, (req, res) => {
  try {
    const { cropId, quantity, farmerId, totalAmount } = req.body;

    const order = {
      id: Date.now().toString(),
      cropId,
      quantity,
      buyerId: req.user.id,
      farmerId,
      totalAmount,
      status: 'pending',
      createdAt: new Date(),
      paymentStatus: 'pending'
    };

    mockDB.orders.push(order);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create order' });
  }
});

app.get('/orders/user/:userId', authenticateToken, (req, res) => {
  try {
    const userOrders = mockDB.orders.filter(order => 
      order.buyerId === req.params.userId || order.farmerId === req.params.userId
    );
    res.json({ success: true, data: userOrders });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

app.patch('/orders/:id/status', authenticateToken, (req, res) => {
  try {
    const { status } = req.body;
    const orderIndex = mockDB.orders.findIndex(o => o.id === req.params.id);
    
    if (orderIndex === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    mockDB.orders[orderIndex].status = status;
    mockDB.orders[orderIndex].updatedAt = new Date();
    
    res.json({ success: true, data: mockDB.orders[orderIndex] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update order' });
  }
});

// AI Services Routes (Mock implementations)
app.post('/ai/price-prediction', (req, res) => {
  try {
    const { name, location, quantity } = req.body;
    
    // Mock AI price prediction
    const basePrice = Math.floor(Math.random() * 80) + 20;
    const confidence = Math.floor(Math.random() * 30) + 70;
    const trends = ['up', 'down', 'stable'];
    const marketTrend = trends[Math.floor(Math.random() * trends.length)];
    
    const factors = [
      'Seasonal demand analysis',
      'Local market conditions',
      'Historical price trends',
      'Quality assessment'
    ];

    res.json({
      success: true,
      data: {
        suggestedPrice: basePrice,
        confidence,
        marketTrend,
        factors
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Price prediction failed' });
  }
});

app.post('/ai/chat', (req, res) => {
  try {
    const { message } = req.body;
    
    // Mock chatbot responses
    const responses = [
      "Based on current market trends, I recommend focusing on organic vegetables as they command higher prices.",
      "For better negotiation, highlight your crop quality, certifications, and offer competitive pricing.",
      "The best time to list your crops is early morning when buyers are most active on the platform.",
      "Consider bundling your products or offering bulk discounts to attract more buyers."
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    const suggestions = [
      "Tell me more about pricing",
      "Market trends in my area",
      "How to improve my listings"
    ];

    res.json({
      success: true,
      data: {
        response,
        suggestions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Chat service failed' });
  }
});

// Payment Routes (Mock implementation)
app.post('/payments/create-order', authenticateToken, (req, res) => {
  try {
    const { amount, currency, orderId } = req.body;
    
    // Mock payment creation
    const paymentId = 'pay_' + Date.now();
    const paymentUrl = `https://mock-payment-gateway.com/pay/${paymentId}`;
    
    mockDB.payments.push({
      id: paymentId,
      orderId,
      amount,
      currency,
      status: 'created',
      createdAt: new Date()
    });

    res.json({
      success: true,
      data: {
        paymentId,
        paymentUrl
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Payment creation failed' });
  }
});

app.post('/payments/verify', (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;
    
    // Mock payment verification
    const payment = mockDB.payments.find(p => p.id === paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }
    
    payment.status = 'verified';
    payment.verifiedAt = new Date();

    res.json({
      success: true,
      data: { verified: true }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Payment verification failed' });
  }
});

// File Upload Route
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      data: { url: fileUrl }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
});

// Health Check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'CropConnect API is running',
    timestamp: new Date()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`CropConnect API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;