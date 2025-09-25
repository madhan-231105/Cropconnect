'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Heart, 
  ShoppingCart, 
  TrendingUp, 
  Package, 
  MapPin,
  Bell,
  Star,
  Clock,
  Users
} from 'lucide-react';
import { MobileNavigation } from '@/components/MobileNavigation';

// Mock data for buyer dashboard
const mockRecommendedCrops = [
  {
    id: '1',
    name: 'Organic Tomatoes',
    farmer: 'Raj Singh',
    quantity: '500 kg',
    price: '₹45/kg',
    location: 'Maharashtra, Pune',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/1400172/pexels-photo-1400172.jpeg',
    distance: '12 km',
    freshness: '1 day'
  },
  {
    id: '2',
    name: 'Fresh Onions',
    farmer: 'Priya Patel',
    quantity: '1000 kg',
    price: '₹28/kg',
    location: 'Gujarat, Ahmedabad',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/144248/onions-food-stack-144248.jpeg',
    distance: '8 km',
    freshness: 'Today'
  },
  {
    id: '3',
    name: 'Green Chillies',
    farmer: 'Anil Kumar',
    quantity: '200 kg',
    price: '₹80/kg',
    location: 'Karnataka, Bangalore',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/4198090/pexels-photo-4198090.jpeg',
    distance: '15 km',
    freshness: 'Today'
  }
];

const mockStats = {
  totalOrders: 24,
  activeOrders: 3,
  totalSpent: 85000,
  savedAmount: 12000
};

const mockRecentOrders = [
  {
    id: '1',
    crop: 'Organic Potatoes',
    farmer: 'Suresh Yadav',
    quantity: '50 kg',
    amount: '₹1,500',
    status: 'delivered',
    date: '2024-01-15'
  },
  {
    id: '2',
    crop: 'Fresh Carrots',
    farmer: 'Meena Devi',
    quantity: '25 kg',
    amount: '₹750',
    status: 'in-transit',
    date: '2024-01-14'
  }
];

export default function BuyerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in-transit': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Buyer Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Avatar>
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:flex">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="browse">Browse Crops</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{mockStats.totalOrders}</p>
                      <p className="text-sm text-gray-600">Total Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Package className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{mockStats.activeOrders}</p>
                      <p className="text-sm text-gray-600">Active Orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">₹{(mockStats.totalSpent / 1000).toFixed(0)}k</p>
                      <p className="text-sm text-gray-600">Total Spent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Star className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">₹{(mockStats.savedAmount / 1000).toFixed(0)}k</p>
                      <p className="text-sm text-gray-600">Amount Saved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Search */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Search</CardTitle>
                <CardDescription>Find the crops you need</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search for crops, farmers, or locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <Link href="/marketplace">
                    <Button className="bg-green-600 hover:bg-green-700">Browse All</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Crops */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>Based on your previous purchases and location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockRecommendedCrops.map((crop) => (
                    <Card key={crop.id} className="hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img 
                          src={crop.image} 
                          alt={crop.name}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-2 right-2"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold">{crop.name}</h3>
                            <Badge variant="secondary" className="text-green-600">
                              {crop.price}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">by {crop.farmer}</p>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{crop.location}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span>{crop.rating}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-green-500" />
                              <span>{crop.freshness}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                              Buy Now
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Order delivered: Organic Potatoes</p>
                      <p className="text-xs text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Order placed: Fresh Carrots</p>
                      <p className="text-xs text-gray-600">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Added to wishlist: Green Chillies</p>
                      <p className="text-xs text-gray-600">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="browse" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Browse Crops</h2>
              <Link href="/marketplace">
                <Button className="bg-green-600 hover:bg-green-700">
                  View Full Marketplace
                </Button>
              </Link>
            </div>

            {/* Search and Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search crops, farmers, locations..."
                      className="pl-10"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Vegetables</Badge>
                    <Badge variant="secondary">Fruits</Badge>
                    <Badge variant="secondary">Grains</Badge>
                    <Badge variant="secondary">Organic</Badge>
                    <Badge variant="secondary">Local</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Browse Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockRecommendedCrops.map((crop) => (
                <Card key={crop.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={crop.image} 
                      alt={crop.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{crop.name}</h3>
                        <p className="text-sm text-gray-600">by {crop.farmer}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Price:</span>
                          <span className="font-semibold text-green-600">{crop.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Quantity:</span>
                          <span className="font-medium">{crop.quantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Distance:</span>
                          <span className="font-medium">{crop.distance}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{crop.rating}</span>
                        </div>
                        <Badge variant="outline" className="text-green-600">
                          Fresh: {crop.freshness}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                          Buy Now
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          Contact Farmer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Orders</h2>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter Orders
              </Button>
            </div>

            <div className="space-y-4">
              {mockRecentOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{order.crop}</h3>
                        <p className="text-sm text-gray-600">from {order.farmer}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Quantity</p>
                        <p className="font-medium">{order.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Amount</p>
                        <p className="font-medium">{order.amount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Order Date</p>
                        <p className="font-medium">{order.date}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Actions</p>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Track</Button>
                          <Button size="sm" variant="outline">Support</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <MobileNavigation userRole="buyer" />
    </div>
  );
}