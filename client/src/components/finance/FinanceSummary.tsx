import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const FinanceSummary = () => {
  const { data, isLoading, isError } = useQuery<FinanceSummary>({
    queryKey: ['/api/finance/summary'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-8 w-40" />
              </div>
              <Skeleton className="h-12 w-12 rounded-lg" />
            </div>
            <div className="mt-4 flex items-center">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-32 ml-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-red-100 p-4 rounded-md text-red-800 mb-8">
        Failed to load financial summary. Please try again later.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Current Balance</p>
            <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(data.balance)}</h3>
          </div>
          <div className="p-3 bg-purple-100 rounded-lg">
            <i className="fas fa-wallet text-xl text-purple-600"></i>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-green-600 flex items-center">
            <i className="fas fa-arrow-up mr-1"></i> 15%
          </span>
          <span className="text-gray-500 ml-2">from last month</span>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Income</p>
            <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(data.totalIncome)}</h3>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <i className="fas fa-arrow-down text-xl text-green-600"></i>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-green-600 flex items-center">
            <i className="fas fa-arrow-up mr-1"></i> 8%
          </span>
          <span className="text-gray-500 ml-2">from last month</span>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Expense</p>
            <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(data.totalExpense)}</h3>
          </div>
          <div className="p-3 bg-red-100 rounded-lg">
            <i className="fas fa-arrow-up text-xl text-red-600"></i>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <span className="text-red-600 flex items-center">
            <i className="fas fa-arrow-up mr-1"></i> 12%
          </span>
          <span className="text-gray-500 ml-2">from last month</span>
        </div>
      </div>
    </div>
  );
};

export default FinanceSummary;
