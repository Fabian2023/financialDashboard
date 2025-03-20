
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/formatters';
import { MonthlyData } from '@/lib/types';

type IncomeVsExpenseChartProps = {
  data: MonthlyData[];
};

const IncomeVsExpenseChart = ({ data }: IncomeVsExpenseChartProps) => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-base md:text-lg font-medium mb-4">Ingresos vs Gastos Mensuales</h3>
      
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis 
              dataKey="month" 
              scale="point" 
              padding={{ left: 20, right: 20 }} 
              tickLine={false}
              axisLine={{ stroke: '#E0E0E0' }}
            />
            <YAxis 
              tickFormatter={(value) => `${value/1000}k`}
              tickLine={false}
              axisLine={{ stroke: '#E0E0E0' }}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => `Mes: ${label}`}
            />
            <Bar 
              dataKey="income" 
              name="Ingresos" 
              fill="#159947" 
              radius={[4, 4, 0, 0]} 
              animationDuration={1500}
            />
            <Bar 
              dataKey="expense" 
              name="Gastos" 
              fill="#E76161" 
              radius={[4, 4, 0, 0]} 
              animationDuration={1500}
              animationBegin={300}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default IncomeVsExpenseChart;
