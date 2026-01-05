import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

interface Item {
  id: number;
  title: string;
  description: string;
}

export default function Likes() {
  const [likedItems, setLikedItems] = useState<Item[]>([]);

  useEffect(() => {
    // Cargar los items guardados
    const globalLiked = (global as any).likedItems;
    if (globalLiked) {
      setLikedItems(globalLiked);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Link href="/" style={styles.backButton}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </Link>
        <Text style={styles.headerTitle}>Items que me gustan</Text>
      </View>

      <FlatList
        data={likedItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.likedCard}>
            <Text style={styles.likedCardTitle}>{item.title}</Text>
            <Text style={styles.likedCardDescription}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Text style={styles.emptyListText}>
              Aún no has dado like a ningún item
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
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 18,
    color: '#00bfa5',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  likedCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  likedCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  likedCardDescription: {
    fontSize: 16,
    color: '#666',
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyListText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
});