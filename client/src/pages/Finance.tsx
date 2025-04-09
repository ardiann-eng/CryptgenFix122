import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import FinanceSummary from '@/components/finance/FinanceSummary';
import ChartSection from '@/components/finance/ChartSection';
import TransactionsTable from '@/components/finance/TransactionsTable';
import TransactionModal from '@/components/finance/TransactionModal';
import type { Transaction } from '@shared/schema';

const Finance = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | undefined>(undefined);
  
  const { data: transactions, isLoading, isError } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
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

  return (
    <div className="animate-fade-in">
      <section className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Class Finance Dashboard</h2>
          <div className="flex space-x-3">
            <button 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center"
              onClick={handleAddTransaction}
            >
              <i className="fas fa-plus mr-2"></i> Add Transaction
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
    </div>
  );
};

export default Finance;
