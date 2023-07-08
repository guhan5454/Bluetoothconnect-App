import React, { useState, useEffect } from 'react';
import {
  Text, View, Platform, StatusBar, StyleSheet, Dimensions, SafeAreaView, NativeModules, ToastAndroid, Alert,
  useColorScheme, TouchableOpacity, NativeEventEmitter, PermissionsAndroid, ActivityIndicator, Image
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { faStop, faLeftLong, faRightLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = () => {

  const [isConnected, setIsConnected] = useState({
    'connection': true,
    'bluetooth': false,
    'ble': false,
    'location': false,
  });

  useEffect(() => {
    // turn on bluetooth if it is not on
    BleManager.enableBluetooth().then(() => {
      console.log('Bluetooth is turned on!');
      setIsConnected((prev) => {
        return {
          ...prev, bluetooth: true
        }
      });
    });
    // start bluetooth manager
    BleManager.start({ showAlert: false }).then(() => {
      console.log('BLE Manager initialized');
      setIsConnected((prev) => {
        return {
          ...prev, ble: true
        }
      });
    });
    let stopListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setIsScanning(false);
        console.log('Scan is stopped');
        handleGetConnectedDevices();
      },
    );
    if (Platform.OS === 'android') {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
          setIsConnected((prev) => {
            return {
              ...prev, location: true
            }
          });
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(result => {
            if (result) {
              console.log('User accept');
              setIsConnected((prev) => {
                return {
                  ...prev, location: true
                }
              });
            } else {
              console.log('User refuse');
              Alert.alert('Permission Needed', 'App requires Location Permission', [
                { text: 'OK', onPress: () => console.log('alert closed') }
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

  const connectDevice = () => {
    BleManager.connect("64:E8:33:DA:B9:26")
      .then(() => {
        // Success code
        console.log("Connected");
        setIsConnected((prev) => {
          return {
            ...prev, connection: true
          }
        });
      })
      .catch((error) => {
        // Failure code
        console.log(error);
        Alert.alert('Couldn\'t Connect', `${error}`, [
          { text: 'OK', onPress: () => console.log('alert clossed') }
        ]);
      });
  }

  const disconnectDevice = () => {
    BleManager.disconnect("64:E8:33:DA:B9:26")
      .then(() => {
        // Success code
        console.log("Disconnected");
        setIsConnected((prev) => {
          return {
            ...prev, connection: false
          }
        });
      })
      .catch((error) => {
        // Failure code
        console.log(error);
      });
  }
  const sendDataToESP32 = (str) => {
    const str1 = str;
    const data = str1.charCodeAt(0); //converts to ASCII
    // console.log(data);

    BleManager.write(
      '64:E8:33:DA:B9:26',
      '2e83cb78-c55e-4172-a529-e9597e98aa53',
      'f101a3de-99aa-4375-bc5d-8e58679e267c',
      [data]
    )
      .then(() => {
        console.log("Write: " + data);
      })
      .catch((error) => {
        console.log("Write error:", error);

      });
  };

  return (
    <SafeAreaView style={styles.mainBody}>
      <View style={ styles.titleContainer}>
        <Text style={styles.titleText}>Jewellery Automation</Text>
      </View>
      {/* Checks connection */}
      {isConnected['connection'] ?
        // if connected
        <View style={styles.bodyContainer}>
          <View style={styles.actionCard}>
            <Text style={styles.switchTxt}>Temple Switch</Text>
            <View style={styles.buttonPack}>
              <TouchableOpacity style={styles.button}>
                <FontAwesomeIcon icon={faLeftLong} size={20} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <FontAwesomeIcon icon={faStop} size={20} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <FontAwesomeIcon icon={faRightLong} size={20} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.actionCard}>
            <Text style={styles.switchTxt}>Arch Switch</Text>
            <View style={styles.buttonPack}>
              <TouchableOpacity style={styles.button}>
                <FontAwesomeIcon icon={faLeftLong} size={20} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} >
                <FontAwesomeIcon icon={faStop} size={20} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <FontAwesomeIcon icon={faRightLong} size={20} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.actionCard}>
            <Text style={styles.switchTxt}>Lotus Switch</Text>
            <View style={styles.buttonPack}>
              <TouchableOpacity style={styles.button}>
                <FontAwesomeIcon icon={faLeftLong} size={20} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <FontAwesomeIcon icon={faStop} size={20} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <FontAwesomeIcon icon={faRightLong} size={20} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.actionCard}>
            <Text style={styles.switchTxt}>All Off</Text>
          </View>
        </View>
        : //if not connected
        <View style={styles.bodyContainer}>
          <View style={styles.connectionbar}>
            <Text style={{ fontSize: 18, color: '#111' }}>Turning bluetooth</Text>
            {isConnected['bluetooth'] ?
              <Image source={require('./assets/icons/check_circle.png')} style={styles.tick} />
              :
              <ActivityIndicator color='#1b9bd1' size='large' />
            }
          </View>
          <View style={styles.connectionbar}>
            <Text style={{ fontSize: 18, color: '#111' }}>BLE Initialization</Text>
            {isConnected['ble'] ?
              <Image source={require('./assets/icons/check_circle.png')} style={styles.tick} />
              :
              <ActivityIndicator color='#1b9bd1' size='large' />
            }
          </View>
          <View style={styles.connectionbar}>
            <Text style={{ fontSize: 18, color: '#111' }}>Location Access</Text>
            {isConnected['location'] ?
              <Image source={require('./assets/icons/check_circle.png')} style={styles.tick} />
              :
              <ActivityIndicator color='#1b9bd1' size='large' />
            }
          </View>
          <TouchableOpacity
            style={styles.connectButton}
            onPress={() => {
              setIsConnected((prev) => {
                return {
                  ...prev, connection: true
                }
              })
            }}>
            <Text style={{ color: '#f6f6f6', fontFamily: 'Roboto-Regular', fontSize: 20, }}>Connect to device</Text>
          </TouchableOpacity>
        </View>
      }
    </SafeAreaView>
  );
};
// const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    height: '100%',
    backgroundColor: 'lightgrey'
  },
  titleContainer: {
    height: '15%',
    padding: '5%',
    paddingTop: '3%',
    // backgroundColor:'yellow',
    justifyContent: 'center',

  },
  titleText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 27,
    color: '#111',
    marginBottom: '2%',
  },
  bodyContainer: {
    height: '90%',
    // backgroundColor:'blue',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionbar: {
    elevation:20,
    flexDirection: 'row',
    backgroundColor: 'lightgrey',
    height: '10%',
    width: '80%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 20,
    margin: '2%',
  },
  tick: {
    resizeMode: 'contain',
    width: '11.5%',
    height: '100%',
    opacity: 0.75,
  },
  connectButton: {
    backgroundColor: '#7CC9F7',
    height: '9.5%',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderRadius: 60,
    marginTop: '30%',
  },
  actionCard: {
    elevation: 10,
    height: '15%',
    width: '95%',
    margin: '5%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'lightgrey',
    paddingHorizontal: '4%',
    borderRadius: 25,
  },
  switchTxt: {
    color: 'black',
    fontSize: 23
  },
  buttonPack: {
    flexDirection: 'row',
    // backgroundColor:'yellow',
    justifyContent: 'space-evenly',
    paddingHorizontal: '30%',
  },
  button: {
    marginHorizontal: '45%'
  }
});
export default App;
