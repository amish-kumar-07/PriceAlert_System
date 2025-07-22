"use client";
import React, { useState, useEffect } from 'react';
import { NavbarDemo } from '../_components/navbar';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Search,
  Bell,
  Shield,
  Smartphone,
  CheckCircle,
  Star,
  ArrowRight,
  Eye,
  Target,
  Zap,
  Users,
  Mail,
  Github,
  Twitter,
  TrendingDown,
  TrendingUp,
  Calendar,
  DollarSign,
  Clock,
  Filter,
  Download,
  Share2,
  Loader2
} from 'lucide-react';

// Types based on your database schema
type PriceHistoryData = {
  id: number;
  email: string;
  asin: string;
  trackedAt: string;
  currentPrice: number;
  originalPrice: number | null;
  platform: string | null;
  userId: number | null;
};

type ChartData = {
  date: string;
  currentPrice: number;
  originalPrice: number;
};

type ProductSummary = {
  asin: string;
  name: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  targetPrice: number;
  savings: number;
  trend: "up" | "down";
  lastUpdated: string;
  platform: string;
};

type PriceAlert = {
  id: number;
  date: string;
  change: number;
  type: 'increase' | 'decrease';
  message: string;
};

function PriceHistoryChart({ data }: { data: ChartData[] }) {
  return (
    <Card className="bg-white/5 border-white/10 text-white">
      <CardHeader className="flex flex-col gap-1 border-b border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-1">
          <CardTitle className="text-white">Price History</CardTitle>
          <CardDescription className="text-gray-400">Track product price changes over time</CardDescription>
        </div>
        <div className="flex gap-2">
          <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={{
            currentPrice: { label: "Current Price", color: "#3b82f6" },
            originalPrice: { label: "Original Price", color: "#ef4444" },
          }}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillOriginal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fill: '#9CA3AF' }}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                  className="bg-gray-800 border-gray-700"
                />
              }
            />
            
            <Area
              dataKey="currentPrice"
              type="monotone"
              stroke="#3b82f6"
              fill="url(#fillCurrent)"
            />
            <Area
              dataKey="originalPrice"
              type="monotone"
              stroke="#ef4444"
              fill="url(#fillOriginal)"
            />
            
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const PriceHistoryPage = () => {
  const [priceHistoryData, setPriceHistoryData] = useState<PriceHistoryData[]>([]);
  const [trackedProducts, setTrackedProducts] = useState<ProductSummary[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductSummary | null>(null);
  const [timeRange, setTimeRange] = useState('3M');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockData = () => {
      const generateMockData = (): PriceHistoryData[] => {
        const mockProducts = [
          { asin: 'B08N5WRWNW', name: 'Wireless Headphones', platform: 'Amazon' },
          { asin: 'B07FZ8S74R', name: 'Smart Watch', platform: 'Amazon' },
          { asin: 'B085XJGJ5M', name: 'Bluetooth Speaker', platform: 'Amazon' },
        ];

        const data: PriceHistoryData[] = [];
        const now = new Date();

        mockProducts.forEach((product, productIndex) => {
          const basePrice = 50 + (productIndex * 30);
          
          for (let i = 0; i < 30; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            const priceVariation = Math.sin(i * 0.2) * 10 + Math.random() * 5;
            const currentPrice = basePrice + priceVariation;
            const originalPrice = basePrice + 20;

            data.push({
              id: productIndex * 30 + i,
              email: 'user@example.com',
              asin: product.asin,
              trackedAt: date.toISOString(),
              currentPrice: Math.round(currentPrice * 100) / 100,
              originalPrice: Math.round(originalPrice * 100) / 100,
              platform: product.platform,
              userId: 1,
            });
          }
        });

        return data;
      };

      setTimeout(() => {
        const data = generateMockData();
        setPriceHistoryData(data);
        
        const productSummaries = processDataToProductSummaries(data);
        setTrackedProducts(productSummaries);
        
        if (productSummaries.length > 0) {
          setSelectedProduct(productSummaries[0]);
        }
        setLoading(false);
      }, 1000);
    };

    mockData();
  }, []);

  // Process raw price history data into product summaries
  const processDataToProductSummaries = (data: PriceHistoryData[]): ProductSummary[] => {
    const productMap = new Map<string, PriceHistoryData[]>();
    
    // Group by ASIN
    data.forEach(item => {
      if (!productMap.has(item.asin)) {
        productMap.set(item.asin, []);
      }
      productMap.get(item.asin)?.push(item);
    });

    // Product name mapping
    const productNames: { [key: string]: string } = {
      'B08N5WRWNW': 'Wireless Headphones',
      'B07FZ8S74R': 'Smart Watch',
      'B085XJGJ5M': 'Bluetooth Speaker',
    };

    // Create summaries for each product
    return Array.from(productMap.entries()).map(([asin, history]) => {
      const sortedHistory = history.sort((a, b) => new Date(b.trackedAt).getTime() - new Date(a.trackedAt).getTime());
      const latest = sortedHistory[0];
      const oldest = sortedHistory[sortedHistory.length - 1];
      
      const currentPrice = Number(latest.currentPrice);
      const originalPrice = Number(latest.originalPrice || latest.currentPrice);
      const oldestPrice = Number(oldest.currentPrice);
      
      const trend = currentPrice < oldestPrice ? "down" : "up";
      const savings = Math.max(0, originalPrice - currentPrice);
      
      return {
        asin,
        name: productNames[asin] || `Product ${asin.slice(-6)}`,
        image: "https://images.pexels.com/photos/3945652/pexels-photo-3945652.jpeg?auto=compress&cs=tinysrgb&w=300",
        currentPrice,
        originalPrice,
        targetPrice: currentPrice * 0.9,
        savings,
        trend,
        lastUpdated: new Date(latest.trackedAt).toLocaleString(),
        platform: latest.platform || "Unknown"
      };
    });
  };

  // Filter price history data for selected product and time range
  const getFilteredChartData = (): ChartData[] => {
    if (!selectedProduct) return [];
    
    const productHistory = priceHistoryData
      .filter(item => item.asin === selectedProduct.asin)
      .sort((a, b) => new Date(a.trackedAt).getTime() - new Date(b.trackedAt).getTime());

    // Filter by time range
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case '1M':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case '6M':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case '1Y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'All':
        cutoffDate.setFullYear(2000);
        break;
    }

    return productHistory
      .filter(item => new Date(item.trackedAt) >= cutoffDate)
      .map(item => ({
        date: item.trackedAt.split('T')[0],
        currentPrice: Number(item.currentPrice),
        originalPrice: Number(item.originalPrice || item.currentPrice)
      }));
  };

  // Generate price alerts from chart data
  const generatePriceAlerts = (): PriceAlert[] => {
    const chartData = getFilteredChartData();
    if (chartData.length < 2) return [];

    const alerts: PriceAlert[] = [];
    
    for (let i = 1; i < Math.min(chartData.length, 5); i++) {
      const current = chartData[chartData.length - i];
      const previous = chartData[chartData.length - i - 1];
      
      if (current && previous) {
        const change = current.currentPrice - previous.currentPrice;
        const changePercent = Math.abs(change / previous.currentPrice) * 100;
        
        if (Math.abs(change) > 0.5) {
          alerts.push({
            id: i,
            date: current.date,
            change: change,
            type: change > 0 ? 'increase' : 'decrease',
            message: `Price ${change > 0 ? 'increased' : 'decreased'} by $${Math.abs(change).toFixed(2)} (${changePercent.toFixed(1)}%)`
          });
        }
      }
    }

    return alerts.slice(0, 4);
  };

  // Calculate dynamic stats from real data
  const calculateStats = () => {
    if (trackedProducts.length === 0) {
      return [
        { label: "Total Savings", value: "$0", color: "text-green-400", icon: <DollarSign className="h-5 w-5" /> },
        { label: "Products Tracked", value: "0", color: "text-indigo-400", icon: <Eye className="h-5 w-5" /> },
        { label: "Price Alerts", value: "0", color: "text-yellow-400", icon: <Bell className="h-5 w-5" /> },
        { label: "Avg. Savings", value: "0%", color: "text-purple-400", icon: <TrendingDown className="h-5 w-5" /> }
      ];
    }

    const totalSavings = trackedProducts.reduce((sum, product) => sum + product.savings, 0);
    const avgSavingsPercent = trackedProducts.reduce((sum, product) => {
      const percent = ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100;
      return sum + percent;
    }, 0) / trackedProducts.length;

    return [
      { label: "Total Savings", value: `$${totalSavings.toFixed(2)}`, color: "text-green-400", icon: <DollarSign className="h-5 w-5" /> },
      { label: "Products Tracked", value: trackedProducts.length.toString(), color: "text-indigo-400", icon: <Eye className="h-5 w-5" /> },
      { label: "Price Data Points", value: priceHistoryData.length.toString(), color: "text-yellow-400", icon: <Bell className="h-5 w-5" /> },
      { label: "Avg. Savings", value: `${avgSavingsPercent.toFixed(1)}%`, color: "text-purple-400", icon: <TrendingDown className="h-5 w-5" /> }
    ];
  };

  const stats = calculateStats();
  const timeRanges = ['1M', '3M', '6M', '1Y', 'All'];
  const chartData = getFilteredChartData();
  const priceAlerts = generatePriceAlerts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-indigo-500" />
          <p className="text-gray-400">Loading price history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white">
      {/* Header */}
        <div className="w-full flex justify-evenly items-center px-4 sm:px-6 lg:px-8 py-4 shadow-sm bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
           <NavbarDemo />
        </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Price History</h1>
          <p className="text-gray-400">Track price changes and savings across all your monitored products</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg bg-white/10 ${stat.color}`}>
                  {stat.icon}
                </div>
                <span className="text-sm text-gray-400">{stat.label}</span>
              </div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Product List */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Tracked Products</h2>
                <Filter className="h-5 w-5 text-gray-400 cursor-pointer hover:text-white" />
              </div>
              <div className="space-y-4">
                {trackedProducts.length > 0 ? (
                  trackedProducts.map((product) => (
                    <div
                      key={product.asin}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedProduct?.asin === product.asin
                          ? 'bg-indigo-600/20 border border-indigo-500'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="flex items-center space-x-3">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate">{product.name}</h3>
                          <p className="text-xs text-gray-400 mb-1">{product.platform}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-green-400">${product.currentPrice}</span>
                            {product.trend === 'down' ? (
                              <TrendingDown className="h-4 w-4 text-green-400" />
                            ) : (
                              <TrendingUp className="h-4 w-4 text-red-400" />
                            )}
                          </div>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {product.lastUpdated}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No tracked products found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chart and Details */}
          <div className="lg:col-span-3 space-y-6">
            {selectedProduct ? (
              <>
                {/* Product Details */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h2 className="text-xl font-semibold">{selectedProduct.name}</h2>
                        <p className="text-gray-400">{selectedProduct.platform}</p>
                        <p className="text-sm text-gray-500">ASIN: {selectedProduct.asin}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {timeRanges.map((range) => (
                        <button
                          key={range}
                          onClick={() => setTimeRange(range)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            timeRange === range
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Current Price</p>
                      <p className="text-2xl font-bold text-green-400">${selectedProduct.currentPrice}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Original Price</p>
                      <p className="text-2xl font-bold text-gray-300">${selectedProduct.originalPrice}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Target Price</p>
                      <p className="text-2xl font-bold text-indigo-400">${selectedProduct.targetPrice.toFixed(2)}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Total Savings</p>
                      <p className="text-2xl font-bold text-green-400">${selectedProduct.savings.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Price Chart */}
                {chartData.length > 0 ? (
                  <PriceHistoryChart data={chartData} />
                ) : (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                    <TrendingDown className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-400">No price data available for the selected time range</p>
                  </div>
                )}

                {/* Price Alerts */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-4">Recent Price Changes</h3>
                  <div className="space-y-3">
                    {priceAlerts.length > 0 ? (
                      priceAlerts.map((alert) => (
                        <div key={alert.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${alert.type === 'decrease' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {alert.type === 'decrease' ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                            </div>
                            <div>
                              <p className="font-medium">{alert.message}</p>
                              <p className="text-sm text-gray-400">{new Date(alert.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <span className={`font-medium ${alert.type === 'decrease' ? 'text-green-400' : 'text-red-400'}`}>
                            {alert.type === 'decrease' ? '' : '+'}${Math.abs(alert.change).toFixed(2)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No recent price changes detected</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400">Select a product to view its price history</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceHistoryPage;