import { StyleSheet } from 'react-native';
import colors from './colors';
import { fontConfig } from './fonts';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 20,
  },
  heading: {
    fontFamily: fontConfig.heading,
    fontSize: 24,
    color: colors.primary,
  },
  subheading: {
    fontFamily: fontConfig.body,
    fontSize: 14,
    color: colors.gray,
  },
  body: {
    fontFamily: fontConfig.body,
    fontSize: 16,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonPrimaryText: {
    color: colors.white,
    fontFamily: fontConfig.heading,
    fontSize: 16,
  },
  buttonSecondary: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: colors.primary,
    fontFamily: fontConfig.heading,
    fontSize: 16,
  },
  background: {
    backgroundColor: colors.surface,
  },
});
