import {
  Text,
  View,
  Platform,
  StyleSheet,
  SafeAreaView,
  NativeModules,
  ToastAndroid,
  Alert,
  TouchableOpacity,
  NativeEventEmitter,
  PermissionsAndroid,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import React, { useEffect, useContext } from 'react';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import ConnectingScreen from './connectingScreen';
import Lottie from 'lottie-react-native';

import BleManager from 'react-native-ble-manager';
import { AppContext } from '../Context/Context';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default function checkScreen() {
  const { isConnected, setIsConnected, timing, setTiming } = useContext(AppContext);

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
    <>
      {timing ? (
        <ConnectingScreen />
      ) : (
        <SafeAreaView style={styles.mainBody}>
          <StatusBar backgroundColor={styles.titleContainer.backgroundColor} />
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Jewellery Automation</Text>
          </View>
          <View style={styles.bodyContainer}>
            <View style={styles.animationContainer}>
              <Lottie source={require('../assets/animations/ConnectingAnimation.json')} autoPlay loop />
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
      )}
    </>
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
    borderBottomRightRadius: 55,
    borderBottomLeftRadius: 55,
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
    flex: 1,
    height: '40%',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  connectionbar: {
    elevation: 5,
    flexDirection: 'row',
    // backgroundColor: '#DCDADA',
    height: '10%',
    width: '80%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 20,
    margin: '2%',
  },
  connectButton: {
    elevation: 5,
    backgroundColor: '#33AEEE',
    height: '9.5%',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: 60,
    marginTop: '30%',
  },
  animationContainer: {
    height: '40%',
    width: '100%',
  },
});
