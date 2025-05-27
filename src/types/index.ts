export type SurveillanceModule = 'VAE' | 'CLABSI' | 'CAUTI' | 'SSI' | 'DE';
export type Population = 'Adults' | 'NICU';

export interface SurveillanceData {
  id: string;
  module: SurveillanceModule;
  population?: Population;
  month: number;
  year: number;
  numerator: number;
  denominator: number;
  rate: number;
  benchmark?: number;
}

export interface MonthlyData {
  [key: string]: SurveillanceData[];
}

export interface ReportData {
  year: number;
  module: SurveillanceModule;
  population?: Population;
  data: SurveillanceData[];
  averageRate: number;
  benchmarkRate: number;
}

export interface Benchmark {
  module: SurveillanceModule;
  population?: Population;
  rate: number;
  source: string;
  year: number;
} 