interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'away' | 'pending'
  className?: string
}

const dotColors: Record<string, string> = {
  online: 'bg-success',
  offline: 'bg-danger',
  away: 'bg-warning',
  pending: 'bg-border',
}

export function StatusIndicator({ status, className = '' }: StatusIndicatorProps) {
  return (
    <span className={`relative inline-flex w-2 h-2 ${className}`}>
      <span className={`absolute inset-0 rounded-full ${dotColors[status]}`} />
      {status === 'online' && (
        <span className={`absolute inset-0 rounded-full ${dotColors[status]} animate-ping opacity-75`} />
      )}
    </span>
  )
}

export function NetworkBanner({ isOnline }: { isOnline: boolean }) {
  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-warning text-white text-xs text-center py-1.5 px-4 font-medium">
      You are offline. Some features may be limited.
    </div>
  )
}
