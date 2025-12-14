
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Transaction } from '@/types/budget';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { defaultCategories } from '@/data/categories';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const theme = useTheme();

  if (transactions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Recent Transactions</Text>
        <View style={[styles.emptyCard, { backgroundColor: theme.colors.card }]}>
          <IconSymbol 
            ios_icon_name="tray" 
            android_material_icon_name="inbox" 
            size={40} 
            color={colors.textSecondary} 
          />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No transactions yet
          </Text>
        </View>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Recent Transactions</Text>
      {transactions.map((transaction, index) => {
        const category = defaultCategories.find(c => c.name === transaction.category);
        const isIncome = transaction.type === 'income';

        return (
          <TouchableOpacity
            key={transaction.id || index}
            style={[styles.transactionCard, { backgroundColor: theme.colors.card }]}
            activeOpacity={0.7}
            accessibilityLabel={`${transaction.description}, ${isIncome ? 'income' : 'expense'} of ${transaction.amount} dollars`}
          >
            <View style={styles.transactionLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: category?.color || colors.primary },
                ]}
              >
                <IconSymbol
                  ios_icon_name={isIncome ? 'arrow.down.circle.fill' : 'arrow.up.circle.fill'}
                  android_material_icon_name={isIncome ? 'arrow-downward' : 'arrow-upward'}
                  size={20}
                  color="#fff"
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={[styles.transactionDescription, { color: theme.colors.text }]}>
                  {transaction.description}
                </Text>
                <Text style={[styles.transactionCategory, { color: colors.textSecondary }]}>
                  {transaction.category} • {formatDate(transaction.date)}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                { color: isIncome ? colors.success : colors.error },
              ]}
            >
              {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 13,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyCard: {
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
  },
});
