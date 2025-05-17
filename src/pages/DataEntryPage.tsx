import { useNavigate } from 'react-router-dom'
import { useReportStore } from '../store/reportStore'
import { useState } from 'react'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

const DataEntryPage = () => {
  const navigate = useNavigate()
  const { accessData, eventData, benchmarkData, setAccessData, setEventData, setBenchmarkData } = useReportStore()
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const numValue = type === 'number' ? Number(value) : value

    if (name in accessData) {
      setAccessData({ ...accessData, [name]: numValue })
    } else if (name in eventData) {
      setEventData({ ...eventData, [name]: type === 'checkbox' ? checked : numValue })
    } else if (name in benchmarkData) {
      setBenchmarkData({ ...benchmarkData, [name]: numValue })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('falcon_report_month', selectedMonth);
    localStorage.setItem('falcon_report_year', selectedYear.toString());
    navigate('/report')
  }

  const totalAccess = accessData.cvc + accessData.avf + accessData.avg

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-4xl font-extrabold text-primary-dark mb-8 tracking-tight drop-shadow-sm text-center">
        Enter Dialysis Event Data
      </h1>
      <div className="flex justify-center gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
          <select
            className="block w-36 rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 px-4 py-2 text-lg transition"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <select
            className="block w-28 rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 px-4 py-2 text-lg transition"
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Access Type Section */}
        <div className="bg-gradient-to-br from-white via-blue-50 to-blush-light rounded-2xl shadow-soft p-8">
          <h2 className="text-2xl font-bold text-primary mb-4">Access Type (Denominator Data)</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
              <input
                type="number"
                name="cvc"
                value={accessData.cvc}
                onChange={handleInputChange}
                min="0"
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 px-4 py-2 text-lg transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">AVF</label>
              <input
                type="number"
                name="avf"
                value={accessData.avf}
                onChange={handleInputChange}
                min="0"
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 px-4 py-2 text-lg transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">AVG</label>
              <input
                type="number"
                name="avg"
                value={accessData.avg}
                onChange={handleInputChange}
                min="0"
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary bg-gray-50 px-4 py-2 text-lg transition"
              />
            </div>
          </div>
          <div className="mt-6 text-right">
            <span className="text-lg font-semibold text-primary">Total Access: {totalAccess}</span>
          </div>
        </div>

        {/* Event Data Section */}
        <div className="bg-gradient-to-br from-white via-accent-light to-primary-light rounded-2xl shadow-soft p-8">
          <h2 className="text-2xl font-bold text-accent mb-4">Event Data (Numerator Data)</h2>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              name="noEvents"
              checked={eventData.noEvents}
              onChange={handleInputChange}
              className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded-full transition"
            />
            <label className="ml-3 block text-base text-gray-900 font-medium">No Events this Month</label>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Infection</label>
              <input
                type="number"
                name="infection"
                value={eventData.infection}
                onChange={handleInputChange}
                disabled={eventData.noEvents}
                min="0"
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-accent focus:ring-accent bg-gray-50 px-4 py-2 text-lg transition disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Antimicrobial Start (AS)</label>
              <input
                type="number"
                name="antimicrobialStart"
                value={eventData.antimicrobialStart}
                onChange={handleInputChange}
                disabled={eventData.noEvents}
                min="0"
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-accent focus:ring-accent bg-gray-50 px-4 py-2 text-lg transition disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Positive Blood Culture (PBC)</label>
              <input
                type="number"
                name="positiveBloodCulture"
                value={eventData.positiveBloodCulture}
                onChange={handleInputChange}
                disabled={eventData.noEvents}
                min="0"
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-accent focus:ring-accent bg-gray-50 px-4 py-2 text-lg transition disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        {/* Benchmarking Section */}
        <div className="bg-gradient-to-br from-white via-blush-light to-pink-light rounded-2xl shadow-soft p-8">
          <h2 className="text-2xl font-bold text-blush mb-4">Benchmarking</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Internal Benchmark</label>
              <input
                type="number"
                name="internalBenchmark"
                value={benchmarkData.internalBenchmark}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blush focus:ring-blush bg-gray-50 px-4 py-2 text-lg transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">External Benchmark (Optional)</label>
              <input
                type="number"
                name="externalBenchmark"
                value={benchmarkData.externalBenchmark}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blush focus:ring-blush bg-gray-50 px-4 py-2 text-lg transition"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-full bg-white/80 text-primary font-semibold shadow-soft border border-primary transition hover:bg-primary hover:text-white hover:scale-105 hover:shadow-lg"
          >
            Home
          </button>
          <button
            type="submit"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-soft transition hover:scale-105 hover:shadow-lg"
          >
            Generate Report
          </button>
        </div>
      </form>
    </div>
  )
}

export default DataEntryPage 