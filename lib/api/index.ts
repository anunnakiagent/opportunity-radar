import { Opportunity, CryptoPrice, Trend, Alert } from '../types'
import { getCryptoPrices, getArbitrageOpportunities } from './coingecko'
import { getTrends, getNewsArticles } from './news'
import { getPolymarketOpportunities } from './polymarket'
import { getSocialTrends } from './social'

export async function getAllOpportunities(): Promise<Opportunity[]> {
  try {
    const [cryptoOpps, polyOpps] = await Promise.allSettled([
      getArbitrageOpportunities(),
      getPolymarketOpportunities(),
    ])

    const opportunities: Opportunity[] = []

    if (cryptoOpps.status === 'fulfilled') {
      opportunities.push(...cryptoOpps.value)
    }

    if (polyOpps.status === 'fulfilled') {
      opportunities.push(...polyOpps.value)
    }

    opportunities.sort((a, b) => b.score - a.score)

    return opportunities.slice(0, 12)
  } catch (error) {
    console.error('Error fetching opportunities:', error)
    return getFallbackOpportunities()
  }
}

export async function getMarketData(): Promise<CryptoPrice[]> {
  try {
    return await getCryptoPrices()
  } catch (error) {
    console.error('Error fetching market data:', error)
    return getFallbackMarketData()
  }
}

export async function getTrendingTopics(): Promise<Trend[]> {
  try {
    const [newsTrends, socialTrends] = await Promise.allSettled([
      getTrends(),
      getSocialTrends(),
    ])

    const combinedTrends: Trend[] = []
    
    if (newsTrends.status === 'fulfilled') {
      combinedTrends.push(...newsTrends.value)
    }
    
    if (socialTrends.status === 'fulfilled') {
      combinedTrends.push(...socialTrends.value)
    }

    const topicMap = new Map<string, Trend>()

    combinedTrends.forEach(trend => {
      const key = trend.topic.toLowerCase()
      if (topicMap.has(key)) {
        const existing = topicMap.get(key)!
        existing.growth = Math.max(existing.growth, trend.growth)
        if (trend.source === 'Reddit' || trend.source === 'Social') {
          existing.source = existing.source.includes('Reddit') ? existing.source : `${existing.source}/Reddit`
        }
      } else {
        topicMap.set(key, { ...trend })
      }
    })

    const trends = Array.from(topicMap.values())
      .sort((a, b) => b.growth - a.growth)
      .slice(0, 8)

    return trends.length > 0 ? trends : getFallbackTrends()
  } catch (error) {
    console.error('Error fetching trends:', error)
    return getFallbackTrends()
  }
}

export async function getRecentAlerts(): Promise<Alert[]> {
  try {
    const [oppurities, trends] = await Promise.allSettled([
      getAllOpportunities(),
      getTrendingTopics(),
    ])

    const alerts: Alert[] = []

    if (oppurities.status === 'fulfilled' && oppurities.value.length > 0) {
      const highScore = oppurities.value.find(o => o.score >= 90)
      if (highScore) {
        alerts.push({
          message: `High score opportunity: ${highScore.title}`,
          time: 'Just now',
          type: 'alert',
        })
      }
    }

    if (trends.status === 'fulfilled' && trends.value.length > 0) {
      const topTrend = trends.value[0]
      if (topTrend.growth > 400) {
        alerts.push({
          message: `${topTrend.topic} trending +${topTrend.growth}%`,
          time: '15m ago',
          type: 'info',
        })
      }
    }

    const news = await getNewsArticles()
    if (news.length > 0 && news[0].sentiment === 'positive') {
      alerts.push({
        message: news[0].title.substring(0, 50) + '...',
        time: '1h ago',
        type: 'success',
      })
    }

    if (alerts.length === 0) {
      return getFallbackAlerts()
    }

    return alerts.slice(0, 4)
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return getFallbackAlerts()
  }
}

function getFallbackOpportunities(): Opportunity[] {
  return [
    {
      id: 'fallback-1',
      title: 'Bitcoin Price Divergence',
      category: 'Crypto Arbitrage',
      score: 92,
      potential: '+$2,400',
      risk: 'Medium',
      timing: 'Now',
      description: 'BTC showing 4% price gap between exchanges',
      tags: ['arbitrage', 'crypto', 'immediate'],
    },
    {
      id: 'fallback-2',
      title: 'Polymarket: Trump Election Odds',
      category: 'Prediction Market',
      score: 88,
      potential: '+15% ROI',
      risk: 'Low',
      timing: '2 hours',
      description: 'Market inefficiency detected in election probability',
      tags: ['polymarket', 'politics', 'trending'],
    },
    {
      id: 'fallback-3',
      title: 'Ethereum DeFi Volume Surge',
      category: 'DeFi',
      score: 85,
      potential: '+$1,800',
      risk: 'Medium',
      timing: 'Now',
      description: 'DeFi protocols showing 25% volume increase',
      tags: ['defi', 'ethereum', 'trending'],
    },
  ]
}

function getFallbackMarketData(): CryptoPrice[] {
  return [
    { symbol: 'BTC', name: 'Bitcoin', price: 43250, change24h: 2.4 },
    { symbol: 'ETH', name: 'Ethereum', price: 2890, change24h: 3.1 },
    { symbol: 'SOL', name: 'Solana', price: 98.40, change24h: -1.2 },
    { symbol: 'NVDA', name: 'NVIDIA', price: 620, change24h: 1.8 },
    { symbol: 'USDC', name: 'USD Coin', price: 1.00, change24h: 0.0 },
  ]
}

function getFallbackTrends(): Trend[] {
  return [
    { topic: 'AI Regulation', growth: 340, source: 'News', sentiment: 'Positive' },
    { topic: 'Quantum Computing', growth: 280, source: 'Social', sentiment: 'Neutral' },
    { topic: 'Polymarket', growth: 520, source: 'Markets', sentiment: 'Bullish' },
    { topic: 'Solana DeFi', growth: 410, source: 'Tech', sentiment: 'Very Bullish' },
    { topic: 'Bitcoin ETF', growth: 450, source: 'Markets', sentiment: 'Bullish' },
    { topic: 'Space Mining', growth: 190, source: 'News', sentiment: 'Speculative' },
  ]
}

function getFallbackAlerts(): Alert[] {
  return [
    { message: 'BTC hit $44,000 resistance', time: '2m ago', type: 'alert' },
    { message: 'New polymarket created', time: '15m ago', type: 'info' },
    { message: 'Solana volume +200%', time: '1h ago', type: 'success' },
  ]
}
