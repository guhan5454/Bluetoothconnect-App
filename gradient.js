import React from 'react'
import {BlurView} from '@react-native-community/blur';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  View,
  Animated,
} from 'react-native';

export default function gradient() {
  return (
    <SafeAreaView>
      <Image
        style={styles.backgroundImage}
        source={require('./assets/bkg.jpg')}
      />
      <Image
        style={styles.backgroundAbstractImage}
        source={require('./assets/abstract.png')}
      />
      <View style={styles.contentContainer}>
        <BlurView blurType='light' blurAmount={20} style={styles.cardContainer}>
          <Text>ABCD</Text>
        </BlurView>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  backgroundImage: {
    height: '100%',
    aspectRatio: 1,
  },
  backgroundAbstractImage: {
    position: 'absolute',
    height: undefined,
    width: '100%',
    aspectRatio: 1,
    zIndex: 5,
    transform: [{translateY: 200}, {rotateZ: '-55deg'}, {scale: 1.5}],
  },
  contentContainer: {
    display: 'flex',
    height: '100%',
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: '90%',
    height: '20%',
  },
  card: {
    height: '100%',
    width: '100%',
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    borderWidth: 2,
  },
  draggableBox: {
    borderRadius: 20,
    overflow: 'hidden',
  },
});