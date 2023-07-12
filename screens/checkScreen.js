import {
  Text,
  View,
  Platform,
  StyleSheet,
  SafeAreaView,
  NativeModules,
  Alert,
  TouchableHighlight,
  NativeEventEmitter,
  PermissionsAndroid,
  ActivityIndicator,
  ToastAndroid,
  StatusBar,
} from 'react-native';
import React, { useEffect, useContext, useRef } from 'react';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Lottie from 'lottie-react-native';

import BleManager from 'react-native-ble-manager';
import { AppContext } from '../Context/Context';
const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default function checkScreen() {
  const { isConnected, setIsConnected, timing, setTiming } = useContext(AppContext);
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

  useEffect(() => {
    // turn on bluetooth if it is not on
    BleManager.enableBluetooth()
      .then(() => {
        console.log('Bluetooth is turned on!');
        setIsConnected(prev => {
          return {
            ...prev,
            bluetooth: true,
          };
        });
      })
      .catch(err => {
        console.log('Catched Error:', err);
        Alert.alert('Bluetooth not enabled', 'Turn on Bluetooth and try again', [
          { text: 'OK', onPress: () => console.log('alert closed') },
        ]);
      });
    // start bluetooth manager
    BleManager.start({ showAlert: false }).then(() => {
      console.log('BLE Manager initialized');
      setIsConnected(prev => {
        return {
          ...prev,
          ble: true,
        };
      });
    });
    let stopListener = BleManagerEmitter.addListener('BleManagerStopScan', () => {
      setIsScanning(false);
      console.log('Scan is stopped');
      handleGetConnectedDevices();
    });
    if (Platform.OS === 'android') {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(result => {
        if (result) {
          console.log('Permission is OK');
          setIsConnected(prev => {
            return {
              ...prev,
              location: true,
            };
          });
        } else {
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(result => {
            if (result) {
              console.log('User accept');
              setIsConnected(prev => {
                return {
                  ...prev,
                  location: true,
                };
              });
            } else {
              console.log('User refuse');
              Alert.alert('Permission Needed', 'App requires Location Permission', [
                { text: 'OK', onPress: () => console.log('alert closed') },
              ]);
            }
          });
        }
      });
    }
    return () => {
      stopListener.remove();
    };
  }, []);

  if (isConnected.bluetooth && isConnected.ble && isConnected.location) {
    setTimeout(() => setTiming(true), 1300);
  }

  return (
      <SafeAreaView style={styles.mainBody}>
        <StatusBar backgroundColor={styles.titleContainer.backgroundColor} />
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Jewellery Automation</Text>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.animation}>
            <Lottie source={require('../assets/animations/wifiConnecting.json')} loop ref={animationRef} />
            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor="#2D9BF3"
              onPress={() => {
                ToastAndroid.show('Connecting...', 200);
                playAnimation();
                setTimeout(() => connectDevice(), 3000);
              }}
              style={(timing? [styles.connectButton,{backgroundColor: '#2196f3',}]:[styles.connectButton,{backgroundColor: 'grey',}])}>
              <Text
                style={{
                  color: '#d3d3d3',
                  fontFamily: 'Roboto-Regular',
                  fontSize: 20,
                }}>
                Connect
              </Text>
            </TouchableHighlight>
          </View>
          {isConnected['bluetooth'] ? (
            <View style={[styles.connectionbar, { backgroundColor: '#E1DCDC' }]}>
              <Text style={{ fontSize: 18, color: '#111', fontFamily: 'Roboto-Regular' }}>Turning bluetooth</Text>
              <FontAwesomeIcon icon={faCircleCheck} size={30} color="#005c4b" style={{ opacity: 0.9 }} />
            </View>
          ) : (
            <View style={[styles.connectionbar, { backgroundColor: '#BBB' }]}>
              <Text style={{ fontSize: 18, color: '#ccc', fontFamily: 'Roboto-Regular' }}>Turning bluetooth</Text>
              <ActivityIndicator color="green" size="large" />
            </View>
          )}
          {isConnected['ble'] ? (
            <View style={[styles.connectionbar, { backgroundColor: '#E1DCDC' }]}>
              <Text style={{ fontSize: 18, color: '#111', fontFamily: 'Roboto-Regular' }}>BLE Initialization</Text>
              <FontAwesomeIcon icon={faCircleCheck} size={30} color="#005c4b" style={{ opacity: 0.9 }} />
            </View>
          ) : (
            <View style={[styles.connectionbar, { backgroundColor: '#BBB' }]}>
              <Text style={{ fontSize: 18, color: '#ccc', fontFamily: 'Roboto-Regular' }}>BLE Initialization</Text>
              <FontAwesomeIcon icon={faCircleCheck} size={30} color="#005c4b" style={{ opacity: 0.9 }} />
            </View>
          )}

          {isConnected['location'] ? (
            <View style={[styles.connectionbar, { backgroundColor: '#E1DCDC' }]}>
              <Text style={{ fontSize: 18, color: '#111', fontFamily: 'Roboto-Regular' }}>Location Access</Text>
              <FontAwesomeIcon icon={faCircleCheck} size={30} color="#005c4b" style={{ opacity: 0.9 }} />
            </View>
          ) : (
            <View style={[styles.connectionbar, { backgroundColor: '#BBB' }]}>
              <Text style={{ fontSize: 18, color: '#ccc', fontFamily: 'Roboto-Regular' }}>Location Access</Text>
              <ActivityIndicator color="green" size="large" />
            </View>
          )}
        </View>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    height: '100%',
    backgroundColor: '#d3d3d3',
  },
  titleContainer: {
    width: '100%',
    // borderBottomRightRadius: 55,
    // borderBottomLeftRadius: 55,
    height: '10%',
    padding: '5%',
    paddingTop: '3%',
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '5%',
  },
  titleText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 27,
    color: '#fff',
    marginBottom: '2%',
  },
  bodyContainer: {
    flex: 0.5,
    // backgroundColor: 'black',
    paddingTop: 100,
    // height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    // position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  connectionbar: {
    elevation: 5,
    flexDirection: 'row',
    backgroundColor: '#DCDADA',
    height: '25%',
    width: '80%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 20,
    margin: '2%',
  },
  connectButton: {
    elevation: 5,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    // opacity: 0.95,
  },
});
