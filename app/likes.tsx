import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { Photo } from './index';

const { width } = Dimensions.get('window');
const imageSize = (width - 45) / 2; // 2 columnas con espaciado

export default function Likes() {
  const [likedPhotos, setLikedPhotos] = useState<Photo[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadLikedPhotos();
    }, [])
  );

  const loadLikedPhotos = async () => {
    try {
      const stored = await AsyncStorage.getItem('likedPhotos');
      const liked: Photo[] = stored ? JSON.parse(stored) : [];
      setLikedPhotos(liked);
    } catch (error) {
      console.error('Error cargando likes:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/gallery" style={styles.backButton}>
          <Text style={styles.backButtonText}>← Galería</Text>
        </Link>
        <Text style={styles.headerTitle}>Mis Favoritas</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={likedPhotos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <View style={styles.photoCard}>
            <Image source={{ uri: item.uri }} style={styles.photo} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyListText}>
              Aún no has dado like a ninguna foto
            </Text>
            <Text style={styles.emptyListSubText}>
              Desliza fotos a la derecha para agregarlas aquí
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#00bfa5',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 60,
  },
  grid: {
    padding: 15,
  },
  photoCard: {
    width: imageSize,
    height: imageSize,
    margin: 5,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyListText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyListSubText: {
    fontSize: 14,
    color: '#bbb',
    textAlign: 'center',
  },
});