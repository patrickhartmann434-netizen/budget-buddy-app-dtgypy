
import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Animated } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { useBudgetData } from "@/hooks/useBudgetData";
import { defaultCategories } from "@/data/categories";

interface CategoryReduction {
  categoryId: string;
  categoryName: string;
  currentSpending: number;
  reductionPercentage: number;
  color: string;
}

export default function SavingsCalculator() {
  const theme = useTheme();
  const { transactions, isLoading } = useBudgetData();
  
  // Calculate spending by category with memoization
  const categorySpending = useMemo(() => {
    return defaultCategories
      .filter(cat => cat.type === 'expense')
      .map(category => {
        const spent = transactions
          .filter(t => t.type === 'expense' && t.category === category.name)
          .reduce((sum, t) => sum + t.amount, 0);
        return {
          categoryId: category.id,
          categoryName: category.name,
          currentSpending: spent,
          reductionPercentage: 0,
          color: category.color,
        };
      })
      .filter(cat => cat.currentSpending > 0)
      .sort((a, b) => b.currentSpending - a.currentSpending);
  }, [transactions]);

  const [reductions, setReductions] = useState<CategoryReduction[]>(categorySpending);

  // Update reductions when categorySpending changes
  React.useEffect(() => {
    setReductions(categorySpending);
  }, [categorySpending]);

  const updateReduction = (categoryId: string, percentage: number) => {
    setReductions(prev =>
      prev.map(cat =>
        cat.categoryId === categoryId
          ? { ...cat, reductionPercentage: Math.min(100, Math.max(0, percentage)) }
          : cat
      )
    );
  };

  const totalCurrentSpending = reductions.reduce((sum, cat) => sum + cat.currentSpending, 0);
  const totalSavings = reductions.reduce(
    (sum, cat) => sum + (cat.currentSpending * cat.reductionPercentage) / 100,
    0
  );
  const newMonthlySpending = totalCurrentSpending - totalSavings;
  const annualSavings = totalSavings * 12;

  if (isLoading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: "Savings Calculator",
            headerBackTitle: "Back",
            presentation: "card",
          }}
        />
        <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Calculating your savings potential...
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Savings Calculator",
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
              ios_icon_name="lightbulb.fill" 
              android_material_icon_name="lightbulb" 
              size={32} 
              color={colors.accent} 
            />
            <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
              Discover Your Savings Potential
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Adjust the sliders below to see how much you could save by reducing spending in different categories.
            </Text>
          </View>

          {/* Summary Cards */}
          <View style={styles.summaryContainer}>
            <View style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
              <IconSymbol 
                ios_icon_name="dollarsign.circle.fill" 
                android_material_icon_name="attach-money" 
                size={28} 
                color="#fff" 
              />
              <Text style={styles.summaryLabel}>Monthly Savings</Text>
              <Text style={styles.summaryAmount}>${totalSavings.toFixed(2)}</Text>
            </View>

            <View style={[styles.summaryCard, { backgroundColor: colors.success }]}>
              <IconSymbol 
                ios_icon_name="calendar" 
                android_material_icon_name="calendar-today" 
                size={28} 
                color="#fff" 
              />
              <Text style={styles.summaryLabel}>Annual Savings</Text>
              <Text style={styles.summaryAmount}>${annualSavings.toFixed(2)}</Text>
            </View>
          </View>

          <View style={[styles.spendingCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.spendingRow}>
              <Text style={[styles.spendingLabel, { color: colors.textSecondary }]}>
                Current Monthly Spending
              </Text>
              <Text style={[styles.spendingAmount, { color: theme.colors.text }]}>
                ${totalCurrentSpending.toFixed(2)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.spendingRow}>
              <Text style={[styles.spendingLabel, { color: colors.textSecondary }]}>
                New Monthly Spending
              </Text>
              <Text style={[styles.spendingAmount, { color: colors.success, fontWeight: '700' }]}>
                ${newMonthlySpending.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Category Reductions */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Adjust Your Spending
          </Text>

          {reductions.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: theme.colors.card }]}>
              <IconSymbol 
                ios_icon_name="exclamationmark.circle" 
                android_material_icon_name="info" 
                size={48} 
                color={colors.textSecondary} 
              />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No expense data available yet.
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                Add some transactions to see your savings potential!
              </Text>
            </View>
          ) : (
            reductions.map((category, index) => (
              <View 
                key={category.categoryId}
                style={[styles.categoryCard, { backgroundColor: theme.colors.card }]}
              >
                <View style={styles.categoryHeader}>
                  <View style={styles.categoryInfo}>
                    <View 
                      style={[styles.categoryDot, { backgroundColor: category.color }]} 
                    />
                    <View>
                      <Text style={[styles.categoryName, { color: theme.colors.text }]}>
                        {category.categoryName}
                      </Text>
                      <Text style={[styles.categorySpending, { color: colors.textSecondary }]}>
                        Current: ${category.currentSpending.toFixed(2)}/month
                      </Text>
                    </View>
                  </View>
                  <View style={styles.savingsInfo}>
                    <Text style={[styles.savingsAmount, { color: colors.success }]}>
                      -${((category.currentSpending * category.reductionPercentage) / 100).toFixed(2)}
                    </Text>
                  </View>
                </View>

                <View style={styles.sliderContainer}>
                  <View style={styles.sliderLabels}>
                    <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>
                      Reduce by {category.reductionPercentage}%
                    </Text>
                  </View>
                  
                  <View style={styles.percentageButtons}>
                    {[0, 10, 25, 50, 75, 100].map((percent) => (
                      <TouchableOpacity
                        key={`${category.categoryId}-${percent}`}
                        style={[
                          styles.percentButton,
                          { borderColor: theme.dark ? colors.border : '#E0E0E0' },
                          category.reductionPercentage === percent && {
                            backgroundColor: category.color,
                            borderColor: category.color,
                          },
                        ]}
                        onPress={() => updateReduction(category.categoryId, percent)}
                        activeOpacity={0.7}
                        accessibilityLabel={`Reduce ${category.categoryName} by ${percent} percent`}
                      >
                        <Text
                          style={[
                            styles.percentButtonText,
                            category.reductionPercentage === percent
                              ? { color: '#fff', fontWeight: '700' }
                              : { color: theme.colors.text },
                          ]}
                        >
                          {percent}%
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            ))
          )}

          {/* Projection Card */}
          {totalSavings > 0 && (
            <View style={[styles.projectionCard, { backgroundColor: colors.accent }]}>
              <IconSymbol 
                ios_icon_name="star.fill" 
                android_material_icon_name="star" 
                size={32} 
                color="#fff" 
              />
              <View style={styles.projectionText}>
                <Text style={styles.projectionTitle}>💰 Savings Projection</Text>
                <Text style={styles.projectionSubtitle}>
                  By making these changes, you could save ${totalSavings.toFixed(2)} per month.
                </Text>
                <Text style={styles.projectionSubtitle}>
                  That&apos;s ${annualSavings.toFixed(2)} per year!
                </Text>
                {annualSavings > 1000 && (
                  <Text style={[styles.projectionSubtitle, { fontWeight: '700', marginTop: 8 }]}>
                    🎉 You could save over $1,000 annually!
                  </Text>
                )}
              </View>
            </View>
          )}

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
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  spendingCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  spendingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  spendingLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  spendingAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  categoryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  categorySpending: {
    fontSize: 13,
  },
  savingsInfo: {
    alignItems: 'flex-end',
  },
  savingsAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  sliderContainer: {
    marginTop: 8,
  },
  sliderLabels: {
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  percentageButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  percentButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 60,
    alignItems: 'center',
  },
  percentButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  projectionCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  projectionText: {
    flex: 1,
    marginLeft: 16,
  },
  projectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  projectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 20,
  },
  emptyCard: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});
