
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Transaction, 
  SupabaseTransaction, 
  Category, 
  SupabaseCategory, 
  Account, 
  SupabaseAccount 
} from '@/lib/types';

// Helper function to convert Supabase transaction to our app's Transaction format
const mapTransaction = async (
  supabaseTransaction: SupabaseTransaction, 
  categories: Record<string, Category>, 
  accounts: Record<string, Account>
): Promise<Transaction> => {
  return {
    id: supabaseTransaction.id,
    type: supabaseTransaction.type,
    description: supabaseTransaction.description,
    category: categories[supabaseTransaction.category_id],
    account: accounts[supabaseTransaction.account_id],
    date: new Date(supabaseTransaction.date),
    amount: supabaseTransaction.amount,
    paymentMethod: supabaseTransaction.payment_method,
    notes: supabaseTransaction.notes,
    receiptUrl: supabaseTransaction.receipt_url,
  };
};

// Fetch categories from Supabase
const fetchCategories = async (): Promise<Record<string, Category>> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
  
  if (error) {
    console.error('Error fetching categories:', error);
    throw new Error(error.message);
  }
  
  const categoriesMap: Record<string, Category> = {};
  (data as SupabaseCategory[]).forEach(category => {
    categoriesMap[category.id] = {
      id: category.id,
      name: category.name,
      color: category.color,
    };
  });
  
  return categoriesMap;
};

// Fetch accounts from Supabase
const fetchAccounts = async (): Promise<Record<string, Account>> => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*');
  
  if (error) {
    console.error('Error fetching accounts:', error);
    throw new Error(error.message);
  }
  
  const accountsMap: Record<string, Account> = {};
  (data as SupabaseAccount[]).forEach(account => {
    accountsMap[account.id] = {
      id: account.id,
      name: account.name,
      balance: account.balance,
      type: account.type,
    };
  });
  
  return accountsMap;
};

// Fetch transactions from Supabase
const fetchTransactions = async (): Promise<Transaction[]> => {
  // Fetch categories and accounts first to use for transaction mapping
  const categories = await fetchCategories();
  const accounts = await fetchAccounts();
  
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching transactions:', error);
    throw new Error(error.message);
  }
  
  // Map Supabase transactions to our app's Transaction format
  const transactions = await Promise.all(
    (data as SupabaseTransaction[]).map(transaction => 
      mapTransaction(transaction, categories, accounts)
    )
  );
  
  return transactions;
};

// Add a new transaction to Supabase
const addTransaction = async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
  // Convert to the format Supabase expects
  const supabaseTransaction: Omit<SupabaseTransaction, 'id' | 'created_at'> = {
    type: transaction.type,
    description: transaction.description,
    category_id: transaction.category.id,
    account_id: transaction.account.id,
    date: transaction.date.toISOString(),
    amount: transaction.amount,
    payment_method: transaction.paymentMethod,
    notes: transaction.notes,
    receipt_url: transaction.receiptUrl,
  };
  
  const { data, error } = await supabase
    .from('transactions')
    .insert(supabaseTransaction)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding transaction:', error);
    throw new Error(error.message);
  }
  
  // Re-fetch the categories and accounts to make sure we have the latest
  const categories = await fetchCategories();
  const accounts = await fetchAccounts();
  
  // Map the returned transaction to our app's format
  return mapTransaction(data as SupabaseTransaction, categories, accounts);
};

// Custom hook to access and manage transactions
export const useTransactionsData = () => {
  const queryClient = useQueryClient();
  
  // Query to fetch all transactions
  const {
    data: transactions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });
  
  // Query to fetch categories
  const {
    data: categoriesMap = {},
    isLoading: isCategoriesLoading,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
  
  // Query to fetch accounts
  const {
    data: accountsMap = {},
    isLoading: isAccountsLoading,
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
  });
  
  // Convert maps to arrays for easier use in components
  const categories = Object.values(categoriesMap);
  const accounts = Object.values(accountsMap);
  
  // Mutation to add a new transaction
  const addTransactionMutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      // Invalidate and refetch queries after a successful mutation
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
  
  return {
    transactions,
    categories,
    accounts,
    isLoading: isLoading || isCategoriesLoading || isAccountsLoading,
    error,
    refetch,
    addTransaction: addTransactionMutation.mutate,
    isAddingTransaction: addTransactionMutation.isPending,
  };
};
