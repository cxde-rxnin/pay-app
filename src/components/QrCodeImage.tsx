import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { View, ImageBackground } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system/legacy';
import ViewShot from 'react-native-view-shot';

export interface QrCodeImageHandle {
  generateImage: () => Promise<string | null>;
}

interface QrCodeImageProps {
  value: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

const QrCodeImage = forwardRef<QrCodeImageHandle, QrCodeImageProps>(({ value, size = 200, color = '#000', backgroundColor = '#fff' }, ref) => {
  const viewShotRef = useRef<ViewShot>(null);

  useImperativeHandle(ref, () => ({
    async generateImage() {
      if (viewShotRef.current && typeof viewShotRef.current.capture === 'function') {
        try {
          const uri = await viewShotRef.current.capture();
          return uri;
        } catch (error) {
          return null;
        }
      }
      return null;
    }
  }));

  return (
    <ViewShot
      ref={viewShotRef}
      options={{ format: 'png', quality: 1 }}
      style={{ width: size + 60, height: size + 100, justifyContent: 'center', alignItems: 'center' }}
    >
      <ImageBackground
        source={require('../assets/receipt.png')}
        style={{ width: size + 60, height: size + 100, justifyContent: 'center', alignItems: 'center' }}
        resizeMode="contain"
      >
        <View style={{
          width: size,
          height: size,
          backgroundColor: '#fff',
          borderRadius: 6,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 4,
          padding: 18,
        }}>
          <QRCode
            value={value}
            size={size - 36}
            color={color}
            backgroundColor={'#fff'}
          />
        </View>
      </ImageBackground>
    </ViewShot>
  );
});

export default QrCodeImage;
