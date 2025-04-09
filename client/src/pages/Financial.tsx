import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Wallet } from "lucide-react";
import { FinancialOverview, ExpenseBreakdown } from "@/components/finance/FinancialCharts";
import { RecentTransactionsList, CashBookTable } from "@/components/finance/TransactionList";
import TransactionForm from "@/components/finance/TransactionForm";

const Financial = () => {
  const { 
    transactions, 
    totalIncome, 
    totalExpenses, 
    currentBalance,
    monthlyData,
    expenseBreakdown,
    isLoading 
  } = useTransactions();

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 font-sans sm:text-4xl">Financial Dashboard</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Track class finances, manage transactions, and view financial reports.
        </p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Current Balance</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {isLoading ? (
                    <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    `Rp ${currentBalance.toLocaleString('id-ID')}`
                  )}
                </h3>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <ArrowUp className="mr-1 h-3 w-3" />
                  <span>12.5% from last month</span>
                </p>
              </div>
              <div className="p-3 bg-primary/20 rounded-full">
                <Wallet className="text-primary h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Income</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {isLoading ? (
                    <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    `Rp ${totalIncome.toLocaleString('id-ID')}`
                  )}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Academic Year 2023/2024</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <ArrowDown className="text-green-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                  {isLoading ? (
                    <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
                  ) : (
                    `Rp ${totalExpenses.toLocaleString('id-ID')}`
                  )}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Academic Year 2023/2024</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <ArrowUp className="text-red-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Transaction Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Financial Charts */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <>
              <div className="bg-gray-100 h-[400px] w-full rounded-lg mb-6 animate-pulse"></div>
              <div className="bg-gray-100 h-[400px] w-full rounded-lg animate-pulse"></div>
            </>
          ) : (
            <>
              <FinancialOverview 
                labels={monthlyData.labels}
                incomeData={monthlyData.incomeData}
                expenseData={monthlyData.expenseData}
              />
              
              <ExpenseBreakdown 
                categories={expenseBreakdown.categories}
                percentages={expenseBreakdown.percentages}
              />
            </>
          )}
        </div>
        
        {/* Transaction Form and List */}
        <div>
          <TransactionForm />
          
          <div className="mt-6">
            {isLoading ? (
              <div className="bg-gray-100 h-[400px] w-full rounded-lg animate-pulse"></div>
            ) : (
              <RecentTransactionsList transactions={transactions} />
            )}
          </div>
        </div>
      </div>
      
      {/* Cash Book Records */}
      {isLoading ? (
        <div className="bg-gray-100 h-[400px] w-full rounded-lg animate-pulse"></div>
      ) : (
        <CashBookTable transactions={transactions} />
      )}
    </div>
  );
};

export default Financial;
