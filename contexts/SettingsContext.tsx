
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
];

interface SettingsContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatCurrency: (amount: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const CURRENCY_STORAGE_KEY = '@budgetbuddy_currency';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(CURRENCIES[0]); // Default to USD
  const [isLoading, setIsLoading] = useState(true);

  // Load currency preference from storage
  useEffect(() => {
    loadCurrencyPreference();
  }, []);

  const loadCurrencyPreference = async () => {
    try {
      const savedCurrency = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
      if (savedCurrency) {
        const parsedCurrency = JSON.parse(savedCurrency);
        setCurrencyState(parsedCurrency);
      }
    } catch (error) {
      console.error('Error loading currency preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrency = async (newCurrency: Currency) => {
    try {
      setCurrencyState(newCurrency);
      await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, JSON.stringify(newCurrency));
      console.log('Currency saved:', newCurrency);
    } catch (error) {
      console.error('Error saving currency preference:', error);
    }
  };

  const formatCurrency = (amount: number): string => {
    return `${currency.symbol}${amount.toFixed(2)}`;
  };

  if (isLoading) {
    return null;
  }

  return (
    <SettingsContext.Provider value={{ currency, setCurrency, formatCurrency }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
