
import React from "react";
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { useBudgetData } from "@/hooks/useBudgetData";
import { BudgetOverview } from "@/components/BudgetOverview";
import { RecentTransactions } from "@/components/RecentTransactions";
import { QuickActions } from "@/components/QuickActions";

export default function HomeScreen() {
  const theme = useTheme();
  const { totalIncome, totalExpenses, budgets, transactions, isLoading, error } = useBudgetData();
  const balance = totalIncome - totalExpenses;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading your budget...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
        <IconSymbol 
          ios_icon_name="exclamationmark.triangle.fill" 
          android_material_icon_name="error" 
          size={48} 
          color={colors.error} 
        />
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>BudgetBuddy</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Your Financial Overview
          </Text>
        </View>

        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>${balance.toFixed(2)}</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <IconSymbol 
                ios_icon_name="arrow.up.circle.fill" 
                android_material_icon_name="arrow-upward" 
                size={20} 
                color="#fff" 
              />
              <Text style={styles.balanceItemLabel}>Income</Text>
              <Text style={styles.balanceItemAmount}>${totalIncome.toFixed(2)}</Text>
            </View>
            <View style={styles.balanceItem}>
              <IconSymbol 
                ios_icon_name="arrow.down.circle.fill" 
                android_material_icon_name="arrow-downward" 
                size={20} 
                color="#fff" 
              />
              <Text style={styles.balanceItemLabel}>Expenses</Text>
              <Text style={styles.balanceItemAmount}>${totalExpenses.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <QuickActions />

        {/* New Features Row */}
        <View style={styles.featuresRow}>
          <TouchableOpacity 
            style={[styles.featureCard, { backgroundColor: colors.accent }]}
            onPress={() => router.push('/budget-projection')}
            activeOpacity={0.8}
          >
            <IconSymbol 
              ios_icon_name="chart.line.uptrend.xyaxis" 
              android_material_icon_name="trending-up" 
              size={28} 
              color="#fff" 
            />
            <Text style={styles.featureCardTitle}>Budget Projection</Text>
            <Text style={styles.featureCardSubtitle}>See your future</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.featureCard, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/bank-connect')}
            activeOpacity={0.8}
          >
            <IconSymbol 
              ios_icon_name="building.columns.fill" 
              android_material_icon_name="account-balance" 
              size={28} 
              color="#fff" 
            />
            <Text style={styles.featureCardTitle}>Connect Bank</Text>
            <Text style={styles.featureCardSubtitle}>Coming soon</Text>
          </TouchableOpacity>
        </View>

        {/* Savings Calculator CTA */}
        <TouchableOpacity 
          style={[styles.savingsCard, { backgroundColor: colors.success }]}
          onPress={() => router.push('/savings-calculator')}
          activeOpacity={0.8}
          accessibilityLabel="Open Savings Calculator"
          accessibilityHint="Calculate how much you can save by reducing spending"
        >
          <View style={styles.savingsCardContent}>
            <IconSymbol 
              ios_icon_name="chart.line.uptrend.xyaxis" 
              android_material_icon_name="trending-up" 
              size={32} 
              color="#fff" 
            />
            <View style={styles.savingsCardText}>
              <Text style={styles.savingsCardTitle}>Savings Calculator</Text>
              <Text style={styles.savingsCardSubtitle}>
                See how much you can save by cutting back
              </Text>
            </View>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right" 
              size={24} 
              color="#fff" 
            />
          </View>
        </TouchableOpacity>

        {/* Budget Overview */}
        <BudgetOverview budgets={budgets} />

        {/* Recent Transactions */}
        <RecentTransactions transactions={transactions.slice(0, 5)} />

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
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
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  balanceCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  balanceItem: {
    alignItems: 'center',
  },
  balanceItemLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  balanceItemAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginTop: 2,
  },
  featuresRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  featureCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  featureCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginTop: 12,
    textAlign: 'center',
  },
  featureCardSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  savingsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  savingsCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savingsCardText: {
    flex: 1,
    marginLeft: 16,
  },
  savingsCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  savingsCardSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
