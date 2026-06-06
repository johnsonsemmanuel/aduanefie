import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { CommodityWatchlist } from '@/components/trade/CommodityWatchlist'
import { MarketPriceWidget } from '@/components/trade/MarketPriceWidget'
import { TradeMetricsCard } from '@/components/trade/TradeMetricsCard'
import { QuickActionPanel } from '@/components/trade/QuickActionPanel'
import { TradeActivityFeed } from '@/components/trade/TradeActivityFeed'
import { MarketAlert } from '@/components/trade/MarketAlert'
import { CommodityCard } from '@/components/trade/CommodityCard'
import { TradeOpportunityCard } from '@/components/trade/TradeOpportunityCard'
import { watchlist, marketPrices, tradeMetrics, activities, marketAlerts, commodities, tradeOpportunities } from '@/data/mock'

export function Dashboard() {
  const activeAlerts = marketAlerts.filter(a => !a.read)

  return (
    <div className="space-y-4">
      <QuickActionPanel />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {tradeMetrics.map((metric) => (
          <TradeMetricsCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Prices</CardTitle>
            </CardHeader>
            <MarketPriceWidget prices={marketPrices} />
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {commodities.slice(0, 4).map((c) => (
              <CommodityCard key={c.id} commodity={c} compact />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {activeAlerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Alerts</CardTitle>
                <span className="text-xs text-danger font-medium">{activeAlerts.length} new</span>
              </CardHeader>
              <div className="space-y-2">
                {activeAlerts.map((alert) => (
                  <MarketAlert key={alert.id} alert={alert} />
                ))}
              </div>
            </Card>
          )}

          <CommodityWatchlist items={watchlist} />

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <TradeActivityFeed activities={activities} compact />
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {tradeOpportunities.slice(0, 4).map((opp) => (
          <TradeOpportunityCard key={opp.id} opportunity={opp} compact />
        ))}
      </div>
    </div>
  )
}
