import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Chart from "chart.js/auto";

interface FinancialOverviewProps {
  labels: string[];
  incomeData: number[];
  expenseData: number[];
}

interface ExpenseBreakdownProps {
  categories: string[];
  percentages: number[];
}

export const FinancialOverview = ({ labels, incomeData, expenseData }: FinancialOverviewProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Income',
              data: incomeData,
              backgroundColor: 'rgba(124, 58, 237, 0.1)',
              borderColor: '#7C3AED',
              borderWidth: 2,
              tension: 0.3,
              pointBackgroundColor: '#7C3AED'
            },
            {
              label: 'Expenses',
              data: expenseData,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderColor: '#EF4444',
              borderWidth: 2,
              tension: 0.3,
              pointBackgroundColor: '#EF4444'
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('id-ID', { 
                      style: 'currency', 
                      currency: 'IDR',
                      maximumFractionDigits: 0 
                    }).format(context.parsed.y);
                  }
                  return label;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return 'Rp ' + value.toLocaleString('id-ID');
                }
              }
            }
          }
        }
      });
    }
    
    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [labels, incomeData, expenseData]);

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 font-sans">Financial Overview</h3>
          <Select defaultValue="monthly">
            <SelectTrigger className="w-[120px] text-sm">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <canvas ref={chartRef} height={300}></canvas>
        </div>
      </CardContent>
    </Card>
  );
};

export const ExpenseBreakdown = ({ categories, percentages }: ExpenseBreakdownProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Color mapping
  const colors = {
    dues: '#6D28D9', // Primary
    event: '#8B5CF6', // Secondary dark
    supplies: '#A78BFA', // Secondary
    study: '#FBBF24', // Yellow
    donation: '#10B981', // Green
    other: '#6EE7B7', // Light green
  };

  // Get color for category
  const getCategoryColor = (category: string) => {
    return colors[category as keyof typeof colors] || '#6D28D9';
  };

  useEffect(() => {
    if (!chartRef.current || categories.length === 0 || percentages.length === 0) return;
    
    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: categories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)),
          datasets: [{
            data: percentages,
            backgroundColor: categories.map(getCategoryColor),
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          cutout: '70%',
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.label + ': ' + context.parsed + '%';
                }
              }
            }
          }
        }
      });
    }
    
    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [categories, percentages]);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 font-sans">Expense Breakdown</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <canvas ref={chartRef} height={220}></canvas>
          </div>
          <div className="flex flex-col justify-center">
            {categories.map((category, index) => (
              <div key={category} className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: getCategoryColor(category) }}
                  ></div>
                  <span className="text-sm text-gray-600 capitalize">{category}</span>
                </div>
                <span className="text-sm font-medium">{percentages[index]}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
