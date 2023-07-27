import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ImageBackground,
  ToastAndroid,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  faCircleStop,
  faCircleLeft,
  faCircleRight,
  faCircleUp,
  faCircleDown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { AppContext } from '../Context/Context';
import BleManager from 'react-native-ble-manager';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import LinearGradient from 'react-native-linear-gradient';

const ConnectedScreen = () => {
  const { isConnected, setIsConnected } = useContext(AppContext);

  const [buttonState, setButtonState] = useState({
    tempup: 0.8,
    tempdown: 0.8,
    tempstop: 0.8,
    archtop: 0.8,
    archbottom: 0.8,
    archstop: 0.8,
    lotusopen: 0.8,
    lotusclose: 0.8,
    lotusstop: 0.8,
    alloff: 0.8,
    allon: 0.8,
  });

  //checks the state of bluetooth
  useEffect(() => {
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

  const disconnectDevice = () => {
    BleManager.disconnect('64:E8:33:DA:B9:26')
      .then(() => {
        // Success code
        console.log('Disconnected');
        ToastAndroid.show('Disconnected', 1000);
        setIsConnected(prev => {
          return {
            ...prev,
            connection: false,
          };
        });
      })
      .catch(error => {
        // Failure code
        console.log(error);
        Alert.alert("Couldn't Disconnect", `${error}`, [
          { text: 'OK', onPress: () => console.log('alert closed') },
        ]);
      });
  };

  const sendDataToESP32 = (str, key) => {
    updatedState = {
      tempup: 0.8,
      tempdown: 0.8,
      tempstop: 0.8,
      archtop: 0.8,
      archbottom: 0.8,
      archstop: 0.8,
      lotusopen: 0.8,
      lotusclose: 0.8,
      lotusstop: 0.8,
      alloff: 0.8,
      allon: 0.8,
    };
    if (buttonState[key] === 1) {
      ToastAndroid.show('Button already pressed', 3000);
    } else {
      updatedState[key] = 1;

      setButtonState(updatedState);

      const str1 = str;
      const data = str1.charCodeAt(0); //converts to ASCII
      console.log(data);

      BleManager.write(
        '64:E8:33:DA:B9:26',
        '2e83cb78-c55e-4172-a529-e9597e98aa53',
        'f101a3de-99aa-4375-bc5d-8e58679e267c',
        [data],
      )
        .then(() => {
          console.log('Write: ' + data);
          ToastAndroid.show('Message sent', 3000);
        })
        .catch(error => {
          console.log('Write error:', error);
          Alert.alert('Message Not Sent', `${error}`, [
            { text: 'OK', onPress: () => console.log('alert closed') },
          ]);
        });
    }
  };

  return (
    <View style={styles.mainBody}>
      {/* <View style={styles.mainBody}> */}
      <StatusBar hidden={true} backgroundColor={styles.titleContainer.backgroundColor} />
      <LinearGradient
        style={styles.titleContainer}
        colors={['#f0b52b', '#e67446']}
        locations={[0, 0.7]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        {/* <Text style={styles.titleText}>Jewellery Automation</Text> */}
        <Image source={require('../assets/logo2.png')} style={styles.logo} />
        {/* <Text style={styles.titleText}>Jewellery Automation</Text> */}
      </LinearGradient>
      <View style={styles.bodyContainer}>
        <View style={styles.heading}>
          <Text style={styles.switchTxt}>Temple Switch</Text>
        </View>
        <LinearGradient
          style={styles.actionCard}
          colors={['#e67446', '#f0b52b']}
          locations={[0, 0.7]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          {/* <Text style={styles.switchTxt}>Temple Switch</Text> */}
          <View style={styles.buttonPack}>
            <TouchableOpacity
              onPress={() => sendDataToESP32('U', 'tempup')}
              style={[styles.button, { opacity: buttonState['tempup'] }]}>
              <FontAwesomeIcon
                icon={faCircleUp}
                size={42}
                color="#bd7580"
                style={{ opacity: buttonState.tempup }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => sendDataToESP32('S', 'tempstop')}
              style={[styles.button, { opacity: buttonState['tempstop'] }]}>
              <FontAwesomeIcon
                icon={faCircleStop}
                size={42}
                color="#bd7580"
                style={{ opacity: buttonState.tempstop }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => sendDataToESP32('D', 'tempdown')}
              style={[styles.button, { opacity: buttonState['tempdown'] }]}>
              <FontAwesomeIcon
                icon={faCircleDown}
                size={42}
                color="#bd7580"
                style={{ opacity: buttonState.tempdown }}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <View style={styles.heading}>
          <Text style={styles.switchTxt}>Arch Switch</Text>
        </View>
        <LinearGradient
          style={styles.actionCard}
          colors={['#f0b52b', '#e67446']}
          locations={[0, 0.7]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View style={styles.buttonPack}>
            <TouchableOpacity
              onPress={() => sendDataToESP32('T', 'archtop')}
              style={[styles.button, { opacity: buttonState['archtop'] }]}>
              <FontAwesomeIcon
                icon={faCircleUp}
                size={42}
                color="#bd7580"
                style={{ opacity: buttonState.archtop }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => sendDataToESP32('A', 'archstop')}
              style={[styles.button, { opacity: buttonState['archstop'] }]}>
              <FontAwesomeIcon
                icon={faCircleStop}
                size={42}
                color="#bd7580"
                style={{ opacity: buttonState.archstop }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => sendDataToESP32('B', 'archbottom')}
              style={[styles.button, { opacity: buttonState['archbottom'] }]}>
              <FontAwesomeIcon
                icon={faCircleDown}
                size={42}
                color="#bd7580"
                style={{ opacity: buttonState.archbottom }}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <View style={styles.heading}>
          <Text style={styles.switchTxt}>Lotus Switch</Text>
        </View>
        <LinearGradient
          style={styles.actionCard}
          colors={['#e67446', '#f0b52b']}
          locations={[0, 0.7]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          {/* <Text style={styles.switchTxt}>Lotus Switch</Text> */}
          <View style={styles.buttonPack}>
            <TouchableOpacity
              onPress={() => sendDataToESP32('O', 'lotusopen')}
              style={[styles.button, { opacity: buttonState['lotusopen'] }]}>
              <FontAwesomeIcon
                icon={faCircleUp}
                size={42}
                color="#bd7580"
                style={{ opacity: buttonState.lotusopen }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => sendDataToESP32('L', 'lotusstop')}
              style={[styles.button, { opacity: buttonState['lotusstop'] }]}>
              <FontAwesomeIcon
                icon={faCircleStop}
                size={42}
                color="#bd7580"
                style={{ opacity: buttonState.lotusstop }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => sendDataToESP32('C', 'lotusclose')}
              style={[styles.button, { opacity: buttonState['lotusclose'] }]}>
              <FontAwesomeIcon
                icon={faCircleDown}
                size={42}
                color="#bd7580"
                style={{ opacity: buttonState.lotusclose }}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <View style={styles.allContainer}>
          <TouchableOpacity
            onPress={() => {
              sendDataToESP32('F');
            }}
            style={[styles.allConnectCard, { backgroundColor: '#cf93a5' }]}>
            <Text style={[styles.switchTxt, { color: '#fff', fontWeight: '800' }]}>All Off</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              sendDataToESP32('G');
            }}
            style={[styles.allConnectCard, { backgroundColor: '#73be73' }]}>
            <Text style={[styles.switchTxt, { color: '#fff', fontWeight: '800' }]}>All On</Text>
          </TouchableOpacity>
        </View>
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
    // </View>
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
    height: '15%',
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
  },
  heading: {
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop:'2%',
    width: '100%',
  },
  actionCard: {
    opacity: 0.4,
    // marginTop: '5%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: '4%',
    backgroundColor: '#fff',
    width: '93%',
    height: '13%',
    paddingVertical: '5%',
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
    paddingHorizontal: '25%',
  },
  button: {
    marginHorizontal: '45%',
  },
  disconnectCard: {
    opacity: 0.9,
    elevation: 4,
    // backgroundColor: '#bd7580',
    // borderWidth: 1.5,
    // borderColor: '#fff',
    height: '10%',
    marginTop: '3%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    // paddingHorizontal: '33%',
  },
  gradientContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: '33%',
    borderRadius: 25,
    alignContent: 'center',
    justifyContent: 'center',
  },
  allConnectCard: {
    opacity: 0.9,
    elevation: 2,
    marginHorizontal: '2%',
    justifyContent: 'center',
    borderRadius: 20,
    height: '83%',
    paddingHorizontal: '14.5%',
    marginTop: '3%',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allContainer: {
    flexDirection: 'row',
    // backgroundColor:'grey',
    marginTop: '5%',
    height: '13%',
    paddingBottom: '2%',
  },
});

export default ConnectedScreen;
