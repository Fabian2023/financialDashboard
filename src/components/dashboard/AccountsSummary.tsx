
import { formatCurrency } from '@/lib/formatters';
import { Account } from '@/lib/types';

type AccountsSummaryProps = {
  accounts: Account[];
};

const AccountsSummary = ({ accounts }: AccountsSummaryProps) => {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="h-full">
      <h3 className="text-base md:text-lg font-medium mb-4">Resumen de Cuentas</h3>
      
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left p-3">Cuenta</th>
              <th className="text-left p-3">Tipo</th>
              <th className="text-right p-3">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {accounts.map((account) => (
              <tr key={account.id} className="bg-white hover:bg-slate-50 transition-colors">
                <td className="p-3 font-medium">{account.name}</td>
                <td className="p-3">{getAccountTypeLabel(account.type)}</td>
                <td className={`p-3 text-right ${account.balance >= 0 ? 'text-finance-blue' : 'text-finance-red'}`}>
                  {formatCurrency(account.balance)}
                </td>
              </tr>
            ))}
            <tr className="bg-white">
              <td colSpan={2} className="p-3 font-semibold">Balance Total</td>
              <td className={`p-3 text-right font-semibold ${totalBalance >= 0 ? 'text-finance-blue' : 'text-finance-red'}`}>
                {formatCurrency(totalBalance)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getAccountTypeLabel = (type: Account['type']): string => {
  const labels = {
    'savings': 'Ahorros',
    'checking': 'Corriente',
    'credit': 'Crédito',
    'investment': 'Inversión',
    'other': 'Otro'
  };
  
  return labels[type] || 'Otro';
};

export default AccountsSummary;
