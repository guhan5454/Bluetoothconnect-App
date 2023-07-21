import React, { useContext, useEffect, useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, ToastAndroid, Alert, TouchableOpacity, StatusBar } from 'react-native';
import { faCircleStop, faCircleLeft, faCircleRight, faCircleUp, faCircleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { AppContext } from '../Context/Context';
import BleManager from 'react-native-ble-manager';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

const ConnectedScreen = () => {
  const { isConnected, setIsConnected } = useContext(AppContext);

  const [buttonState, setButtonState] = useState({
    tempup: 0.75,
    tempdown: 0.75,
    tempstop: 0.75,
    archtop: 0.75,
    archbottom: 0.75,
    archstop: 0.75,
    lotusopen: 0.75,
    lotusclose: 0.75,
    lotusstop: 0.75,
    alloff: 0.75,
    allon: 0.75,
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
        Alert.alert("Couldn't Disconnect", `${error}`, [{ text: 'OK', onPress: () => console.log('alert closed') }]);
      });
  };

  const sendDataToESP32 = (str, key) => {
    updatedState = {
      tempup: 0.75,
      tempdown: 0.75,
      tempstop: 0.75,
      archtop: 0.75,
      archbottom: 0.75,
      archstop: 0.75,
      lotusopen: 0.75,
      lotusclose: 0.75,
      lotusstop: 0.75,
      alloff: 0.75,
      allon: 0.75,
    };
    if (buttonState[key] === 1) {
      ToastAndroid.show('Button already pressed', 3000);
    } else {
      updatedState[key] = 1;

      setButtonState(updatedState);

      const str1 = str;
      const data = str1.charCodeAt(0); //converts to ASCII
      console.log(data);

      // BleManager.write(
      //   '64:E8:33:DA:B9:26',
      //   '2e83cb78-c55e-4172-a529-e9597e98aa53',
      //   'f101a3de-99aa-4375-bc5d-8e58679e267c',
      //   [data],
      // )
      //   .then(() => {
      //     console.log('Write: ' + data);
      //     ToastAndroid.show('Message sent', 3000);
      //   })
      //   .catch(error => {
      //     console.log('Write error:', error);
      //     Alert.alert('Message Not Sent', `${error}`, [{ text: 'OK', onPress: () => console.log('alert closed') }]);
      //   });
    }
  };

  return (
    <SafeAreaView style={styles.mainBody}>
      <View style={styles.bodyContainer}>
        <StatusBar backgroundColor={styles.titleContainer.backgroundColor} />
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Jewellery Automation</Text>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.actionCard}>
            <Text style={styles.switchTxt}>Temple Switch</Text>
            <View style={styles.buttonPack}>
              <TouchableOpacity
                onPress={() => sendDataToESP32('U', 'tempup')}
                style={[styles.button, { opacity: buttonState['tempup'] }]}>
                <FontAwesomeIcon icon={faCircleUp} size={42} color="#2196F3" style={{ opacity: buttonState.tempup }} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => sendDataToESP32('S', 'tempstop')}
                style={[styles.button, { opacity: buttonState['tempstop'] }]}>
                <FontAwesomeIcon
                  icon={faCircleStop}
                  size={42}
                  color="#2196F3"
                  style={{ opacity: buttonState.tempstop }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => sendDataToESP32('D', 'tempdown')}
                style={[styles.button, { opacity: buttonState['tempdown'] }]}>
                <FontAwesomeIcon
                  icon={faCircleDown}
                  size={42}
                  color="#2196F3"
                  style={{ opacity: buttonState.tempdown }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.actionCard}>
            <Text style={styles.switchTxt}>Arch Switch</Text>
            <View style={styles.buttonPack}>
              <TouchableOpacity
                onPress={() => sendDataToESP32('T', 'archtop')}
                style={[styles.button, { opacity: buttonState['archtop'] }]}>
                <FontAwesomeIcon icon={faCircleUp} size={42} color="#2196F3" style={{ opacity: buttonState.archtop }} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => sendDataToESP32('A', 'archstop')}
                style={[styles.button, { opacity: buttonState['archstop'] }]}>
                <FontAwesomeIcon
                  icon={faCircleStop}
                  size={42}
                  color="#2196F3"
                  style={{ opacity: buttonState.archstop }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => sendDataToESP32('B', 'archbottom')}
                style={[styles.button, { opacity: buttonState['archbottom'] }]}>
                <FontAwesomeIcon
                  icon={faCircleDown}
                  size={42}
                  color="#2196F3"
                  style={{ opacity: buttonState.archbottom }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.actionCard}>
            <Text style={styles.switchTxt}>Lotus Switch</Text>
            <View style={styles.buttonPack}>
              <TouchableOpacity
                onPress={() => sendDataToESP32('O', 'lotusopen')}
                style={[styles.button, { opacity: buttonState['lotusopen'] }]}>
                <FontAwesomeIcon
                  icon={faCircleUp}
                  size={42}
                  color="#2196F3"
                  style={{ opacity: buttonState.lotusopen }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => sendDataToESP32('L', 'lotusstop')}
                style={[styles.button, { opacity: buttonState['lotusstop'] }]}>
                <FontAwesomeIcon
                  icon={faCircleStop}
                  size={42}
                  color="#2196F3"
                  style={{ opacity: buttonState.lotusstop }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => sendDataToESP32('C', 'lotusclose')}
                style={[styles.button, { opacity: buttonState['lotusclose'] }]}>
                <FontAwesomeIcon
                  icon={faCircleDown}
                  size={42}
                  color="#2196F3"
                  style={{ opacity: buttonState.lotusclose }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.allContainer}>
            <TouchableOpacity
              onPress={() => {
                sendDataToESP32('F');
              }}
              style={[styles.allConnectCard, { opacity: buttonState['alloff'] }]}>
              <Text style={styles.switchTxt}>All Off</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                sendDataToESP32('G');
              }}
              style={[styles.allConnectCard, { opacity: buttonState['allon'] }]}>
              <Text style={styles.switchTxt}>All On</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              disconnectDevice();
            }}
            style={styles.disconnectCard}>
            <Text style={styles.switchTxt}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    height: '100%',
    backgroundColor: '#d3d3d3',
  },
  titleContainer: {
    width: '100%',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
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
    fontSize: 24,
    color: '#fff',
    marginBottom: '2%',
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: '#efefef',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  actionCard: {
    opacity: 0.8,
    margin: '3%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: '4%',
    backgroundColor: '#E4E4E4',
    width: '93%',
    height: '20%',
    paddingVertical: '5%',
    borderRadius: 25,
    elevation: 2,
  },
  switchTxt: {
    color: '#282828',
    fontSize: 20,
    fontFamily: 'Roboto-Regular',
    marginBottom: '6%',
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
    elevation: 1.5,
    backgroundColor: '#E4E4E4',
    height: '10%',
    marginVertical: '3%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    paddingHorizontal: '33%',
  },
  allConnectCard: {
    elevation: 2,
    backgroundColor: '#E4E4E4',
    marginHorizontal: '1%',
    justifyContent: 'center',
    borderRadius: 25,
    paddingHorizontal: '15.5%',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  allContainer: {
    flexDirection: 'row',
    marginVertical: '3%',
    height: '10%',
  },
});

export default ConnectedScreen;
