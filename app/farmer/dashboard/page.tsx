'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarInitials } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, TrendingUp, Package, DollarSign, Users, Bell, Settings, MessageCircle, ChartBar as BarChart3, MapPin, Calendar } from 'lucide-react';
import { MobileNavigation } from '@/components/MobileNavigation';

// Mock data for farmer dashboard
const mockCrops = [
  {
    id: '1',
    name: 'Organic Tomatoes',
    quantity: '500 kg',
    price: '₹45/kg',
    location: 'Maharashtra, Pune',
    status: 'active',
    posted: '2 days ago',
    views: 24,
    inquiries: 3
  },
  {
    id: '2',
    name: 'Fresh Onions',
    quantity: '1000 kg',
    price: '₹28/kg',
    location: 'Maharashtra, Pune',
    status: 'sold',
    posted: '5 days ago',
    views: 18,
    inquiries: 5
  },
  {
    id: '3',
    name: 'Green Chillies',
    quantity: '200 kg',
    price: '₹80/kg',
    location: 'Maharashtra, Pune',
    status: 'pending',
    posted: '1 day ago',
    views: 12,
    inquiries: 1
  }
];

const mockStats = {
  totalListings: 12,
  activeCrops: 8,
  totalEarnings: 145000,
  thisMonthSales: 35000
};

export default function FarmerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [crops, setCrops] = useState(mockCrops);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'sold': return 'Sold';
      case 'pending': return 'Pending';
      default: return 'Unknown';
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
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
            <TabsTrigger value="crops">My Crops</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Package className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{mockStats.totalListings}</p>
                      <p className="text-sm text-gray-600">Total Listings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{mockStats.activeCrops}</p>
                      <p className="text-sm text-gray-600">Active Crops</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">₹{(mockStats.totalEarnings / 1000).toFixed(0)}k</p>
                      <p className="text-sm text-gray-600">Total Earnings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-8 w-8 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">₹{(mockStats.thisMonthSales / 1000).toFixed(0)}k</p>
                      <p className="text-sm text-gray-600">This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks to manage your crops</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link href="/farmer/crops/add">
                    <Button className="w-full h-20 flex-col bg-green-600 hover:bg-green-700">
                      <Plus className="h-6 w-6 mb-2" />
                      Add New Crop
                    </Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button variant="outline" className="w-full h-20 flex-col">
                      <Package className="h-6 w-6 mb-2" />
                      View Marketplace
                    </Button>
                  </Link>
                  <Link href="/chat">
                    <Button variant="outline" className="w-full h-20 flex-col">
                      <MessageCircle className="h-6 w-6 mb-2" />
                      AI Assistant
                    </Button>
                  </Link>
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
                      <p className="text-sm font-medium">New inquiry received for Organic Tomatoes</p>
                      <p className="text-xs text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Fresh Onions marked as sold</p>
                      <p className="text-xs text-gray-600">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Price prediction updated for Green Chillies</p>
                      <p className="text-xs text-gray-600">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crops" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Crop Listings</h2>
              <Link href="/farmer/crops/add">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Crop
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {crops.map((crop) => (
                <Card key={crop.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{crop.name}</CardTitle>
                      <Badge className={getStatusColor(crop.status)}>
                        {getStatusText(crop.status)}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{crop.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <span className="font-medium">{crop.quantity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="font-medium text-green-600">{crop.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Views:</span>
                        <span className="font-medium">{crop.views}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Inquiries:</span>
                        <span className="font-medium">{crop.inquiries}</span>
                      </div>
                      <div className="pt-2 text-xs text-gray-500">
                        Posted {crop.posted}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics & Insights</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Performance</CardTitle>
                  <CardDescription>Your earnings over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">January</span>
                        <span className="text-sm font-medium">₹25,000</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">February</span>
                        <span className="text-sm font-medium">₹32,000</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">March</span>
                        <span className="text-sm font-medium">₹28,000</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Crop Performance</CardTitle>
                  <CardDescription>Most popular crops by inquiries</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tomatoes</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={90} className="w-20 h-2" />
                        <span className="text-sm font-medium">45 inquiries</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Onions</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={75} className="w-20 h-2" />
                        <span className="text-sm font-medium">38 inquiries</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Chillies</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={60} className="w-20 h-2" />
                        <span className="text-sm font-medium">28 inquiries</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
                <CardDescription>AI-powered recommendations for your crops</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Price Increase Opportunity</h4>
                    <p className="text-sm text-green-700">
                      Tomato prices are expected to increase by 15% next week due to high demand. 
                      Consider holding your current stock.
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">High Demand Crop</h4>
                    <p className="text-sm text-blue-700">
                      Green leafy vegetables are in high demand in your area. Consider adding 
                      spinach or lettuce to your listings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <MobileNavigation userRole="farmer" />
    </div>
  );
}