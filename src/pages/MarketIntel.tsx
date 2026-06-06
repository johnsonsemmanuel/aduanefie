import { useState } from 'react'
import { BarChart3, TrendingUp, Cloud, Users, FileText, ArrowUp, ArrowDown, Activity } from 'lucide-react'
import { Tabs } from '@/components/ui/Tabs'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { TickerTape, TopMoversBar } from '@/components/trade/TickerTape'
import { PriceChart } from '@/components/trade/PriceChart'
import { WeatherWidget } from '@/components/trade/WeatherWidget'
import { DemandAnalytics } from '@/components/trade/DemandAnalytics'
import {
  marketTicker, commodityDetails, weatherZones, demandData, marketReports,
  topMovers, marketOverviewData
} from '@/data/agrios'
import type { CommodityDetail } from '@/types'

const intelTabs = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { id: 'prices', label: 'Price Analysis', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: 'weather', label: 'Weather Intel', icon: <Cloud className="w-3.5 h-3.5" /> },
  { id: 'demand', label: 'Demand Analytics', icon: <Users className="w-3.5 h-3.5" /> },
  { id: 'reports', label: 'Reports', icon: <FileText className="w-3.5 h-3.5" /> },
]

export function MarketIntel() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityDetail>(commodityDetails[0])

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-text-primary">Market Intelligence Center</h1>
          <p className="text-xs text-text-secondary">Real-time commodity analytics, weather data, and demand insights</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] text-text-secondary">
          <Activity className="w-3 h-3 text-success" />
          <span>Data refreshes every 30s</span>
        </div>
      </div>

      {/* Market Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {marketOverviewData.map((item) => (
          <div key={item.label} className="rounded-lg border border-border bg-surface p-2.5">
            <p className="text-[10px] text-text-secondary mb-0.5">{item.label}</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-text-primary">{item.value}</span>
              <span className={`text-[10px] font-medium ${
                item.trend === 'up' ? 'text-success' : item.trend === 'down' ? 'text-danger' : 'text-text-secondary'
              }`}>
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Live Ticker */}
      <TickerTape tickers={marketTicker} />

      {/* Tab Navigation */}
      <Card padding="none">
        <Tabs tabs={intelTabs} activeId={activeTab} onChange={setActiveTab} className="px-4" />
      </Card>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'overview' && (
          <>
            <TopMoversBar movers={topMovers} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Selected Commodity Chart */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle>{selectedCommodity.name}</CardTitle>
                    <span className={`text-xs font-semibold ${selectedCommodity.change >= 0 ? 'text-success' : 'text-danger'}`}>
                      ${selectedCommodity.currentPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-text-secondary">
                    <span>O: ${selectedCommodity.open}</span>
                    <span>H: ${selectedCommodity.high}</span>
                    <span>L: ${selectedCommodity.low}</span>
                  </div>
                </CardHeader>
                <PriceChart data={selectedCommodity.priceHistory} width={500} height={180} color={selectedCommodity.change >= 0 ? '#2E7D32' : '#D32F2F'} />
                <div className="flex items-center gap-3 mt-2 text-[10px] text-text-secondary border-t border-border pt-2">
                  <span>RSI: <span className={`font-medium ${selectedCommodity.rsi > 70 ? 'text-danger' : selectedCommodity.rsi < 30 ? 'text-success' : 'text-text-primary'}`}>{selectedCommodity.rsi}</span></span>
                  <span>MA50: ${selectedCommodity.ma50}</span>
                  <span>MA200: ${selectedCommodity.ma200}</span>
                  <span>S: ${selectedCommodity.support}</span>
                  <span>R: ${selectedCommodity.resistance}</span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {commodityDetails.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCommodity(c)}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition-colors ${
                        selectedCommodity.id === c.id
                          ? 'bg-primary text-white'
                          : 'bg-border/50 text-text-secondary hover:bg-surface-hover'
                      }`}
                    >
                      {c.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Top Movers */}
              <Card>
                <CardHeader>
                  <CardTitle>Market Movers</CardTitle>
                  <span className="text-xs text-text-secondary">Top gainers & losers</span>
                </CardHeader>
                <div className="space-y-1">
                  {commodityDetails.slice(0, 6).map((c) => (
                    <div key={c.id} className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-surface-hover transition-colors cursor-pointer" onClick={() => setSelectedCommodity(c)}>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-text-primary truncate">{c.name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-text-secondary">
                          <span>Vol: {c.volume.toLocaleString()}</span>
                          <span>RSI: {c.rsi}</span>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-xs font-semibold">${c.currentPrice.toLocaleString()}</p>
                        <span className={`inline-flex items-center gap-0.5 text-[10px] font-medium ${c.change >= 0 ? 'text-success' : 'text-danger'}`}>
                          {c.trend === 'up' ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                          {Math.abs(c.changePercent).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}

        {activeTab === 'prices' && (
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Price Analysis</CardTitle>
              </CardHeader>
              <div className="flex gap-2 mb-3 flex-wrap">
                {commodityDetails.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCommodity(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCommodity.id === c.id
                        ? 'bg-primary text-white'
                        : 'bg-border/50 text-text-secondary hover:bg-surface-hover'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
              <PriceChart data={selectedCommodity.priceHistory} width={700} height={240} color={selectedCommodity.change >= 0 ? '#2E7D32' : '#D32F2F'} />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {[
                  { label: 'Current', value: `$${selectedCommodity.currentPrice.toLocaleString()}` },
                  { label: 'Open', value: `$${selectedCommodity.open}` },
                  { label: 'High', value: `$${selectedCommodity.high}` },
                  { label: 'Low', value: `$${selectedCommodity.low}` },
                  { label: 'Volume', value: selectedCommodity.volume.toLocaleString() },
                  { label: 'RSI (14)', value: selectedCommodity.rsi.toString() },
                  { label: 'MA (50)', value: `$${selectedCommodity.ma50}` },
                  { label: 'MA (200)', value: `$${selectedCommodity.ma200}` },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-border bg-bg p-2.5">
                    <p className="text-[10px] text-text-secondary">{s.label}</p>
                    <p className="text-xs font-semibold text-text-primary font-mono">{s.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'weather' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <WeatherWidget zones={weatherZones} />
            <Card>
              <CardHeader>
                <CardTitle>Weather Impact Summary</CardTitle>
              </CardHeader>
              <div className="space-y-3">
                {weatherZones.map((z) => (
                  <div key={z.id} className="flex items-start gap-2.5 p-2.5 rounded-lg border border-border">
                    <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                      z.impact === 'positive' ? 'bg-success' :
                      z.impact === 'negative' ? 'bg-danger' : 'bg-border'
                    }`} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-text-primary">{z.region}</p>
                      <p className="text-[10px] text-text-secondary">{z.condition} · {z.temperature}°C · {z.humidity}% humidity</p>
                      <p className="text-[10px] text-text-secondary mt-0.5">
                        {z.impact === 'positive' ? 'Favorable conditions for crop development' :
                         z.impact === 'negative' ? 'Adverse conditions may affect yields and logistics' :
                         'Normal conditions for this season'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'demand' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DemandAnalytics data={demandData} />
            <Card>
              <CardHeader>
                <CardTitle>Supply-Demand Overview</CardTitle>
              </CardHeader>
              <div className="space-y-3">
                {demandData.map((d) => (
                  <div key={d.commodity} className="p-2.5 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-text-primary">{d.commodity}</span>
                      <span className="text-[10px] text-text-secondary">{d.fillRate}% filled</span>
                    </div>
                    <div className="w-full h-2 bg-border/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${d.fillRate > 80 ? 'bg-success' : d.fillRate > 50 ? 'bg-warning' : 'bg-danger'}`}
                        style={{ width: `${d.fillRate}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-text-secondary mt-1">
                      <span>Demand: {d.totalDemand.toLocaleString()} {d.unit}</span>
                      <span>Buyers: {d.buyerCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {marketReports.map((report) => (
              <div key={report.id} className="rounded-lg border border-border bg-surface p-4 hover:bg-surface-hover transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                    report.category === 'price-analysis' ? 'bg-success/10 text-success' :
                    report.category === 'weather' ? 'bg-commodity-inputs/10 text-commodity-inputs' :
                    report.category === 'trade-flow' ? 'bg-commodity-export/10 text-commodity-export' :
                    report.category === 'policy' ? 'bg-warning/10 text-warning' :
                    'bg-border/50 text-text-secondary'
                  }`}>
                    {report.category.replace('-', ' ')}
                  </span>
                  <span className={`text-[10px] font-medium ${
                    report.impact === 'positive' ? 'text-success' :
                    report.impact === 'negative' ? 'text-danger' : 'text-text-secondary'
                  }`}>
                    {report.impact === 'positive' ? 'Bullish' : report.impact === 'negative' ? 'Bearish' : 'Neutral'}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-text-primary mb-1">{report.title}</h3>
                <p className="text-xs text-text-secondary mb-3 line-clamp-2">{report.summary}</p>

                <ul className="space-y-1 mb-3">
                {report.keyPoints.slice(0, 2).map((point, i) => (
                    <li key={i} className="text-[10px] text-text-secondary flex items-start gap-1">
                      <span className="text-primary mt-0.5">·</span>
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between text-[10px] text-text-secondary border-t border-border pt-2">
                  <span>{report.date} · {report.readTime} read</span>
                  <span className="text-primary font-medium">Read →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
