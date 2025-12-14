
import { Category } from '@/types/budget';

export const defaultCategories: Category[] = [
  // Expense categories
  { id: '1', name: 'Food & Dining', icon: 'restaurant', color: '#FF6B6B', type: 'expense' },
  { id: '2', name: 'Transportation', icon: 'directions-car', color: '#4ECDC4', type: 'expense' },
  { id: '3', name: 'Shopping', icon: 'shopping-cart', color: '#95E1D3', type: 'expense' },
  { id: '4', name: 'Entertainment', icon: 'movie', color: '#F38181', type: 'expense' },
  { id: '5', name: 'Bills & Utilities', icon: 'receipt', color: '#AA96DA', type: 'expense' },
  { id: '6', name: 'Healthcare', icon: 'local-hospital', color: '#FCBAD3', type: 'expense' },
  { id: '7', name: 'Education', icon: 'school', color: '#A8D8EA', type: 'expense' },
  { id: '8', name: 'Other', icon: 'more-horiz', color: '#C7CEEA', type: 'expense' },
  
  // Income categories
  { id: '9', name: 'Salary', icon: 'account-balance-wallet', color: '#4CAF50', type: 'income' },
  { id: '10', name: 'Freelance', icon: 'work', color: '#8BC34A', type: 'income' },
  { id: '11', name: 'Investment', icon: 'trending-up', color: '#CDDC39', type: 'income' },
  { id: '12', name: 'Other Income', icon: 'attach-money', color: '#9CCC65', type: 'income' },
];
