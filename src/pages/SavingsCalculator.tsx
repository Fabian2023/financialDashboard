
import { useState, useEffect } from "react";
import QueryInput from "@/components/calculator/QueryInput";
import ResultsPanel from "@/components/calculator/ResultsPanel";
import { SavingsGoal } from "@/lib/types";
import { toast } from "sonner";

interface WebhookResponse {
  "Cantidad mensual de ahorro requerida"?: number;
  "Fecha proyectada de finalización"?: string;
  "Recomendaciones de reducción de gastos"?: {
    [category: string]: string | { categoria?: string; sugerencia?: string } | object;
  };
  output?: string;  // For handling alternative response format
}

const SavingsCalculator = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SavingsGoal | null>(null);
  const [rawResponse, setRawResponse] = useState<WebhookResponse | null>(null);
  
  // Set page title
  useEffect(() => {
    document.title = "Calculadora de Ahorros | Dashboard Financiero";
  }, []);

  const handleSubmit = async (userQuery: string) => {
    setQuery(userQuery);
    setLoading(true);
    setResult(null);
    setRawResponse(null);
    
    try {
      // Encode the query for URL
      const encodedQuery = encodeURIComponent(userQuery);
      // Updated to production webhook URL
      const webhookUrl = `https://fabian40.app.n8n.cloud/webhook/4f878eb8-15d4-4786-8289-4d11bf0ea939?prompt=${encodedQuery}`;
      
      // Call the webhook
      const response = await fetch(webhookUrl);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data: WebhookResponse = await response.json();
      console.log("Webhook response:", data);
      
      // Store the raw response
      setRawResponse(data);
      
      // Extract purpose from query
      let purpose = "tu meta financiera";
      const purposeMatch = userQuery.match(/para\s+([^,\.]+)/i);
      if (purposeMatch) {
        purpose = purposeMatch[1].trim();
      }
      
      // Parse amount from user query to use as target amount
      const amountMatch = userQuery.match(/\$?\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?|\d+)/);
      const targetAmount = amountMatch 
        ? parseInt(amountMatch[1].replace(/[.,]/g, "")) 
        : 5000000;
      
      // Format recommendations from webhook response
      const recommendations: string[] = [];
      
      // Check which format we received and process accordingly
      if (data.output) {
        // Handle free text output format
        const recs = data.output.split('\n').filter(line => 
          line.includes('-') && (line.includes('gasto') || line.includes('ahorro'))
        );
        recommendations.push(...recs.map(rec => rec.trim()));
      } else if (data["Recomendaciones de reducción de gastos"]) {
        // Handle structured format
        const recsData = data["Recomendaciones de reducción de gastos"];
        
        if (recsData) {
          Object.keys(recsData).forEach(key => {
            const item = recsData[key];
            if (typeof item === 'string') {
              recommendations.push(item);
            } else if (typeof item === 'object' && item !== null) {
              if ('sugerencia' in item && typeof item.sugerencia === 'string') {
                recommendations.push(item.sugerencia);
              } else if ('categoria' in item && 'sugerencia' in item) {
                const categoria = item.categoria;
                const sugerencia = item.sugerencia;
                if (typeof categoria === 'string' && typeof sugerencia === 'string') {
                  recommendations.push(`${categoria}: ${sugerencia}`);
                }
              }
            }
          });
        }
      }
      
      // Create date object if we have a date string
      let targetDate: Date | undefined;
      
      if (data["Fecha proyectada de finalización"]) {
        // Just use the string directly, we'll handle formatting in the ResultsPanel
        const dateStr = data["Fecha proyectada de finalización"];
        
        // Try to parse it as a date if it looks like a date format
        if (dateStr.includes('/')) {
          const dateParts = dateStr.split('/');
          if (dateParts.length === 3) {
            targetDate = new Date(
              parseInt(dateParts[2]), // Year
              parseInt(dateParts[1]) - 1, // Month (0-indexed)
              parseInt(dateParts[0]) // Day
            );
          }
        }
      }
      
      // Create result object with a fallback for monthly savings amount
      const savingsGoal: SavingsGoal = {
        id: "goal-1",
        name: purpose,
        targetAmount: targetAmount,
        currentAmount: 0,
        deadline: targetDate,
        monthlySavingAmount: data["Cantidad mensual de ahorro requerida"] || 0,
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
          
          {result && <ResultsPanel goal={result} rawResponse={rawResponse} />}
        </div>
      </div>
    </div>
  );
};

export default SavingsCalculator;
