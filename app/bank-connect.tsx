
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

export default function BankConnect() {
  const theme = useTheme();
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const banks = [
    { id: '1', name: 'Chase Bank', icon: 'building-columns', color: '#0066CC' },
    { id: '2', name: 'Bank of America', icon: 'building-columns', color: '#E31837' },
    { id: '3', name: 'Wells Fargo', icon: 'building-columns', color: '#D71E28' },
    { id: '4', name: 'Citibank', icon: 'building-columns', color: '#056DAE' },
    { id: '5', name: 'Capital One', icon: 'building-columns', color: '#004879' },
    { id: '6', name: 'US Bank', icon: 'building-columns', color: '#0C2074' },
  ];

  const handleConnectPlaid = useCallback(async () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    Alert.alert(
      'Plaid Integration Setup Required',
      'To connect your bank account, you need to:\n\n' +
      '1. Create a Plaid account at plaid.com\n' +
      '2. Get your Plaid API keys (client_id and secret)\n' +
      '3. Set up a backend server to:\n' +
      '   • Generate link_tokens\n' +
      '   • Exchange public_tokens for access_tokens\n' +
      '   • Fetch transaction data\n\n' +
      'The react-native-plaid-link-sdk package is already installed and ready to use once you have your backend set up.\n\n' +
      'For now, you can manually add transactions using the Quick Actions on the home screen.',
      [
        {
          text: 'View Plaid Docs',
          onPress: () => {
            console.log('Opening Plaid documentation');
            Alert.alert(
              'Plaid Documentation',
              'Visit plaid.com/docs to learn how to integrate Plaid into your app.\n\n' +
              'Key steps:\n' +
              '1. Sign up for Plaid\n' +
              '2. Create a backend API\n' +
              '3. Implement /create_link_token endpoint\n' +
              '4. Implement /exchange_public_token endpoint\n' +
              '5. Use PlaidLink component in React Native'
            );
          },
        },
        {
          text: 'Manual Entry',
          onPress: () => router.back(),
        },
        {
          text: 'OK',
          style: 'cancel',
        },
      ]
    );
  }, []);

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId);
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
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

          <View style={[styles.noticeCard, { backgroundColor: colors.accent + '20', borderColor: colors.accent }]}>
            <IconSymbol
              ios_icon_name="info.circle.fill"
              android_material_icon_name="info"
              size={24}
              color={colors.accent}
            />
            <View style={styles.noticeContent}>
              <Text style={[styles.noticeTitle, { color: theme.colors.text }]}>
                Setup Required
              </Text>
              <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
                Bank connectivity requires a Plaid account and backend server. The SDK is installed and ready to use once you complete the setup.
              </Text>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              What You Need
            </Text>
            <View style={styles.stepsList}>
              <View style={styles.stepItem}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
                    Plaid Account
                  </Text>
                  <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                    Sign up at plaid.com and get your API keys
                  </Text>
                </View>
              </View>

              <View style={styles.stepItem}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
                    Backend Server
                  </Text>
                  <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                    Create endpoints for link_token and public_token exchange
                  </Text>
                </View>
              </View>

              <View style={styles.stepItem}>
                <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
                    Integration
                  </Text>
                  <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                    Use PlaidLink component to connect banks
                  </Text>
                </View>
              </View>
            </View>
          </View>

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

          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Supported Banks (Preview)
            </Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
              Plaid supports 12,000+ financial institutions
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
                  onPress={() => handleBankSelect(bank.id)}
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

          <View style={[styles.codeCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Quick Start Code
            </Text>
            <Text style={[styles.codeText, { color: colors.textSecondary }]}>
              {`// Example Plaid integration\nimport { PlaidLink } from 'react-native-plaid-link-sdk';\n\nconst config = {\n  token: linkToken, // from your backend\n};\n\nconst onSuccess = (success) => {\n  // Exchange public_token\n  exchangeToken(success.publicToken);\n};\n\n<PlaidLink\n  tokenConfig={config}\n  onSuccess={onSuccess}\n  onExit={(exit) => console.log(exit)}\n>\n  <TouchableOpacity>\n    <Text>Connect Bank</Text>\n  </TouchableOpacity>\n</PlaidLink>`}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.connectButton, { backgroundColor: colors.primary }]}
            onPress={handleConnectPlaid}
            activeOpacity={0.8}
            disabled={isConnecting}
          >
            <IconSymbol
              ios_icon_name="link.circle.fill"
              android_material_icon_name="link"
              size={24}
              color="#fff"
            />
            <Text style={styles.connectButtonText}>
              {isConnecting ? 'Connecting...' : 'Setup Instructions'}
            </Text>
          </TouchableOpacity>

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
  cardSubtitle: {
    fontSize: 14,
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
  codeCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  codeText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 18,
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
