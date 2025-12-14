
import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { useBudgetData } from "@/hooks/useBudgetData";
import { defaultCategories } from "@/data/categories";
import { useSettings } from "@/contexts/SettingsContext";

const { width } = Dimensions.get('window');
const CHART_SIZE = Math.min(width - 80, 280);

export default function SpendingCharts() {
  const theme = useTheme();
  const { transactions, totalIncome, totalExpenses, isLoading } = useBudgetData();
  const { formatCurrency } = useSettings();

  // Calculate spending by category
  const categoryData = useMemo(() => {
    const expenseCategories = defaultCategories.filter(cat => cat.type === 'expense');
    
    const data = expenseCategories
      .map(category => {
        const spent = transactions
          .filter(t => t.type === 'expense' && t.category === category.name)
          .reduce((sum, t) => sum + t.amount, 0);
        
        return {
          name: category.name,
          amount: spent,
          color: category.color,
          percentage: 0,
        };
      })
      .filter(cat => cat.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    // Calculate percentages
    const total = data.reduce((sum, cat) => sum + cat.amount, 0);
    data.forEach(cat => {
      cat.percentage = total > 0 ? (cat.amount / total) * 100 : 0;
    });

    return data;
  }, [transactions]);

  // Calculate income vs expenses
  const incomeVsExpenses = useMemo(() => {
    return [
      { name: 'Income', amount: totalIncome, color: colors.success, percentage: 0 },
      { name: 'Expenses', amount: totalExpenses, color: colors.error, percentage: 0 },
    ];
  }, [totalIncome, totalExpenses]);

  // Calculate percentages for income vs expenses
  const totalFlow = totalIncome + totalExpenses;
  incomeVsExpenses.forEach(item => {
    item.percentage = totalFlow > 0 ? (item.amount / totalFlow) * 100 : 0;
  });

  // Calculate monthly trend (last 6 months)
  const monthlyTrend = useMemo(() => {
    const now = new Date();
    const months = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === date.getMonth() && 
               tDate.getFullYear() === date.getFullYear();
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      months.push({
        month: monthName,
        income,
        expenses,
        net: income - expenses,
      });
    }

    return months;
  }, [transactions]);

  const maxMonthlyAmount = Math.max(
    ...monthlyTrend.map(m => Math.max(m.income, m.expenses)),
    1
  );

  if (isLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Spending Charts",
            headerBackTitle: "Back",
            presentation: "card",
          }}
        />
        <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading your spending data...
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Spending Charts",
          headerBackTitle: "Back",
          presentation: "card",
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
              ios_icon_name="chart.bar.fill" 
              android_material_icon_name="bar-chart" 
              size={32} 
              color={colors.primary} 
            />
            <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
              Your Spending Overview
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Visualize where your money goes and track your financial trends.
            </Text>
          </View>

          {/* Income vs Expenses Doughnut */}
          <View style={[styles.chartCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
              Income vs Expenses
            </Text>
            
            <View style={styles.doughnutContainer}>
              <View style={styles.doughnutChart}>
                {incomeVsExpenses.map((item, index) => {
                  const startAngle = index === 0 ? 0 : 180;
                  const endAngle = index === 0 ? 180 : 360;
                  
                  return (
                    <View
                      key={index}
                      style={[
                        styles.doughnutSegment,
                        {
                          width: CHART_SIZE,
                          height: CHART_SIZE,
                          borderRadius: CHART_SIZE / 2,
                          backgroundColor: item.color,
                          transform: [
                            { rotate: `${startAngle}deg` }
                          ],
                        },
                      ]}
                    />
                  );
                })}
                <View style={[styles.doughnutCenter, { 
                  width: CHART_SIZE * 0.6, 
                  height: CHART_SIZE * 0.6,
                  borderRadius: (CHART_SIZE * 0.6) / 2,
                  backgroundColor: theme.colors.card,
                }]}>
                  <Text style={[styles.doughnutCenterText, { color: theme.colors.text }]}>
                    Balance
                  </Text>
                  <Text style={[styles.doughnutCenterAmount, { 
                    color: totalIncome - totalExpenses >= 0 ? colors.success : colors.error 
                  }]}>
                    {formatCurrency(totalIncome - totalExpenses)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.legendContainer}>
              {incomeVsExpenses.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <View style={styles.legendText}>
                    <Text style={[styles.legendLabel, { color: theme.colors.text }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.legendAmount, { color: colors.textSecondary }]}>
                      {formatCurrency(item.amount)} ({item.percentage.toFixed(0)}%)
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Category Breakdown */}
          {categoryData.length > 0 && (
            <View style={[styles.chartCard, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
                Spending by Category
              </Text>
              
              <View style={styles.categoryList}>
                {categoryData.map((category, index) => (
                  <View key={index} style={styles.categoryItem}>
                    <View style={styles.categoryHeader}>
                      <View style={styles.categoryInfo}>
                        <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
                        <Text style={[styles.categoryName, { color: theme.colors.text }]}>
                          {category.name}
                        </Text>
                      </View>
                      <Text style={[styles.categoryAmount, { color: theme.colors.text }]}>
                        {formatCurrency(category.amount)}
                      </Text>
                    </View>
                    
                    <View style={styles.categoryBarContainer}>
                      <View 
                        style={[
                          styles.categoryBar,
                          { 
                            width: `${category.percentage}%`,
                            backgroundColor: category.color,
                          }
                        ]} 
                      />
                    </View>
                    
                    <Text style={[styles.categoryPercentage, { color: colors.textSecondary }]}>
                      {category.percentage.toFixed(1)}% of total spending
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Monthly Trend */}
          <View style={[styles.chartCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
              6-Month Trend
            </Text>
            
            <View style={styles.trendChart}>
              {monthlyTrend.map((month, index) => (
                <View key={index} style={styles.trendColumn}>
                  <View style={styles.trendBars}>
                    <View 
                      style={[
                        styles.trendBar,
                        styles.trendBarIncome,
                        { 
                          height: `${(month.income / maxMonthlyAmount) * 100}%`,
                          backgroundColor: colors.success,
                        }
                      ]} 
                    />
                    <View 
                      style={[
                        styles.trendBar,
                        styles.trendBarExpense,
                        { 
                          height: `${(month.expenses / maxMonthlyAmount) * 100}%`,
                          backgroundColor: colors.error,
                        }
                      ]} 
                    />
                  </View>
                  <Text style={[styles.trendMonth, { color: colors.textSecondary }]}>
                    {month.month}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.trendLegend}>
              <View style={styles.trendLegendItem}>
                <View style={[styles.trendLegendDot, { backgroundColor: colors.success }]} />
                <Text style={[styles.trendLegendText, { color: theme.colors.text }]}>Income</Text>
              </View>
              <View style={styles.trendLegendItem}>
                <View style={[styles.trendLegendDot, { backgroundColor: colors.error }]} />
                <Text style={[styles.trendLegendText, { color: theme.colors.text }]}>Expenses</Text>
              </View>
            </View>
          </View>

          {/* Summary Stats */}
          <View style={[styles.statsCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.statsTitle, { color: theme.colors.text }]}>
              Quick Stats
            </Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <IconSymbol 
                  ios_icon_name="arrow.up.circle.fill" 
                  android_material_icon_name="arrow-upward" 
                  size={24} 
                  color={colors.success} 
                />
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Total Income
                </Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {formatCurrency(totalIncome)}
                </Text>
              </View>

              <View style={styles.statItem}>
                <IconSymbol 
                  ios_icon_name="arrow.down.circle.fill" 
                  android_material_icon_name="arrow-downward" 
                  size={24} 
                  color={colors.error} 
                />
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Total Expenses
                </Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {formatCurrency(totalExpenses)}
                </Text>
              </View>

              <View style={styles.statItem}>
                <IconSymbol 
                  ios_icon_name="chart.line.uptrend.xyaxis" 
                  android_material_icon_name="trending-up" 
                  size={24} 
                  color={colors.primary} 
                />
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Savings Rate
                </Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0}%
                </Text>
              </View>

              <View style={styles.statItem}>
                <IconSymbol 
                  ios_icon_name="list.bullet" 
                  android_material_icon_name="list" 
                  size={24} 
                  color={colors.accent} 
                />
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Transactions
                </Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {transactions.length}
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom padding */}
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  chartCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  doughnutContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  doughnutChart: {
    width: CHART_SIZE,
    height: CHART_SIZE,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doughnutSegment: {
    position: 'absolute',
  },
  doughnutCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  doughnutCenterText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  doughnutCenterAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  legendContainer: {
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendText: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  legendAmount: {
    fontSize: 13,
  },
  categoryList: {
    gap: 20,
  },
  categoryItem: {
    gap: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
  },
  categoryAmount: {
    fontSize: 15,
    fontWeight: '700',
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
  categoryPercentage: {
    fontSize: 12,
  },
  trendChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 180,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  trendColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  trendBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 150,
  },
  trendBar: {
    width: 12,
    borderRadius: 4,
    minHeight: 4,
  },
  trendBarIncome: {
  },
  trendBarExpense: {
  },
  trendMonth: {
    fontSize: 11,
    fontWeight: '500',
  },
  trendLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 8,
  },
  trendLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trendLegendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  trendLegendText: {
    fontSize: 13,
    fontWeight: '500',
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    width: '47%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});
