import { useState } from 'react';
import Layout from '../components/Layout';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SurveillanceData, SurveillanceModule, Population } from '../types';
import { calculateAverageRate, getMonthName } from '../utils/calculations';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const modules: { value: SurveillanceModule; label: string; hasPopulation: boolean }[] = [
  { value: 'VAE', label: 'Ventilator-Associated Event', hasPopulation: true },
  { value: 'CLABSI', label: 'Central Line-Associated Bloodstream Infection', hasPopulation: true },
  { value: 'CAUTI', label: 'Catheter-Associated Urinary Tract Infection', hasPopulation: true },
  { value: 'SSI', label: 'Surgical Site Infection', hasPopulation: false },
  { value: 'DE', label: 'Dialysis Events', hasPopulation: false },
];

const populations: { value: Population; label: string }[] = [
  { value: 'Adults', label: 'Adults' },
  { value: 'NICU', label: 'NICU' },
];

export default function Reports() {
  const [data] = useLocalStorage<SurveillanceData[]>('surveillance-data', []);
  const [isLoading] = useLocalStorage('isLoading', true);

  const [selectedModule, setSelectedModule] = useState<SurveillanceModule>('VAE');
  const [selectedPopulation, setSelectedPopulation] = useState<Population>('Adults');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const filteredData = data.filter(
    (item) =>
      item.module === selectedModule &&
      item.year === selectedYear &&
      (!modules.find((m) => m.value === selectedModule)?.hasPopulation ||
        item.population === selectedPopulation)
  );

  const chartData = Array.from({ length: 12 }, (_, i) => {
    const monthData = filteredData.find((item) => item.month === i + 1);
    return {
      month: getMonthName(i + 1),
      rate: monthData?.rate || 0,
    };
  });

  const averageRate = calculateAverageRate(filteredData);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="mt-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label htmlFor="module" className="block text-sm font-medium text-gray-700">
                  Surveillance Module
                </label>
                <select
                  id="module"
                  name="module"
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value as SurveillanceModule)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  {modules.map((module) => (
                    <option key={module.value} value={module.value}>
                      {module.label}
                    </option>
                  ))}
                </select>
              </div>

              {modules.find((m) => m.value === selectedModule)?.hasPopulation && (
                <div>
                  <label htmlFor="population" className="block text-sm font-medium text-gray-700">
                    Population
                  </label>
                  <select
                    id="population"
                    name="population"
                    value={selectedPopulation}
                    onChange={(e) => setSelectedPopulation(e.target.value as Population)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    {populations.map((population) => (
                      <option key={population.value} value={population.value}>
                        {population.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  id="year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-8">
              <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Monthly Rates for {selectedYear}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Average Rate: {averageRate.toFixed(2)}
                    </p>
                  </div>
                  <div className="mt-6" style={{ height: '400px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="rate"
                          stroke="#0ea5e9"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Month
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {chartData.map((item) => (
                      <tr key={item.month}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {item.month}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.rate.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 