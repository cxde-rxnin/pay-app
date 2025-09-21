import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../theme/styles';
import colors from '../../theme/colors';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const items = [
  { label: 'My Profile', icon: 'person-outline' as const },
  { label: 'Account Verification', icon: 'verified-user' as const, badge: 'Verified' },
  { label: 'Notifications', icon: 'notifications-none' as const },
  { label: 'Face ID', icon: 'face-recognition' as const, lib: 'mc' },
  { label: 'Security', icon: 'shield-outline' as const, lib: 'mc' },
  { label: 'Appearance', icon: 'color-lens' as const },
  { label: 'Support', icon: 'support-agent' as const },
  { label: 'Privacy Policy', icon: 'privacy-tip' as const },
  { label: 'Log Out', icon: 'logout' as const, danger: true },
];

const SettingsScreen = () => (
  <View style={[styles.screen, { backgroundColor: '#F7F8FA', paddingHorizontal: 0 }]}>
    <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text, flex: 1 }}>More</Text>
        <View style={{ backgroundColor: '#FFF7E0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color: '#F59E0B', fontWeight: '700', fontSize: 13 }}>Tier 3</Text>
        </View>
      </View>
      <View style={{ backgroundColor: colors.white, borderRadius: 20, paddingVertical: 4, marginBottom: 18, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 2 }}>
        {items.map((item, idx) => (
          <TouchableOpacity key={item.label} onPress={() => {}} style={{ paddingVertical: 18, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}>
            {item.lib === 'mc' ? (
              <MaterialCommunityIcons name={item.icon as any} size={22} color={item.danger ? colors.error : colors.primary} />
            ) : (
              <MaterialIcons name={item.icon as any} size={22} color={item.danger ? colors.error : colors.primary} />
            )}
            <Text style={{ marginLeft: 16, color: item.danger ? colors.error : colors.text, fontWeight: '500', fontSize: 15, flex: 1 }}>{item.label}</Text>
            {item.badge && (
              <View style={{ backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 8 }}>
                <Text style={{ color: colors.success, fontSize: 12, fontWeight: '600' }}>{item.badge}</Text>
              </View>
            )}
            <MaterialIcons name="chevron-right" size={22} color={colors.gray} />
          </TouchableOpacity>
        ))}
      </View>
      <Text style={{ color: colors.gray, fontSize: 12, textAlign: 'center', marginTop: 18 }}>Version 2.11</Text>
    </View>
  </View>
);

export default SettingsScreen;
