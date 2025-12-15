
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

export default function BankConnect() {
  const theme = useTheme();
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const banks = [
    { id: '1', name: 'Chase Bank', icon: 'building-columns', color: '#0066CC' },
    { id: '2', name: 'Bank of America', icon: 'building-columns', color: '#E31837' },
    { id: '3', name: 'Wells Fargo', icon: 'building-columns', color: '#D71E28' },
    { id: '4', name: 'Citibank', icon: 'building-columns', color: '#056DAE' },
    { id: '5', name: 'Capital One', icon: 'building-columns', color: '#004879' },
    { id: '6', name: 'US Bank', icon: 'building-columns', color: '#0C2074' },
  ];

  const handleConnect = () => {
    Alert.alert(
      'Bank Connection Coming Soon',
      'Bank account connectivity requires backend infrastructure with Plaid or similar services. This feature will be available in a future update.\n\nFor now, you can manually add your income and expenses using the Quick Actions on the home screen.',
      [
        {
          text: 'Learn More',
          onPress: () => {
            console.log('User wants to learn more about bank connectivity');
          },
        },
        {
          text: 'OK',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Connect Bank',
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
              ios_icon_name="building.columns.fill"
              android_material_icon_name="account-balance"
              size={48}
              color={colors.primary}
            />
            <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
              Connect Your Bank
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Automatically import transactions from your bank account for easier budgeting.
            </Text>
          </View>

          {/* Coming Soon Notice */}
          <View style={[styles.noticeCard, { backgroundColor: colors.accent + '20', borderColor: colors.accent }]}>
            <IconSymbol
              ios_icon_name="info.circle.fill"
              android_material_icon_name="info"
              size={24}
              color={colors.accent}
            />
            <View style={styles.noticeContent}>
              <Text style={[styles.noticeTitle, { color: theme.colors.text }]}>
                Feature Coming Soon
              </Text>
              <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
                Bank connectivity requires secure backend infrastructure with services like Plaid. 
                This feature is currently in development and will be available in a future update.
              </Text>
            </View>
          </View>

          {/* How It Will Work */}
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              How It Will Work
            </Text>
            <View style={styles.stepsList}>
              <View style={styles.stepItem}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
                    Select Your Bank
                  </Text>
                  <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                    Choose from thousands of supported financial institutions
                  </Text>
                </View>
              </View>

              <View style={styles.stepItem}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
                    Secure Login
                  </Text>
                  <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                    Safely connect using bank-grade encryption
                  </Text>
                </View>
              </View>

              <View style={styles.stepItem}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
                    Auto-Import
                  </Text>
                  <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                    Transactions automatically sync to your budget
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Security Features */}
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Security & Privacy
            </Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <IconSymbol
                  ios_icon_name="lock.shield.fill"
                  android_material_icon_name="security"
                  size={24}
                  color={colors.success}
                />
                <Text style={[styles.featureText, { color: theme.colors.text }]}>
                  Bank-level 256-bit encryption
                </Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol
                  ios_icon_name="eye.slash.fill"
                  android_material_icon_name="visibility-off"
                  size={24}
                  color={colors.success}
                />
                <Text style={[styles.featureText, { color: theme.colors.text }]}>
                  Read-only access to your accounts
                </Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol
                  ios_icon_name="checkmark.shield.fill"
                  android_material_icon_name="verified-user"
                  size={24}
                  color={colors.success}
                />
                <Text style={[styles.featureText, { color: theme.colors.text }]}>
                  Your credentials are never stored
                </Text>
              </View>
              <View style={styles.featureItem}>
                <IconSymbol
                  ios_icon_name="hand.raised.fill"
                  android_material_icon_name="block"
                  size={24}
                  color={colors.success}
                />
                <Text style={[styles.featureText, { color: theme.colors.text }]}>
                  No ability to move money
                </Text>
              </View>
            </View>
          </View>

          {/* Popular Banks Preview */}
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Supported Banks (Preview)
            </Text>
            <View style={styles.banksList}>
              {banks.map((bank, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.bankCard,
                    { backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' },
                    selectedBank === bank.id && { borderColor: colors.primary, borderWidth: 2 },
                  ]}
                  onPress={() => setSelectedBank(bank.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.bankIcon, { backgroundColor: bank.color }]}>
                    <IconSymbol
                      ios_icon_name="building.columns.fill"
                      android_material_icon_name="account-balance"
                      size={24}
                      color="#fff"
                    />
                  </View>
                  <Text style={[styles.bankName, { color: theme.colors.text }]}>
                    {bank.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* CTA Button */}
          <TouchableOpacity
            style={[styles.connectButton, { backgroundColor: colors.primary }]}
            onPress={handleConnect}
            activeOpacity={0.8}
          >
            <IconSymbol
              ios_icon_name="link.circle.fill"
              android_material_icon_name="link"
              size={24}
              color="#fff"
            />
            <Text style={styles.connectButtonText}>Learn More</Text>
          </TouchableOpacity>

          {/* Manual Entry CTA */}
          <TouchableOpacity
            style={[styles.manualButton, { backgroundColor: theme.colors.card }]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={[styles.manualButtonText, { color: theme.colors.text }]}>
              Continue with Manual Entry
            </Text>
          </TouchableOpacity>

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
    padding: 24,
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  noticeCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    gap: 12,
  },
  noticeContent: {
    flex: 1,
    gap: 4,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  noticeText: {
    fontSize: 13,
    lineHeight: 18,
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
  stepsList: {
    gap: 20,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  stepContent: {
    flex: 1,
    gap: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  stepText: {
    fontSize: 14,
    lineHeight: 20,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    flex: 1,
  },
  banksList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bankCard: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  bankIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  connectButton: {
    flexDirection: 'row',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  connectButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  manualButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  manualButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
