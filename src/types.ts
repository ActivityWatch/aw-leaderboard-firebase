export interface Event {
  timestamp: number // Unix timestamp
  duration: number
  data: any
}

// Screentime is stored in day-level objects that have
// their `events` appended when new data is added.
export interface ScreenTimeData {
  userId: string
  public: boolean
  date: string
  events: Event[]
}

// Same as above, but with events aggregated
export interface ScreenTimeSummary {
  userId: string
  total: number
  date: string
  categoryTotals: { [key: string]: number }
}

export interface ChartDataset {
  label: string
  data: number[]
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}
