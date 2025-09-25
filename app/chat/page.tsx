'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, MessageCircle, Languages, TrendingUp, CircleHelp as HelpCircle, Lightbulb } from 'lucide-react';
import { MobileNavigation } from '@/components/MobileNavigation';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  language?: string;
}

const predefinedQuestions = [
  {
    category: 'Pricing',
    questions: [
      'What should be the price for tomatoes in my area?',
      'How do I negotiate better prices with buyers?',
      'When is the best time to sell my crops?'
    ]
  },
  {
    category: 'Market Trends',
    questions: [
      'Which crops are in high demand right now?',
      'What are the market predictions for next month?',
      'How can I increase my crop visibility?'
    ]
  },
  {
    category: 'General Help',
    questions: [
      'How do I create a good crop listing?',
      'What payment methods are available?',
      'How to handle crop quality complaints?'
    ]
  }
];

const mockResponses = {
  'pricing': [
    "Based on current market data, tomatoes in your area are selling for ₹45-55 per kg. Consider pricing around ₹50/kg for competitive positioning.",
    "For better price negotiations, highlight your crop quality, organic certification if available, and offer bulk discounts. Build long-term relationships with buyers.",
    "The best time to sell is typically early morning (6-8 AM) when crops are freshest, and during peak demand seasons for your specific crop type."
  ],
  'market': [
    "Currently, organic vegetables, leafy greens, and seasonal fruits are in high demand. Focus on quality and freshness to command better prices.",
    "Market predictions show increasing demand for organic produce and exotic vegetables. Consider diversifying your crop portfolio accordingly.",
    "To increase visibility, upload high-quality photos, provide detailed descriptions, update prices regularly, and maintain good ratings through quality service."
  ],
  'general': [
    "Create compelling listings with clear photos, accurate quantities, competitive pricing, and detailed descriptions including freshness and quality indicators.",
    "We support UPI, digital wallets, and bank transfers through our secure escrow system. Payments are released after successful delivery confirmation.",
    "Address quality complaints promptly, offer replacements or refunds when justified, and use feedback to improve your processes. Good customer service builds reputation."
  ]
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI farming assistant. I can help you with pricing, market trends, and general farming questions. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || input.trim();
    if (!content) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Generate response based on content
    let response = "I understand your question. Let me help you with that.";
    
    if (content.toLowerCase().includes('price') || content.toLowerCase().includes('cost')) {
      response = mockResponses.pricing[Math.floor(Math.random() * mockResponses.pricing.length)];
    } else if (content.toLowerCase().includes('market') || content.toLowerCase().includes('demand')) {
      response = mockResponses.market[Math.floor(Math.random() * mockResponses.market.length)];
    } else {
      response = mockResponses.general[Math.floor(Math.random() * mockResponses.general.length)];
    }

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      language: selectedLanguage
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Assistant</h1>
                <p className="text-sm text-gray-600">Multilingual farming support</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-32">
                  <Languages className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="mr">मराठी</SelectItem>
                  <SelectItem value="ta">தமிழ்</SelectItem>
                  <SelectItem value="te">తెలుగు</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Quick Help Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Quick Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {predefinedQuestions.map((category, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-sm mb-2 text-gray-700">{category.category}</h4>
                    <div className="space-y-2">
                      {category.questions.map((question, qIndex) => (
                        <Button
                          key={qIndex}
                          variant="ghost"
                          size="sm"
                          className="w-full text-left justify-start h-auto p-2 text-xs"
                          onClick={() => handleSendMessage(question)}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium text-sm">Tip</span>
                </div>
                <p className="text-xs text-gray-600">
                  Ask specific questions about your crops, location, and current market conditions for more accurate advice.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[calc(100vh-200px)] flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} space-x-2`}>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={message.type === 'user' ? 'bg-blue-100' : 'bg-green-100'}>
                          {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`px-4 py-2 rounded-2xl ${
                        message.type === 'user' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-green-100">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about farming, pricing, or market trends..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button 
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim() || isTyping}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Press Enter to send • Switch languages using the dropdown above
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {user && <MobileNavigation userRole={user.role} />}
    </div>
  );
}