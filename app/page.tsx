'use client'

import { useState, useEffect } from 'react'
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
  RefreshCw,
} from 'lucide-react'
import { Opportunity, CryptoPrice, Trend, Alert } from '../lib/types'
import { getAllOpportunities, getMarketData, getTrendingTopics, getRecentAlerts } from '../lib/api'

const OpportunityCard = ({ opp, index }: { opp: Opportunity; index: number }) => (
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
      <a
        href={opp.url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-semibold transition-colors"
      >
        View <ArrowUpRight className="w-4 h-4" />
      </a>
    </div>
  </motion.div>
)

export default function Home() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [marketData, setMarketData] = useState<CryptoPrice[]>([])
  const [trends, setTrends] = useState<Trend[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [ops, markets, trnds, alrts] = await Promise.allSettled([
        getAllOpportunities(),
        getMarketData(),
        getTrendingTopics(),
        getRecentAlerts(),
      ])

      if (ops.status === 'fulfilled') setOpportunities(ops.value)
      if (markets.status === 'fulfilled') setMarketData(markets.value)
      if (trnds.status === 'fulfilled') setTrends(trnds.value)
      if (alrts.status === 'fulfilled') setAlerts(alrts.value)

      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  const filteredOpps = opportunities.filter(opp =>
    opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opp.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const avgScore = opportunities.length > 0
    ? Math.round(opportunities.reduce((sum, o) => sum + o.score, 0) / opportunities.length)
    : 0
  const highPriority = opportunities.filter(o => o.score >= 85).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
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
              <button
                onClick={fetchData}
                disabled={isLoading}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Opportunities', value: opportunities.length.toString(), icon: TrendingUp, color: 'text-green-400' },
            { label: 'Avg. Score', value: avgScore.toString(), icon: BarChart3, color: 'text-blue-400' },
            { label: 'High Priority', value: highPriority.toString(), icon: AlertCircle, color: 'text-yellow-400' },
            { label: 'Data Sources', value: '3 APIs', icon: Zap, color: 'text-purple-400' },
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Eye className="w-6 h-6 text-purple-400" />
                Opportunity Feed
              </h2>
              <div className="flex items-center gap-3">
                {isLoading && <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />}
                <span className="text-sm text-gray-400">{filteredOpps.length} results</span>
                <span className="text-xs text-gray-500">Updated {lastUpdate.toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="space-y-4">
              {filteredOpps.length > 0 ? (
                filteredOpps.map((opp, index) => (
                  <OpportunityCard key={opp.id} opp={opp} index={index} />
                ))
              ) : (
                <div className="glass rounded-lg p-8 text-center text-gray-400">
                  {isLoading ? 'Loading opportunities...' : 'No opportunities found'}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
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
                      <div className="text-white">${market.price.toLocaleString()}</div>
                      <div className={`text-sm ${market.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
                        trend.sentiment === 'Positive' ? 'text-green-400' :
                        trend.sentiment === 'Negative' ? 'text-red-400' :
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

            <div className="glass rounded-lg p-5 gradient-border">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-400" />
                Alert Center
              </h3>
              <div className="space-y-3">
                {alerts.map((alert, i) => (
                  <div key={i} className={`p-3 bg-gray-800/50 rounded border-l-4 ${
                    alert.type === 'alert' ? 'border-yellow-500' :
                    alert.type === 'info' ? 'border-blue-500' :
                    'border-green-500'
                  }`}>
                    <p className="text-white text-sm">{alert.message}</p>
                    <p className="text-gray-500 text-xs mt-1">{alert.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>Opportunity Radar • AI-Powered Intelligence • Built with 🚀 by Tuna</p>
        </div>
      </footer>
    </div>
  )
}
