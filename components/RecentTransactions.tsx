
import React from 'react';
import { View, Text, StyleSheet, Alert, Animated } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Transaction } from '@/types/budget';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { defaultCategories } from '@/data/categories';
import { useBudgetData } from '@/hooks/useBudgetData';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const theme = useTheme();
  const { deleteTransaction } = useBudgetData();

  const handleDelete = (transaction: Transaction) => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${transaction.description}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            await deleteTransaction(transaction.id);
            console.log('Transaction deleted:', transaction.id);
          },
        },
      ]
    );
  };

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    transaction: Transaction
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.deleteAction,
          {
            transform: [{ translateX: trans }],
          },
        ]}
      >
        <View style={[styles.deleteButton, { backgroundColor: colors.error }]}>
          <IconSymbol
            ios_icon_name="trash.fill"
            android_material_icon_name="delete"
            size={24}
            color="#fff"
          />
          <Text style={styles.deleteText}>Delete</Text>
        </View>
      </Animated.View>
    );
  };

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
    <GestureHandlerRootView style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Recent Transactions</Text>
      {transactions.map((transaction, index) => {
        const category = defaultCategories.find(c => c.name === transaction.category);
        const isIncome = transaction.type === 'income';

        return (
          <Swipeable
            key={transaction.id || index}
            renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, transaction)}
            onSwipeableOpen={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
              handleDelete(transaction);
            }}
            overshootRight={false}
            friction={2}
            rightThreshold={40}
          >
            <View
              style={[styles.transactionCard, { backgroundColor: theme.colors.card }]}
            >
              <View style={styles.transactionContent}>
                <View style={styles.transactionLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: category?.color || colors.primary },
                    ]}
                  >
                    <IconSymbol
                      ios_icon_name={isIncome ? 'arrow.up.circle.fill' : 'arrow.down.circle.fill'}
                      android_material_icon_name={isIncome ? 'arrow-upward' : 'arrow-downward'}
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
                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      { color: isIncome ? colors.success : colors.error },
                    ]}
                  >
                    {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </Swipeable>
        );
      })}
      <Text style={[styles.swipeHint, { color: colors.textSecondary }]}>
        💡 Swipe left on any transaction to delete it
      </Text>
    </GestureHandlerRootView>
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  transactionRight: {
    marginLeft: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  deleteButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 12,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
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
  swipeHint: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});
