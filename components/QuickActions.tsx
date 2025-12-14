
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

export function QuickActions() {
  const theme = useTheme();

  const handleAddIncome = () => {
    Alert.alert(
      'Add Income',
      'This feature will allow you to add income transactions.',
      [{ text: 'OK' }]
    );
    console.log('Add income pressed');
  };

  const handleAddExpense = () => {
    Alert.alert(
      'Add Expense',
      'This feature will allow you to add expense transactions.',
      [{ text: 'OK' }]
    );
    console.log('Add expense pressed');
  };

  const handleSetBudget = () => {
    Alert.alert(
      'Set Budget',
      'This feature will allow you to set budgets for different categories.',
      [{ text: 'OK' }]
    );
    console.log('Set budget pressed');
  };

  const handleViewReports = () => {
    Alert.alert(
      'View Reports',
      'This feature will show detailed financial reports and analytics.',
      [{ text: 'OK' }]
    );
    console.log('View reports pressed');
  };

  const actions = [
    {
      title: 'Add Income',
      icon: 'arrow.down.circle.fill' as const,
      androidIcon: 'arrow-downward' as const,
      color: colors.success,
      onPress: handleAddIncome,
    },
    {
      title: 'Add Expense',
      icon: 'arrow.up.circle.fill' as const,
      androidIcon: 'arrow-upward' as const,
      color: colors.error,
      onPress: handleAddExpense,
    },
    {
      title: 'Set Budget',
      icon: 'chart.bar.fill' as const,
      androidIcon: 'bar-chart' as const,
      color: colors.primary,
      onPress: handleSetBudget,
    },
    {
      title: 'View Reports',
      icon: 'chart.pie.fill' as const,
      androidIcon: 'pie-chart' as const,
      color: colors.accent,
      onPress: handleViewReports,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.actionCard, { backgroundColor: theme.colors.card }]}
            onPress={action.onPress}
            activeOpacity={0.7}
            accessibilityLabel={action.title}
            accessibilityHint={`Tap to ${action.title.toLowerCase()}`}
          >
            <View style={[styles.iconContainer, { backgroundColor: action.color }]}>
              <IconSymbol
                ios_icon_name={action.icon}
                android_material_icon_name={action.androidIcon}
                size={24}
                color="#fff"
              />
            </View>
            <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
              {action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
