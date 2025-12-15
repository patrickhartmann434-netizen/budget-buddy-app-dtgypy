
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useBudgetData } from '@/hooks/useBudgetData';
import { useSettings } from '@/contexts/SettingsContext';

const { width } = Dimensions.get('window');

type ProjectionPeriod = '1month' | '3months' | '6months' | '1year';

export default function BudgetProjection() {
  const theme = useTheme();
  const { transactions, totalIncome, totalExpenses, budgets } = useBudgetData();
  const { formatCurrency } = useSettings();
  const [selectedPeriod, setSelectedPeriod] = useState<ProjectionPeriod>('3months');

  const periods = [
    { value: '1month' as const, label: '1 Month', months: 1 },
    { value: '3months' as const, label: '3 Months', months: 3 },
    { value: '6months' as const, label: '6 Months', months: 6 },
    { value: '1year' as const, label: '1 Year', months: 12 },
  ];

  // Calculate average monthly income and expenses
  const monthlyAverages = useMemo(() => {
    const now = new Date();
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    
    const recentTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= threeMonthsAgo;
    });

    const monthsCount = 3;
    const avgIncome = recentTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0) / monthsCount;
    
    const avgExpenses = recentTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0) / monthsCount;

    return { avgIncome, avgExpenses };
  }, [transactions]);

  // Calculate projections
  const projection = useMemo(() => {
    const period = periods.find(p => p.value === selectedPeriod);
    if (!period) return null;

    const currentBalance = totalIncome - totalExpenses;
    const monthlyNet = monthlyAverages.avgIncome - monthlyAverages.avgExpenses;
    const projectedBalance = currentBalance + (monthlyNet * period.months);
    
    const totalProjectedIncome = monthlyAverages.avgIncome * period.months;
    const totalProjectedExpenses = monthlyAverages.avgExpenses * period.months;

    // Calculate category projections
    const categoryProjections = budgets.map(budget => {
      const categoryTransactions = transactions.filter(
        t => t.type === 'expense' && t.category === budget.category
      );
      
      const avgMonthlySpending = categoryTransactions.length > 0
        ? categoryTransactions.reduce((sum, t) => sum + t.amount, 0) / 3
        : 0;
      
      const projectedSpending = avgMonthlySpending * period.months;
      const budgetLimit = budget.limit * period.months;
      const overBudget = projectedSpending > budgetLimit;

      return {
        category: budget.category,
        avgMonthlySpending,
        projectedSpending,
        budgetLimit,
        overBudget,
        difference: budgetLimit - projectedSpending,
      };
    });

    return {
      currentBalance,
      projectedBalance,
      monthlyNet,
      totalProjectedIncome,
      totalProjectedExpenses,
      categoryProjections,
      isPositive: projectedBalance > currentBalance,
    };
  }, [selectedPeriod, monthlyAverages, totalIncome, totalExpenses, budgets, transactions]);

  // Generate monthly breakdown
  const monthlyBreakdown = useMemo(() => {
    if (!projection) return [];
    
    const period = periods.find(p => p.value === selectedPeriod);
    if (!period) return [];

    const breakdown = [];
    let runningBalance = projection.currentBalance;

    for (let i = 1; i <= period.months; i++) {
      runningBalance += projection.monthlyNet;
      breakdown.push({
        month: i,
        balance: runningBalance,
        income: monthlyAverages.avgIncome,
        expenses: monthlyAverages.avgExpenses,
      });
    }

    return breakdown;
  }, [projection, selectedPeriod, monthlyAverages]);

  if (!projection) return null;

  const maxBalance = Math.max(
    projection.currentBalance,
    ...monthlyBreakdown.map(m => m.balance)
  );
  const minBalance = Math.min(
    projection.currentBalance,
    ...monthlyBreakdown.map(m => m.balance)
  );
  const balanceRange = maxBalance - minBalance || 1;

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Budget Projection',
          headerBackTitle: 'Back',
          presentation: 'card',
        }}
      />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Info */}
          <View style={[styles.infoCard, { backgroundColor: theme.colors.card }]}>
            <IconSymbol
              ios_icon_name="chart.line.uptrend.xyaxis"
              android_material_icon_name="trending-up"
              size={32}
              color={colors.primary}
            />
            <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
              Budget Forecast
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Based on your spending habits from the last 3 months, here&apos;s where your budget is heading.
            </Text>
          </View>

          {/* Period Selector */}
          <View style={styles.periodSelector}>
            {periods.map((period, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.periodButton,
                  { backgroundColor: theme.colors.card },
                  selectedPeriod === period.value && {
                    backgroundColor: colors.primary,
                  },
                ]}
                onPress={() => setSelectedPeriod(period.value)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    { color: theme.colors.text },
                    selectedPeriod === period.value && { color: '#fff' },
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Projection Summary */}
          <View style={[styles.summaryCard, { 
            backgroundColor: projection.isPositive ? colors.success : colors.error 
          }]}>
            <Text style={styles.summaryLabel}>Projected Balance</Text>
            <Text style={styles.summaryAmount}>
              {formatCurrency(projection.projectedBalance)}
            </Text>
            <View style={styles.summaryChange}>
              <IconSymbol
                ios_icon_name={projection.isPositive ? 'arrow.up.circle.fill' : 'arrow.down.circle.fill'}
                android_material_icon_name={projection.isPositive ? 'arrow-upward' : 'arrow-downward'}
                size={20}
                color="#fff"
              />
              <Text style={styles.summaryChangeText}>
                {projection.isPositive ? '+' : ''}{formatCurrency(projection.projectedBalance - projection.currentBalance)}
              </Text>
            </View>
          </View>

          {/* Monthly Averages */}
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Monthly Averages
            </Text>
            <View style={styles.averagesGrid}>
              <View style={styles.averageItem}>
                <IconSymbol
                  ios_icon_name="arrow.up.circle.fill"
                  android_material_icon_name="arrow-upward"
                  size={24}
                  color={colors.success}
                />
                <Text style={[styles.averageLabel, { color: colors.textSecondary }]}>
                  Income
                </Text>
                <Text style={[styles.averageValue, { color: theme.colors.text }]}>
                  {formatCurrency(monthlyAverages.avgIncome)}
                </Text>
              </View>
              <View style={styles.averageItem}>
                <IconSymbol
                  ios_icon_name="arrow.down.circle.fill"
                  android_material_icon_name="arrow-downward"
                  size={24}
                  color={colors.error}
                />
                <Text style={[styles.averageLabel, { color: colors.textSecondary }]}>
                  Expenses
                </Text>
                <Text style={[styles.averageValue, { color: theme.colors.text }]}>
                  {formatCurrency(monthlyAverages.avgExpenses)}
                </Text>
              </View>
              <View style={styles.averageItem}>
                <IconSymbol
                  ios_icon_name="chart.bar.fill"
                  android_material_icon_name="bar-chart"
                  size={24}
                  color={colors.primary}
                />
                <Text style={[styles.averageLabel, { color: colors.textSecondary }]}>
                  Net
                </Text>
                <Text style={[styles.averageValue, { 
                  color: projection.monthlyNet >= 0 ? colors.success : colors.error 
                }]}>
                  {formatCurrency(projection.monthlyNet)}
                </Text>
              </View>
            </View>
          </View>

          {/* Balance Trend Chart */}
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Balance Trend
            </Text>
            <View style={styles.trendChart}>
              <View style={styles.trendLine}>
                {/* Current balance marker */}
                <View style={[styles.trendPoint, {
                  left: 0,
                  bottom: `${((projection.currentBalance - minBalance) / balanceRange) * 100}%`,
                  backgroundColor: colors.accent,
                }]}>
                  <Text style={styles.trendPointLabel}>Now</Text>
                </View>
                
                {/* Monthly points */}
                {monthlyBreakdown.map((month, index) => {
                  const leftPosition = ((index + 1) / (monthlyBreakdown.length + 1)) * 100;
                  const bottomPosition = ((month.balance - minBalance) / balanceRange) * 100;
                  
                  return (
                    <View
                      key={index}
                      style={[styles.trendPoint, {
                        left: `${leftPosition}%`,
                        bottom: `${bottomPosition}%`,
                        backgroundColor: month.balance >= projection.currentBalance ? colors.success : colors.error,
                      }]}
                    >
                      <Text style={styles.trendPointLabel}>M{month.month}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
            <View style={styles.trendLabels}>
              <Text style={[styles.trendLabel, { color: colors.textSecondary }]}>
                {formatCurrency(minBalance)}
              </Text>
              <Text style={[styles.trendLabel, { color: colors.textSecondary }]}>
                {formatCurrency(maxBalance)}
              </Text>
            </View>
          </View>

          {/* Category Projections */}
          {projection.categoryProjections.length > 0 && (
            <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Category Projections
              </Text>
              <View style={styles.categoryList}>
                {projection.categoryProjections.map((cat, index) => (
                  <View key={index} style={styles.categoryItem}>
                    <View style={styles.categoryHeader}>
                      <Text style={[styles.categoryName, { color: theme.colors.text }]}>
                        {cat.category}
                      </Text>
                      {cat.overBudget && (
                        <View style={[styles.warningBadge, { backgroundColor: colors.error }]}>
                          <IconSymbol
                            ios_icon_name="exclamationmark.triangle.fill"
                            android_material_icon_name="warning"
                            size={12}
                            color="#fff"
                          />
                          <Text style={styles.warningText}>Over Budget</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.categoryDetails}>
                      <Text style={[styles.categoryDetailText, { color: colors.textSecondary }]}>
                        Projected: {formatCurrency(cat.projectedSpending)}
                      </Text>
                      <Text style={[styles.categoryDetailText, { color: colors.textSecondary }]}>
                        Budget: {formatCurrency(cat.budgetLimit)}
                      </Text>
                    </View>
                    <View style={styles.categoryBarContainer}>
                      <View
                        style={[
                          styles.categoryBar,
                          {
                            width: `${Math.min((cat.projectedSpending / cat.budgetLimit) * 100, 100)}%`,
                            backgroundColor: cat.overBudget ? colors.error : colors.success,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.categoryDifference, { 
                      color: cat.overBudget ? colors.error : colors.success 
                    }]}>
                      {cat.overBudget ? 'Over by ' : 'Under by '}
                      {formatCurrency(Math.abs(cat.difference))}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Recommendations */}
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <View style={styles.recommendationHeader}>
              <IconSymbol
                ios_icon_name="lightbulb.fill"
                android_material_icon_name="lightbulb"
                size={24}
                color={colors.accent}
              />
              <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                Recommendations
              </Text>
            </View>
            <View style={styles.recommendationList}>
              {projection.monthlyNet < 0 && (
                <View style={styles.recommendationItem}>
                  <IconSymbol
                    ios_icon_name="exclamationmark.circle.fill"
                    android_material_icon_name="error"
                    size={20}
                    color={colors.error}
                  />
                  <Text style={[styles.recommendationText, { color: theme.colors.text }]}>
                    You&apos;re spending more than you earn. Consider reducing expenses by{' '}
                    {formatCurrency(Math.abs(projection.monthlyNet))} per month.
                  </Text>
                </View>
              )}
              {projection.categoryProjections.some(c => c.overBudget) && (
                <View style={styles.recommendationItem}>
                  <IconSymbol
                    ios_icon_name="chart.bar.fill"
                    android_material_icon_name="bar-chart"
                    size={20}
                    color={colors.accent}
                  />
                  <Text style={[styles.recommendationText, { color: theme.colors.text }]}>
                    Some categories are projected to exceed their budgets. Review and adjust your spending.
                  </Text>
                </View>
              )}
              {projection.monthlyNet > 0 && (
                <View style={styles.recommendationItem}>
                  <IconSymbol
                    ios_icon_name="checkmark.circle.fill"
                    android_material_icon_name="check-circle"
                    size={20}
                    color={colors.success}
                  />
                  <Text style={[styles.recommendationText, { color: theme.colors.text }]}>
                    Great job! You&apos;re saving {formatCurrency(projection.monthlyNet)} per month on average.
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  infoCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  periodSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  summaryChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryChangeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  averagesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  averageItem: {
    alignItems: 'center',
    gap: 8,
  },
  averageLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  averageValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  trendChart: {
    height: 200,
    marginBottom: 12,
    position: 'relative',
  },
  trendLine: {
    flex: 1,
    position: 'relative',
  },
  trendPoint: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    transform: [{ translateX: -6 }, { translateY: 6 }],
  },
  trendPointLabel: {
    position: 'absolute',
    top: -20,
    left: -10,
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  trendLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trendLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  categoryList: {
    gap: 16,
  },
  categoryItem: {
    gap: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  warningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  warningText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  categoryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryDetailText: {
    fontSize: 13,
  },
  categoryBarContainer: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryBar: {
    height: '100%',
    borderRadius: 4,
  },
  categoryDifference: {
    fontSize: 12,
    fontWeight: '600',
  },
  recommendationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  recommendationList: {
    gap: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
