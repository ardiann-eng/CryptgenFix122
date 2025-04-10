import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import FinanceSummary from '@/components/finance/FinanceSummary';
import ChartSection from '@/components/finance/ChartSection';
import TransactionsTable from '@/components/finance/TransactionsTable';
import TransactionModal from '@/components/finance/TransactionModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Transaction } from '@shared/schema';

const Finance = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | undefined>(undefined);
  const [isResetting, setIsResetting] = useState(false);
  
  const { data: transactions, isLoading, isError } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
  });

  // Mutation to delete all transactions (reset finance)
  const resetFinanceMutation = useMutation({
    mutationFn: async () => {
      // Delete existing transactions
      const currentTransactions = await apiRequest('GET', '/api/transactions');
      const transactionsData = await currentTransactions.json();
      
      // Delete transactions sequentially
      for (const transaction of transactionsData) {
        await apiRequest('DELETE', `/api/transactions/${transaction.id}`);
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/finance/summary'] });
      toast({
        title: "Finance Reset",
        description: "All financial transactions have been reset to zero",
      });
      setIsResetDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to reset finance: ${error}`,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsResetting(false);
    }
  });

  const handleAddTransaction = () => {
    setTransactionToEdit(undefined);
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTransactionToEdit(undefined);
  };

  const handleResetFinance = () => {
    setIsResetDialogOpen(true);
  };

  const confirmResetFinance = async () => {
    setIsResetting(true);
    await resetFinanceMutation.mutateAsync();
  };

  return (
    <div className="animate-fade-in">
      <section className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Class Finance Dashboard</h2>
          <div className="flex flex-wrap gap-3">
            <button 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center"
              onClick={handleAddTransaction}
            >
              <i className="fas fa-plus mr-2"></i> Add Transaction
            </button>
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center"
              onClick={handleResetFinance}
            >
              <i className="fas fa-trash-alt mr-2"></i> Reset Finance
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center">
              <i className="fas fa-download mr-2"></i> Export
            </button>
          </div>
        </div>

        <FinanceSummary />
        <ChartSection transactions={transactions} isLoading={isLoading} isError={isError} />
        <TransactionsTable onEditTransaction={handleEditTransaction} />
      </section>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        transactionToEdit={transactionToEdit}
      />

      {/* Reset Finance Confirmation Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Finance</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset all financial transactions? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmResetFinance}
              disabled={isResetting}
            >
              {isResetting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Resetting...
                </>
              ) : (
                'Reset Finance'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Finance;
