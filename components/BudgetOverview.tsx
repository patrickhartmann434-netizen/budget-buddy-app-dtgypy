
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Budget } from '@/types/budget';
import { colors } from '@/styles/commonStyles';
import { defaultCategories } from '@/data/categories';

interface BudgetOverviewProps {
  budgets: Budget[];
}

export function BudgetOverview({ budgets }: BudgetOverviewProps) {
  const theme = useTheme();

  if (budgets.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Budget Overview</Text>
      {budgets.map((budget, index) => {
        const category = defaultCategories.find(c => c.name === budget.category);
        const percentage = (budget.spent / budget.limit) * 100;
        const isOverBudget = percentage > 100;
        const isWarning = percentage > 80 && percentage <= 100;

        return (
          <View key={index} style={[styles.budgetCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.budgetHeader}>
              <View style={styles.budgetInfo}>
                <View style={[styles.categoryDot, { backgroundColor: category?.color || colors.primary }]} />
                <Text style={[styles.categoryName, { color: theme.colors.text }]}>
                  {budget.category}
                </Text>
              </View>
              <Text style={[styles.budgetAmount, { color: theme.colors.text }]}>
                ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarBackground, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: isOverBudget
                        ? colors.error
                        : isWarning
                        ? colors.warning
                        : colors.success,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.percentageText,
                  {
                    color: isOverBudget
                      ? colors.error
                      : isWarning
                      ? colors.warning
                      : colors.textSecondary,
                  },
                ]}
              >
                {percentage.toFixed(0)}%
              </Text>
            </View>

            {isOverBudget && (
              <Text style={[styles.warningText, { color: colors.error }]}>
                Over budget by ${(budget.spent - budget.limit).toFixed(2)}
              </Text>
            )}
          </View>
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
  budgetCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  budgetAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  warningText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },
});
