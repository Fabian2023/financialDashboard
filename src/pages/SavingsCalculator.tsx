
import { useState, useEffect } from "react";
import QueryInput from "@/components/calculator/QueryInput";
import ResultsPanel from "@/components/calculator/ResultsPanel";
import { SavingsGoal } from "@/lib/types";
import { toast } from "sonner";

interface WebhookResponse {
  "Cantidad mensual de ahorro requerida": number;
  "Fecha proyectada de finalización": string;
  "Recomendaciones de reducción de gastos": {
    [category: string]: string | { categoria?: string; sugerencia?: string } | object;
  };
}

const SavingsCalculator = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SavingsGoal | null>(null);
  
  // Set page title
  useEffect(() => {
    document.title = "Calculadora de Ahorros | Dashboard Financiero";
  }, []);

  const handleSubmit = async (userQuery: string) => {
    setQuery(userQuery);
    setLoading(true);
    
    try {
      // Encode the query for URL
      const encodedQuery = encodeURIComponent(userQuery);
      const webhookUrl = `https://fabian40.app.n8n.cloud/webhook-test/4f878eb8-15d4-4786-8289-4d11bf0ea939?prompt=${encodedQuery}`;
      
      // Call the webhook
      const response = await fetch(webhookUrl);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data: WebhookResponse = await response.json();
      
      // Extract purpose from query
      let purpose = "tu meta financiera";
      const purposeMatch = userQuery.match(/para\s+([^,\.]+)/i);
      if (purposeMatch) {
        purpose = purposeMatch[1].trim();
      }
      
      // Parse amount from user query to use as target amount
      const amountMatch = userQuery.match(/\$\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/);
      const targetAmount = amountMatch 
        ? parseInt(amountMatch[1].replace(/[.,]/g, "")) 
        : 5000000;
      
      // Format recommendations from webhook response
      const recommendations: string[] = [];
      const recsData = data["Recomendaciones de reducción de gastos"];
      
      Object.keys(recsData).forEach(key => {
        const item = recsData[key];
        if (typeof item === 'string') {
          recommendations.push(item);
        } else if (typeof item === 'object' && item !== null) {
          if ('sugerencia' in item && typeof item.sugerencia === 'string') {
            recommendations.push(item.sugerencia);
          } else if ('categoria' in item && 'sugerencia' in item) {
            recommendations.push(`${item.categoria}: ${item.sugerencia}`);
          }
        }
      });
      
      // Create date object from the string date
      const dateStr = data["Fecha proyectada de finalización"];
      const dateParts = dateStr.split('/');
      const targetDate = new Date(
        parseInt(dateParts[2]), // Year
        parseInt(dateParts[1]) - 1, // Month (0-indexed)
        parseInt(dateParts[0]) // Day
      );
      
      // Create result object
      const savingsGoal: SavingsGoal = {
        id: "goal-1",
        name: purpose,
        targetAmount: targetAmount,
        currentAmount: 0,
        deadline: targetDate,
        monthlySavingAmount: data["Cantidad mensual de ahorro requerida"],
        recommendations: recommendations.length > 0 ? recommendations : [
          "Reduce gastos en entretenimiento en un 15% para aumentar tu capacidad de ahorro.",
          "Considera usar una cuenta de ahorro con mayor rendimiento para tu meta.",
          "Establece transferencias automáticas mensuales por el monto calculado."
        ]
      };
      
      setResult(savingsGoal);
    } catch (error) {
      console.error("Error fetching data from webhook:", error);
      toast.error("No pudimos procesar tu consulta. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
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
