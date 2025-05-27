import { SurveillanceData, SurveillanceModule } from '../types';

export const calculateRate = (
  numerator: number,
  denominator: number,
  module: SurveillanceModule
): number => {
  if (denominator === 0) return 0;
  
  // VAE, CLABSI, CAUTI: rates per 1000 device days
  if (['VAE', 'CLABSI', 'CAUTI'].includes(module)) {
    return (numerator / denominator) * 1000;
  }
  
  // SSI and DE: rates per 100 procedures/events
  return (numerator / denominator) * 100;
};

export const calculateAverageRate = (data: SurveillanceData[]): number => {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, curr) => acc + curr.rate, 0);
  return sum / data.length;
};

export const formatRate = (rate: number): string => {
  return rate.toFixed(2);
};

export const getMonthName = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1];
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
}; 