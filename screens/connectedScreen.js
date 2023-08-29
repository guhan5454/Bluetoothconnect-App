import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ToastAndroid,
  TextInput,
  Alert,
  TouchableOpacity,
  StatusBar,
  Platform,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import { faCircleStop, faCircleLeft, faCircleRight, faCircleUp, faCircleDown } from '@fortawesome/free-solid-svg-icons';
import BleManager from 'react-native-ble-manager';
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { AppContext } from '../Context/Context';

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const ConnectedScreen = () => {
  const { isConnected, setIsConnected, deviceId, setDeviceId } = useContext(AppContext);
  const [pass, setPass] = useState('');
  const [isLocked, setIsLocked] = useState(true);

  const [buttonState, setButtonState] = useState({
    tempup: 0.85,
    tempdown: 0.85,
    tempstop: 0.85,
    archtop: 0.85,
    archbottom: 0.85,
    archstop: 0.85,
    lotusopen: 0.85,
    lotusclose: 0.85,
    lotusstop: 0.85,
    alloff: 0.85,
    allon: 0.85,
  });

  useEffect(() => {
    // Listen for disconnection events
    const disconnectionListener = BleManagerEmitter.addListener('BleManagerDisconnectPeripheral', ({ peripheral }) => {
      // console.log('Peripheral disconnected:', peripheral);
      ToastAndroid.show(`Device Disconnected`, 500);
      setIsConnected(prev => {
        return {
          ...prev,
          connection: false,
        };
      });
    });
    return () => {
      // Clean up the listener when the component unmounts
      disconnectionListener.remove();
    };
  }, [isConnected['connection']]);

  const disconnectDevice = () => {
    BleManager.disconnect(deviceId)
      .then(() => {
        // Success code
        setIsConnected(prev => {
          return {
            ...prev,
            connection: false,
          };
        });
      })
      .catch(error => {
        // Failure code
        // console.log(error);
        Alert.alert("Couldn't Disconnect", `${error}`, [
          {
            text: 'OK',
            onPress: () => {
              // console.log('alert closed');
            },
          },
        ]);
      });
  };

  const passHandler = () => {
    if (pass === '2023') {
      setIsLocked(false);
    } else {
      setPass('');
      Alert.alert('Invalid PIN', 'Try Again', [
        {
          text: 'OK',
          onPress: () => {
            // console.log('alert closed');
          },
        },
      ]);
    }
  };

  const sendDataToESP32 = async (str, key) => {
    var updatedState = {
      tempup: 0.85,
      tempdown: 0.85,
      tempstop: 0.85,
      archtop: 0.85,
      archbottom: 0.85,
      archstop: 0.85,
      lotusopen: 0.85,
      lotusclose: 0.85,
      lotusstop: 0.85,
      alloff: 0.85,
      allon: 0.85,
    };
    if (buttonState[key] === 1) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Button already pressed', 3000);
      }
    } else {
      //to pop up the currently pressed button
      updatedState[key] = 1;
      setButtonState(updatedState);

      const str1 = str;
      const data = str1.charCodeAt(0); //converts to ASCII
      // console.log(data);
      try {
        await BleManager.write(
          deviceId,
          '2e83cb78-c55e-4172-a529-e9597e98aa53',
          'f101a3de-99aa-4375-bc5d-8e58679e267c',
          [data],
        );
        if (Platform.OS === 'android') {
          ToastAndroid.show('Message sent', 3000);
        }
      } catch (error) {
        // console.log('Write error:', error);
        Alert.alert('Message Not Sent', `${error}`, [
          {
            text: 'OK',
            onPress: () => {
              // console.log('alert closed');
            },
          },
        ]);
      }
    }
  };

  return (
    <View style={styles.mainBody}>
      <LinearGradient
        style={styles.titleContainer}
        colors={['#f0b52b', '#e67446']}
        locations={[0, 1]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}>
        <StatusBar translucent={true} backgroundColor={'transparent'} />
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </LinearGradient>
      <View style={styles.bodyContainer}>
        <View style={styles.allContainer}>
          <LinearGradient
            style={styles.allConnectCard}
            colors={['#d3d3d3', '#bbb']}
            locations={[0, 0.7]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <TouchableOpacity
              onPress={() => {
                sendDataToESP32('F', 'alloff');
              }}
              style={[styles.allButton, { opacity: buttonState['alloff'] }]}>
              <Text style={[styles.switchTxt, { color: '#fff', fontWeight: '800' }]}>All Off</Text>
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            style={styles.allConnectCard}
            colors={['#8FCD8F', '#73be73']}
            locations={[0, 0.7]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <TouchableOpacity
              style={[styles.allButton, { opacity: buttonState['allon'] }]}
              onPress={() => {
                sendDataToESP32('G', 'allon');
              }}>
              <Text style={[styles.switchTxt, { color: '#fff', fontWeight: '800' }]}>All On</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        {isLocked ? (
          <View style={styles.lockContainer}>
            <Text style={styles.pinText}>Enter PIN to Unlock</Text>
            <TextInput
              placeholder="PIN"
              placeholderTextColor={'#434242'}
              cursorColor={'#434242'}
              keyboardType="numeric"
              maxLength={4}
              secureTextEntry={true}
              value={pass}
              onChangeText={val => {
                setPass(val);
              }}
              onSubmitEditing={() => passHandler()}
              style={styles.TxtInput}
            />
          </View>
        ) : (
          <>
            <View style={styles.heading}>
              <Text style={styles.switchTxt}>Temple Switch</Text>
            </View>
            <View style={[styles.actionCard, { backgroundColor: '#fff' }]}>
              <View style={styles.buttonPack}>
                <TouchableOpacity
                  onPress={() => sendDataToESP32('U', 'tempup')}
                  style={[styles.button, { opacity: buttonState['tempup'] }]}>
                  <FontAwesomeIcon
                    icon={faCircleUp}
                    size={42}
                    color="#E8981A"
                    style={{ opacity: buttonState.tempup }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => sendDataToESP32('S', 'tempstop')}
                  style={[styles.button, { opacity: buttonState['tempstop'] }]}>
                  <FontAwesomeIcon
                    icon={faCircleStop}
                    size={42}
                    color="#E8981A"
                    style={{ opacity: buttonState.tempstop }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => sendDataToESP32('D', 'tempdown')}
                  style={[styles.button, { opacity: buttonState['tempdown'] }]}>
                  <FontAwesomeIcon
                    icon={faCircleDown}
                    size={42}
                    color="#E8981A"
                    style={{ opacity: buttonState.tempdown }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.heading}>
              <Text style={styles.switchTxt}>Arch Switch</Text>
            </View>
            <View style={[styles.actionCard, { backgroundColor: '#fff' }]}>
              <View style={styles.buttonPack}>
                <TouchableOpacity
                  onPress={() => sendDataToESP32('T', 'archtop')}
                  style={[styles.button, { opacity: buttonState['archtop'] }]}>
                  <FontAwesomeIcon
                    icon={faCircleUp}
                    size={42}
                    color="#E8981A"
                    style={{ opacity: buttonState.archtop }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => sendDataToESP32('A', 'archstop')}
                  style={[styles.button, { opacity: buttonState['archstop'] }]}>
                  <FontAwesomeIcon
                    icon={faCircleStop}
                    size={42}
                    color="#E8981A"
                    style={{ opacity: buttonState.archstop }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => sendDataToESP32('B', 'archbottom')}
                  style={[styles.button, { opacity: buttonState['archbottom'] }]}>
                  <FontAwesomeIcon
                    icon={faCircleDown}
                    size={42}
                    color="#E8981A"
                    style={{ opacity: buttonState.archbottom, borderWidth: 2, borderColor: '#000' }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.heading}>
              <Text style={styles.switchTxt}>Lotus Switch</Text>
            </View>
            <View style={[styles.actionCard, { backgroundColor: '#fff' }]}>
              <View style={styles.buttonPack}>
                <TouchableOpacity
                  onPress={() => sendDataToESP32('O', 'lotusopen')}
                  style={[styles.button, { opacity: buttonState['lotusopen'] }]}>
                  <FontAwesomeIcon
                    icon={faCircleUp}
                    size={42}
                    color="#E8981A"
                    style={{ opacity: buttonState.lotusopen }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => sendDataToESP32('L', 'lotusstop')}
                  style={[styles.button, { opacity: buttonState['lotusstop'] }]}>
                  <FontAwesomeIcon
                    icon={faCircleStop}
                    size={42}
                    color="#E8981A"
                    style={{ opacity: buttonState.lotusstop }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => sendDataToESP32('C', 'lotusclose')}
                  style={[styles.button, { opacity: buttonState['lotusclose'] }]}>
                  <FontAwesomeIcon
                    icon={faCircleDown}
                    size={42}
                    color="#E8981A"
                    style={{ opacity: buttonState.lotusclose }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
        <TouchableOpacity
          style={styles.disconnectCard}
          onPress={() => {
            disconnectDevice();
          }}>
          <LinearGradient
            style={styles.gradientContainer}
            colors={['#f0b52b', '#e67446']}
            locations={[0, 0.7]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Text style={[styles.switchTxt, { color: '#fff', fontWeight: '800' }]}>Disconnect</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    height: '100%',
    backgroundColor: '#fff',
  },
  titleContainer: {
    elevation: 20,
    width: '100%',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    height: '18%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 24,
    color: '#fff',
    marginBottom: '2%',
  },
  logo: {
    resizeMode: 'contain',
    width: '70%',
    height: '70%',
  },
  bodyContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '1%',
  },
  heading: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  actionCard: {
    opacity: 0.8,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    width: '92%',
    height: '13%',
    borderRadius: 25,
    elevation: 3,
  },
  switchTxt: {
    color: '#111',
    fontSize: 20,
    fontFamily: 'Roboto-Regular',
    marginVertical: '4%',
  },
  buttonPack: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: '23%',
  },
  button: {
    marginHorizontal: '49%',
  },
  disconnectCard: {
    opacity: 0.9,
    elevation: 4,
    height: '10%',
    marginTop: '6%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginHorizontal: '2%',
  },
  allButton: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '14%',
  },
  gradientContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: '33%',
    borderRadius: 25,
    opacity: 0.9,
    alignContent: 'center',
    justifyContent: 'center',
  },
  allConnectCard: {
    elevation: 2,
    marginHorizontal: '2%',
    borderRadius: 20,
    height: '83%',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allContainer: {
    flexDirection: 'row',
    marginTop: '4%',
    height: '13%',
  },
  lockContainer: {
    marginTop: '1%',
    backgroundColor: '#FFF',
    width: '90%',
    height: '66%',
    borderWidth: 3,
    borderColor: '#f0b52b',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  pinText: {
    color: '#434242',
    fontSize: 24,
    fontWeight: '600',
  },
  TxtInput: {
    marginTop: '4%',
    color: 'black',
    borderColor: 'lightgrey',
    height: 58,
    width: '85%',
    paddingLeft: '6%',
    borderWidth: 3,
    borderRadius: 20,
  },
});

export default ConnectedScreen;
