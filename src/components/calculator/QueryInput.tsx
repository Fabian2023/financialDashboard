
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calculator } from "lucide-react";

type QueryInputProps = {
  onSubmit: (query: string) => void;
  isLoading: boolean;
};

const QueryInput = ({ onSubmit, isLoading }: QueryInputProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error("Por favor ingrese una consulta");
      return;
    }
    
    onSubmit(query);
  };

  const examples = [
    "Quiero ahorrar $5.000.000 para un viaje en 10 meses",
    "¿Cuánto debo ahorrar mensualmente para comprar un carro de $30.000.000 en 2 años?",
    "Necesito $15.000.000 para remodelar mi casa en 18 meses",
  ];

  return (
    <div className="card-glass p-6 animate-scale-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Describe tu meta de ahorro
          </label>
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej: Quiero ahorrar $5.000.000 para un viaje en 10 meses"
            rows={4}
            className="resize-none"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-finance-blue hover:bg-finance-blue/90 flex items-center justify-center"
          disabled={isLoading}
        >
          <Calculator className="mr-2 h-4 w-4" />
          {isLoading ? "Calculando..." : "Calcular"}
        </Button>

        {/* Examples */}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Ejemplos de consultas:</h4>
          <div className="space-y-2">
            {examples.map((example, index) => (
              <button
                key={index}
                type="button"
                className="text-sm text-left p-3 rounded-md bg-slate-100 hover:bg-slate-200 transition-colors w-full"
                onClick={() => setQuery(example)}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default QueryInput;
