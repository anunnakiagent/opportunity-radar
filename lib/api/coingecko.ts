import { CryptoPrice, Opportunity } from '../types'

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3'

const COINS = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'cardano', 'ripple', 'polkadot', 'dogecoin']

const SYMBOL_MAP: Record<string, string> = {
  bitcoin: 'BTC',
  ethereum: 'ETH',
  solana: 'SOL',
  binancecoin: 'BNB',
  cardano: 'ADA',
  ripple: 'XRP',
  polkadot: 'DOT',
  dogecoin: 'DOGE',
}

export async function getCryptoPrices(): Promise<CryptoPrice[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API_BASE}/coins/markets?vs_currency=usd&ids=${COINS.join(',')}&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h`,
      {
        next: { revalidate: 60 }
      }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()

    return data.map((coin: { id: string; symbol: string; name: string; current_price: number; price_change_percentage_24h: number | null; market_cap: number; total_volume: number }) => ({
      symbol: SYMBOL_MAP[coin.id] || coin.symbol.toUpperCase(),
      name: coin.name,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h || 0,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
    }))
  } catch (error) {
    console.error('Error fetching crypto prices:', error)
    return getFallbackCryptoPrices()
  }
}

function getFallbackCryptoPrices(): CryptoPrice[] {
  return [
    { symbol: 'BTC', name: 'Bitcoin', price: 43250, change24h: 2.4 },
    { symbol: 'ETH', name: 'Ethereum', price: 2890, change24h: 3.1 },
    { symbol: 'SOL', name: 'Solana', price: 98.40, change24h: -1.2 },
    { symbol: 'BNB', name: 'Binance Coin', price: 320, change24h: 1.5 },
    { symbol: 'USDC', name: 'USD Coin', price: 1.00, change24h: 0.0 },
  ]
}

export async function getArbitrageOpportunities(): Promise<Opportunity[]> {
  const prices = await getCryptoPrices()
  
  const opportunities: Opportunity[] = []
  
  const btc = prices.find(p => p.symbol === 'BTC')
  const eth = prices.find(p => p.symbol === 'ETH')
  const sol = prices.find(p => p.symbol === 'SOL')
  
  if (btc && btc.change24h > 2) {
    opportunities.push({
      id: `arb-${Date.now()}-1`,
      title: 'Bitcoin Price Momentum',
      category: 'Crypto Trading',
      score: Math.min(90, 70 + Math.floor(btc.change24h * 2)),
      potential: `+${(btc.change24h * 10).toFixed(0)}% potential`,
      risk: btc.change24h > 5 ? 'High' : 'Medium',
      timing: 'Now',
      description: `BTC showing strong momentum with ${btc.change24h.toFixed(1)}% 24h change`,
      tags: ['crypto', 'momentum', 'btc'],
    })
  }
  
  if (eth && eth.change24h > 2) {
    opportunities.push({
      id: `arb-${Date.now()}-2`,
      title: 'Ethereum Price Action',
      category: 'Crypto Trading',
      score: Math.min(85, 65 + Math.floor(eth.change24h * 2)),
      potential: `+${(eth.change24h * 8).toFixed(0)}% potential`,
      risk: eth.change24h > 5 ? 'High' : 'Medium',
      timing: 'Now',
      description: `ETH gaining traction with ${eth.change24h.toFixed(1)}% 24h change`,
      tags: ['crypto', 'momentum', 'eth'],
    })
  }
  
  if (sol && Math.abs(sol.change24h) > 3) {
    opportunities.push({
      id: `arb-${Date.now()}-3`,
      title: 'Solana Volatility Play',
      category: 'Crypto Trading',
      score: Math.min(80, 60 + Math.floor(Math.abs(sol.change24h) * 2)),
      potential: `+${Math.abs(sol.change24h * 12).toFixed(0)}% potential`,
      risk: 'High',
      timing: 'Now',
      description: `SOL showing high volatility at ${sol.change24h.toFixed(1)}% 24h change`,
      tags: ['solana', 'volatility', 'high-risk'],
    })
  }
  
  return opportunities.length > 0 ? opportunities : []
}
