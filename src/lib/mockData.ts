
import { Account, Category, Transaction, MonthlyData, CategoryTotal } from './types';

// Categories
export const categories: Category[] = [
    { id: '1', name: 'Vivienda', color: '#4A6FA5' },
    { id: '2', name: 'Alimentación', color: '#FFB347' },
    { id: '3', name: 'Transporte', color: '#785EF0' },
    { id: '4', name: 'Entretenimiento', color: '#FE6B8B' },
    { id: '5', name: 'Salud', color: '#50C878' },
    { id: '6', name: 'Educación', color: '#4E9BB9' },
    { id: '7', name: 'Servicios', color: '#DC143C' },
    { id: '8', name: 'Salario', color: '#2E8B57' },
    { id: '9', name: 'Inversiones', color: '#6A5ACD' },
    { id: '10', name: 'Otros', color: '#708090' }
];

// Accounts
export const accounts: Account[] = [
    { id: '1', name: 'Cuenta de Ahorros', balance: 5800000, type: 'savings' },
    { id: '2', name: 'Cuenta Corriente', balance: 2300000, type: 'checking' },
    { id: '3', name: 'Tarjeta de Crédito', balance: -1200000, type: 'credit' }
];

// Generate transactions
const generateTransactions = (): Transaction[] => {
    const transactions: Transaction[] = [];
    const today = new Date();
    
    // Past transaction generator
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(today.getDate() - Math.floor(Math.random() * 90));
        
        const isIncome = Math.random() > 0.7;
        const categoryIndex = isIncome 
            ? Math.floor(Math.random() * 2) + 7 // Income categories (Salario, Inversiones)
            : Math.floor(Math.random() * 7); // Expense categories
        
        const amount = isIncome 
            ? Math.floor(Math.random() * 2000000) + 1000000
            : Math.floor(Math.random() * 500000) + 10000;
        
        const accountIndex = Math.floor(Math.random() * accounts.length);
        
        const transaction: Transaction = {
            id: `t-${i}`,
            type: isIncome ? 'income' : 'expense',
            description: isIncome 
                ? ['Salario', 'Dividendos', 'Bonificación', 'Reembolso'][Math.floor(Math.random() * 4)]
                : ['Arriendo', 'Mercado', 'Restaurante', 'Cine', 'Medicina', 'Transporte', 'Gas'][Math.floor(Math.random() * 7)],
            category: categories[categoryIndex],
            account: accounts[accountIndex],
            date: date,
            amount: amount,
            paymentMethod: ['cash', 'credit', 'debit', 'transfer'][Math.floor(Math.random() * 4)] as any,
            notes: Math.random() > 0.7 ? 'Nota de ejemplo' : undefined
        };
        
        transactions.push(transaction);
    }
    
    return transactions;
};

export const transactions: Transaction[] = generateTransactions();

// Monthly data
export const generateMonthlyData = (): MonthlyData[] => {
    const data: MonthlyData[] = [];
    const today = new Date();
    let balance = 2500000; // Starting balance
    
    for (let i = 5; i >= 0; i--) {
        const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = new Intl.DateTimeFormat('es-CO', { month: 'short' }).format(month);
        
        const income = Math.floor(Math.random() * 1000000) + 2500000;
        const expense = Math.floor(Math.random() * 1500000) + 1000000;
        
        balance = balance + income - expense;
        
        data.push({
            month: monthName,
            income,
            expense,
            balance
        });
    }
    
    return data;
};

export const monthlyData: MonthlyData[] = generateMonthlyData();

// Category expense totals
export const generateCategoryTotals = (): CategoryTotal[] => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const categoryAmounts = new Map<string, number>();
    
    expenseTransactions.forEach(transaction => {
        const categoryId = transaction.category.id;
        const currentAmount = categoryAmounts.get(categoryId) || 0;
        categoryAmounts.set(categoryId, currentAmount + transaction.amount);
    });
    
    const result: CategoryTotal[] = [];
    
    categoryAmounts.forEach((amount, categoryId) => {
        const category = categories.find(c => c.id === categoryId);
        if (category) {
            result.push({
                category,
                amount,
                percentage: (amount / totalExpense) * 100
            });
        }
    });
    
    return result.sort((a, b) => b.amount - a.amount);
};

export const categoryTotals: CategoryTotal[] = generateCategoryTotals();

// Total financial summary
export const financialSummary = {
    totalBalance: accounts.reduce((sum, account) => sum + account.balance, 0),
    totalIncome: transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
    totalExpense: transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
    savingsRate: 15.3, // Percentage
};
