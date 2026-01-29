'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  DollarSign,
  AlertCircle,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  Clock,
  Target,
  Zap,
  Eye,
  Bell,
  Search,
  Filter,
} from 'lucide-react'

// Mock data generators
const generateOpportunities = () => [
  {
    id: 1,
    title: 'Bitcoin Price Divergence',
    category: 'Crypto Arbitrage',
    score: 92,
    potential: '+$2,400',
    risk: 'Medium',
    timing: 'Now',
    description: 'BTC showing 4% price gap between Binance and Coinbase',
    tags: ['arbitrage', 'crypto', 'immediate'],
  },
  {
    id: 2,
    title: 'Polymarket: Trump Deportation Odds',
    category: 'Prediction Market',
    score: 88,
    potential: '+15% ROI',
    risk: 'Low',
    timing: '2 hours',
    description: 'Market inefficiency detected in deportation probability markets',
    tags: ['polymarket', 'politics', 'trending'],
  },
  {
    id: 3,
    title: 'NVDA Earnings Implied Move',
    category: 'Options Trading',
    score: 85,
    potential: '+$3,200',
    risk: 'High',
    timing: '3 days',
    description: 'Implied volatility 20% below historical average pre-earnings',
    tags: ['options', 'earnings', 'nvda'],
  },
  {
    id: 4,
    title: 'Solana Token Launch Spike',
    category: 'Meme Coin',
    score: 78,
    potential: '+500%',
    risk: 'Very High',
    timing: 'Now',
    description: 'New token launch on Solana showing 3000% volume spike',
    tags: ['solana', 'meme', 'viral'],
  },
  {
    id: 5,
    title: 'USD/EUR Carry Trade',
    category: 'Forex',
    score: 75,
    potential: '+$850/month',
    risk: 'Low',
    timing: 'Ongoing',
    description: 'Interest rate differential favors USD carry trade',
    tags: ['forex', 'passive', 'low-risk'],
  },
]

const generateMarketData = () => [
  { symbol: 'BTC', price: '$43,250', change: '+2.4%', up: true },
  { symbol: 'ETH', price: '$2,890', change: '+3.1%', up: true },
  { symbol: 'SOL', price: '$98.40', change: '-1.2%', up: false },
  { symbol: 'NVDA', price: '$620', change: '+1.8%', up: true },
  { symbol: 'USDC', price: '$1.00', change: '0.0%', up: true },
]

const generateTrends = () => [
  { topic: 'AI Regulation', growth: 340, source: 'News', sentiment: 'Positive' },
  { topic: 'Quantum Computing', growth: 280, source: 'Social', sentiment: 'Neutral' },
  { topic: 'Polymarket', growth: 520, source: 'Markets', sentiment: 'Bullish' },
  { topic: 'Solana DeFi', growth: 410, source: 'Tech', sentiment: 'Very Bullish' },
  { topic: 'Space Mining', growth: 190, source: 'News', sentiment: 'Speculative' },
]

const OpportunityCard = ({ opp, index }: { opp: any, index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="glass rounded-lg p-5 gradient-border hover:scale-[1.02] transition-all duration-300"
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <span className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
          {opp.category}
        </span>
        <h3 className="text-lg font-bold text-white mt-1">{opp.title}</h3>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-3xl font-bold gradient-text">{opp.score}</div>
        <span className="text-xs text-gray-400">AI Score</span>
      </div>
    </div>

    <p className="text-gray-300 text-sm mb-3">{opp.description}</p>

    <div className="flex items-center gap-4 mb-3">
      <div className="flex items-center gap-1">
        <DollarSign className="w-4 h-4 text-green-400" />
        <span className="text-green-400 font-semibold">{opp.potential}</span>
      </div>
      <div className="flex items-center gap-1">
        <Target className="w-4 h-4 text-blue-400" />
        <span className="text-blue-400">{opp.risk} Risk</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="w-4 h-4 text-yellow-400" />
        <span className="text-yellow-400">{opp.timing}</span>
      </div>
    </div>

    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {opp.tags.map((tag: string) => (
          <span
            key={tag}
            className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      <button className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-semibold transition-colors">
        View <ArrowUpRight className="w-4 h-4" />
      </button>
    </div>
  </motion.div>
)

export default function Home() {
  const [opportunities] = useState(generateOpportunities())
  const [marketData] = useState(generateMarketData())
  const [trends] = useState(generateTrends())
  const [searchQuery, setSearchQuery] = useState('')

  const filteredOpps = opportunities.filter(opp =>
    opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Opportunity Radar</h1>
                <p className="text-xs text-gray-400">AI-Powered Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-400" />
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                T
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Opportunities', value: '24', icon: TrendingUp, color: 'text-green-400' },
            { label: 'Avg. Score', value: '87', icon: BarChart3, color: 'text-blue-400' },
            { label: 'High Priority', value: '8', icon: AlertCircle, color: 'text-yellow-400' },
            { label: 'New Today', value: '12', icon: Zap, color: 'text-purple-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-lg p-5 gradient-border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <stat.icon className={`w-10 h-10 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="glass rounded-lg p-4 mb-8 flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search opportunities, tags, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Opportunities Feed */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Eye className="w-6 h-6 text-purple-400" />
                Opportunity Feed
              </h2>
              <span className="text-sm text-gray-400">{filteredOpps.length} results</span>
            </div>

            <div className="space-y-4">
              {filteredOpps.map((opp, index) => (
                <OpportunityCard key={opp.id} opp={opp} index={index} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Market Monitor */}
            <div className="glass rounded-lg p-5 gradient-border">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-400" />
                Market Monitor
              </h3>
              <div className="space-y-3">
                {marketData.map((market) => (
                  <div key={market.symbol} className="flex items-center justify-between py-2 border-b border-gray-800">
                    <span className="text-white font-semibold">{market.symbol}</span>
                    <div className="text-right">
                      <div className="text-white">{market.price}</div>
                      <div className={`text-sm ${market.up ? 'text-green-400' : 'text-red-400'}`}>
                        {market.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trend Scanner */}
            <div className="glass rounded-lg p-5 gradient-border">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Trend Scanner
              </h3>
              <div className="space-y-3">
                {trends.map((trend, i) => (
                  <div key={i} className="py-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">{trend.topic}</span>
                      <span className={`text-sm ${
                        trend.sentiment.includes('Bullish') ? 'text-green-400' :
                        trend.sentiment.includes('Bearish') ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {trend.sentiment}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-800 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(trend.growth / 6, 100)}%` }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        />
                      </div>
                      <span className="text-xs text-gray-400">+{trend.growth}%</span>
                    </div>
                    <span className="text-xs text-gray-500">{trend.source}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alert Center Preview */}
            <div className="glass rounded-lg p-5 gradient-border">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-400" />
                Alert Center
              </h3>
              <div className="space-y-3">
                {[
                  { msg: 'BTC hit $44,000 resistance', time: '2m ago', type: 'alert' },
                  { msg: 'New polymarket created', time: '15m ago', type: 'info' },
                  { msg: 'Solana volume +200%', time: '1h ago', type: 'success' },
                ].map((alert, i) => (
                  <div key={i} className="p-3 bg-gray-800/50 rounded border-l-4 ${
                    alert.type === 'alert' ? 'border-yellow-500' :
                    alert.type === 'info' ? 'border-blue-500' :
                    'border-green-500'
                  }">
                    <p className="text-white text-sm">{alert.msg}</p>
                    <p className="text-gray-500 text-xs mt-1">{alert.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>Opportunity Radar • AI-Powered Intelligence • Built with 🚀 by Tuna</p>
        </div>
      </footer>
    </div>
  )
}
