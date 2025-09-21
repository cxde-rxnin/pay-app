import { useFonts } from 'expo-font';

export const fontConfig = {
  heading: 'BricolageGrotesqueVariable',
  body: 'PoppinsRegular',
};

export function useAppFonts() {
  const [fontsLoaded] = useFonts({
    BricolageGrotesqueVariable: require('../assets/fonts/BricolageGrotesque-VariableFont_opsz,wdth,wght.ttf'),
    PoppinsRegular: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
  });
  return fontsLoaded;
}
