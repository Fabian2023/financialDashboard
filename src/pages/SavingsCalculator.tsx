
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
      // Log the query to help with debugging
      console.log("Submitting query:", userQuery);
      
      // Encode the query for URL
      const encodedQuery = encodeURIComponent(userQuery);
      // Use the webhook-test URL
      const webhookUrl = `https://fabian40.app.n8n.cloud/webhook-test/4f878eb8-15d4-4786-8289-4d11bf0ea939?prompt=${encodedQuery}`;
      
      console.log("Calling webhook URL:", webhookUrl);
      
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
      let targetAmount = 5000000; // Default value
      const amountMatch = userQuery.match(/\$?\s*(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?|\d+)\s*(mil|millon|millones)?/i);
      
      if (amountMatch) {
        console.log("Amount match:", amountMatch);
        // Get the base numeric value
        let baseAmount = parseFloat(amountMatch[1].replace(/[.,]/g, ""));
        
        // Apply multiplier if specified
        const multiplier = amountMatch[2]?.toLowerCase();
        if (multiplier) {
          if (multiplier.includes('mil')) {
            baseAmount *= 1000;
          } else if (multiplier.includes('millon')) {
            baseAmount *= 1000000;
          }
        }
        
        targetAmount = baseAmount;
        console.log("Parsed target amount:", targetAmount);
      }
      
      // Format recommendations from webhook response
      const recommendations: string[] = [];
      
      // Process recommendations regardless of format
      if (data["Recomendaciones de reducción de gastos"]) {
        const recsData = data["Recomendaciones de reducción de gastos"];
        console.log("Processing recommendations:", recsData);
        
        if (recsData) {
          Object.entries(recsData).forEach(([key, value]) => {
            if (typeof value === 'string') {
              recommendations.push(`${key}: ${value}`);
            } else if (typeof value === 'object' && value !== null) {
              if ('sugerencia' in value && typeof value.sugerencia === 'string') {
                const categoria = 'categoria' in value && typeof value.categoria === 'string' 
                  ? value.categoria 
                  : key;
                recommendations.push(`${categoria}: ${value.sugerencia}`);
              } else {
                // Try to extract meaningful information from the object
                const objStr = JSON.stringify(value).replace(/[{}"]/g, '');
                if (objStr.length > 0) {
                  recommendations.push(`${key}: ${objStr}`);
                }
              }
            }
          });
        }
      } else if (data.output) {
        // Handle free text output format
        console.log("Parsing output string for recommendations");
        const outputLines = data.output.split('\n');
        const recs = outputLines.filter(line => 
          line.includes('-') || line.includes('•') || (line.includes('gasto') || line.includes('ahorro'))
        );
        recommendations.push(...recs.map(rec => rec.trim()));
      }
      
      if (recommendations.length === 0) {
        // Fallback recommendations if none are provided
        console.log("Using fallback recommendations");
        recommendations.push(
          "Reduce gastos en entretenimiento en un 15% para aumentar tu capacidad de ahorro.",
          "Considera usar una cuenta de ahorro con mayor rendimiento para tu meta.",
          "Establece transferencias automáticas mensuales por el monto calculado."
        );
      }
      
      // Handle the date properly
      let targetDate: Date | undefined;
      
      if (data["Fecha proyectada de finalización"]) {
        const dateStr = data["Fecha proyectada de finalización"];
        console.log("Date from webhook:", dateStr);
        
        // Try different date formats
        if (dateStr.includes('/')) {
          const dateParts = dateStr.split('/');
          if (dateParts.length === 3) {
            // Format DD/MM/YYYY
            const day = parseInt(dateParts[0]);
            const month = parseInt(dateParts[1]) - 1;
            const year = parseInt(dateParts[2]);
            
            if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
              targetDate = new Date(year, month, day);
              console.log("Parsed date:", targetDate);
            }
          }
        } else {
          // Try standard date parsing as fallback
          const parsedDate = new Date(dateStr);
          if (!isNaN(parsedDate.getTime())) {
            targetDate = parsedDate;
          }
        }
      }
      
      // Create result object with values from webhook
      const savingsGoal: SavingsGoal = {
        id: "goal-1",
        name: purpose,
        targetAmount: targetAmount,
        currentAmount: 0,
        deadline: targetDate,
        monthlySavingAmount: data["Cantidad mensual de ahorro requerida"] || 0,
        recommendations: recommendations
      };
      
      console.log("Created savings goal:", savingsGoal);
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
