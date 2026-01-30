import { NewsArticle, Trend } from '../types'

const GNEWS_API_BASE = 'https://gnews.io/api/v4'

interface GNewsResponse {
  articles: Array<{
    title: string
    description: string
    url: string
    source: { name: string }
    publishedAt: string
    content: string
  }>
}

export async function getNewsArticles(): Promise<NewsArticle[]> {
  const apiKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY

  if (!apiKey) {
    console.warn('GNEWS_API_KEY not found, using fallback data')
    return getFallbackNews()
  }

  try {
    const response = await fetch(
      `${GNEWS_API_BASE}/search?q=cryptocurrency OR trading OR markets OR blockchain&lang=en&max=10&apikey=${apiKey}`,
      {
        next: { revalidate: 300 }
      }
    )

    if (!response.ok) {
      throw new Error(`GNews API error: ${response.status}`)
    }

    const data: GNewsResponse = await response.json()

    return (data.articles || []).map(article => ({
      title: article.title,
      description: article.description || article.content?.substring(0, 150) + '...',
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      sentiment: analyzeSentiment(article.title + ' ' + article.description),
    }))
  } catch (error) {
    console.error('Error fetching news:', error)
    return getFallbackNews()
  }
}

export async function getTrends(): Promise<Trend[]> {
  const articles = await getNewsArticles()
  
  const topics = new Map<string, { count: number; sentiment: string[] }>()
  
  articles.forEach(article => {
    const keywords = extractKeywords(article.title + ' ' + article.description)
    
    keywords.forEach(keyword => {
      if (!topics.has(keyword)) {
        topics.set(keyword, { count: 0, sentiment: [] })
      }
      const topic = topics.get(keyword)!
      topic.count++
      if (article.sentiment) topic.sentiment.push(article.sentiment)
    })
  })
  
  const trends: Trend[] = []
  const sortedTopics = Array.from(topics.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 6)
  
  sortedTopics.forEach(([topic, data], index) => {
    const growth = Math.max(100, 500 - index * 50)
    const sentiment = getAverageSentiment(data.sentiment)
    
    trends.push({
      topic: capitalizeWords(topic),
      growth,
      source: 'News',
      sentiment,
    })
  })
  
  if (trends.length === 0) {
    return getFallbackTrends()
  }
  
  return trends
}

function analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
  const positiveWords = ['surge', 'rally', 'gain', 'bullish', 'growth', 'rise', 'soar', 'breakthrough', 'success', 'profit']
  const negativeWords = ['crash', 'fall', 'bearish', 'decline', 'drop', 'loss', 'risk', 'fear', 'concern', 'warn']
  
  const lowerText = text.toLowerCase()
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length
  
  if (positiveCount > negativeCount) return 'positive'
  if (negativeCount > positiveCount) return 'negative'
  return 'neutral'
}

function extractKeywords(text: string): string[] {
  const keywords: string[] = []
  const terms = [
    'Bitcoin', 'BTC', 'Ethereum', 'ETH', 'Solana', 'SOL',
    'DeFi', 'NFT', 'AI', 'Polymarket', 'Crypto', 'Blockchain',
    'Trading', 'Market', 'Volatility', 'Regulation', 'Adoption',
    'Innovation', 'Technology', 'Quantum', 'Space', 'Mining'
  ]
  
  terms.forEach(term => {
    if (text.toLowerCase().includes(term.toLowerCase()) && !keywords.includes(term)) {
      keywords.push(term)
    }
  })
  
  return keywords
}

function getAverageSentiment(sentiments: string[]): Trend['sentiment'] {
  if (sentiments.length === 0) return 'Neutral'
  
  const positiveCount = sentiments.filter(s => s === 'positive').length
  const negativeCount = sentiments.filter(s => s === 'negative').length
  
  if (positiveCount > sentiments.length * 0.6) return 'Bullish'
  if (positiveCount > sentiments.length * 0.8) return 'Very Bullish'
  if (negativeCount > sentiments.length * 0.6) return 'Bearish'
  if (negativeCount > sentiments.length * 0.8) return 'Negative'
  if (positiveCount > negativeCount) return 'Positive'
  
  return 'Neutral'
}

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, l => l.toUpperCase())
}

function getFallbackNews(): NewsArticle[] {
  return [
    {
      title: 'Bitcoin Surges Past Key Resistance Level',
      description: 'Bitcoin breaks through major resistance as institutional demand increases.',
      url: '#',
      source: 'Crypto News',
      publishedAt: new Date().toISOString(),
      sentiment: 'positive',
    },
    {
      title: 'Ethereum Layer 2 Solutions See Record Adoption',
      description: 'Layer 2 scaling solutions achieve unprecedented transaction volumes.',
      url: '#',
      source: 'Blockchain Daily',
      publishedAt: new Date().toISOString(),
      sentiment: 'positive',
    },
    {
      title: 'Polymarket Trading Volume Reaches New Heights',
      description: 'Prediction market platform sees surge in activity amid election speculation.',
      url: '#',
      source: 'Market Watch',
      publishedAt: new Date().toISOString(),
      sentiment: 'positive',
    },
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
