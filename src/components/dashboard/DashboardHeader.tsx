
import { formatCurrency } from "@/lib/formatters";

type DashboardHeaderProps = {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  savingsRate: number;
};

const DashboardHeader = ({ 
  totalBalance, 
  totalIncome, 
  totalExpense,
  savingsRate 
}: DashboardHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-finance-blue">
        Resumen Financiero
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          title="Balance Total" 
          value={totalBalance} 
          valueClass={totalBalance >= 0 ? "text-finance-blue font-semibold" : "text-finance-red font-semibold"}
          delay={0}
        />
        <SummaryCard 
          title="Ingresos Totales" 
          value={totalIncome} 
          valueClass="text-finance-green font-semibold"
          delay={1}
        />
        <SummaryCard 
          title="Gastos Totales" 
          value={totalExpense} 
          valueClass="text-finance-red font-semibold"
          delay={2}
        />
        <SummaryCard 
          title="Tasa de Ahorro" 
          value={savingsRate} 
          valueClass="text-finance-blue font-semibold"
          isPercentage
          delay={3}
        />
      </div>
    </div>
  );
};

type SummaryCardProps = {
  title: string;
  value: number;
  valueClass?: string;
  isPercentage?: boolean;
  delay?: number;
};

const SummaryCard = ({ 
  title, 
  value, 
  valueClass, 
  isPercentage = false,
  delay = 0
}: SummaryCardProps) => {
  const formattedValue = isPercentage 
    ? `${value.toFixed(1)}%` 
    : formatCurrency(value);

  return (
    <div 
      className="card-glass p-5 dash-section" 
      style={{ '--delay': delay } as React.CSSProperties}
    >
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      <div className={`text-xl md:text-2xl ${valueClass}`}>
        {formattedValue}
      </div>
    </div>
  );
};

export default DashboardHeader;
