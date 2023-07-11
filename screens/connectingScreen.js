import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useContext } from 'react'
import { AppContext } from '../Context/Context';

const connectingScreen = () => {

   const {setIsConnected, isConnected} = useContext(AppContext)

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
    <ImageBackground source={require('../assets/bg.jpg')} resizeMode="cover" style={styles.image}>
      <TouchableOpacity
          onPress={() => {
            connectDevice();
          }}
          style={styles.connectButton}>
          <Text
            style={{
              color: '#d3d3d3',
              fontFamily: 'Roboto-Regular',
              fontSize: 20,
            }}>
            Connect to device
          </Text>
        </TouchableOpacity>
        </ImageBackground>
    </View>
  )
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        // alignItems: 'center',
        justifyContent: 'center'
    },
    connectButton: {
        elevation: 5,
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: '#1976D2',
    },
    image:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})


export default connectingScreen
