import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Transaction, InsertTransaction } from '@shared/schema';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: Transaction;
}

const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const TransactionModal = ({ isOpen, onClose, transactionToEdit }: TransactionModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<InsertTransaction> & { amount: string | number }>({
    type: 'income',
    date: getCurrentDate(),
    description: '',
    category: '',
    amount: '',
    notes: '',
    status: 'completed'
  });

  useEffect(() => {
    if (transactionToEdit) {
      setFormData({
        type: transactionToEdit.type,
        date: new Date(transactionToEdit.date).toISOString().split('T')[0],
        description: transactionToEdit.description,
        category: transactionToEdit.category,
        amount: String(transactionToEdit.amount),
        notes: transactionToEdit.notes || '',
        status: transactionToEdit.status
      });
    } else {
      setFormData({
        type: 'income',
        date: getCurrentDate(),
        description: '',
        category: '',
        amount: '',
        notes: '',
        status: 'completed'
      });
    }
  }, [transactionToEdit, isOpen]);

  const createTransactionMutation = useMutation({
    mutationFn: async (data: InsertTransaction) => {
      return apiRequest('POST', '/api/transactions', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/finance/summary'] });
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add transaction: ${error}`,
        variant: "destructive",
      });
    },
  });

  const updateTransactionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertTransaction> }) => {
      return apiRequest('PUT', `/api/transactions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/finance/summary'] });
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update transaction: ${error}`,
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'amount') {
      // Handle amount field specially to convert to string for API
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      type: e.target.value as 'income' | 'expense'
    }));
  };

  const handleSubmit = () => {
    if (!formData.description || !formData.category || formData.amount === '' || formData.amount === undefined) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Process the data before sending to API
    const processedData = {
      ...formData,
      // Ensure amount is properly formatted as string for the API
      amount: String(formData.amount)
    };

    if (transactionToEdit) {
      updateTransactionMutation.mutate({ 
        id: transactionToEdit.id, 
        data: processedData as Partial<InsertTransaction>
      });
    } else {
      createTransactionMutation.mutate(processedData as InsertTransaction);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-800">
              {transactionToEdit ? 'Edit Transaction' : 'Add New Transaction'}
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <form id="transaction-form" onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="type" 
                    value="income" 
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                    checked={formData.type === 'income'}
                    onChange={handleRadioChange}
                  />
                  <span className="ml-2 text-gray-700">Income</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="type" 
                    value="expense" 
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                    checked={formData.type === 'expense'}
                    onChange={handleRadioChange}
                  />
                  <span className="ml-2 text-gray-700">Expense</span>
                </label>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input 
                type="date" 
                id="date" 
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input 
                type="text" 
                id="description" 
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                placeholder="Enter transaction description"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select 
                id="category" 
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select category</option>
                <option value="dues">Class Dues</option>
                <option value="donation">Donation</option>
                <option value="sponsorship">Sponsorship</option>
                <option value="supplies">Supplies</option>
                <option value="events">Events</option>
                <option value="printing">Printing</option>
                <option value="travel">Travel</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">Amount (Rp)</label>
              <input 
                type="number" 
                id="amount" 
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                placeholder="0"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
              <textarea 
                id="notes" 
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3} 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                placeholder="Additional notes..."
              ></textarea>
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t flex justify-end space-x-3">
          <button 
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
            onClick={handleSubmit}
          >
            {transactionToEdit ? 'Update Transaction' : 'Save Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
