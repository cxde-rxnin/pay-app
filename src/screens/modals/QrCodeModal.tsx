import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, Animated, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Alert } from 'react-native';
import colors from '../../theme/colors';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Code, ScanBarcode } from 'iconsax-react-nativejs';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { CameraView, Camera, useCameraPermissions } from 'expo-camera';
import QrCodeImage, { QrCodeImageHandle } from '../../components/QrCodeImage';

const { height, width } = Dimensions.get('window');

interface QRCodeModalProps {
  visible: boolean;
  onClose: () => void;
  userTag?: string;
}

const QrCodeModal: React.FC<QRCodeModalProps> = ({ visible, onClose, userTag = "obed" }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-code' | 'scan'>('my-code');
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const qrSvgRef = useRef<any>(null);
  const qrImageComponentRef = useRef<QrCodeImageHandle>(null);

  // Scanner state
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  // QR code ref for sharing
  const [qrImageUri, setQrImageUri] = useState<string | null>(null);
  const [qrImageLoading, setQrImageLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      slideAnim.setValue(height);
      fadeAnim.setValue(0);
      translateY.setValue(0);
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            speed: 18,
            bounciness: 8,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start();
      }, 50);
    } else if (modalVisible) {
      handleClose();
    }
  }, [visible, modalVisible, slideAnim, fadeAnim, translateY]);

  useEffect(() => {
    if (activeTab === 'scan' && !permission?.granted) {
      requestPermission();
    }
  }, [activeTab]);

  const handleClose = () => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: height,
        useNativeDriver: true,
        speed: 20,
        bounciness: 0,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      setModalVisible(false);
      setQrImageUri(null);
      setQrImageLoading(false);
      onClose();
    });
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationY: dragDistance, velocityY } = event.nativeEvent;
      if (dragDistance > 100 || velocityY > 500) {
        translateY.setValue(0);
        handleClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          speed: 20,
          bounciness: 8,
        }).start();
      }
    }
  };

  const handleShareQr = async () => {
    if (!qrImageLoading && qrImageComponentRef.current) {
      setQrImageLoading(true);
      try {
        const fileUri = await qrImageComponentRef.current.generateImage();
        if (fileUri) {
          setQrImageUri(fileUri);
          setQrImageLoading(false);
          await Sharing.shareAsync(fileUri);
        } else {
          setQrImageLoading(false);
          Alert.alert('Error', 'Unable to generate QR code image.');
        }
      } catch (error) {
        setQrImageLoading(false);
        Alert.alert('Error', 'Unable to save or share QR code.');
      }
    } else if (qrImageLoading) {
      Alert.alert('Please wait', 'QR code is still generating. Please try again in a moment.');
    }
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setScanResult(data);
  };

  const renderMyCode = () => (
    <View style={{ alignItems: 'center', paddingVertical: 20 }}>
      <View style={{
        width: 200,
        height: 200,
        backgroundColor: colors.white,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.gray + '30',
        marginBottom: 20,
        position: 'relative',
      }}>
        <QrCodeImage
          ref={qrImageComponentRef}
          value={userTag}
          size={160}
          color={colors.text}
          backgroundColor={colors.white}
        />
      </View>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 20, textAlign: 'center' }}>
          Your QR Code
        </Text>
      <View style={{
        backgroundColor: colors.gray + '10',
        padding: 15,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center'
      }}>
        <Text style={{ fontSize: 16, color: colors.text, fontWeight: '600' }}>
          @{userTag}
        </Text>
        <Text style={{ fontSize: 14, color: colors.gray, marginTop: 4 }}>
          Share this code to receive payments
        </Text>
      </View>
      <TouchableOpacity 
        style={{
          backgroundColor: qrImageLoading ? colors.gray : colors.primary,
          width: '100%',
          paddingHorizontal: 50,
          paddingVertical: 16,
          borderRadius: 10,
          marginTop: 20,
          opacity: qrImageLoading ? 0.6 : 1,
        }}
        onPress={handleShareQr}
        disabled={qrImageLoading}
      >
        <Text style={{ color: colors.white, fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
          {qrImageLoading ? 'Generating...' : 'Share QR Code'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderScanner = () => (
    <View style={{ alignItems: 'center', paddingVertical: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 20 }}>
        Scan QR Code
      </Text>
      <View style={{
        width: width * 0.7,
        height: width * 0.7,
        backgroundColor: colors.gray + '20',
        borderRadius: 12,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
        borderStyle: 'dashed',
        marginBottom: 20
      }}>
        {!permission ? (
          <Text>Requesting camera permission...</Text>
        ) : !permission.granted ? (
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: 'red', marginBottom: 10 }}>No access to camera</Text>
            <TouchableOpacity onPress={requestPermission}>
              <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Grant Permission</Text>
            </TouchableOpacity>
          </View>
        ) : !scanned ? (
          <CameraView
            style={{ width: '100%', height: '100%' }}
            facing="back"
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "pdf417", "aztec", "ean13", "ean8", "upc_e", "datamatrix", "code128", "code39", "code93", "codabar", "itf14", "upc_a"],
            }}
          />
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Text style={{ fontSize: 16, color: colors.text, marginBottom: 10 }}>Scanned Data:</Text>
            <Text style={{ fontSize: 14, color: colors.primary, textAlign: 'center', paddingHorizontal: 10 }}>
              {scanResult}
            </Text>
            <TouchableOpacity 
              onPress={() => { 
                setScanned(false); 
                setScanResult(null); 
              }} 
              style={{ marginTop: 16 }}
            >
              <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Scan Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  if (!modalVisible) return null;

  return (
    <Modal visible={modalVisible} animationType="none" transparent onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.85)',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: fadeAnim
        }} />
      </TouchableWithoutFeedback>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetY={10}
        failOffsetY={-10}
      >
        <Animated.View style={{
          backgroundColor: colors.white,
          borderRadius: 35,
          padding: 28,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
          width: '95%',
          alignSelf: 'center',
          position: 'absolute',
          maxHeight: height * 0.8,
          transform: [
            { translateY: slideAnim },
            { translateY: translateY }
          ],
          bottom: 30,
        }}>
          {/* Drag Indicator */}
          <View style={{ 
            width: 40, 
            height: 4, 
            backgroundColor: colors.gray, 
            borderRadius: 2, 
            alignSelf: 'center', 
            marginBottom: 16, 
            opacity: 0.4 
          }} />
          
          {/* Header */}
          <Text style={{ 
            fontSize: 22, 
            fontWeight: '900', 
            marginBottom: 24, 
            color: colors.text, 
            textAlign: 'center' 
          }}>
            QR Code
          </Text>
          
          {/* Tab Buttons */}
          <View style={{
            flexDirection: 'row',
            backgroundColor: colors.gray + '20',
            borderRadius: 12,
            padding: 4,
            marginBottom: 20
          }}>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: activeTab === 'my-code' ? colors.white : 'transparent',
                alignItems: 'center'
              }}
              onPress={() => setActiveTab('my-code')}
            >
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: activeTab === 'my-code' ? colors.primary : colors.gray
              }}>
                My Code
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: activeTab === 'scan' ? colors.white : 'transparent',
                alignItems:'center'
              }}
              onPress={() => setActiveTab('scan')}
            >
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: activeTab === 'scan' ? colors.primary : colors.gray
              }}>
                Scan
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Tab Content */}
          {activeTab === 'my-code' ? renderMyCode() : renderScanner()}
        </Animated.View>
      </PanGestureHandler>
    </Modal>
  );
};

export default QrCodeModal;