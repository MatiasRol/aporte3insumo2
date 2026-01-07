import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SwipeCard from '../components/SwipeCard';
import { Photo } from './index';

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [likedPhotos, setLikedPhotos] = useState<Photo[]>([]);

  // 🔥 Se ejecuta cada vez que entras a la galería
  useFocusEffect(
    useCallback(() => {
      loadPhotos();
      loadLikes();
    }, [])
  );

  const loadPhotos = async () => {
    const stored = await AsyncStorage.getItem('pendingPhotos');
    const parsed: Photo[] = stored ? JSON.parse(stored) : [];
    setPhotos(parsed);
  };

  const loadLikes = async () => {
    const stored = await AsyncStorage.getItem('likedPhotos');
    const parsed: Photo[] = stored ? JSON.parse(stored) : [];
    setLikedPhotos(parsed);
  };

  const removePhoto = async (photoId: string) => {
    const updatedPhotos = photos.filter(p => p.id !== photoId);
    setPhotos(updatedPhotos);
    await AsyncStorage.setItem(
      'pendingPhotos',
      JSON.stringify(updatedPhotos)
    );
  };

  const handleSwipeLeft = async (photo: Photo) => {
    await removePhoto(photo.id);
  };

  const handleSwipeRight = async (photo: Photo) => {
    const updated = { ...photo, isLiked: true };
    const newLiked = [...likedPhotos, updated];

    setLikedPhotos(newLiked);
    await AsyncStorage.setItem('likedPhotos', JSON.stringify(newLiked));

    await removePhoto(photo.id);
  };

  const renderCards = () => {
    if (photos.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📸</Text>
          <Text style={styles.emptyText}>No hay fotos para deslizar</Text>
          <Text style={styles.emptySubText}>Toma fotos desde la cámara</Text>
        </View>
      );
    }

    return photos
      .slice(0, 3)
      .map((photo, index) => (
        <SwipeCard
          key={photo.id}
          item={photo}
          isTop={index === 0}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      ))
      .reverse();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/" asChild>
          <TouchableOpacity>
            <Text style={styles.backButtonText}>📷 Cámara</Text>
          </TouchableOpacity>
        </Link>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Galería</Text>
          <Text style={styles.headerSubtitle}>
            {photos.length} pendiente{photos.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <Link href="/likes" asChild>
          <TouchableOpacity>
            <Text style={styles.likesText}>❤️ {likedPhotos.length}</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.cardsContainer}>{renderCards()}</View>

      <View style={styles.instructions}>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionIcon}>💾</Text>
          <Text style={styles.instructionText}>Izquierda</Text>
          <Text style={styles.instructionSubText}>Quitar</Text>
        </View>
        <View style={styles.instructionItem}>
          <Text style={styles.instructionIcon}>❤️</Text>
          <Text style={styles.instructionText}>Derecha</Text>
          <Text style={styles.instructionSubText}>Like</Text>
        </View>
      </View>
    </View>
  );
}

/* ================== ESTILOS ================== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  header: {
    paddingTop: 60,
    padding: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  backButtonText: {
    color: '#00bfa5',
    fontSize: 16,
    fontWeight: '600',
  },

  headerCenter: {
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  headerSubtitle: {
    fontSize: 12,
    color: '#999',
  },

  likesText: {
    fontSize: 16,
    color: '#ff5252',
    fontWeight: '600',
  },

  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyState: {
    alignItems: 'center',
    padding: 40,
  },

  emptyIcon: {
    fontSize: 64,
  },

  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  emptySubText: {
    fontSize: 16,
    color: '#999',
  },

  instructions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },

  instructionItem: {
    alignItems: 'center',
  },

  instructionIcon: {
    fontSize: 28,
  },

  instructionText: {
    fontSize: 14,
    fontWeight: '600',
  },

  instructionSubText: {
    fontSize: 12,
    color: '#999',
  },
});
