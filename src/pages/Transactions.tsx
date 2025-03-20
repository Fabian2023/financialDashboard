
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionForm from "@/components/transactions/TransactionForm";
import CSVImport from "@/components/transactions/CSVImport";
import TransactionBreakdown from "@/components/dashboard/TransactionBreakdown";
import { toast } from "sonner";
import { useTransactionsData } from "@/hooks/useTransactionsData";
import { Transaction } from "@/lib/types";

const Transactions = () => {
  const [activeTab, setActiveTab] = useState("new");
  const { transactions, addTransaction, isLoading, refetch } = useTransactionsData();

  // Set page title
  useEffect(() => {
    document.title = "Transacciones - Dashboard Financiero";
  }, []);

  const handleSubmitTransaction = (transaction: Omit<Transaction, "id">) => {
    addTransaction(transaction, {
      onSuccess: () => {
        toast.success("Transacción guardada exitosamente");
        refetch();
      },
      onError: (error) => {
        toast.error(`Error al guardar la transacción: ${error.message}`);
      }
    });
  };

  const handleImportTransactions = (transactionsToImport: Omit<Transaction, "id">[]) => {
    // Process and add each imported transaction
    transactionsToImport.forEach(transaction => {
      addTransaction(transaction);
    });
    
    toast.success(`Se importaron ${transactionsToImport.length} transacciones exitosamente`);
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8 page-transition">
      <h1 className="text-3xl font-bold mb-6">Transacciones</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="new">Nueva Transacción</TabsTrigger>
          <TabsTrigger value="import">Importar CSV</TabsTrigger>
          <TabsTrigger value="list">Ver Todas</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-0">
          <div className="card-glass p-6">
            <TransactionForm onSubmit={handleSubmitTransaction} />
          </div>
        </TabsContent>

        <TabsContent value="import" className="mt-0">
          <CSVImport onImport={handleImportTransactions} />
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <div className="card-glass p-6">
            <h2 className="text-xl font-semibold mb-4">Todas las Transacciones</h2>
            {isLoading ? (
              <p className="text-center py-8">Cargando transacciones...</p>
            ) : (
              <TransactionBreakdown transactions={transactions} limit={50} />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Transactions;
