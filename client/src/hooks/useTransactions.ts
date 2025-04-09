import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Transaction, type InsertTransaction } from "@shared/schema";

export function useTransactions() {
  const query = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
  });

  const transactions = query.data || [];

  // Calculate financial summary
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpenses;

  // Monthly data for charts
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const getMonthlyData = () => {
    const monthlyIncome = Array(12).fill(0);
    const monthlyExpense = Array(12).fill(0);

    transactions.forEach(transaction => {
      const monthIndex = new Date(transaction.date).getMonth();
      
      if (transaction.type === 'income') {
        monthlyIncome[monthIndex] += transaction.amount;
      } else {
        monthlyExpense[monthIndex] += transaction.amount;
      }
    });

    return {
      labels: months,
      incomeData: monthlyIncome,
      expenseData: monthlyExpense
    };
  };

  // Expense breakdown by category
  const getExpenseBreakdown = () => {
    const categories = ['dues', 'donation', 'event', 'supplies', 'study', 'other'];
    const expenseByCategory: Record<string, number> = {};
    let totalExpense = 0;

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
        totalExpense += t.amount;
      });

    // Convert to percentages
    const categoryPercentages: Record<string, number> = {};
    for (const category in expenseByCategory) {
      categoryPercentages[category] = Math.round((expenseByCategory[category] / totalExpense) * 100);
    }

    return {
      categories: Object.keys(categoryPercentages),
      percentages: Object.values(categoryPercentages)
    };
  };

  return {
    ...query,
    transactions,
    totalIncome,
    totalExpenses,
    currentBalance,
    monthlyData: getMonthlyData(),
    expenseBreakdown: getExpenseBreakdown()
  };
}

export function useTransaction(id: number) {
  return useQuery<Transaction>({
    queryKey: [`/api/transactions/${id}`],
  });
}

export function useCreateTransaction() {
  return useMutation({
    mutationFn: async (transaction: InsertTransaction) => {
      const res = await apiRequest('POST', '/api/transactions', transaction);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
    },
  });
}

export function useUpdateTransaction(id: number) {
  return useMutation({
    mutationFn: async (transaction: Partial<InsertTransaction>) => {
      const res = await apiRequest('PUT', `/api/transactions/${id}`, transaction);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: [`/api/transactions/${id}`] });
    },
  });
}

export function useDeleteTransaction() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/transactions/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
    },
  });
}
