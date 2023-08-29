import {
  Text,
  View,
  Platform,
  StyleSheet,
  Alert,
  Image,
  TouchableWithoutFeedback,
  PermissionsAndroid,
  ActivityIndicator,
  ToastAndroid,
  StatusBar,
  Linking,
} from 'react-native';
import React, { useEffect, useContext, useRef } from 'react';
import Lottie from 'lottie-react-native';
import bleManager from 'react-native-ble-manager';
import { BleManager } from 'react-native-ble-plx';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { AppContext } from '../Context/Context';
import LinearGradient from 'react-native-linear-gradient';

const manager = new BleManager();

export default function checkScreen() {
  const { isConnected, setIsConnected, deviceId, setDeviceId } = useContext(AppContext);
  const animationRef = useRef(null);

  //used for animation
  const playAnimation = () => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  };

  const requestLocationPermission = async () => {
    let check = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (check == 'granted') {
      setIsConnected(prev => {
        return {
          ...prev,
          locationAccess: true,
        };
      });
      return check;
    }
    let result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    if (result == 'granted') {
      // console.log('User accept');
      setIsConnected(prev => {
        return {
          ...prev,
          locationAccess: true,
        };
      });
    }
    // console.log('Result: ', result);
    return result;
  };

  const requestBlePermission = async () => {
    if (Platform.Version > 30) {
      let check = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN);
      console.log('Check: ', check);
      if (check == 'granted') {
        setIsConnected(prev => {
          return {
            ...prev,
            bluetoothAccess: true,
          };
        });
        return check;
      }
      let result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      if (result['android.permission.BLUETOOTH_SCAN'] == 'granted') {
        setIsConnected(prev => {
          return {
            ...prev,
            bluetoothAccess: true,
          };
        });
      }
      return result['android.permission.BLUETOOTH_SCAN'];
    } else {
      setIsConnected(prev => {
        return {
          ...prev,
          bluetoothAccess: true,
        };
      });
      return 'granted';
    }
  };

  const turnOnLocation = async () => {
    try {
      let res = await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      });
      if (res == 'already-enabled' || 'enabled') {
        setIsConnected(prev => {
          return {
            ...prev,
            locationEnabled: true,
          };
        });
      }
    } catch {
      // console.log('Not Turned On');
      Alert.alert('App requires location to scan', 'Turn on and Try Again', [
        {
          text: 'OK',
          onPress: () => {
            //
          },
        },
      ]);
    }
  };

  const scanForDevices = () => {
    if (
      isConnected['bluetoothAccess'] &&
      isConnected['locationEnabled'] &&
      isConnected['locationAccess'] &&
      isConnected['enableBluetooth']
    ) {
      playAnimation();
      manager.startDeviceScan(null, { allowDuplicates: false }, async (error, device) => {
        if (error) {
          console.log('BLE Error', JSON.stringify(error));
        }
        // found a bluetooth device
        if (device != null) {
          if (device.name == 'iQubeKCT') {
            setDeviceId(device.id);
            manager.stopDeviceScan();
            animationRef.current.reset();
            setIsConnected(prev => {
              return {
                ...prev,
                scan: true,
              };
            });
          }
        }
      });
    } else if (!isConnected['locationAccess']) {
      Alert.alert('Permission Required', 'Allow Location Permission', [
        {
          text: 'OK',
          onPress: () => {
            requestLocationPermission().then(result => {
              if (result == 'never_ask_again') {
                Alert.alert('Permission Required', 'Allow Location Permission in Settings', [
                  {
                    text: 'Open Settings',
                    onPress: () => {
                      Linking.openSettings();
                    },
                  },
                ]);
              }
            });
          },
        },
      ]);
    } else if (!isConnected['bluetoothAccess']) {
      Alert.alert('Permission Required', 'Allow Bluetooth Permission', [
        {
          text: 'OK',
          onPress: () => {
            requestBlePermission().then(res => {
              console.log('BLE Res: ', res);
              if (res == 'never_ask_again') {
                Alert.alert('Permission Required', 'Allow Bluetooth Permission in Settings', [
                  {
                    text: 'Open Settings',
                    onPress: () => {
                      Linking.openSettings();
                    },
                  },
                ]);
              }
            });
          },
        },
      ]);
    } else if (!isConnected['locationEnabled']) {
      turnOnLocation();
    } else if (!isConnected['enableBluetooth']) {
      Alert.alert('Bluetooth is Off', 'Turn On Bluetooth', [
        {
          text: 'OK',
          onPress: () => {
            bleManager.enableBluetooth();
          },
        },
      ]);
    } else {
      Alert.alert("Couldn't Connect", ' ', [
        {
          text: 'OK',
          onPress: () => {
            // console.log('alert closed');
          },
        },
      ]);
    }
  };

  const connectDevice = () => {
    if (isConnected.enableBluetooth && isConnected.scan) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Connecting...', 200);
      }
      playAnimation();
      setTimeout(() => {
        bleManager
          .connect(deviceId)
          .then(() => {
            // Success code
            if (Platform.OS === 'android') {
              ToastAndroid.show('Connected', 1000);
            }
            setIsConnected(prev => {
              return {
                ...prev,
                connection: true,
              };
            });
          })
          .catch(error => {
            animationRef.current.reset();
            Alert.alert("Couldn't Connect", `${error}`, [
              {
                text: 'OK',
                onPress: () => {
                  // console.log('alert closed');
                },
              },
            ]);
          });
      }, 2000);
    } else if (!isConnected.enableBluetooth) {
      Alert.alert('Bluetooth turned off', 'Turn on bluetooth and try again', [
        {
          text: 'OK',
          onPress: () => {
            // console.log('alert closed');
            bleManager.enableBluetooth().catch(err => {
              Alert.alert('Bluetooth not enabled', 'Turn on Bluetooth and try again', [
                {
                  text: 'OK',
                  onPress: () => {
                    // console.log('alert closed');
                  },
                },
              ]);
            });
          },
        },
      ]);
    } else if (!isConnected.scan) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Scanning...', 1000);
        scanForDevices();
      }
    } else {
      Alert.alert("Couldn't Connect", ' ', [
        {
          text: 'OK',
          onPress: () => {
            // console.log('alert closed');
          },
        },
      ]);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'android') {
      requestBlePermission()
        .then(res => {
          if (res == 'never_ask_again') {
            Alert.alert('App requires Bluetooth Permission', 'Allow in Settings', [
              {
                text: 'Open Settings',
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ]);
          }
          return requestLocationPermission();
        })
        .then(res => {
          console.log('Location res: ', res);
          if (res == 'denied') {
            Alert.alert('Permission Denied', 'Allow Location Permission', [
              {
                text: 'OK',
                onPress: () => {
                  requestLocationPermission();
                },
              },
            ]);
          } else if (res == 'never_ask_again') {
            Alert.alert('App requires Location Permission', 'Allow in Settings', [
              {
                text: 'Open Settings',
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ]);
          }
          // turnOnLocation();
          return bleManager.enableBluetooth();
        })
        .then(() => {
          console.log('Bluetooth Turned on');
          setIsConnected(prev => {
            return {
              ...prev,
              enableBluetooth: true,
            };
          });
        })
        .catch(err => {
          Alert.alert('Bluetooth Turned Off', 'Enable Bluetooth and Try Again', [
            {
              text: 'Enable',
              onPress: () => {
                bleManager.enableBluetooth();
              },
            },
          ]);
        });
      bleManager
        .start({ showAlert: false }) // start bluetooth manager
        .then(() => {
          console.log('BLE Manager initialized');
          setIsConnected(prev => {
            return {
              ...prev,
              ble: true,
            };
          });
        })
        .catch(err => {
          // console.log('Catched Error:', err);
          Alert.alert('Error', err, [
            {
              text: 'OK',
              onPress: () => {
                // console.log('alert closed');
              },
            },
          ]);
        });
    }
  }, []);

  return (
    <LinearGradient
      colors={['#f0b52b', '#e67446']}
      locations={[0, 0.9]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0.5, y: 0.5 }}
      style={styles.mainBody}>
      <StatusBar translucent={true} backgroundColor={'transparent'} />
      <View style={styles.imageContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <View style={styles.bodyContainer}>
        {isConnected['bluetoothAccess'] ? (
          <View style={[styles.connectionbar, { backgroundColor: '#fff' }]}>
            <Text
              style={{
                fontSize: 18,
                color: '#111',
                fontFamily: 'Roboto-Regular',
              }}>
              Bluetooth Access
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
              Bluetooth Access
            </Text>
            <ActivityIndicator color="green" size="large" />
          </View>
        )}

        {isConnected['locationAccess'] ? (
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

        {isConnected['scan'] ? (
          <View style={[styles.connectionbar, { backgroundColor: '#fff' }]}>
            <Text
              style={{
                fontSize: 18,
                color: '#111',
                fontFamily: 'Roboto-Regular',
              }}>
              Finding Device
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
              Finding Device
            </Text>
            <ActivityIndicator color="green" size="large" />
          </View>
        )}

        <View style={styles.wholeAnimation}>
          <Lottie
            source={require('../assets/animations/orangeanimation.json')}
            loop
            ref={animationRef}
            style={{ position: 'absolute', marginTop: 30 }}
          />
          <View style={{ justifyContent: 'center', alignItems: 'center',top:'14%' }}>
            {isConnected['scan'] ? (
              <TouchableWithoutFeedback
                style={styles.connectButton}
                activeOpacity={0.6}
                underlayColor="#FDFCEE"
                onPress={() => {
                  connectDevice();
                }}>
                <LinearGradient
                  colors={['#f0b52b', '#e67446']}
                  locations={[0, 0.7]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.connectButton}>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Roboto-Regular',
                      fontSize: 23,
                      paddingBottom: '45%',
                    }}>
                    Connect
                  </Text>
                </LinearGradient>
              </TouchableWithoutFeedback>
            ) : (
              <TouchableWithoutFeedback
                style={styles.connectButton}
                activeOpacity={0.6}
                underlayColor="#FDFCEE"
                onPress={() => {
                  scanForDevices();
                }}>
                <LinearGradient
                  colors={['#f0b52b', '#e67446']}
                  locations={[0, 0.7]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.connectButton}>
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: 'Roboto-Regular',
                      fontSize: 23,
                      paddingBottom: '45%',
                    }}>
                    Scan
                  </Text>
                </LinearGradient>
              </TouchableWithoutFeedback>
            )}
          </View>
        </View>
      </View>
    </LinearGradient>
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
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '35%',
  },
  logo: {
    resizeMode: 'contain',
    width: '90%',
    height: '50%',
  },
  titleText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 27,
    color: '#fff',
    marginBottom: '2%',
  },
  bodyContainer: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
  },
  animation: {
    alignItems: 'center',
    height: '90%',
    width: 'auto',
  },
  wholeAnimation: {
    position: 'relative',
    height: '100%',
    width: '100%',
    paddingBottom: 50,
    bottom: '12%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  connectionbar: {
    elevation: 5,
    opacity: 0.8,
    flexDirection: 'row',
    height: '14%',
    width: '80%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 20,
    margin: '3%',
  },
  connectButton: {
    position: 'absolute',
    marginTop: '3%',
    elevation: 3,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2%',
    borderRadius: 100,
    opacity: 0.95,
  },
});
