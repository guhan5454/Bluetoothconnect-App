import { StyleSheet, Text, View, TouchableHighlight, ImageBackground, StatusBar, ToastAndroid } from 'react-native';
import React, { useContext, useRef } from 'react';
import { AppContext } from '../Context/Context';
import Lottie from 'lottie-react-native';

const connectingScreen = () => {
  const { setIsConnected, isConnected } = useContext(AppContext);
  
  const connectDevice = () => {
    setIsConnected(prev => {
      return {
        ...prev,
        connection: true,
      };
    });
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
    //     Alert.alert("Couldn't Connect", `${error}`, [{ text: 'OK', onPress: () => console.log('alert closed') }]);
    //   });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={styles.titleContainer.backgroundColor} />
      <View style={styles.bodyContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Jewellery Automation</Text>
        </View>
        {/* <ImageBackground source={require('../assets/bg.jpg')} resizeMode="cover" style={styles.image}> */}
        
        {/* </ImageBackground> */}
      </View>
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
    // borderBottomRightRadius: 55,
    // borderBottomLeftRadius: 55,
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
    fontSize: 24,
    color: '#fff',
    marginBottom: '2%',
  },
  bodyContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:'#DCDBDE',
    justifyContent: 'center',
  },
  connectButton: {
    elevation: 5,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#2196F3',
    opacity: 0.95,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '80%',
  },
});

export default connectingScreen;
