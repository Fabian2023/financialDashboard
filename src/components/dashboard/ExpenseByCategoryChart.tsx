
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { CategoryTotal } from '@/lib/types';

type ExpenseByCategoryChartProps = {
  data: CategoryTotal[];
};

const ExpenseByCategoryChart = ({ data }: ExpenseByCategoryChartProps) => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-base md:text-lg font-medium mb-4">Gastos por Categoría</h3>
      
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="amount"
              nameKey="category.name"
              animationDuration={800}
              animationBegin={300}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.category.color} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Categoría: ${label}`}
            />
            <Legend 
              layout="vertical" 
              verticalAlign="middle" 
              align="right"
              formatter={(value, entry, index) => {
                // @ts-ignore - recharts typing issue
                const { payload } = entry;
                return (
                  <span className="text-xs md:text-sm">
                    {value} ({formatPercentage(payload.percentage)})
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseByCategoryChart;
