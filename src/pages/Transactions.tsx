
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionForm from "@/components/transactions/TransactionForm";
import CSVImport from "@/components/transactions/CSVImport";
import { Transaction } from "@/lib/types";
import { toast } from "sonner";

const Transactions = () => {
  const [activeTab, setActiveTab] = useState("form");
  
  // Set page title
  useEffect(() => {
    document.title = "Transacciones | Dashboard Financiero";
  }, []);

  const handleAddTransaction = (transaction: Omit<Transaction, "id">) => {
    console.log("Transacción añadida:", transaction);
    // Here you would typically save the transaction to your data store
  };
  
  const handleImportTransactions = (transactions: Omit<Transaction, "id">[]) => {
    console.log("Transacciones importadas:", transactions);
    // Here you would typically process and save the imported transactions
  };

  return (
    <div className="py-8 page-transition">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-finance-blue">
          Seguimiento de Actividad Financiera
        </h1>
        
        <Tabs defaultValue="form" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="form" className="text-sm sm:text-base">
              Registrar Transacción
            </TabsTrigger>
            <TabsTrigger value="import" className="text-sm sm:text-base">
              Importar desde CSV
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="form" className="animate-slide-up">
            <div className="card-glass p-6">
              <TransactionForm onSubmit={handleAddTransaction} />
            </div>
          </TabsContent>
          
          <TabsContent value="import" className="animate-slide-up">
            <CSVImport onImport={handleImportTransactions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Transactions;
