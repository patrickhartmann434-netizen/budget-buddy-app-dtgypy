
import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";

export default function ProfileScreen() {
  const theme = useTheme();

  const handleEditProfile = () => {
    Alert.alert(
      'Edit Profile',
      'This feature will allow you to edit your profile information.',
      [{ text: 'OK' }]
    );
    console.log('Edit profile pressed');
  };

  const handleSettings = () => {
    Alert.alert(
      'Settings',
      'This feature will open app settings.',
      [{ text: 'OK' }]
    );
    console.log('Settings pressed');
  };

  const handleNotifications = () => {
    Alert.alert(
      'Notifications',
      'This feature will manage your notification preferences.',
      [{ text: 'OK' }]
    );
    console.log('Notifications pressed');
  };

  const handleHelp = () => {
    Alert.alert(
      'Help & Support',
      'This feature will provide help and support resources.',
      [{ text: 'OK' }]
    );
    console.log('Help pressed');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
      >
        <GlassView style={[
          styles.profileHeader,
          Platform.OS !== 'ios' && { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
        ]} glassEffectStyle="regular">
          <IconSymbol ios_icon_name="person.circle.fill" android_material_icon_name="person" size={80} color={theme.colors.primary} />
          <Text style={[styles.name, { color: theme.colors.text }]}>John Doe</Text>
          <Text style={[styles.email, { color: theme.dark ? '#98989D' : '#666' }]}>john.doe@example.com</Text>
          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            onPress={handleEditProfile}
            activeOpacity={0.8}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </GlassView>

        <GlassView style={[
          styles.section,
          Platform.OS !== 'ios' && { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
        ]} glassEffectStyle="regular">
          <View style={styles.infoRow}>
            <IconSymbol ios_icon_name="phone.fill" android_material_icon_name="phone" size={20} color={theme.dark ? '#98989D' : '#666'} />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>+1 (555) 123-4567</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <IconSymbol ios_icon_name="location.fill" android_material_icon_name="location-on" size={20} color={theme.dark ? '#98989D' : '#666'} />
            <Text style={[styles.infoText, { color: theme.colors.text }]}>San Francisco, CA</Text>
          </View>
        </GlassView>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Settings</Text>

        <GlassView style={[
          styles.section,
          Platform.OS !== 'ios' && { backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }
        ]} glassEffectStyle="regular">
          <TouchableOpacity style={styles.menuItem} onPress={handleSettings} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <IconSymbol ios_icon_name="gear" android_material_icon_name="settings" size={20} color={colors.primary} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>App Settings</Text>
            </View>
            <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={20} color={theme.dark ? '#98989D' : '#666'} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem} onPress={handleNotifications} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <IconSymbol ios_icon_name="bell.fill" android_material_icon_name="notifications" size={20} color={colors.accent} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Notifications</Text>
            </View>
            <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={20} color={theme.dark ? '#98989D' : '#666'} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem} onPress={handleHelp} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <IconSymbol ios_icon_name="questionmark.circle.fill" android_material_icon_name="help" size={20} color={colors.success} />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Help & Support</Text>
            </View>
            <IconSymbol ios_icon_name="chevron.right" android_material_icon_name="chevron-right" size={20} color={theme.dark ? '#98989D' : '#666'} />
          </TouchableOpacity>
        </GlassView>

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            BudgetBuddy v1.0.0
          </Text>
        </View>
      </ScrollView>
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
  contentContainer: {
    padding: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    borderRadius: 12,
    padding: 32,
    marginBottom: 16,
    gap: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
  },
  editButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  infoText: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  versionText: {
    fontSize: 12,
  },
});
