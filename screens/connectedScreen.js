import React, { useContext, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ToastAndroid,
  Alert,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { faCircleStop, faCircleLeft, faCircleRight, faCircleUp, faCircleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { AppContext } from '../Context/Context';
import LinearGradient from 'react-native-linear-gradient';
import BleManager from 'react-native-ble-manager';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

const ConnectedScreen = () => {
  const { isConnected, setIsConnected } = useContext(AppContext);

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
              connection:false,
              bluetooth: false,
            };
          });
          break;
        default:
          break;
      }
      // console.log("\n Bluetooth State:",bluetoothState);
    }, true /*=emitCurrentState*/);
  }, [isConnected['bluetooth']]);

  const disconnectDevice = () => {
    setIsConnected(prev => {
      return {
        ...prev,
        connection: false,
      };
    });
    // BleManager.disconnect('64:E8:33:DA:B9:26')
    //   .then(() => {
    //     // Success code
    //     console.log('Disconnected');
    // ToastAndroid.show('Disconnecting...', 1000);
    //     //state
    //   })
    //   .catch(error => {
    //     // Failure code
    //     console.log(error);
    //     Alert.alert("Couldn't Disconnect", `${error}`, [{text: 'OK', onPress: () => console.log('alert closed')}]);
    //   });
  };

  const sendDataToESP32 = str => {
    const str1 = str;
    const data = str1.charCodeAt(0); //converts to ASCII
    // console.log(data);

    BleManager.write('64:E8:33:DA:B9:26', '2e83cb78-c55e-4172-a529-e9597e98aa53', 'f101a3de-99aa-4375-bc5d-8e58679e267c', [data])
      .then(() => {
        console.log('Write: ' + data);
        ToastAndroid.show('Message sent', 3000);
      })
      .catch(error => {
        console.log('Write error:', error);
        Alert.alert('Message Not Sent', `${error}`, [{ text: 'OK', onPress: () => console.log('alert closed') }]);
      });
  };

  return (
    <SafeAreaView style={styles.mainBody}>
      <LinearGradient colors={['#BBDEFB', '#42A5F5']} angle={45} angleCenter={{ x: 1, y: 0.5 }} style={styles.bodyContainer}>
        <StatusBar backgroundColor={styles.titleContainer.backgroundColor} />
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Jewellery Automation</Text>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.actionCard}>
            <Text style={styles.switchTxt}>Temple Switch</Text>
            <View style={styles.buttonPack}>
              <TouchableOpacity onPress={() => sendDataToESP32('C')} style={styles.button}>
                <FontAwesomeIcon icon={faCircleLeft} size={42} color="#1E88E5" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
                <FontAwesomeIcon icon={faCircleStop} size={42} color="#CE2828" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => sendDataToESP32('O')} style={styles.button}>
                <FontAwesomeIcon icon={faCircleRight} size={42} color="#1E88E5" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.actionCard}>
            <Text style={styles.switchTxt}>Arch Switch</Text>
            <View style={styles.buttonPack}>
              <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
                <FontAwesomeIcon icon={faCircleLeft} size={42} color="#1E88E5" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
                <FontAwesomeIcon icon={faCircleStop} size={42} color="#CE2828" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
                <FontAwesomeIcon icon={faCircleRight} size={42} color="#1E88E5" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.actionCard}>
            <Text style={styles.switchTxt}>Lotus Switch</Text>
            <View style={styles.buttonPack}>
              <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
                <FontAwesomeIcon icon={faCircleLeft} size={42} color="#1E88E5" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
                <FontAwesomeIcon icon={faCircleStop} size={42} color="#CE2828" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
                <FontAwesomeIcon icon={faCircleRight} size={42} color="#1E88E5" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              sendDataToESP32('F');
            }}
            style={styles.disconnectCard}>
            <Text style={styles.switchTxt}>All Off</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              disconnectDevice();
            }}
            style={styles.disconnectCard}>
            <Text style={styles.switchTxt}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  actionCard: {
    opacity: 0.8,
    margin: '3%',
    alignItems: 'center',
    justifyContent:'space-evenly',
    paddingHorizontal: '4%',
    backgroundColor: '#E4E4E4',
    width: '93%',
    height:'20%',
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
    elevation: 2,
    backgroundColor: '#E4E4E4',
    height: '10%',
    width: '90%',
    marginVertical: '3%',
    alignItems: 'center',
    justifyContent:'center',
    paddingHorizontal: '30%',
    borderRadius: 25,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ConnectedScreen;
