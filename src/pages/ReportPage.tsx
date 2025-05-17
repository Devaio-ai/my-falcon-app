import { useNavigate } from 'react-router-dom'
import ReactECharts from 'echarts-for-react'
import { useReportStore } from '../store/reportStore'
import React, { useEffect, useRef } from 'react'
import html2pdf from 'html2pdf.js'
import html2canvas from 'html2canvas'
import jazanLogo from '/jazan-logo.png'

// Remove inline declaration
// declare module 'html2pdf.js';

const ReportPage = () => {
  const navigate = useNavigate()
  const {
    accessData,
    eventData,
    benchmarkData,
    calculateTotalAccess,
    calculateTotalEvents,
    calculateEventRate,
    getAccessTypeData,
    getEventData
  } = useReportStore()
  const reportRef = useRef<HTMLDivElement>(null)

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Get selected month and year from localStorage
  const selectedMonth = localStorage.getItem('falcon_report_month');
  const selectedYear = localStorage.getItem('falcon_report_year');

  const totalAccess = calculateTotalAccess()
  const totalEvents = calculateTotalEvents()
  const eventRate = calculateEventRate()

  const getBenchmarkComparison = () => {
    if (eventRate === 0) return 'No events to compare'
    if (eventRate <= benchmarkData.internalBenchmark) {
      return 'Below internal benchmark'
    }
    return 'Above internal benchmark'
  }

  // ECharts options for Access Type Summary
  const accessTypeData = getAccessTypeData()
  const accessTypeOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 40, right: 20, bottom: 40, top: 40, containLabel: true },
    xAxis: [{
      type: 'category',
      data: accessTypeData.map((item) => item.name),
      axisLabel: { fontWeight: 'bold', fontSize: 16, color: '#312E81' },
      name: 'Access Type',
      nameLocation: 'middle',
      nameGap: 30,
    }],
    yAxis: [{
      type: 'value',
      axisLabel: { fontWeight: 'bold', fontSize: 12, color: '#312E81' },
      name: 'Number of Patients',
      nameLocation: 'middle',
      nameGap: 40,
    }],
    series: [{
      name: 'Number of Patients',
      type: 'bar',
      barWidth: '50%',
      data: accessTypeData.map((item) => item.value),
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#6366F1' },
            { offset: 1, color: '#A5B4FC' },
          ],
        },
        borderRadius: [8, 8, 0, 0],
      },
      label: {
        show: true,
        position: 'top',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#312E81',
      },
    }],
    legend: {
      show: true,
      bottom: 0,
      textStyle: { fontSize: 14, color: '#312E81' },
    },
  }

  // ECharts options for Event Summary
  const eventTypeLabels = [
    'infection',
    'AS',
    'PBC'
  ];
  const eventDataArr = [
    eventData.infection || 0,
    eventData.antimicrobialStart || 0,
    eventData.positiveBloodCulture || 0
  ];
  const eventOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: 40, right: 20, bottom: 40, top: 40, containLabel: true },
    xAxis: [{
      type: 'category',
      data: eventTypeLabels,
      axisLabel: { fontWeight: 'bold', fontSize: 16, color: '#065F46', interval: 0 },
      name: 'Event Type',
      nameLocation: 'middle',
      nameGap: 30,
    }],
    yAxis: [{
      type: 'value',
      axisLabel: { fontWeight: 'bold', fontSize: 12, color: '#065F46' },
      name: 'Number of Events',
      nameLocation: 'middle',
      nameGap: 40,
    }],
    series: [{
      name: 'Number of Events',
      type: 'bar',
      barWidth: '50%',
      data: eventDataArr,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#10B981' },
            { offset: 1, color: '#6EE7B7' },
          ],
        },
        borderRadius: [8, 8, 0, 0],
      },
      label: {
        show: true,
        position: 'top',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#065F46',
      },
    }],
    legend: {
      show: true,
      bottom: 0,
      textStyle: { fontSize: 14, color: '#065F46' },
    },
  }

  useEffect(() => {
    if (!accessData || !eventData || !benchmarkData) {
      navigate('/data-entry')
    }
  }, [accessData, eventData, benchmarkData, navigate])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    const element = reportRef.current;
    if (!element) {
      console.error('Report element not found');
      return;
    }
    console.log('Generating PDF from element:', element);

    // Calculate the element's width and height in mm for a perfect fit
    const pxToMm = (px: number) => px * 0.264583;
    const rect = element.getBoundingClientRect();
    const contentWidthMm = pxToMm(rect.width);
    const contentHeightMm = pxToMm(rect.height);

    const opt = {
      margin: 0,
      filename: 'falcon-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: 0,
        width: rect.width,
        height: rect.height,
      },
      jsPDF: {
        unit: 'mm',
        format: [contentWidthMm, contentHeightMm],
        orientation: contentWidthMm > contentHeightMm ? 'landscape' : 'portrait',
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleDownloadImage = async () => {
    const element = reportRef.current;
    if (!element) {
      console.error('Report element not found');
      return;
    }
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = 'falcon-report.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    }
  };

  if (!accessData || !eventData || !benchmarkData) return null

  return (
    <div className="max-w-5xl mx-auto px-2 py-8 print:px-0 print:py-0 print:max-w-full print:bg-white print:shadow-none print:mt-0 print:mb-0">
      {/* Print-specific styles */}
      <style>{`
        @media print {
          header, footer, nav, .app-header, .app-footer, .print\:hidden, .print-hide, .no-print {
            display: none !important;
          }
          .falcon-print-header {
            display: block !important;
            text-align: center;
            margin-bottom: 8mm;
          }
          .falcon-print-header h1 {
            font-size: 2.2rem;
            font-weight: 800;
            color: #312E81;
            margin-bottom: 0.2em;
            letter-spacing: 0.1em;
          }
          .falcon-print-header .subtitle {
            font-size: 1.1rem;
            color: #374151;
            font-weight: 400;
            margin-bottom: 0.2em;
          }
          .falcon-print-header .datetime {
            font-size: 0.95rem;
            color: #6B7280;
            font-weight: 300;
          }
          header.print\:block, footer.print\:block {
            display: block !important;
          }
          .print\:block { display: block !important; }
          .print\:flex { display: flex !important; }
          .print\:w-full { width: 100% !important; }
          .print\:max-w-full { max-width: 100vw !important; }
          .print\:mx-0 { margin-left: 0 !important; margin-right: 0 !important; }
          .print\:my-0 { margin-top: 0 !important; margin-bottom: 0 !important; }
          .print\:p-0 { padding: 0 !important; }
          .print\:text-xs { font-size: 12px !important; }
          body, #root {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          .falcon-print-root {
            box-sizing: border-box;
            width: 210mm;
            min-height: 270mm;
            max-height: 287mm;
            margin: 0 auto !important;
            padding: 16mm 10mm 10mm 10mm !important;
            background: white !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            overflow: hidden !important;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
          }
          .falcon-print-root > div {
            width: 100% !important;
            max-width: 100% !important;
          }
          .chart-section, .chart-section > div, .main-section, .summary-section, .benchmarks-section, .recommendations-section, .signature-section {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-before: avoid !important;
            page-break-after: avoid !important;
          }
          .chart-section {
            min-height: 220px !important;
            height: auto !important;
          }
        }
      `}</style>
      {/* Print-only FALCON header */}
      <div ref={reportRef} className="falcon-print-root">
        {/* Report Header: Centered at the top of the page */}
        <div className="w-full flex flex-col items-center justify-center mb-2 mt-2">
          <img src={jazanLogo} alt="Jazan Health Cluster Logo" className="w-28 h-auto object-contain mb-2" style={{ zIndex: 10 }} />
          <div className="falcon-print-header text-center w-full">
            <h1 className="text-4xl font-extrabold text-primary-dark tracking-widest mb-1" style={{ fontFamily: 'Figtree, Inter, Arial, sans-serif', letterSpacing: '0.12em' }}>SAMTAH GENERAL HOSPITAL</h1>
            <div className="subtitle text-lg text-gray-700 font-light mb-1">Dialysis Surveillance Report Generator</div>
            <div className="datetime text-base text-gray-500 mb-1">{currentDate} {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
            {selectedMonth && selectedYear && (
              <div className="text-lg font-semibold text-primary mt-1 mb-1">Report for: {selectedMonth} {selectedYear}</div>
            )}
          </div>
        </div>
        {/* Main Report Content */}
        <div className="bg-white/95 rounded-2xl shadow-soft p-6 print:p-2 print:rounded-2xl print:shadow-none print:border print-main print:mb-0">
          {/* Summary & Benchmarks */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4 print:flex-col print:gap-2 print:mb-2">
            <div className="flex-1 bg-gradient-to-br from-white via-blue-50 to-blush-light rounded-2xl shadow-soft p-4 print:p-2 print:rounded-2xl print:shadow-none">
              <h2 className="text-lg font-bold text-primary mb-2 print:text-base">Summary</h2>
              <div className="flex flex-row gap-2 justify-between print:gap-1">
                <div className="flex-1 text-center">
                  <div className="text-xs text-gray-500">Total Access</div>
                  <div className="font-bold text-xl text-primary print:text-base">{totalAccess}</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-xs text-gray-500">Total Events</div>
                  <div className="font-bold text-xl text-accent print:text-base">{totalEvents}</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-xs text-gray-500">Event Rate</div>
                  <div className="font-bold text-xl text-blush print:text-base">{eventRate.toFixed(2)}%</div>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-white via-blush-light to-pink-light rounded-2xl shadow-soft p-4 print:p-2 print:rounded-2xl print:shadow-none">
              <h2 className="text-lg font-bold text-blush mb-2 print:text-base">Benchmarks</h2>
              <div className="flex flex-row gap-2 justify-between print:gap-1">
                <div className="flex-1 text-center">
                  <div className="text-xs text-gray-500">Internal</div>
                  <div className="font-bold text-lg text-primary print:text-base">{benchmarkData.internalBenchmark}%</div>
                </div>
                {benchmarkData.externalBenchmark > 0 && (
                  <div className="flex-1 text-center">
                    <div className="text-xs text-gray-500">External</div>
                    <div className="font-bold text-lg text-accent print:text-base">{benchmarkData.externalBenchmark}%</div>
                  </div>
                )}
                <div className="flex-1 text-center">
                  <div className="text-xs text-gray-500">Status</div>
                  <div className={`font-bold text-lg print:text-base ${eventRate > benchmarkData.internalBenchmark ? 'text-red-600' : 'text-green-600'}`}>{getBenchmarkComparison()}</div>
                </div>
              </div>
            </div>
          </div>
          {/* Charts Row */}
          <div className="flex flex-row gap-4 mb-4 print:flex-col print:gap-2 print:mb-2 chart-section">
            <div className="flex-1 bg-gradient-to-br from-white via-blue-50 to-blush-light rounded-2xl shadow-soft p-4 flex flex-col print:rounded-2xl print:shadow-none print:p-2">
              <h2 className="text-base font-semibold text-primary mb-1 print:text-sm">Access Type</h2>
              <div className="flex-1 min-h-[220px] print:min-h-[220px] print:h-[220px]">
                <ReactECharts option={accessTypeOption} style={{ height: '200px', width: '100%' }} opts={{ renderer: 'svg' }} />
              </div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-white via-accent-light to-primary-light rounded-2xl shadow-soft p-4 flex flex-col print:rounded-2xl print:shadow-none print:p-2">
              <h2 className="text-base font-semibold text-accent mb-1 print:text-sm">Event Summary</h2>
              <div className="flex-1 min-h-[220px] print:min-h-[220px] print:h-[220px]">
                <ReactECharts option={eventOption} style={{ height: '200px', width: '100%' }} opts={{ renderer: 'svg' }} />
              </div>
            </div>
          </div>
          {/* Recommendations & Signature on same row */}
          <div className="flex flex-row gap-4 mt-2 print:flex-col print:gap-2 print:mt-1">
            <div className="flex-[2] bg-gradient-to-br from-white via-blush-light to-pink-light rounded-2xl shadow-soft p-4 print:rounded-2xl print:shadow-none print:p-2">
              <h2 className="text-base font-semibold text-blush mb-1 print:text-sm">Recommendations & Action Plan</h2>
              <ul className="list-disc pl-5 mt-1 text-sm print:text-xs">
                {eventRate > benchmarkData.internalBenchmark && (
                  <>
                    <li>Implement additional infection control measures for CVC access</li>
                    <li>Review and update antimicrobial stewardship protocols</li>
                    <li>Conduct staff training on proper access care procedures</li>
                  </>
                )}
                {eventRate <= benchmarkData.internalBenchmark && (
                  <li>Continue current infection control practices and monitoring</li>
                )}
              </ul>
            </div>
            <div className="flex-1 bg-gradient-to-br from-white via-blue-50 to-blush-light rounded-2xl shadow-soft p-4 flex flex-col justify-end print:rounded-2xl print:shadow-none print:p-2">
              <label className="block text-xs font-medium text-gray-700 mb-1 print:text-xs">Signature</label>
              <input
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-xl shadow-sm focus:border-primary focus:ring-primary print:rounded-2xl print:shadow-soft print:border print:border-gray-200 print:text-xs bg-gray-50 px-4 py-2 text-lg transition"
                placeholder="Enter your name"
                style={{ minHeight: 32 }}
              />
            </div>
          </div>
        </div>
        {/* Figma-style footer (screen, print, PDF, image) */}
        <div className="w-full flex justify-center mt-8">
          <div className="text-center py-2 print:py-1 w-full" style={{ position: 'relative', bottom: 0 }}>
            <span className="text-gray-500 text-base tracking-widest font-sans" style={{ fontFamily: 'Figtree, Inter, Arial, sans-serif', letterSpacing: '0.15em', fontWeight: 600 }}>
              Generated by <span className="text-primary font-extrabold" style={{ fontFamily: 'Figtree, Inter, Arial, sans-serif', fontWeight: 900, fontSize: '1.15em', letterSpacing: '0.18em' }}>Falcon</span> <span className="mx-1">©</span> Designed by <span className="text-accent font-extrabold" style={{ fontFamily: 'Figtree, Inter, Arial, sans-serif', fontWeight: 900, fontSize: '1.15em', letterSpacing: '0.18em' }}>Ali Ashery</span>
            </span>
          </div>
        </div>
      </div>
      {/* Action Buttons (hide on print) */}
      <div className="mt-8 flex justify-end space-x-4 print:hidden">
        <button
          onClick={handlePrint}
          className="px-6 py-3 rounded-full bg-white/80 text-primary font-semibold shadow-soft border border-primary transition hover:bg-primary hover:text-white hover:scale-105 hover:shadow-lg"
        >
          Print Report
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-soft transition hover:scale-105 hover:shadow-lg"
        >
          Download PDF
        </button>
        <button
          onClick={handleDownloadImage}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-accent to-primary text-white font-semibold shadow-soft transition hover:scale-105 hover:shadow-lg"
        >
          Download as Image
        </button>
      </div>
    </div>
  )
}

export default ReportPage 