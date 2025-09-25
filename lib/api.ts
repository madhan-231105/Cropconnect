// API utility functions for CropConnect

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Authentication API
export const authAPI = {
  login: async (credentials: { email: string; password: string }): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  register: async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    location: string;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }
};

// Crops API
export const cropsAPI = {
  getAll: async (filters?: {
    category?: string;
    location?: string;
    priceRange?: [number, number];
    organic?: boolean;
  }): Promise<ApiResponse<any[]>> => {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value));
          }
        });
      }
      
      const response = await fetch(`${API_BASE_URL}/crops?${params}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/crops/${id}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  create: async (cropData: any): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/crops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cropData)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  update: async (id: string, cropData: any): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/crops/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cropData)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  delete: async (id: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/crops/${id}`, {
        method: 'DELETE'
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }
};

// Orders API
export const ordersAPI = {
  create: async (orderData: {
    cropId: string;
    quantity: number;
    buyerId: string;
    farmerId: string;
    totalAmount: number;
  }): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  getByUserId: async (userId: string): Promise<ApiResponse<any[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  updateStatus: async (orderId: string, status: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }
};

// AI Services API
export const aiAPI = {
  getPricePrediction: async (cropData: {
    name: string;
    location: string;
    quantity: number;
    season?: string;
  }): Promise<ApiResponse<{
    suggestedPrice: number;
    confidence: number;
    marketTrend: string;
    factors: string[];
  }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/price-prediction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cropData)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  getChatResponse: async (message: string, context?: any): Promise<ApiResponse<{
    response: string;
    suggestions?: string[];
  }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context })
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }
};

// Payments API
export const paymentsAPI = {
  createOrder: async (orderData: {
    amount: number;
    currency: string;
    orderId: string;
  }): Promise<ApiResponse<{
    paymentId: string;
    paymentUrl: string;
  }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  },

  verifyPayment: async (paymentData: {
    paymentId: string;
    orderId: string;
    signature: string;
  }): Promise<ApiResponse<{ verified: boolean }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }
};

// Utils
export const uploadImage = async (file: File): Promise<ApiResponse<{ url: string }>> => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Upload failed' };
  }
};