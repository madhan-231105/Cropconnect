'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, Grid3x3 as Grid3X3, List, MapPin, Star, Heart, Clock, Leaf } from 'lucide-react';
import { MobileNavigation } from '@/components/MobileNavigation';

const mockCrops = [
  {
    id: '1',
    name: 'Organic Tomatoes',
    farmer: 'Raj Singh',
    quantity: '500 kg',
    price: 45,
    location: 'Maharashtra, Pune',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/1400172/pexels-photo-1400172.jpeg',
    distance: '12 km',
    freshness: '1 day',
    category: 'vegetables',
    organic: true
  },
  {
    id: '2',
    name: 'Fresh Onions',
    farmer: 'Priya Patel',
    quantity: '1000 kg',
    price: 28,
    location: 'Gujarat, Ahmedabad',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/144248/onions-food-stack-144248.jpeg',
    distance: '8 km',
    freshness: 'Today',
    category: 'vegetables',
    organic: false
  },
  {
    id: '3',
    name: 'Green Chillies',
    farmer: 'Anil Kumar',
    quantity: '200 kg',
    price: 80,
    location: 'Karnataka, Bangalore',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/4198090/pexels-photo-4198090.jpeg',
    distance: '15 km',
    freshness: 'Today',
    category: 'vegetables',
    organic: false
  },
  {
    id: '4',
    name: 'Sweet Mangoes',
    farmer: 'Lakshmi Reddy',
    quantity: '300 kg',
    price: 120,
    location: 'Andhra Pradesh, Guntur',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/142890/pexels-photo-142890.jpeg',
    distance: '20 km',
    freshness: '2 days',
    category: 'fruits',
    organic: true
  },
  {
    id: '5',
    name: 'Fresh Spinach',
    farmer: 'Gopal Verma',
    quantity: '100 kg',
    price: 35,
    location: 'Uttar Pradesh, Lucknow',
    rating: 4.5,
    image: 'https://images.pexels.com/photos/2255332/pexels-photo-2255332.jpeg',
    distance: '5 km',
    freshness: 'Today',
    category: 'vegetables',
    organic: true
  },
  {
    id: '6',
    name: 'Basmati Rice',
    farmer: 'Harinder Singh',
    quantity: '2000 kg',
    price: 85,
    location: 'Punjab, Amritsar',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg',
    distance: '25 km',
    freshness: '1 week',
    category: 'grains',
    organic: false
  }
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredCrops, setFilteredCrops] = useState(mockCrops);
  const [user, setUser] = useState<any>(null);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    let filtered = mockCrops;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(crop => 
        crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(crop => crop.category === selectedCategory);
    }

    // Price range filter
    filtered = filtered.filter(crop => crop.price >= priceRange[0] && crop.price <= priceRange[1]);

    // Organic filter
    if (organicOnly) {
      filtered = filtered.filter(crop => crop.organic);
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        filtered.sort((a, b) => parseInt(a.distance) - parseInt(b.distance));
        break;
    }

    setFilteredCrops(filtered);
  }, [searchQuery, selectedCategory, priceRange, organicOnly, sortBy]);

  const CropCard = ({ crop, isListView = false }: { crop: any; isListView?: boolean }) => (
    <Card className={`hover:shadow-lg transition-shadow ${isListView ? 'flex' : ''}`}>
      <div className={`relative ${isListView ? 'w-48 flex-shrink-0' : ''}`}>
        <img 
          src={crop.image} 
          alt={crop.name}
          className={`object-cover rounded-t-lg ${isListView ? 'w-full h-full rounded-l-lg rounded-t-none' : 'w-full h-48'}`}
        />
        <Button
          size="sm"
          variant="secondary"
          className="absolute top-2 right-2"
        >
          <Heart className="h-4 w-4" />
        </Button>
        {crop.organic && (
          <Badge className="absolute top-2 left-2 bg-green-600">
            <Leaf className="h-3 w-3 mr-1" />
            Organic
          </Badge>
        )}
      </div>
      <CardContent className={`${isListView ? 'flex-1' : ''} p-4`}>
        <div className={`space-y-3 ${isListView ? 'flex flex-col justify-between h-full' : ''}`}>
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg">{crop.name}</h3>
              <Badge variant="secondary" className="text-green-600 font-semibold">
                ₹{crop.price}/kg
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">by {crop.farmer}</p>
            <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
              <MapPin className="h-4 w-4" />
              <span>{crop.location}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Quantity:</span>
              <span className="font-medium">{crop.quantity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Distance:</span>
              <span className="font-medium">{crop.distance}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">{crop.rating}</span>
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{crop.freshness}</span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
              Buy Now
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Marketplace</h1>
              <p className="text-sm text-gray-600">{filteredCrops.length} crops available</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="hidden sm:inline-flex"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="hidden sm:inline-flex"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-1" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search crops, farmers, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-full lg:w-80 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Filters</h3>
                  
                  {/* Category Filter */}
                  <div className="space-y-3 mb-6">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="vegetables">Vegetables</SelectItem>
                        <SelectItem value="fruits">Fruits</SelectItem>
                        <SelectItem value="grains">Grains</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range Filter */}
                  <div className="space-y-3 mb-6">
                    <label className="text-sm font-medium">Price Range (₹/kg)</label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={200}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>

                  {/* Organic Filter */}
                  <div className="space-y-3 mb-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={organicOnly}
                        onChange={(e) => setOrganicOnly(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm font-medium">Organic Only</span>
                      <Leaf className="h-4 w-4 text-green-600" />
                    </label>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="distance">Distance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Crops Grid/List */}
          <div className="flex-1">
            {filteredCrops.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No crops found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or filters</p>
                </CardContent>
              </Card>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-6'
              }>
                {filteredCrops.map((crop) => (
                  <CropCard key={crop.id} crop={crop} isListView={viewMode === 'list'} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {user && <MobileNavigation userRole={user.role} />}
    </div>
  );
}