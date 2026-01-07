import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface Photo {
  id: string;
  uri: string;
  timestamp: number;
  savedToGallery: boolean;
  isLiked: boolean;
}

export default function Index() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!permission?.granted) {
        await requestPermission();
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
        });

        const newPhoto: Photo = {
          id: Date.now().toString(),
          uri: photo.uri,
          timestamp: Date.now(),
          savedToGallery: false,
          isLiked: false,
        };

        const stored = await AsyncStorage.getItem('pendingPhotos');
        const pendingPhotos: Photo[] = stored ? JSON.parse(stored) : [];

        // ✅ ORDEN CRONOLÓGICO CORRECTO
        pendingPhotos.push(newPhoto);

        await AsyncStorage.setItem(
          'pendingPhotos',
          JSON.stringify(pendingPhotos)
        );

        // Reset índice de galería
        await AsyncStorage.setItem('currentGalleryIndex', '0');
      } catch (error) {
        console.error('Error al tomar foto:', error);
        Alert.alert('Error', 'No se pudo tomar la foto');
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const goToGallery = () => {
    router.push('/gallery');
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Cargando...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Necesitamos permiso para usar la cámara
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Dar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => Alert.alert('Salir', '¿Cerrar la app?')}
          >
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={goToGallery}
          >
            <Ionicons name="images" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.flipButton}
            onPress={toggleCameraFacing}
          >
            <Ionicons name="camera-reverse" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>

      <Text style={styles.hint}>Ronda de práctica</Text>
      <Text style={styles.subHint}>
        No se enviará a nadie. ¡Es solo para divertirse!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
  camera: { flex: 1 },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  galleryButton: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: 'white',
  },
  flipButton: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
  hint: {
    position: 'absolute',
    bottom: 150,
    alignSelf: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subHint: {
    position: 'absolute',
    bottom: 130,
    alignSelf: 'center',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#00bfa5',
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
