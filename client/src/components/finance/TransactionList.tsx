import { useState } from "react";
import { format } from "date-fns";
import { Transaction } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useDeleteTransaction } from "@/hooks/useTransactions";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TransactionListProps {
  transactions: Transaction[];
}

const RecentTransactionsList = ({ transactions }: TransactionListProps) => {
  const latestTransactions = transactions
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 font-sans">Recent Transactions</h3>
          <Button variant="link" className="text-primary text-sm p-0">View All</Button>
        </div>
        
        <div className="space-y-4">
          {latestTransactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No transactions found</p>
          ) : (
            latestTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  } mr-3`}>
                    {transaction.type === 'income' ? (
                      <ArrowDown className="text-green-600 h-4 w-4" />
                    ) : (
                      <ArrowUp className="text-red-600 h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(transaction.date), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <span className={`font-medium ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  Rp {transaction.amount.toLocaleString('id-ID')}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const CashBookTable = ({ transactions }: TransactionListProps) => {
  const { toast } = useToast();
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);
  const deleteTransaction = useDeleteTransaction();
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  
  // Sort transactions by date, newest first
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Get current items
  const currentTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  // Calculate running balance
  let runningBalance = 0;
  const transactionsWithBalance = sortedTransactions.map(transaction => {
    if (transaction.type === 'income') {
      runningBalance += transaction.amount;
    } else {
      runningBalance -= transaction.amount;
    }
    return { ...transaction, balance: runningBalance };
  }).reverse(); // Reverse to show oldest first in the table
  
  // Get current page transactions with their running balance
  const currentTransactionsWithBalance = transactionsWithBalance
    .slice()
    .reverse() // Reverse back to newest first
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const handleDelete = (id: number) => {
    setTransactionToDelete(id);
    setDeleteAlertOpen(true);
  };
  
  const confirmDelete = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransaction.mutateAsync(transactionToDelete);
        toast({
          title: "Transaction deleted",
          description: "The transaction has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete transaction.",
          variant: "destructive",
        });
      }
      setDeleteAlertOpen(false);
      setTransactionToDelete(null);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 font-sans">Cash Book Records</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-primary">
                Export
              </Button>
              <Button variant="outline" size="sm" className="text-primary">
                Print
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount (Rp)
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance (Rp)
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentTransactionsWithBalance.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  currentTransactionsWithBalance.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(transaction.date), 'yyyy-MM-dd')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.category === 'dues' ? 'bg-blue-100 text-blue-800' :
                          transaction.category === 'event' ? 'bg-purple-100 text-purple-800' :
                          transaction.category === 'supplies' ? 'bg-green-100 text-green-800' :
                          transaction.category === 'study' ? 'bg-yellow-100 text-yellow-800' :
                          transaction.category === 'donation' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {transaction.balance.toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm" className="text-primary mr-1">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {transactions.length > 0 && (
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, transactions.length)}
                </span>{" "}
                of <span className="font-medium">{transactions.length}</span> transactions
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                  // Show the current page and up to 2 pages
                  let pageToShow = currentPage;
                  if (i === 0 && currentPage > 1) pageToShow = currentPage - 1;
                  if (i === 2 && currentPage < totalPages) pageToShow = currentPage + 1;
                  if (totalPages <= 3) pageToShow = i + 1;
                  
                  return (
                    <Button
                      key={pageToShow}
                      variant={currentPage === pageToShow ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageToShow)}
                    >
                      {pageToShow}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export { RecentTransactionsList, CashBookTable };
