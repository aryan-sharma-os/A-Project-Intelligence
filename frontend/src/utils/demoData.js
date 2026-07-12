export const DEMO_DATA = {
  ticker: 'AAPL',
  company_name: 'Apple Inc.',
  exchange: 'NASDAQ',
  sector: 'Technology',
  price: '313.39',
  priceChange: '+2.48',
  priceChangePercent: '+0.80%',
  marketStatus: 'Market Closed • May 28, 2025',
  recommendation: 'HOLD',
  investment_score: 54,
  confidence_level: 54,

  executive_summary: "Apple Inc. remains a leader in the technology sector with a strong ecosystem, loyal customer base, and robust financial position. However, revenue growth has moderated, and the company faces increasing competition in key markets along with macroeconomic headwinds pose risks to future performance. Valuation appears fair given the growth outlook and cash generation.",
  
  key_takeaways: [
    { type: 'positive', text: "Strong balance sheet with $101.3B in free cash flow" },
    { type: 'positive', text: "Services segment showing consistent growth" },
    { type: 'positive', text: "Valuation appears fair given growth outlook" }
  ],

  financial_highlights: [
    { metric_name: 'Market Cap', value: '$3.34 Trillion' },
    { metric_name: 'Revenue (TTM)', value: '$383.3B' },
    { metric_name: 'Net Income (TTM)', value: '$97.0B' },
    { metric_name: 'EPS (TTM)', value: '$6.42' },
    { metric_name: 'Gross Margin', value: '46.2%' },
    { metric_name: 'ROE', value: '147.3%' },
    { metric_name: 'Dividend Yield', value: '0.54%' }
  ],

  key_financials: [
    { label: 'Market Cap', value: '$3.34T' },
    { label: 'Enterprise Value', value: '$3.41T' },
    { label: 'P/E Ratio', value: '32.4x' },
    { label: 'PEG Ratio', value: '2.12x' },
    { label: 'Price to Sales', value: '8.72x' },
    { label: 'Price to Book', value: '49.21x' },
    { label: 'Current Ratio', value: '0.91' },
    { label: 'Debt to Equity', value: '1.73' }
  ],

  revenue_breakdown: [
    { name: 'iPhone', value: 52.3, amount: '$200.6B', color: '#10b981' },
    { name: 'Services', value: 26.4, amount: '$101.3B', color: '#3b82f6' },
    { name: 'Mac', value: 8.1, amount: '$31.1B', color: '#8b5cf6' },
    { name: 'iPad', value: 6.8, amount: '$26.1B', color: '#f59e0b' },
    { name: 'Wearables', value: 6.4, amount: '$24.2B', color: '#ef4444' }
  ],

  financial_performance: [
    { year: '2021', revenue: 365, netIncome: 94, freeCashFlow: 92 },
    { year: '2022', revenue: 394, netIncome: 99, freeCashFlow: 111 },
    { year: '2023', revenue: 383, netIncome: 97, freeCashFlow: 99 },
    { year: '2024', revenue: 390, netIncome: 100, freeCashFlow: 105 },
    { year: 'TTM', revenue: 383.3, netIncome: 97.0, freeCashFlow: 101.3 }
  ],

  latest_news: [
    {
      title: "Apple WWDC 2025: AI features take center stage with new iOS updates",
      source: "TechCrunch",
      time: "2 hours ago",
      sentiment: "Positive"
    },
    {
      title: "Apple expands manufacturing in India to reduce China dependency",
      source: "Reuters",
      time: "5 hours ago",
      sentiment: "Neutral"
    },
    {
      title: "Apple stock rises on strong iPhone sales in emerging markets",
      source: "Bloomberg",
      time: "1 day ago",
      sentiment: "Positive"
    },
    {
      title: "Apple faces scrutiny over App Store policies in EU",
      source: "CNBC",
      time: "1 day ago",
      sentiment: "Negative"
    }
  ],

  competitors: [
    { name: "Microsoft (MSFT)", marketCap: "$3.15T", peRatio: "33.2x", revenueGrowth: "+15.2%" },
    { name: "Alphabet (GOOGL)", marketCap: "$2.10T", peRatio: "18.7x", revenueGrowth: "+13.6%" },
    { name: "Samsung (005930.KS)", marketCap: "$0.37T", peRatio: "11.2x", revenueGrowth: "+5.7%" },
    { name: "Sony (6758.T)", marketCap: "$0.11T", peRatio: "16.3x", revenueGrowth: "-1.2%" }
  ],

  industry_updates: [
    { title: "Global smartphone market grows 7.8% in Q1 2025", source: "IDC", time: "3 hours ago", sentiment: "Positive" },
    { title: "AI chip demand surges as tech companies increase investments", source: "SemiAnalysis", time: "6 hours ago", sentiment: "Positive" },
    { title: "Tech sector faces regulatory scrutiny over market dominance", source: "FT", time: "1 day ago", sentiment: "Neutral" }
  ],

  investments: [
    { title: "$500M investment in Perplexity AI", desc: "Strategic partnership to enhance AI search capabilities.", date: "May 21, 2025" },
    { title: "Acquisition of DarwinAI", desc: "Strengthens on-device AI and computer vision capabilities.", date: "May 14, 2025" },
    { title: "$1B investment in US manufacturing", desc: "Expanding iPhone production capacity in USA.", date: "May 10, 2025" }
  ],

  industry_overview: {
    sector: "Technology Hardware",
    description: "The global technology hardware market is projected to grow at a CAGR of 5.8% from 2024 to 2030, driven by AI adoption, cloud computing, and IoT expansion.",
    trends: [
      "AI integration in devices",
      "Supply chain diversification",
      "Sustainability initiatives",
      "Cloud & edge computing growth"
    ],
    marketSize: "$685.6B",
    cagr: "5.8%"
  },

  risk_assessment: [
    { category: "Market Risk", level: "Medium" },
    { category: "Operational Risk", level: "Low" },
    { category: "Financial Risk", level: "Medium" },
    { category: "Regulatory Risk", level: "Medium" },
    { category: "Competitive Risk", level: "High" }
  ],
  
  overall_risk: "Medium",

  ai_reasoning: "Apple demonstrates strong financials and brand value but faces growth challenges in key markets and increasing competition. Maintain neutral stance until clearer growth catalysts emerge.",
  
  suggested_questions: [
    "How is Apple performing financially?",
    "Compare Apple with Microsoft",
    "What is Apple's growth outlook?",
    "Explain Apple's valuation",
    "What are the biggest risks for Apple?"
  ]
};
