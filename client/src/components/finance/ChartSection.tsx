import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Transaction } from '@shared/schema';
import Chart from 'chart.js/auto';

interface ChartSectionProps {
  transactions?: Transaction[];
  isLoading: boolean;
  isError: boolean;
}

interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const ChartSection = ({ transactions, isLoading, isError }: ChartSectionProps) => {
  const [chartView, setChartView] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const incomeExpenseChartRef = useRef<HTMLCanvasElement>(null);
  const expenseBreakdownChartRef = useRef<HTMLCanvasElement>(null);
  const incomeExpenseChartInstance = useRef<Chart | null>(null);
  const expenseBreakdownChartInstance = useRef<Chart | null>(null);
  
  // Fetch financial summary data for balance
  const { data: financeSummary } = useQuery<FinanceSummary>({
    queryKey: ['/api/finance/summary'],
  });

  useEffect(() => {
    if (isLoading || isError || !transactions) return;

    // Cleanup previous charts
    if (incomeExpenseChartInstance.current) {
      incomeExpenseChartInstance.current.destroy();
    }
    if (expenseBreakdownChartInstance.current) {
      expenseBreakdownChartInstance.current.destroy();
    }

    // Prepare data for Income vs Expense Chart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const incomeData = [500000, 750000, 650000, 800000, 950000, 1100000];
    const expenseData = [300000, 450000, 400000, 350000, 500000, 550000];
    
    // Calculate balance data (income - expense)
    const balanceData = incomeData.map((income, index) => income - expenseData[index]);

    // Create Income vs Expense Chart
    if (incomeExpenseChartRef.current) {
      const ctx = incomeExpenseChartRef.current.getContext('2d');
      if (ctx) {
        incomeExpenseChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: months,
            datasets: [
              {
                label: 'Income',
                data: incomeData,
                backgroundColor: '#a855f7', // Purple
                borderColor: '#9333ea',
                borderWidth: 1
              },
              {
                label: 'Expense',
                data: expenseData,
                backgroundColor: '#ef4444', // Red
                borderColor: '#dc2626',
                borderWidth: 1
              },
              {
                label: 'Balance',
                data: balanceData,
                type: 'line',
                backgroundColor: 'rgba(34, 197, 94, 0.2)', // Green with transparency
                borderColor: '#22c55e', // Green
                borderWidth: 2,
                fill: true,
                tension: 0.2,
                pointBackgroundColor: '#22c55e',
                pointBorderColor: '#fff',
                pointRadius: 4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return 'Rp ' + Number(value).toLocaleString();
                  }
                }
              }
            },
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return context.dataset.label + ': Rp ' + Number(context.raw).toLocaleString();
                  }
                }
              }
            }
          }
        });
      }
    }

    // Prepare data for Expense Breakdown Chart
    const categories = ['Supplies', 'Events', 'Printing', 'Travel', 'Other'];
    const expenseBreakdownData = [35, 25, 20, 15, 5];
    const expenseColors = [
      '#a855f7', // Purple
      '#ec4899', // Pink
      '#f59e0b', // Amber
      '#10b981', // Emerald
      '#6b7280'  // Gray
    ];

    // Create Expense Breakdown Chart
    if (expenseBreakdownChartRef.current) {
      const ctx = expenseBreakdownChartRef.current.getContext('2d');
      if (ctx) {
        expenseBreakdownChartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: categories,
            datasets: [{
              data: expenseBreakdownData,
              backgroundColor: expenseColors,
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
              }
            }
          }
        });
      }
    }

    return () => {
      // Cleanup on unmount
      if (incomeExpenseChartInstance.current) {
        incomeExpenseChartInstance.current.destroy();
      }
      if (expenseBreakdownChartInstance.current) {
        expenseBreakdownChartInstance.current.destroy();
      }
    };
  }, [transactions, isLoading, isError, chartView, financeSummary]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-6" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 p-4 rounded-md text-red-800 mb-8">
        Failed to load financial charts. Please try again later.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Income vs Expense</h3>
          <div className="flex space-x-2">
            <button 
              className={`px-3 py-1 text-sm rounded-md ${
                chartView === 'monthly' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-white text-gray-600'
              }`}
              onClick={() => setChartView('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md ${
                chartView === 'quarterly' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-white text-gray-600'
              }`}
              onClick={() => setChartView('quarterly')}
            >
              Quarterly
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-md ${
                chartView === 'yearly' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-white text-gray-600'
              }`}
              onClick={() => setChartView('yearly')}
            >
              Yearly
            </button>
          </div>
        </div>
        <div className="h-64">
          <canvas ref={incomeExpenseChartRef}></canvas>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Expense Breakdown</h3>
          <button className="text-sm text-purple-600">
            <i className="fas fa-ellipsis-v"></i>
          </button>
        </div>
        <div className="h-64">
          <canvas ref={expenseBreakdownChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
