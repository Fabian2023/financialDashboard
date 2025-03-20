
export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 'cash' | 'credit' | 'debit' | 'transfer' | 'other';

export type Category = {
    id: string;
    name: string;
    color?: string;
};

export type Account = {
    id: string;
    name: string;
    balance: number;
    type: 'savings' | 'checking' | 'credit' | 'investment' | 'other';
};

export type Transaction = {
    id: string;
    type: TransactionType;
    description: string;
    category: Category;
    account: Account;
    date: Date;
    amount: number;
    paymentMethod: PaymentMethod;
    notes?: string;
    receiptUrl?: string;
};

export type MonthlyData = {
    month: string;
    income: number;
    expense: number;
    balance: number;
};

export type CategoryTotal = {
    category: Category;
    amount: number;
    percentage: number;
};

export type SavingsGoal = {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: Date;
    monthlySavingAmount?: number;
    recommendations?: string[];
};
