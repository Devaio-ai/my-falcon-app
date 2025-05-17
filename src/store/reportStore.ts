import { create } from 'zustand'

interface AccessData {
  cvc: number
  avf: number
  avg: number
}

interface EventData {
  puss: number
  redness: number
  infection: number
  antimicrobialStart: number
  positiveBloodCulture: number
  noEvents: boolean
}

interface BenchmarkData {
  internalBenchmark: number
  externalBenchmark: number
}

interface ReportStore {
  accessData: AccessData
  eventData: EventData
  benchmarkData: BenchmarkData
  setAccessData: (data: AccessData) => void
  setEventData: (data: EventData) => void
  setBenchmarkData: (data: BenchmarkData) => void
  calculateTotalAccess: () => number
  calculateTotalEvents: () => number
  calculateEventRate: () => number
  getAccessTypeData: () => Array<{ name: string; value: number }>
  getEventData: () => Array<{ name: string; value: number }>
}

export const useReportStore = create<ReportStore>((set, get) => ({
  accessData: {
    cvc: 0,
    avf: 0,
    avg: 0
  },
  eventData: {
    puss: 0,
    redness: 0,
    infection: 0,
    antimicrobialStart: 0,
    positiveBloodCulture: 0,
    noEvents: false
  },
  benchmarkData: {
    internalBenchmark: 0,
    externalBenchmark: 0
  },
  setAccessData: (data) => set({ accessData: data }),
  setEventData: (data) => set({ eventData: data }),
  setBenchmarkData: (data) => set({ benchmarkData: data }),
  calculateTotalAccess: () => {
    const { cvc, avf, avg } = get().accessData
    return cvc + avf + avg
  },
  calculateTotalEvents: () => {
    const { puss, redness, infection, antimicrobialStart, positiveBloodCulture, noEvents } = get().eventData
    if (noEvents) return 0
    return puss + redness + infection + antimicrobialStart + positiveBloodCulture
  },
  calculateEventRate: () => {
    const totalAccess = get().calculateTotalAccess()
    const totalEvents = get().calculateTotalEvents()
    if (totalAccess === 0) return 0
    // DE Rate = (Number of Events / Total Access) * 100
    return (totalEvents / totalAccess) * 100
  },
  getAccessTypeData: () => {
    const { cvc, avf, avg } = get().accessData
    return [
      { name: 'CVC', value: cvc },
      { name: 'AVF', value: avf },
      { name: 'AVG', value: avg }
    ]
  },
  getEventData: () => {
    const { puss, redness, infection, antimicrobialStart, positiveBloodCulture } = get().eventData
    return [
      { name: 'Puss', value: puss },
      { name: 'Redness', value: redness },
      { name: 'Infection', value: infection },
      { name: 'AS', value: antimicrobialStart },
      { name: 'PBC', value: positiveBloodCulture }
    ]
  }
})) 