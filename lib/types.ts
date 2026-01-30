export interface CryptoPrice {
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap?: number
  volume24h?: number
}

export interface Opportunity {
  id: string | number
  title: string
  category: string
  score: number
  potential: string
  risk: 'Low' | 'Medium' | 'High' | 'Very High'
  timing: string
  description: string
  tags: string[]
  url?: string
}

export interface Trend {
  topic: string
  growth: number
  source: string
  sentiment: 'Positive' | 'Neutral' | 'Bullish' | 'Very Bullish' | 'Bearish' | 'Negative' | 'Speculative'
}

export interface NewsArticle {
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  sentiment?: 'positive' | 'neutral' | 'negative'
}

export interface Alert {
  message: string
  time: string
  type: 'alert' | 'info' | 'success'
}

export interface PolymarketMarket {
  id: string
  question: string
  tokens: {
    yes: number
    no: number
  }
  volume: number
  liquidity: number
  endDate: string
  slug?: string
}
