import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Transaction } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const getCategoryBadge = (type: string) => {
  if (type === 'income') {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Income</span>;
  }
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Expense</span>;
};

const getStatusBadge = (status: string) => {
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Completed</span>;
};

const getAmountDisplay = (amount: number, type: string) => {
  if (type === 'income') {
    return <span className="font-medium text-green-600">+ {formatCurrency(amount)}</span>;
  }
  return <span className="font-medium text-red-600">- {formatCurrency(amount)}</span>;
};

interface TransactionsTableProps {
  onEditTransaction: (transaction: Transaction) => void;
}

const TransactionsTable = ({ onEditTransaction }: TransactionsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: transactions, isLoading, isError } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/finance/summary'] });
      toast({
        title: "Transaction deleted",
        description: "The transaction has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete transaction: ${error}`,
        variant: "destructive",
      });
    },
  });

  const totalPages = transactions 
    ? Math.ceil(transactions.length / itemsPerPage) 
    : 0;
  
  const paginatedTransactions = transactions
    ? transactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDeleteTransaction = (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransactionMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
        </div>
        
        <div className="p-4">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !transactions) {
    return (
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
        </div>
        
        <div className="p-4">
          <div className="bg-red-100 p-4 rounded-md text-red-800">
            Failed to load transactions. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date <i className="fas fa-sort ml-1"></i>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description <i className="fas fa-sort ml-1"></i>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category <i className="fas fa-sort ml-1"></i>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount <i className="fas fa-sort ml-1"></i>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status <i className="fas fa-sort ml-1"></i>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedTransactions.map(transaction => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {getCategoryBadge(transaction.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {getAmountDisplay(Number(transaction.amount), transaction.type)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {getStatusBadge(transaction.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    className="text-purple-600 hover:text-purple-900 mr-3"
                    onClick={() => onEditTransaction(transaction)}
                  >
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {transactions.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          No transactions found. Add a new transaction to get started.
        </div>
      ) : (
        <div className="px-6 py-3 flex items-center justify-between border-t">
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button 
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, transactions.length)}
                </span> of{' '}
                <span className="font-medium">{transactions.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <i className="fas fa-chevron-left"></i>
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      currentPage === i + 1
                        ? 'bg-purple-50 text-purple-600 border-purple-300'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    } text-sm font-medium`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button 
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Next</span>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
