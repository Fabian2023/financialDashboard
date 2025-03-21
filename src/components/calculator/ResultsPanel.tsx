
import { ArrowRight, PiggyBank, DollarSign, Calendar, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { SavingsGoal } from "@/lib/types";

type ResultsPanelProps = {
  goal: SavingsGoal | null;
  rawResponse: any | null;
};

const ResultsPanel = ({ goal, rawResponse }: ResultsPanelProps) => {
  if (!goal) return null;

  // Get the formatted completion date
  let completionDate = 'Fecha no disponible';
  
  if (rawResponse && rawResponse["Fecha proyectada de finalización"]) {
    completionDate = rawResponse["Fecha proyectada de finalización"];
  } else if (goal.deadline) {
    completionDate = new Intl.DateTimeFormat('es-CO', { 
      day: 'numeric',
      month: 'long', 
      year: 'numeric' 
    }).format(goal.deadline);
  }

  // Format recommendations for display
  const displayRecommendations = goal.recommendations?.filter(rec => 
    rec && rec.trim() !== '' && 
    !rec.includes('undefined') && 
    !rec.toLowerCase().includes('no hay')
  );

  return (
    <div className="card-glass p-6 animate-scale-in">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-finance-blue flex items-center">
          <PiggyBank className="mr-2 h-5 w-5" />
          Resultados para: {goal.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Datos calculados basados en tu consulta
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Monthly Savings */}
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
          <div className="flex items-start mb-2">
            <div className="p-2 rounded-md bg-finance-blue/10 mr-3">
              <DollarSign className="h-5 w-5 text-finance-blue" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Ahorro Mensual</h4>
              <p className="text-xl font-bold text-finance-blue">
                {rawResponse && rawResponse["Cantidad mensual de ahorro requerida"] !== undefined 
                  ? formatCurrency(rawResponse["Cantidad mensual de ahorro requerida"]) 
                  : formatCurrency(goal.monthlySavingAmount || 0)}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Cantidad que debes ahorrar cada mes para alcanzar tu meta
          </p>
        </div>

        {/* Target Amount */}
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
          <div className="flex items-start mb-2">
            <div className="p-2 rounded-md bg-green-100 mr-3">
              <ArrowRight className="h-5 w-5 text-finance-green" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Meta Total</h4>
              <p className="text-xl font-bold text-finance-green">
                {formatCurrency(goal.targetAmount)}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Monto total que necesitas alcanzar
          </p>
        </div>

        {/* Completion Date */}
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
          <div className="flex items-start mb-2">
            <div className="p-2 rounded-md bg-blue-100 mr-3">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Fecha Proyectada</h4>
              <p className="text-xl font-bold text-blue-600">
                {completionDate}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Fecha estimada para alcanzar tu meta
          </p>
        </div>
      </div>

      {/* Recommendations */}
      {displayRecommendations && displayRecommendations.length > 0 && (
        <div className="bg-white rounded-lg p-5 border border-slate-200 shadow-sm mb-2">
          <h4 className="text-base font-semibold flex items-center mb-4 text-finance-blue">
            <TrendingDown className="mr-2 h-5 w-5" />
            Recomendaciones para Optimizar tus Ahorros
          </h4>
          <ul className="space-y-3">
            {displayRecommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <div className="min-w-6 h-6 rounded-full bg-finance-blue/10 flex items-center justify-center text-finance-blue font-medium text-xs mr-3 mt-0.5">
                  {index + 1}
                </div>
                <span className="text-sm">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Raw Response - hidden in production */}
      {rawResponse && process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h4 className="text-sm font-semibold mb-2">Respuesta del Webhook (Debug):</h4>
          <pre className="text-xs overflow-auto max-h-60">
            {JSON.stringify(rawResponse, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
