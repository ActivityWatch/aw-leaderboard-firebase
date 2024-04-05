export interface Event {
  timestamp: string
  duration: number
  data: []
}
export interface RawEvent {
  id: number
  timestamp: string
  duration: number
  data: []
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
  backgroundColor: string
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}
