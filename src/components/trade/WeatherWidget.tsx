import { Cloud, CloudSun, CloudRain, CloudLightning, Sun, AlertTriangle, Thermometer, Droplets } from 'lucide-react'
import type { WeatherZone } from '@/types'

interface WeatherWidgetProps {
  zones: WeatherZone[]
}

const conditionIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: CloudLightning,
  dry: CloudSun,
}

const conditionColors = {
  sunny: 'text-warning',
  cloudy: 'text-text-secondary',
  rainy: 'text-commodity-inputs',
  stormy: 'text-danger',
  dry: 'text-warning',
}

const conditionBg = {
  sunny: 'bg-warning/10',
  cloudy: 'bg-border/50',
  rainy: 'bg-commodity-inputs/10',
  stormy: 'bg-danger/10',
  dry: 'bg-warning/5',
}

export function WeatherWidget({ zones }: WeatherWidgetProps) {
  return (
    <div className="space-y-2">
      {zones.map((zone) => {
        const Icon = conditionIcons[zone.condition]
        const color = conditionColors[zone.condition]
        const bg = conditionBg[zone.condition]

        return (
          <div key={zone.id} className="rounded-lg border border-border bg-surface p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-semibold text-text-primary">{zone.region}</h3>
                  {zone.alert && (
                    <AlertTriangle className={`w-3 h-3 ${zone.alert.severity === 'critical' ? 'text-danger' : 'text-warning'}`} />
                  )}
                </div>
                <p className="text-[10px] text-text-secondary truncate">{zone.country}</p>
              </div>
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-text-secondary" />
                <span className="text-sm font-bold text-text-primary">{zone.temperature}°</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-text-secondary" />
                <span className="text-xs text-text-secondary">{zone.humidity}%</span>
              </div>
              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                zone.impact === 'positive' ? 'bg-success/10 text-success' :
                zone.impact === 'negative' ? 'bg-danger/10 text-danger' :
                'bg-border/50 text-text-secondary'
              }`}>
                {zone.impact === 'positive' ? 'Favorable' : zone.impact === 'negative' ? 'Concerning' : 'Neutral'}
              </span>
            </div>

            {zone.alert && (
              <div className={`text-[10px] p-2 rounded mb-2 ${
                zone.alert.severity === 'critical' ? 'bg-danger/5 text-danger border border-danger/20' :
                'bg-warning/5 text-warning border border-warning/20'
              }`}>
                <strong>{zone.alert.type}:</strong> {zone.alert.message}
              </div>
            )}

            <div className="flex gap-1.5">
              {zone.forecast.map((day) => {
                const DayIcon = conditionIcons[day.condition as keyof typeof conditionIcons] || Cloud
                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-0.5 py-1 rounded bg-bg">
                    <span className="text-[9px] text-text-secondary font-medium">{day.day}</span>
                    <DayIcon className={`w-3 h-3 ${conditionColors[day.condition as keyof typeof conditionIcons] || 'text-text-secondary'}`} />
                    <span className="text-[10px] font-medium text-text-primary">{day.temp}°</span>
                    <span className="text-[8px] text-text-secondary">{day.rainfall}mm</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
