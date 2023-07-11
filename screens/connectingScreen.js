import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import React, { useContext, useRef } from 'react';
import { AppContext } from '../Context/Context';
import Lottie from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';

const connectingScreen = () => {
  const { setIsConnected, isConnected } = useContext(AppContext);
  const animationRef = useRef(null);

  const playAnimation = () => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  };

  const connectDevice = () => {
    setIsConnected(prev => {
      return {
        ...prev,
        connection: true,
      };
    });
    // ToastAndroid.show('Connecting...', 1000);
    // BleManager.connect('64:E8:33:DA:B9:26')
    //   .then(() => {
    //     // Success code
    //     ToastAndroid.show('Connected', 1000);
    //     console.log('Connected');
    //     //state
    //   })
    //   .catch(error => {
    //     // Failure code
    //     console.log(error);
    //     Alert.alert("Couldn't Connect", `${error}`, [{text: 'OK', onPress: () => console.log('alert closed')}]);
    //   });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={styles.titleContainer.backgroundColor} />
      <LinearGradient colors={['#90CAF9', '#1E88E5']} angleCenter={{ x: 0.5, y: 0.5 }} angle={40} style={styles.bodyContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Jewellery Automation</Text>
        </View>
        {/* <ImageBackground source={require('../assets/bg.jpg')} resizeMode="cover" style={styles.image}> */}
        <Lottie source={require('../assets/animations/circleanimation.json')} ref={animationRef} loop style={styles.animation} />
        <TouchableOpacity
          onPress={() => {
            // connectDevice();
            playAnimation();
            setTimeout(() => connectDevice(), 2500);
          }}
          style={styles.connectButton}>
          <Text
            style={{
              color: '#d3d3d3',
              fontFamily: 'Roboto-Regular',
              fontSize: 20,
            }}>
            Connect
          </Text>
        </TouchableOpacity>
        {/* </ImageBackground> */}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    width: '100%',
    borderBottomRightRadius: 70,
    borderBottomLeftRadius: 70,
    height: '10%',
    padding: '5%',
    paddingTop: '3%',
    position: 'absolute',
    top: 0,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 27,
    color: '#fff',
    marginBottom: '2%',
  },
  bodyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButton: {
    elevation: 5,
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#0087FF',
    opacity: 0.95,
  },
  image: {
    flex: 1,
    // color: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: '92%',
    width: '74%',
  },
});

export default connectingScreen;
