import { useState } from 'react'
import { SearchInput } from './Input'
import { Button } from './Button'

export type FilterOption = {
  key: string
  label: string
  options: { value: string; label: string }[]
}

interface FilterBarProps {
  filters: FilterOption[]
  onSearch?: (query: string) => void
  onFilterChange?: (key: string, value: string) => void
  onClear?: () => void
  searchPlaceholder?: string
  className?: string
}

export function FilterBar({
  filters, onSearch, onFilterChange, onClear,
  searchPlaceholder = 'Search...', className = ''
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchQuery(val)
    onSearch?.(val)
  }

  const handleFilter = (key: string, value: string) => {
    const updated = { ...activeFilters }
    if (value === '' || value === 'all') {
      delete updated[key]
    } else {
      updated[key] = value
    }
    setActiveFilters(updated)
    onFilterChange?.(key, value)
  }

  const hasActiveFilters = Object.keys(activeFilters).length > 0 || searchQuery

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <div className="flex-1 min-w-[200px] max-w-[320px]">
        <SearchInput
          value={searchQuery}
          onChange={handleSearch}
          placeholder={searchPlaceholder}
          onClear={() => { setSearchQuery(''); onSearch?.('') }}
        />
      </div>
      {filters.map((filter) => (
        <select
          key={filter.key}
          onChange={(e) => handleFilter(filter.key, e.target.value)}
          className="h-9 rounded-lg border border-border bg-surface text-xs text-text-primary px-2.5 focus:border-primary focus:outline-none"
        >
          <option value="">{filter.label}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ))}
      {hasActiveFilters && onClear && (
        <Button variant="ghost" size="sm" onClick={() => {
          setSearchQuery('')
          setActiveFilters({})
          onClear()
        }}>
          Clear
        </Button>
      )}
    </div>
  )
}
