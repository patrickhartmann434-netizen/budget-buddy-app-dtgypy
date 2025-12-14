
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, Budget } from '@/types/budget';

const STORAGE_KEYS = {
  TRANSACTIONS: '@budgetbuddy_transactions',
  BUDGETS: '@budgetbuddy_budgets',
};

// Sample data for first-time users
const initialTransactions: Transaction[] = [
  {
    id: '1',
    amount: 3500,
    category: 'Salary',
    description: 'Monthly Salary',
    date: new Date().toISOString(),
    type: 'income',
  },
  {
    id: '2',
    amount: 85.50,
    category: 'Food & Dining',
    description: 'Grocery shopping',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'expense',
  },
  {
    id: '3',
    amount: 45.00,
    category: 'Transportation',
    description: 'Gas',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'expense',
  },
  {
    id: '4',
    amount: 120.00,
    category: 'Shopping',
    description: 'New shoes',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'expense',
  },
  {
    id: '5',
    amount: 15.99,
    category: 'Entertainment',
    description: 'Netflix subscription',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'expense',
  },
  {
    id: '6',
    amount: 150.00,
    category: 'Bills & Utilities',
    description: 'Electricity bill',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'expense',
  },
  {
    id: '7',
    amount: 65.00,
    category: 'Food & Dining',
    description: 'Restaurant dinner',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'expense',
  },
  {
    id: '8',
    amount: 200.00,
    category: 'Healthcare',
    description: 'Doctor visit',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'expense',
  },
  {
    id: '9',
    amount: 50.00,
    category: 'Entertainment',
    description: 'Movie tickets',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'expense',
  },
  {
    id: '10',
    amount: 95.00,
    category: 'Food & Dining',
    description: 'Groceries',
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'expense',
  },
];

const initialBudgets: Budget[] = [
  {
    id: '1',
    category: 'Food & Dining',
    limit: 500,
    spent: 245.50,
    period: 'monthly',
  },
  {
    id: '2',
    category: 'Transportation',
    limit: 200,
    spent: 45.00,
    period: 'monthly',
  },
  {
    id: '3',
    category: 'Entertainment',
    limit: 150,
    spent: 65.99,
    period: 'monthly',
  },
  {
    id: '4',
    category: 'Shopping',
    limit: 300,
    spent: 120.00,
    period: 'monthly',
  },
];

export function useBudgetData() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [transactionsData, budgetsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS),
        AsyncStorage.getItem(STORAGE_KEYS.BUDGETS),
      ]);

      if (transactionsData) {
        setTransactions(JSON.parse(transactionsData));
      } else {
        // First time user - set initial data
        setTransactions(initialTransactions);
        await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(initialTransactions));
      }

      if (budgetsData) {
        setBudgets(JSON.parse(budgetsData));
      } else {
        // First time user - set initial data
        setBudgets(initialBudgets);
        await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(initialBudgets));
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data');
      // Fallback to initial data
      setTransactions(initialTransactions);
      setBudgets(initialBudgets);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTransactions = async (newTransactions: Transaction[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(newTransactions));
      setTransactions(newTransactions);
    } catch (err) {
      console.error('Error saving transactions:', err);
      setError('Failed to save transaction');
    }
  };

  const saveBudgets = async (newBudgets: Budget[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(newBudgets));
      setBudgets(newBudgets);
    } catch (err) {
      console.error('Error saving budgets:', err);
      setError('Failed to save budget');
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    const newTransactions = [newTransaction, ...transactions];
    await saveTransactions(newTransactions);
  }, [transactions]);

  const deleteTransaction = useCallback(async (id: string) => {
    const newTransactions = transactions.filter(t => t.id !== id);
    await saveTransactions(newTransactions);
  }, [transactions]);

  const updateBudget = useCallback(async (budget: Budget) => {
    const index = budgets.findIndex(b => b.id === budget.id);
    let newBudgets: Budget[];
    
    if (index >= 0) {
      newBudgets = [...budgets];
      newBudgets[index] = budget;
    } else {
      newBudgets = [...budgets, budget];
    }
    
    await saveBudgets(newBudgets);
  }, [budgets]);

  const clearAllData = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.TRANSACTIONS, STORAGE_KEYS.BUDGETS]);
      setTransactions([]);
      setBudgets([]);
    } catch (err) {
      console.error('Error clearing data:', err);
      setError('Failed to clear data');
    }
  }, []);

  return {
    transactions,
    budgets,
    totalIncome,
    totalExpenses,
    isLoading,
    error,
    addTransaction,
    deleteTransaction,
    updateBudget,
    clearAllData,
    refreshData: loadData,
  };
}
