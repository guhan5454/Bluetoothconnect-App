import {
  Text,
  View,
  Platform,
  StyleSheet,
  ImageBackground,
  NativeModules,
  Alert,
  Image,
  TouchableOpacity,
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
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { AppContext } from '../Context/Context';
import LinearGradient from 'react-native-linear-gradient';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export default function checkScreen() {
  const { isConnected, setIsConnected } = useContext(AppContext);
  const animationRef = useRef(null);

  const playAnimation = () => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  };

  const connectDevice = () => {
    if (isConnected.bluetooth && isConnected.ble && isConnected.location) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Connecting...', 200);
      }
      playAnimation();
      setTimeout(() => {
        BleManager.connect('64:E8:33:DA:B9:26')
          .then(() => {
            // Success code
            if (Platform.OS === 'android') {
              ToastAndroid.show('Connected', 1000);
            }
            console.log('Connected');
            setIsConnected(prev => {
              return {
                ...prev,
                connection: true,
              };
            });
          })
          .catch(error => {
            // Failure code
            console.log(error);
            Alert.alert("Couldn't Connect", `${error}`, [{ text: 'OK', onPress: () => console.log('alert closed') }]);
          });
      }, 5000);
    } else if (!isConnected.bluetooth) {
      Alert.alert('Bluetooth turned off', 'Turn on bluetooth and try again', [
        {
          text: 'OK',
          onPress: () => {
            console.log('alert closed');
            BleManager.enableBluetooth().catch(err => {
              Alert.alert('Bluetooth not enabled', 'Turn on Bluetooth and try again', [
                {
                  text: 'OK',
                  onPress: () => console.log('alert closed'),
                },
              ]);
            });
          },
        },
      ]);
    } else {
      Alert.alert("Couldn't Connect", ' ', [
        {
          text: 'OK',
          onPress: () => console.log('alert closed'),
        },
      ]);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      //request required permissions
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT)
        .then(res => {
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
                    {
                      text: 'OK',
                      onPress: () => console.log('alert closed'),
                    },
                  ]);
                }
              });
            }
          });
        }) //turn on bluetooth if it is off
        .then(res => {
          return BleManager.enableBluetooth();
        })
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
            {
              text: 'OK',
              onPress: () => console.log('alert closed'),
            },
          ]);
        });
    }
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

    return () => {
      stopListener.remove();
    };
  }, []);

  useEffect(() => {
    //checks for bluetooth changes
    BluetoothStateManager.onStateChange(bluetoothState => {
      switch (bluetoothState) {
        case 'PoweredOn':
          setIsConnected(prev => {
            return {
              ...prev,
              bluetooth: true,
            };
          });
          break;
        case 'PoweredOff':
          setIsConnected(prev => {
            return {
              ...prev,
              connection: false,
              bluetooth: false,
            };
          });
          break;
        default:
          break;
      }
    }, true /*=emitCurrentState*/);
  }, [isConnected['bluetooth']]);

  return (
    <ImageBackground style={styles.mainBody} source={require('../assets/bg5.jpg')} resizeMode="cover">
      <StatusBar hidden={true} backgroundColor={styles.titleContainer.backgroundColor} />
      <LinearGradient
        style={styles.titleContainer}
        colors={['#e4abce', '#bd7580']}
        locations={[0, 0.7]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        {/* <Text style={styles.titleText}>Jewellery Automation</Text> */}
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </LinearGradient>
      <View style={styles.bodyContainer}>
        <View style={styles.animation}>
          <Lottie source={require('../assets/animations/pulse.json')} loop ref={animationRef} />
          <TouchableOpacity
            activeOpacity={0.6}
            underlayColor="#2D9BF3"
            onPress={() => {
              connectDevice();
            }}>
            <LinearGradient
              colors={['#e4abce', '#bd7580']}
              locations={[0, 0.7]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={
                isConnected.bluetooth && isConnected.ble && isConnected.location
                  ? [
                      styles.connectButton,
                      {
                        backgroundColor: '#fff',
                      },
                    ]
                  : [styles.connectButton, { backgroundColor: '#fff' }]
              }>
              <Text
                style={{
                  color: '#ffffff',
                  fontFamily: 'Roboto-Regular',
                  fontSize: 20,
                }}>
                Connect
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        {isConnected['bluetooth'] ? (
          <View style={[styles.connectionbar, { backgroundColor: '#fff', marginTop: '10%' }]}>
            <Text
              style={{
                fontSize: 18,
                color: '#111',
                fontFamily: 'Roboto-Regular',
              }}>
              Turning bluetooth
            </Text>
            <FontAwesomeIcon icon={faCircleCheck} size={30} color="#73be73" />
          </View>
        ) : (
          <View style={[styles.connectionbar, { backgroundColor: '#e7eef8', marginTop: '10%' }]}>
            <Text
              style={{
                fontSize: 18,
                color: '#ccc',
                fontFamily: 'Roboto-Regular',
              }}>
              Bluetooth Status
            </Text>
            <ActivityIndicator color="green" size="large" />
          </View>
        )}
        {isConnected['ble'] ? (
          <View style={[styles.connectionbar, { backgroundColor: '#fff' }]}>
            <Text
              style={{
                fontSize: 18,
                color: '#111',
                fontFamily: 'Roboto-Regular',
              }}>
              BLE Initialization
            </Text>
            <FontAwesomeIcon icon={faCircleCheck} size={30} color="#73be73" />
          </View>
        ) : (
          <View style={[styles.connectionbar, { backgroundColor: '#e7eef8' }]}>
            <Text
              style={{
                fontSize: 18,
                color: '#ccc',
                fontFamily: 'Roboto-Regular',
              }}>
              BLE Initialization
            </Text>
            <FontAwesomeIcon icon={faCircleCheck} size={30} color="#73be73" />
          </View>
        )}

        {isConnected['location'] ? (
          <View style={[styles.connectionbar, { backgroundColor: '#fff' }]}>
            <Text
              style={{
                fontSize: 18,
                color: '#111',
                fontFamily: 'Roboto-Regular',
              }}>
              Location Access
            </Text>
            <FontAwesomeIcon icon={faCircleCheck} size={30} color="#73be73" />
          </View>
        ) : (
          <View style={[styles.connectionbar, { backgroundColor: '#e7eef8' }]}>
            <Text
              style={{
                fontSize: 18,
                color: '#ccc',
                fontFamily: 'Roboto-Regular',
              }}>
              Location Access
            </Text>
            <ActivityIndicator color="green" size="large" />
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    height: '100%',
  },
  titleContainer: {
    elevation: 20,
    width: '100%',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    height: '13%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    resizeMode: 'contain',
    width: '70%',
    height: '100%',
  },
  titleText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 27,
    color: '#fff',
    marginBottom: '2%',
  },
  bodyContainer: {
    flex: 0.5,
    paddingTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    marginTop: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  connectionbar: {
    elevation: 5,
    opacity: 0.8,
    flexDirection: 'row',
    height: '25%',
    width: '80%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 20,
    margin: '2%',
  },
  connectButton: {
    elevation: 3,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    opacity: 0.95,
  },
});
