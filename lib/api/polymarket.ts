import { Opportunity, PolymarketMarket } from '../types'

const POLYMARKET_GRAPHQL = 'https://polybetamarket-production.up.railway.app/graphql'

const POLYMARKET_QUERY = `
  query {
    markets(orderBy: volume24h, orderDirection: desc, first: 20) {
      id
      question
      tokens {
        yes
        no
      }
      volume
      liquidity
      endDate
      slug
    }
  }
`

export async function getPolymarketMarkets(): Promise<PolymarketMarket[]> {
  try {
    const response = await fetch(POLYMARKET_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: POLYMARKET_QUERY }),
      next: { revalidate: 120 }
    })

    if (!response.ok) {
      throw new Error(`Polymarket API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`)
    }

    return (data.data?.markets || []).map((market: {
      id: string
      question: string
      tokens: { yes: number; no: number }
      volume: number
      liquidity: number
      endDate: string
      slug?: string
    }) => ({
      id: market.id,
      question: market.question,
      tokens: {
        yes: market.tokens.yes,
        no: market.tokens.no,
      },
      volume: market.volume,
      liquidity: market.liquidity,
      endDate: market.endDate,
    }))
  } catch (error) {
    console.error('Error fetching Polymarket data:', error)
    return getFallbackMarkets()
  }
}

export async function getPolymarketOpportunities(): Promise<Opportunity[]> {
  const markets = await getPolymarketMarkets()
  const opportunities: Opportunity[] = []

  markets.forEach((market) => {
    const yesPrice = market.tokens.yes * 100
    const noPrice = market.tokens.no * 100
    const priceSpread = Math.abs(yesPrice - noPrice)
    
    let risk: Opportunity['risk'] = 'Medium'
    if (priceSpread < 5) risk = 'Low'
    else if (priceSpread > 30) risk = 'High'
    else if (priceSpread > 40) risk = 'Very High'

    const score = Math.min(95, 60 + Math.floor(market.volume / 10000))

    opportunities.push({
      id: `poly-${market.id}`,
      title: market.question.substring(0, 60) + (market.question.length > 60 ? '...' : ''),
      category: 'Prediction Market',
      score,
      potential: `Yes: ${yesPrice.toFixed(1)}¢ / No: ${noPrice.toFixed(1)}¢`,
      risk,
      timing: getTimeUntilEnd(market.endDate),
      description: `Market with $${(market.volume).toLocaleString()} volume. Current odds: Yes ${yesPrice.toFixed(0)}%`,
      tags: ['polymarket', 'prediction', getMarketTopic(market.question)],
      url: `https://polymarket.com/event/${market.slug || market.id}`,
    })
  })

  return opportunities.slice(0, 5)
}

function getTimeUntilEnd(endDate: string): string {
  try {
    const end = new Date(endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 30) return 'Ongoing'
    if (days > 0) return `${days} days`
    if (hours > 0) return `${hours} hours`
    return 'Now'
  } catch {
    return 'Ongoing'
  }
}

function getMarketTopic(question: string): string {
  const lowerQ = question.toLowerCase()
  
  if (lowerQ.includes('trump') || lowerQ.includes('election') || lowerQ.includes('president')) return 'politics'
  if (lowerQ.includes('bitcoin') || lowerQ.includes('btc') || lowerQ.includes('crypto')) return 'crypto'
  if (lowerQ.includes('ethereum') || lowerQ.includes('eth')) return 'eth'
  if (lowerQ.includes('sport') || lowerQ.includes('game') || lowerQ.includes('win')) return 'sports'
  if (lowerQ.includes('economy') || lowerQ.includes('inflation') || lowerQ.includes('fed')) return 'economics'
  if (lowerQ.includes('war') || lowerQ.includes('conflict')) return 'geopolitics'
  
  return 'trending'
}

function getFallbackMarkets(): PolymarketMarket[] {
  return [
    {
      id: 'fallback-1',
      question: 'Will Bitcoin exceed $100,000 by end of 2025?',
      tokens: { yes: 0.35, no: 0.68 },
      volume: 2500000,
      liquidity: 500000,
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'fallback-2',
      question: 'Will Ethereum flip Bitcoin market cap by 2026?',
      tokens: { yes: 0.12, no: 0.91 },
      volume: 850000,
      liquidity: 150000,
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'fallback-3',
      question: 'Will Solana reach $200 in 2025?',
      tokens: { yes: 0.42, no: 0.61 },
      volume: 1200000,
      liquidity: 300000,
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
}
