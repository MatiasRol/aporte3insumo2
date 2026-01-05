import { Link } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SwipeCard from '../components/SwipeCard';

interface Item {
  id: number;
  title: string;
  description: string;
}

const ITEMS_DATA: Item[] = [
  { id: 1, title: 'Imagen 1', description: 'Descripción del item 1' },
  { id: 2, title: 'Imagen 2', description: 'Descripción del item 2' },
  { id: 3, title: 'Imagen 3', description: 'Descripción del item 3' },
  { id: 4, title: 'Imagen 4', description: 'Descripción del item 4' },
  { id: 5, title: 'Imagen 5', description: 'Descripción del item 5' },
  { id: 6, title: 'Imagen 6', description: 'Descripción del item 6' },
  { id: 7, title: 'Imagen 7', description: 'Descripción del item 7' },
  { id: 8, title: 'Imagen 8', description: 'Descripción del item 8' },
];

declare global {
  var likedItems: Item[];
}

export default function Index() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [likedItems, setLikedItems] = useState<Item[]>([]);

  const handleSwipeRight = (item: Item) => {
    const newLiked = [...likedItems, item];
    setLikedItems(newLiked);
    global.likedItems = newLiked;
    setCurrentIndex(currentIndex + 1);
  };

  const handleSwipeLeft = (item: Item) => {
    setCurrentIndex(currentIndex + 1);
  };

  const renderCards = () => {
    if (currentIndex >= ITEMS_DATA.length) {
      return (
        <View style={styles.noMoreCards}>
          <Text style={styles.noMoreCardsText}>No hay más items</Text>
        </View>
      );
    }

    const visibleCards = ITEMS_DATA.slice(currentIndex, currentIndex + 2);
    
    return visibleCards
      .map((item, index, arr) => (
        <SwipeCard
          key={`${item.id}-${currentIndex}`}
          item={item}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          isTop={index === 0}
        />
      ))
      .reverse();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Desliza las tarjetas</Text>
        <Link href="/likes" style={styles.viewLikesButton}>
          <Text style={styles.viewLikesText}>
            Ver Likes ({likedItems.length})
          </Text>
        </Link>
      </View>

      <View style={styles.cardsContainer}>{renderCards()}</View>

      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>← Desliza para descartar</Text>
        <Text style={styles.instructionsText}>Desliza para aceptar →</Text>
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  viewLikesButton: {
    padding: 8,
  },
  viewLikesText: {
    fontSize: 16,
    color: '#00bfa5',
    fontWeight: '600',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreCards: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreCardsText: {
    fontSize: 22,
    color: '#999',
  },
  instructions: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  instructionsText: {
    fontSize: 14,
    color: '#999',
  },
});