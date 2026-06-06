import type { AIRecommendation, AIChatMessage } from '@/types'

export const aiRecommendations: AIRecommendation[] = [
  { id: 'ar1', category: 'trade', title: 'Sell Cocoa Beans at Current Price', description: 'Spot price of $2,850/t is near resistance. RSI at 62 suggests limited upside this week. Consider selling 50-100t.', confidence: 87, impact: 'high', timestamp: '2026-06-06T08:00:00Z' },
  { id: 'ar2', category: 'pricing', title: 'Maize Price Expected to Soften', description: 'Harvest data from Kenya/Tanzania shows +12% yield. Prices likely to drop 5-8% in next 2 weeks. Delay purchases.', confidence: 76, impact: 'high', timestamp: '2026-06-06T07:30:00Z' },
  { id: 'ar3', category: 'weather', title: 'Storm Approaching Zambia Maize Belt', description: 'Tropical depression expected to affect Zambian maize regions. Consider accelerating shipments from Southern Africa.', confidence: 82, impact: 'medium', timestamp: '2026-06-06T06:00:00Z' },
  { id: 'ar4', category: 'planting', title: 'Optimal Planting Window - Northern Region', description: 'Soil moisture levels optimal for maize planting in Northern Ghana. Rain forecast favorable for next 10 days.', confidence: 91, impact: 'high', timestamp: '2026-06-05T14:00:00Z' },
  { id: 'ar5', category: 'risk', title: 'Cashew Market Overbought Signal', description: 'RSI at 72 with 7.7% weekly gain. Profit-taking likely. Consider hedging positions for Q3 contracts.', confidence: 68, impact: 'medium', timestamp: '2026-06-05T10:00:00Z' },
  { id: 'ar6', category: 'harvest', title: 'Cocoa Pod Maturity Alert', description: 'Satellite imagery shows 70% pod maturity in Western Region. Prepare harvest logistics within 10-14 days.', confidence: 94, impact: 'high', timestamp: '2026-06-04T16:00:00Z' },
  { id: 'ar7', category: 'trade', title: 'Buy Opportunity: Soya Beans', description: 'Support level holding at $485. MA50 crossing above MA200 (golden cross formation). Entry opportunity.', confidence: 72, impact: 'medium', timestamp: '2026-06-04T08:00:00Z' },
  { id: 'ar8', category: 'weather', title: 'Dry Spell Risk - Sahel Region', description: 'Extended dry forecast for Mali/Burkina Faso. Livestock water supplies may be affected. Plan alternative sources.', confidence: 78, impact: 'medium', timestamp: '2026-06-03T12:00:00Z' },
]

export const aiChatMessages: AIChatMessage[] = [
  { id: 'msg1', role: 'user', content: 'What is the current outlook for cocoa prices this quarter?', timestamp: '2026-06-06T09:00:00Z' },
  { id: 'msg2', role: 'assistant', content: 'Cocoa prices are showing a bullish trend with current spot at $2,850/t (+4.4% weekly). Production in West Africa is down 8% YoY due to irregular rainfall, while global demand remains strong at +3%. Supply deficit expected in Q3, which could push prices toward $3,000/t resistance level. I recommend monitoring RSI for overbought signals above 70.', timestamp: '2026-06-06T09:00:05Z' },
  { id: 'msg3', role: 'user', content: 'Should I sell my maize stock now or wait?', timestamp: '2026-06-06T09:02:00Z' },
  { id: 'msg4', role: 'assistant', content: 'Based on current data, I suggest selling sooner rather than later. Maize prices at $280/t have declined 5.1% this week. Kenya and Tanzania are reporting above-average harvests (+12% and +15% respectively), which typically pressures prices further. The RSI at 35 is approaching oversold territory, but no immediate reversal signals. I recommend selling within the next 5-7 days.', timestamp: '2026-06-06T09:02:05Z' },
]
