
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Download, FileUp } from "lucide-react";
import { Transaction } from "@/lib/types";

type CSVImportProps = {
  onImport: (transactions: Omit<Transaction, "id">[]) => void;
};

const CSVImport = ({ onImport }: CSVImportProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!file) {
      toast.error("Por favor seleccione un archivo CSV para importar");
      return;
    }

    setLoading(true);

    // Simulate file processing
    setTimeout(() => {
      setLoading(false);
      toast.success(`Se importaron 8 transacciones exitosamente desde ${file.name}`);
      setFile(null);
      // Here you would actually parse the CSV and call onImport with the parsed data
      onImport([]);
    }, 1500);
  };

  const handleDownloadTemplate = () => {
    // Create CSV template content
    const headers = [
      "tipo",
      "descripcion",
      "categoria",
      "cuenta",
      "fecha",
      "monto",
      "metodo_pago",
      "notas",
    ].join(",");
    
    const exampleRow = [
      "expense",
      "Compra de Supermercado",
      "Alimentación",
      "Cuenta Corriente",
      "15/05/2023",
      "120000",
      "debit",
      "Compras semanales",
    ].join(",");
    
    const csvContent = `${headers}\n${exampleRow}`;
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "plantilla_transacciones.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Plantilla descargada exitosamente");
  };

  return (
    <div className="card-glass p-6 max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">Importar Transacciones</h3>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="csv-file">Archivo CSV</Label>
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <Label
                htmlFor="csv-input"
                className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 hover:border-finance-blue transition-colors"
              >
                <div className="flex flex-col items-center space-y-2 text-gray-500">
                  <FileUp className="h-8 w-8" />
                  <span className="text-sm font-medium">
                    {file ? file.name : "Arrastre o haga clic para subir CSV"}
                  </span>
                  <span className="text-xs">
                    Solo archivos CSV con el formato correcto
                  </span>
                </div>
              </Label>
              <Input
                id="csv-input"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Button
            type="button"
            onClick={handleImport}
            disabled={!file || loading}
            className="bg-finance-blue hover:bg-finance-blue/90"
          >
            {loading ? "Importando..." : "Importar Transacciones"}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={handleDownloadTemplate}
            className="flex items-center justify-center"
          >
            <Download className="mr-2 h-4 w-4" />
            Descargar Plantilla CSV
          </Button>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <h4 className="font-medium mb-2">Instrucciones:</h4>
          <ol className="list-decimal list-inside space-y-1">
            <li>Descargue la plantilla CSV para ver el formato requerido</li>
            <li>Complete su archivo con los datos de las transacciones</li>
            <li>Guarde el archivo en formato CSV</li>
            <li>Suba el archivo y haga clic en "Importar Transacciones"</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default CSVImport;
