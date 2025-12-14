
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from '@/components/IconSymbol';
import { GlassView } from 'expo-glass-effect';
import { useThemeMode } from '@/contexts/ThemeContext';
import { useSettings, CURRENCIES, Currency } from '@/contexts/SettingsContext';
import { colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const theme = useTheme();
  const { themeMode, setThemeMode } = useThemeMode();
  const { currency, setCurrency } = useSettings();
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setThemeMode(mode);
  };

  const handleCurrencySelect = (selectedCurrency: Currency) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrency(selectedCurrency);
    setShowCurrencyPicker(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerBackTitle: 'Back',
          presentation: 'card',
        }}
      />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Theme Section */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Appearance</Text>
          <GlassView
            style={[
              styles.section,
              { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
            ]}
            glassEffectStyle="regular"
          >
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <IconSymbol
                  ios_icon_name="sun.max.fill"
                  android_material_icon_name="light-mode"
                  size={24}
                  color={colors.accent}
                />
                <Text style={[styles.settingText, { color: theme.colors.text }]}>Light Mode</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  themeMode === 'light' && { backgroundColor: colors.primary },
                  { borderColor: theme.dark ? colors.border : '#E0E0E0' }
                ]}
                onPress={() => handleThemeChange('light')}
                activeOpacity={0.7}
              >
                {themeMode === 'light' && (
                  <IconSymbol
                    ios_icon_name="checkmark"
                    android_material_icon_name="check"
                    size={16}
                    color="#fff"
                  />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <IconSymbol
                  ios_icon_name="moon.fill"
                  android_material_icon_name="dark-mode"
                  size={24}
                  color={colors.primary}
                />
                <Text style={[styles.settingText, { color: theme.colors.text }]}>Dark Mode</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  themeMode === 'dark' && { backgroundColor: colors.primary },
                  { borderColor: theme.dark ? colors.border : '#E0E0E0' }
                ]}
                onPress={() => handleThemeChange('dark')}
                activeOpacity={0.7}
              >
                {themeMode === 'dark' && (
                  <IconSymbol
                    ios_icon_name="checkmark"
                    android_material_icon_name="check"
                    size={16}
                    color="#fff"
                  />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <IconSymbol
                  ios_icon_name="circle.lefthalf.filled"
                  android_material_icon_name="brightness-auto"
                  size={24}
                  color={colors.success}
                />
                <Text style={[styles.settingText, { color: theme.colors.text }]}>System Default</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  themeMode === 'system' && { backgroundColor: colors.primary },
                  { borderColor: theme.dark ? colors.border : '#E0E0E0' }
                ]}
                onPress={() => handleThemeChange('system')}
                activeOpacity={0.7}
              >
                {themeMode === 'system' && (
                  <IconSymbol
                    ios_icon_name="checkmark"
                    android_material_icon_name="check"
                    size={16}
                    color="#fff"
                  />
                )}
              </TouchableOpacity>
            </View>
          </GlassView>

          {/* Currency Section */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Currency</Text>
          <GlassView
            style={[
              styles.section,
              { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
            ]}
            glassEffectStyle="regular"
          >
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowCurrencyPicker(!showCurrencyPicker);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <IconSymbol
                  ios_icon_name="dollarsign.circle.fill"
                  android_material_icon_name="attach-money"
                  size={24}
                  color={colors.accent}
                />
                <View>
                  <Text style={[styles.settingText, { color: theme.colors.text }]}>
                    Preferred Currency
                  </Text>
                  <Text style={[styles.settingSubtext, { color: colors.textSecondary }]}>
                    {currency.name} ({currency.symbol})
                  </Text>
                </View>
              </View>
              <IconSymbol
                ios_icon_name={showCurrencyPicker ? 'chevron.up' : 'chevron.down'}
                android_material_icon_name={showCurrencyPicker ? 'expand-less' : 'expand-more'}
                size={20}
                color={theme.dark ? '#98989D' : '#666'}
              />
            </TouchableOpacity>

            {showCurrencyPicker && (
              <>
                <View style={styles.divider} />
                <ScrollView style={styles.currencyList} nestedScrollEnabled>
                  {CURRENCIES.map((curr, index) => (
                    <React.Fragment key={curr.code}>
                      <TouchableOpacity
                        style={styles.currencyItem}
                        onPress={() => handleCurrencySelect(curr)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.currencyInfo}>
                          <Text style={[styles.currencySymbol, { color: theme.colors.text }]}>
                            {curr.symbol}
                          </Text>
                          <View>
                            <Text style={[styles.currencyName, { color: theme.colors.text }]}>
                              {curr.name}
                            </Text>
                            <Text style={[styles.currencyCode, { color: colors.textSecondary }]}>
                              {curr.code}
                            </Text>
                          </View>
                        </View>
                        {currency.code === curr.code && (
                          <IconSymbol
                            ios_icon_name="checkmark.circle.fill"
                            android_material_icon_name="check-circle"
                            size={24}
                            color={colors.success}
                          />
                        )}
                      </TouchableOpacity>
                      {index < CURRENCIES.length - 1 && <View style={styles.currencyDivider} />}
                    </React.Fragment>
                  ))}
                </ScrollView>
              </>
            )}
          </GlassView>

          {/* Info Section */}
          <View style={styles.infoCard}>
            <IconSymbol
              ios_icon_name="info.circle.fill"
              android_material_icon_name="info"
              size={20}
              color={colors.textSecondary}
            />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Your preferences are saved locally and will persist across app sessions.
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  section: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtext: {
    fontSize: 13,
    marginTop: 2,
  },
  themeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  currencyList: {
    maxHeight: 300,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '700',
    width: 40,
    textAlign: 'center',
  },
  currencyName: {
    fontSize: 15,
    fontWeight: '500',
  },
  currencyCode: {
    fontSize: 12,
    marginTop: 2,
  },
  currencyDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 52,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
});
