import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { CalendarIcon, Plus, Image } from "lucide-react";
import { cn } from "@/lib/utils";
import { Transaction, Category, Account, PaymentMethod } from "@/lib/types";
import { formatDate } from "@/lib/formatters";
import { useTransactionsData } from "@/hooks/useTransactionsData";
import { supabase } from "@/integrations/supabase/client";

type TransactionFormProps = {
  onSubmit: (transaction: Omit<Transaction, "id">) => void;
};

const TransactionForm = ({ onSubmit }: TransactionFormProps) => {
  const { categories, accounts } = useTransactionsData();
  
  const [type, setType] = useState<"income" | "expense">("expense");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [notes, setNotes] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#1A5F7A");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !categoryId || !accountId || !date || !amount || !paymentMethod) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }
    
    const selectedCategory = categories.find(c => c.id === categoryId);
    const selectedAccount = accounts.find(a => a.id === accountId);
    
    if (!selectedCategory || !selectedAccount) {
      toast.error("Categoría o cuenta inválida");
      return;
    }
    
    const amountValue = parseFloat(amount.replace(/[^\d]/g, ""));
    
    if (isNaN(amountValue) || amountValue <= 0) {
      toast.error("Por favor ingrese un monto válido");
      return;
    }
    
    let receiptUrl: string | undefined = undefined;
    
    if (receipt) {
      try {
        const filename = `${Date.now()}_${receipt.name}`;
        const { data, error } = await supabase.storage
          .from('receipts')
          .upload(filename, receipt);
          
        if (error) {
          console.error('Error uploading receipt:', error);
          toast.error('Error al subir el recibo: ' + error.message);
        } else if (data) {
          const { data: urlData } = supabase.storage
            .from('receipts')
            .getPublicUrl(data.path);
            
          receiptUrl = urlData.publicUrl;
        }
      } catch (err) {
        console.error('Error uploading receipt:', err);
      }
    }
    
    const transaction: Omit<Transaction, "id"> = {
      type,
      description,
      category: selectedCategory,
      account: selectedAccount,
      date,
      amount: amountValue,
      paymentMethod,
      notes: notes || undefined,
      receiptUrl
    };
    
    onSubmit(transaction);
    
    // Reset form
    setDescription("");
    setCategoryId("");
    setAmount("");
    setNotes("");
    setReceipt(null);
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      setIsCreatingCategory(true);
      
      try {
        const { data, error } = await supabase
          .from('categories')
          .insert({
            name: newCategory.trim(),
            color: newCategoryColor
          })
          .select()
          .single();
          
        if (error) {
          toast.error(`Error al añadir categoría: ${error.message}`);
        } else if (data) {
          toast.success(`Nueva categoría "${newCategory}" añadida`);
          setCategoryId(data.id);
        }
      } catch (err) {
        console.error('Error adding category:', err);
        toast.error('Error al añadir categoría');
      } finally {
        setNewCategory("");
        setIsCreatingCategory(false);
        setNewCategoryColor("#1A5F7A");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceipt(e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tipo de transacción */}
        <div className="space-y-2">
          <Label>Tipo de transacción</Label>
          <div className="flex rounded-md overflow-hidden border">
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "flex-1 rounded-none border-r",
                type === "expense" && "bg-finance-red/10 text-finance-red"
              )}
              onClick={() => setType("expense")}
            >
              Gasto
            </Button>
            <Button
              type="button"
              variant="ghost"
              className={cn(
                "flex-1 rounded-none",
                type === "income" && "bg-finance-green/10 text-finance-green"
              )}
              onClick={() => setType("income")}
            >
              Ingreso
            </Button>
          </div>
        </div>

        {/* Monto */}
        <div className="space-y-2">
          <Label htmlFor="amount">Monto *</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <Input
              id="amount"
              value={amount}
              onChange={(e) => {
                // Allow only numbers and format with thousands separator
                const value = e.target.value.replace(/[^\d]/g, "");
                if (value) {
                  const formattedValue = Number(value).toLocaleString("es-CO");
                  setAmount(formattedValue);
                } else {
                  setAmount("");
                }
              }}
              className="pl-7"
              placeholder="0"
              required
            />
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <Label htmlFor="description">Descripción *</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ej: Compra en supermercado"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categoría */}
        <div className="space-y-2">
          <Label htmlFor="category">Categoría *</Label>
          <div className="flex space-x-2">
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="category" className="flex-1">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center">
                      <span
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.color }}
                      ></span>
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
                <SelectItem value="new">
                  <div className="flex items-center text-finance-blue">
                    <Plus className="w-3 h-3 mr-2" />
                    Crear nueva categoría
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {categoryId === "new" && (
            <div className="flex items-center mt-2 space-x-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nombre de nueva categoría"
                className="flex-1"
              />
              <input
                type="color"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                className="w-10 h-10 p-1 border rounded cursor-pointer"
              />
              <Button 
                type="button" 
                size="sm" 
                onClick={handleAddCategory}
                disabled={isCreatingCategory}
              >
                {isCreatingCategory ? "Añadiendo..." : "Añadir"}
              </Button>
            </div>
          )}
        </div>

        {/* Cuenta */}
        <div className="space-y-2">
          <Label htmlFor="account">Cuenta *</Label>
          <Select value={accountId} onValueChange={setAccountId}>
            <SelectTrigger id="account">
              <SelectValue placeholder="Seleccionar cuenta" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fecha */}
        <div className="space-y-2">
          <Label htmlFor="date">Fecha *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? formatDate(date) : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
                className="p-3"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Método de pago */}
        <div className="space-y-2">
          <Label htmlFor="payment-method">Método de pago *</Label>
          <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
            <SelectTrigger id="payment-method">
              <SelectValue placeholder="Seleccionar método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Efectivo</SelectItem>
              <SelectItem value="credit">Tarjeta de Crédito</SelectItem>
              <SelectItem value="debit">Tarjeta Débito</SelectItem>
              <SelectItem value="transfer">Transferencia</SelectItem>
              <SelectItem value="other">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notas */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notas (opcional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Información adicional sobre la transacción"
          rows={3}
        />
      </div>

      {/* Recibo */}
      <div className="space-y-2">
        <Label htmlFor="receipt">Recibo (opcional)</Label>
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <Label
              htmlFor="receipt-input"
              className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4 hover:border-finance-blue transition-colors"
            >
              <div className="flex flex-col items-center space-y-2 text-gray-500">
                <Image className="h-8 w-8" />
                <span className="text-sm font-medium">
                  {receipt ? receipt.name : "Subir imagen de recibo"}
                </span>
                <span className="text-xs">
                  Haga clic para seleccionar un archivo
                </span>
              </div>
            </Label>
            <Input
              id="receipt-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-finance-blue hover:bg-finance-blue/90"
      >
        Guardar Transacción
      </Button>
    </form>
  );
};

export default TransactionForm;
