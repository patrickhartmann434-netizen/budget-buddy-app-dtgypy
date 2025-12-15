
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Platform, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { useBudgetData } from '@/hooks/useBudgetData';
import { defaultCategories } from '@/data/categories';
import * as Haptics from 'expo-haptics';

export default function SetBudgetModal() {
  const theme = useTheme();
  const { updateBudget, budgets } = useBudgetData();
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Food & Dining');
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const expenseCategories = defaultCategories.filter(cat => cat.type === 'expense');

  const backgroundColor = theme.dark ? '#1C1C1E' : '#F2F2F7';
  const cardColor = theme.dark ? '#2C2C2E' : '#FFFFFF';
  const textColor = theme.dark ? '#FFFFFF' : '#000000';

  const periods = [
    { value: 'weekly' as const, label: 'Weekly' },
    { value: 'monthly' as const, label: 'Monthly' },
    { value: 'yearly' as const, label: 'Yearly' },
  ];

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid budget amount greater than 0');
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      const existingBudget = budgets.find(b => b.category === selectedCategory);
      
      await updateBudget({
        id: existingBudget?.id || Date.now().toString(),
        category: selectedCategory,
        limit: parseFloat(amount),
        spent: existingBudget?.spent || 0,
        period: selectedPeriod,
      });

      console.log('Budget set successfully:', { category: selectedCategory, amount, period: selectedPeriod });
      
      Alert.alert(
        'Success',
        `Budget for ${selectedCategory} set to $${amount} per ${selectedPeriod.replace('ly', '')}!`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error setting budget:', error);
      Alert.alert('Error', 'Failed to set budget. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.closeButton}
            accessibilityLabel="Close"
          >
            <IconSymbol 
              ios_icon_name="xmark.circle.fill" 
              android_material_icon_name="close" 
              size={28} 
              color={textColor} 
            />
          </TouchableOpacity>
          <Text style={[styles.title, { color: textColor }]}>Set Budget</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: textColor }]}>Budget Amount</Text>
              <View style={[styles.amountInputContainer, { backgroundColor: cardColor }]}>
                <Text style={[styles.currencySymbol, { color: textColor }]}>$</Text>
                <TextInput
                  style={[styles.amountInput, { color: textColor }]}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="decimal-pad"
                  autoFocus
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: textColor }]}>Period</Text>
              <View style={styles.periodsRow}>
                {periods.map((period, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.periodCard,
                      { backgroundColor: cardColor },
                      selectedPeriod === period.value && { 
                        backgroundColor: colors.primary,
                        borderWidth: 2,
                        borderColor: colors.primary,
                      }
                    ]}
                    onPress={() => {
                      setSelectedPeriod(period.value);
                      if (Platform.OS !== 'web') {
                        Haptics.selectionAsync();
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <Text 
                      style={[
                        styles.periodLabel, 
                        { color: selectedPeriod === period.value ? '#fff' : textColor }
                      ]}
                    >
                      {period.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: textColor }]}>Category</Text>
              <View style={styles.categoriesGrid}>
                {expenseCategories.map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.categoryCard,
                      { backgroundColor: cardColor },
                      selectedCategory === category.name && { 
                        backgroundColor: colors.primary,
                        borderWidth: 2,
                        borderColor: colors.primary,
                      }
                    ]}
                    onPress={() => {
                      setSelectedCategory(category.name);
                      if (Platform.OS !== 'web') {
                        Haptics.selectionAsync();
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <IconSymbol 
                      ios_icon_name="chart.bar.fill" 
                      android_material_icon_name={category.icon} 
                      size={24} 
                      color={selectedCategory === category.name ? '#fff' : category.color} 
                    />
                    <Text 
                      style={[
                        styles.categoryName, 
                        { color: selectedCategory === category.name ? '#fff' : textColor }
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: colors.primary },
                isSubmitting && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Setting...' : 'Set Budget'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '700',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
  },
  periodsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  periodCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  periodLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  submitButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});
