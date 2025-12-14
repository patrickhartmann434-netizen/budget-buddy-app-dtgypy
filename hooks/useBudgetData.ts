
import { useState, useEffect } from 'react';
import { Transaction, Budget } from '@/types/budget';
import { defaultCategories } from '@/data/categories';

// Sample data for demonstration
const sampleTransactions: Transaction[] = [
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

const sampleBudgets: Budget[] = [
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
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(sampleBudgets);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateBudget = (budget: Budget) => {
    setBudgets(prev => {
      const index = prev.findIndex(b => b.id === budget.id);
      if (index >= 0) {
        const newBudgets = [...prev];
        newBudgets[index] = budget;
        return newBudgets;
      }
      return [...prev, budget];
    });
  };

  return {
    transactions,
    budgets,
    totalIncome,
    totalExpenses,
    addTransaction,
    deleteTransaction,
    updateBudget,
  };
}
