import { useState } from 'react';
import Layout from '../components/Layout';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Benchmark, SurveillanceModule, Population } from '../types';

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

export default function Settings() {
  const [benchmarks, setBenchmarks] = useLocalStorage<Benchmark[]>('benchmarks', []);
  const [isLoading] = useLocalStorage('isLoading', true);

  const [formData, setFormData] = useState<Partial<Benchmark>>({
    module: 'VAE',
    population: 'Adults',
    rate: 0,
    source: 'CDC/NHSN',
    year: new Date().getFullYear(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.module || !formData.rate || !formData.source || !formData.year) return;

    const newBenchmark: Benchmark = {
      module: formData.module,
      population: formData.population,
      rate: formData.rate,
      source: formData.source,
      year: formData.year,
    };

    setBenchmarks((prev) => [...prev, newBenchmark]);
    setFormData({
      module: 'VAE',
      population: 'Adults',
      rate: 0,
      source: 'CDC/NHSN',
      year: new Date().getFullYear(),
    });
  };

  const handleDelete = (index: number) => {
    setBenchmarks((prev) => prev.filter((_, i) => i !== index));
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
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
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
                      <label htmlFor="rate" className="block text-sm font-medium text-gray-700">
                        Benchmark Rate
                      </label>
                      <input
                        type="number"
                        name="rate"
                        id="rate"
                        value={formData.rate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            rate: parseFloat(e.target.value) || 0,
                          }))
                        }
                        step="0.01"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label htmlFor="source" className="block text-sm font-medium text-gray-700">
                        Source
                      </label>
                      <input
                        type="text"
                        name="source"
                        id="source"
                        value={formData.source}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            source: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
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
                <h2 className="text-xl font-semibold text-gray-900">Benchmarks</h2>
                <p className="mt-2 text-sm text-gray-700">
                  A list of all configured benchmark rates.
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
                            Rate
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Source
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Year
                          </th>
                          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {benchmarks.map((benchmark, index) => (
                          <tr key={index}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {benchmark.module}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {benchmark.population || '-'}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {benchmark.rate.toFixed(2)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {benchmark.source}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {benchmark.year}
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                onClick={() => handleDelete(index)}
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