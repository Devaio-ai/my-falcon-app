import { useState } from 'react';
import Layout from '../components/Layout';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SurveillanceData, SurveillanceModule, Population } from '../types';
import { calculateRate, generateId, getMonthName } from '../utils/calculations';

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

export default function DataEntry() {
  const [data, setData] = useLocalStorage<SurveillanceData[]>('surveillance-data', []);
  const [isLoading] = useLocalStorage('isLoading', true);

  const [formData, setFormData] = useState<Partial<SurveillanceData>>({
    module: 'VAE',
    population: 'Adults',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    numerator: 0,
    denominator: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.module || !formData.month || !formData.year) return;

    const newData: SurveillanceData = {
      id: generateId(),
      module: formData.module,
      population: formData.population,
      month: formData.month,
      year: formData.year,
      numerator: formData.numerator || 0,
      denominator: formData.denominator || 0,
      rate: calculateRate(
        formData.numerator || 0,
        formData.denominator || 0,
        formData.module
      ),
    };

    setData((prev) => [...prev, newData]);
    setFormData({
      module: 'VAE',
      population: 'Adults',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      numerator: 0,
      denominator: 0,
    });
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };

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
          <h1 className="text-2xl font-semibold text-gray-900">Data Entry</h1>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
              <div className="space-y-8 divide-y divide-gray-200">
                <div>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="module" className="block text-sm font-medium text-gray-700">
                        Surveillance Module
                      </label>
                      <select
                        id="module"
                        name="module"
                        value={formData.module}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            module: e.target.value as SurveillanceModule,
                          }))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        {modules.map((module) => (
                          <option key={module.value} value={module.value}>
                            {module.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {modules.find((m) => m.value === formData.module)?.hasPopulation && (
                      <div className="sm:col-span-3">
                        <label htmlFor="population" className="block text-sm font-medium text-gray-700">
                          Population
                        </label>
                        <select
                          id="population"
                          name="population"
                          value={formData.population}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              population: e.target.value as Population,
                            }))
                          }
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

                    <div className="sm:col-span-3">
                      <label htmlFor="month" className="block text-sm font-medium text-gray-700">
                        Month
                      </label>
                      <select
                        id="month"
                        name="month"
                        value={formData.month}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            month: parseInt(e.target.value),
                          }))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <option key={month} value={month}>
                            {getMonthName(month)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                        Year
                      </label>
                      <input
                        type="number"
                        name="year"
                        id="year"
                        value={formData.year}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            year: parseInt(e.target.value),
                          }))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="numerator" className="block text-sm font-medium text-gray-700">
                        Numerator
                      </label>
                      <input
                        type="number"
                        name="numerator"
                        id="numerator"
                        value={formData.numerator}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            numerator: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="denominator" className="block text-sm font-medium text-gray-700">
                        Denominator
                      </label>
                      <input
                        type="number"
                        name="denominator"
                        id="denominator"
                        value={formData.denominator}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            denominator: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="mt-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h2 className="text-xl font-semibold text-gray-900">Recent Entries</h2>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all surveillance data entries.
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Module
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Population
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Month
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Year
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Rate
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {data.map((entry) => (
                          <tr key={entry.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {entry.module}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {entry.population || '-'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {getMonthName(entry.month)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {entry.year}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {entry.rate.toFixed(2)}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                onClick={() => handleDelete(entry.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
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
        </div>
      </div>
    </Layout>
  );
} 