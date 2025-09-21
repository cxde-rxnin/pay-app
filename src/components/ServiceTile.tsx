import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../theme/colors';
import { MaterialIcons } from '@expo/vector-icons';

type MaterialIconName = 'phone-android' | 'wifi' | 'bolt';

type Props = {
  icon: MaterialIconName;
  label: string;
};

const ServiceTile: React.FC<Props> = ({ icon, label }) => (
  <View style={tileStyles.tile}>
    <View style={tileStyles.iconWrap}>
      <MaterialIcons name={icon} size={28} color={colors.secondary} />
    </View>
    <Text style={tileStyles.label}>{label}</Text>
  </View>
);

const tileStyles = StyleSheet.create({
  tile: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    alignItems: 'flex-start',
    margin: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    width: 150,
  },
  iconWrap: {
    backgroundColor: '#F3E8FF',
    borderRadius: 12,
    padding: 10,
  },
  label: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 12,
  },
});

export default ServiceTile;
