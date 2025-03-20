
import { useState } from 'react';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { Transaction } from '@/lib/types';

type TransactionBreakdownProps = {
  transactions: Transaction[];
  limit?: number;
};

const TransactionBreakdown = ({ transactions, limit = 5 }: TransactionBreakdownProps) => {
  const [showAll, setShowAll] = useState(false);
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const displayTransactions = showAll 
    ? sortedTransactions 
    : sortedTransactions.slice(0, limit);

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base md:text-lg font-medium">Últimas Transacciones</h3>
      </div>
      
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-3">Fecha</th>
              <th className="text-left p-3">Descripción</th>
              <th className="text-left p-3 hidden md:table-cell">Categoría</th>
              <th className="text-left p-3 hidden md:table-cell">Cuenta</th>
              <th className="text-right p-3">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {displayTransactions.length > 0 ? (
              displayTransactions.map((transaction) => (
                <tr key={transaction.id} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="p-3 whitespace-nowrap">{formatDate(transaction.date)}</td>
                  <td className="p-3">{transaction.description}</td>
                  <td className="p-3 hidden md:table-cell">
                    <span 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs"
                      style={{ 
                        backgroundColor: `${transaction.category.color}30`, 
                        color: transaction.category.color 
                      }}
                    >
                      {transaction.category.name}
                    </span>
                  </td>
                  <td className="p-3 hidden md:table-cell">{transaction.account.name}</td>
                  <td className={`p-3 text-right whitespace-nowrap ${
                    transaction.type === 'income' ? 'text-finance-green' : 'text-finance-red'
                  }`}>
                    {transaction.type === 'income' ? '+ ' : '- '}
                    {formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No hay transacciones para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {transactions.length > limit && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-finance-blue hover:text-finance-blue/80 text-sm font-medium transition"
          >
            {showAll ? 'Mostrar menos' : 'Ver todas las transacciones'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionBreakdown;
