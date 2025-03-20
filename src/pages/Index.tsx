
import { useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ExpenseByCategoryChart from "@/components/dashboard/ExpenseByCategoryChart";
import IncomeVsExpenseChart from "@/components/dashboard/IncomeVsExpenseChart";
import BalanceOverTimeChart from "@/components/dashboard/BalanceOverTimeChart";
import AccountsSummary from "@/components/dashboard/AccountsSummary";
import TransactionBreakdown from "@/components/dashboard/TransactionBreakdown";
import { accounts, categoryTotals, financialSummary, monthlyData, transactions } from "@/lib/mockData";

const Index = () => {
  // Set page title
  useEffect(() => {
    document.title = "Dashboard Financiero";
  }, []);

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
