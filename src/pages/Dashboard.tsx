import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SurveillanceData } from '../types';
import { calculateAverageRate } from '../utils/calculations';

const modules = [
  { name: 'VAE', color: 'bg-blue-500' },
  { name: 'CLABSI', color: 'bg-green-500' },
  { name: 'CAUTI', color: 'bg-yellow-500' },
  { name: 'SSI', color: 'bg-purple-500' },
  { name: 'DE', color: 'bg-red-500' },
];

export default function Dashboard() {
  const [data, setData] = useLocalStorage<SurveillanceData[]>('surveillance-data', []);
  const [isLoading] = useLocalStorage('isLoading', true);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const getModuleData = (module: string) => {
    return data.filter(
      (item) =>
        item.module === module &&
        item.year === currentYear &&
        item.month === currentMonth
    );
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
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => {
                const moduleData = getModuleData(module.name);
                const averageRate = calculateAverageRate(moduleData);

                return (
                  <div
                    key={module.name}
                    className="overflow-hidden rounded-lg bg-white shadow"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 rounded-md p-3 ${module.color}`}>
                          <span className="h-6 w-6 text-white">{module.name[0]}</span>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="truncate text-sm font-medium text-gray-500">
                              {module.name}
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                {averageRate.toFixed(2)}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <Link
                          to="/data-entry"
                          className="font-medium text-primary-700 hover:text-primary-900"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
                <p className="mt-2 text-sm text-gray-700">
                  Common tasks and actions for your surveillance data.
                </p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                to="/data-entry"
                className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <span className="mt-2 block text-sm font-semibold text-gray-900">
                  Enter New Data
                </span>
              </Link>
              <Link
                to="/reports"
                className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <span className="mt-2 block text-sm font-semibold text-gray-900">
                  Generate Reports
                </span>
              </Link>
              <Link
                to="/settings"
                className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <span className="mt-2 block text-sm font-semibold text-gray-900">
                  Configure Settings
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 