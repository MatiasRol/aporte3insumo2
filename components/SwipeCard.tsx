import React, { useRef } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

interface Item {
  id: number;
  title: string;
  description: string;
}

interface SwipeCardProps {
  item: Item;
  onSwipeLeft: (item: Item) => void;
  onSwipeRight: (item: Item) => void;
  isTop: boolean;
}

export default function SwipeCard({ item, onSwipeLeft, onSwipeRight, isTop }: SwipeCardProps) {
  const position = useRef(new Animated.ValueXY()).current;
  
  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const nopeOpacity = position.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isTop,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction: 'left' | 'right') => {
    const x = direction === 'right' ? width + 100 : -width - 100;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      if (direction === 'right') {
        onSwipeRight(item);
      } else {
        onSwipeLeft(item);
      }
      position.setValue({ x: 0, y: 0 });
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const cardStyle = {
    ...position.getLayout(),
    transform: [{ rotate }],
  };

  return (
    <Animated.View
      style={[styles.card, cardStyle, !isTop && styles.cardBehind]}
      {...(isTop ? panResponder.panHandlers : {})}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>

      {isTop && (
        <>
          <Animated.View style={[styles.likeLabel, { opacity: likeOpacity }]}>
            <Text style={styles.likeLabelText}>ME GUSTA</Text>
          </Animated.View>
          <Animated.View style={[styles.nopeLabel, { opacity: nopeOpacity }]}>
            <Text style={styles.nopeLabelText}>NO</Text>
          </Animated.View>
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: width * 0.85,
    height: height * 0.6,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  cardBehind: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  likeLabel: {
    position: 'absolute',
    top: 50,
    right: 40,
    borderWidth: 4,
    borderColor: '#00bfa5',
    borderRadius: 10,
    padding: 10,
    transform: [{ rotate: '20deg' }],
  },
  likeLabelText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00bfa5',
  },
  nopeLabel: {
    position: 'absolute',
    top: 50,
    left: 40,
    borderWidth: 4,
    borderColor: '#ff5252',
    borderRadius: 10,
    padding: 10,
    transform: [{ rotate: '-20deg' }],
  },
  nopeLabelText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff5252',
  },
});