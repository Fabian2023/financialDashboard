
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/formatters';
import { MonthlyData } from '@/lib/types';

type BalanceOverTimeChartProps = {
  data: MonthlyData[];
};

const BalanceOverTimeChart = ({ data }: BalanceOverTimeChartProps) => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-base md:text-lg font-medium mb-4">Evolución del Balance</h3>
      
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis 
              dataKey="month" 
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
            <Line 
              type="monotone" 
              dataKey="balance" 
              stroke="#1A5F7A" 
              strokeWidth={3} 
              dot={{ stroke: '#1A5F7A', strokeWidth: 2, r: 4, fill: 'white' }}
              activeDot={{ r: 6, fill: '#1A5F7A' }}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceOverTimeChart;
