
import { useState, useEffect } from "react";
import QueryInput from "@/components/calculator/QueryInput";
import ResultsPanel from "@/components/calculator/ResultsPanel";
import { SavingsGoal } from "@/lib/types";
import { toast } from "sonner";

const SavingsCalculator = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SavingsGoal | null>(null);
  
  // Set page title
  useEffect(() => {
    document.title = "Calculadora de Ahorros | Dashboard Financiero";
  }, []);

  const handleSubmit = (userQuery: string) => {
    setQuery(userQuery);
    setLoading(true);
    
    // Simulate processing time
    setTimeout(() => {
      // Parse the query to extract information
      // This is a simple demo - in a real app, you'd use NLP or a more sophisticated parser
      try {
        const amountMatch = userQuery.match(/\$\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/);
        const amount = amountMatch 
          ? parseInt(amountMatch[1].replace(/[.,]/g, "")) 
          : 5000000;
        
        const monthsMatch = userQuery.match(/(\d+)\s*(mes(?:es)?|año(?:s)?)/i);
        let timeframe = 12; // Default to 12 months
        
        if (monthsMatch) {
          timeframe = parseInt(monthsMatch[1]);
          // Convert years to months if needed
          if (monthsMatch[2].startsWith("año")) {
            timeframe *= 12;
          }
        }
        
        // Extract purpose
        let purpose = "tu meta financiera";
        const purposeMatch = userQuery.match(/para\s+([^,\.]+)/i);
        if (purposeMatch) {
          purpose = purposeMatch[1].trim();
        }
        
        // Calculate monthly amount
        const monthlySaving = Math.ceil(amount / timeframe);
        
        // Calculate target date
        const targetDate = new Date();
        targetDate.setMonth(targetDate.getMonth() + timeframe);
        
        // Create result object
        const savingsGoal: SavingsGoal = {
          id: "goal-1",
          name: purpose,
          targetAmount: amount,
          currentAmount: 0,
          deadline: targetDate,
          monthlySavingAmount: monthlySaving,
          recommendations: [
            "Reduce gastos en entretenimiento en un 15% para aumentar tu capacidad de ahorro.",
            "Considera usar una cuenta de ahorro con mayor rendimiento para tu meta.",
            "Establece transferencias automáticas mensuales por el monto calculado.",
            "Revisa servicios de suscripción que podrías cancelar temporalmente.",
            "Destina ingresos extras (bonos, primas) directamente a tu meta de ahorro."
          ]
        };
        
        setResult(savingsGoal);
        setLoading(false);
      } catch (error) {
        console.error("Error parsing query:", error);
        toast.error("No pudimos procesar tu consulta. Por favor intenta de nuevo con un formato diferente.");
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="py-8 page-transition">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-finance-blue">
          Calculadora de Metas de Ahorro
        </h1>
        <p className="text-gray-600 mb-6">
          Describe tu meta financiera y te ayudaremos a calcular cuánto necesitas ahorrar mensualmente.
        </p>
        
        <div className="space-y-6">
          <QueryInput onSubmit={handleSubmit} isLoading={loading} />
          
          {result && <ResultsPanel goal={result} />}
        </div>
      </div>
    </div>
  );
};

export default SavingsCalculator;
