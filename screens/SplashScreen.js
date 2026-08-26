import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';

// Shows for ~2 seconds with a scale-up animation, then App.js navigates
// away based on whether a name is already saved.
export default function SplashScreen() {
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/kaku-placeholder.png')}
        style={[styles.image, { transform: [{ scale }] }]}
        resizeMode="contain"
      />
      <Text style={styles.title}>MessMate</Text>
      <Text style={styles.tagline}>Tiffin sorted. Friends fed. 🍛</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FF6B35',
  },
  tagline: {
    fontSize: 14,
    color: '#2D1B12',
    marginTop: 6,
  },
});
