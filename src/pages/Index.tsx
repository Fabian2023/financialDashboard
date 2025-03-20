
import { useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ExpenseByCategoryChart from "@/components/dashboard/ExpenseByCategoryChart";
import IncomeVsExpenseChart from "@/components/dashboard/IncomeVsExpenseChart";
import BalanceOverTimeChart from "@/components/dashboard/BalanceOverTimeChart";
import AccountsSummary from "@/components/dashboard/AccountsSummary";
import TransactionBreakdown from "@/components/dashboard/TransactionBreakdown";
import { useTransactionsData } from "@/hooks/useTransactionsData";
import { CategoryTotal, MonthlyData } from "@/lib/types";

const Index = () => {
  // Set page title
  useEffect(() => {
    document.title = "Dashboard Financiero";
  }, []);

  const { transactions, accounts, isLoading } = useTransactionsData();

  // Calculate financial summary
  const financialSummary = {
    totalBalance: accounts.reduce((sum, account) => sum + account.balance, 0),
    totalIncome: transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpense: transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    savingsRate: 0
  };
  
  // Calculate savings rate if we have income
  if (financialSummary.totalIncome > 0) {
    financialSummary.savingsRate = 
      (financialSummary.totalIncome - financialSummary.totalExpense) / 
      financialSummary.totalIncome * 100;
  }

  // Prepare data for category chart
  const calculateCategoryTotals = (): CategoryTotal[] => {
    const expensesByCategory: Record<string, number> = {};
    const categoryMap: Record<string, { id: string; name: string; color?: string }> = {};
    
    // Sum expenses by category
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const categoryId = transaction.category.id;
        if (!expensesByCategory[categoryId]) {
          expensesByCategory[categoryId] = 0;
          categoryMap[categoryId] = transaction.category;
        }
        expensesByCategory[categoryId] += transaction.amount;
      });
    
    const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
    
    // Convert to array and calculate percentages
    return Object.entries(expensesByCategory).map(([categoryId, amount]) => ({
      category: categoryMap[categoryId],
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
    })).sort((a, b) => b.amount - a.amount);
  };

  // Prepare data for monthly charts
  const calculateMonthlyData = (): MonthlyData[] => {
    const monthlySummary: Record<string, { month: string; income: number; expense: number; balance: number }> = {};
    
    // Group by month and sum
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
      
      if (!monthlySummary[monthKey]) {
        monthlySummary[monthKey] = { month: monthLabel, income: 0, expense: 0, balance: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlySummary[monthKey].income += transaction.amount;
      } else {
        monthlySummary[monthKey].expense += transaction.amount;
      }
      
      monthlySummary[monthKey].balance = 
        monthlySummary[monthKey].income - monthlySummary[monthKey].expense;
    });
    
    // Convert to array and sort by month
    return Object.values(monthlySummary)
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  const categoryTotals = calculateCategoryTotals();
  const monthlyData = calculateMonthlyData();

  return (
    <div className="pb-16 page-transition">
      <div className="mt-4 md:mt-8">
        <DashboardHeader
          totalBalance={financialSummary.totalBalance}
          totalIncome={financialSummary.totalIncome}
          totalExpense={financialSummary.totalExpense}
          savingsRate={financialSummary.savingsRate}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="card-glass p-4 dash-section" style={{ '--delay': 4 } as React.CSSProperties}>
            <ExpenseByCategoryChart data={categoryTotals} />
          </div>
          <div className="card-glass p-4 dash-section" style={{ '--delay': 5 } as React.CSSProperties}>
            <IncomeVsExpenseChart data={monthlyData} />
          </div>
        </div>

        <div className="card-glass p-4 mb-6 dash-section" style={{ '--delay': 6 } as React.CSSProperties}>
          <BalanceOverTimeChart data={monthlyData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-glass p-4 dash-section" style={{ '--delay': 7 } as React.CSSProperties}>
            <AccountsSummary accounts={accounts} />
          </div>
          <div className="card-glass p-4 dash-section" style={{ '--delay': 8 } as React.CSSProperties}>
            <TransactionBreakdown transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
