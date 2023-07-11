import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ToastAndroid,
  Alert,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {faCircle, faArrowLeft, faArrowRight, faArrowUp, faArrowDown} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';


import BleManager from 'react-native-ble-manager';

const ConnectedScreen = () => {
  const [isConnected, setIsConnected] = useState({
    connection: false,
    bluetooth: false,
    ble: false,
    location: false,
  });

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
        ToastAndroid.show('Message sent', 1000);
      })
      .catch(error => {
        console.log('Write error:', error);
        Alert.alert('Message Not Sent', `${error}`, [{text: 'OK', onPress: () => console.log('alert closed')}]);
      });
  };

  return (
    <SafeAreaView style={styles.mainBody}>
      <StatusBar backgroundColor={styles.titleContainer.backgroundColor} />
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Jewellery Automation</Text>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.actionCard}>
          <Text style={styles.switchTxt}>Temple Switch</Text>
          <View style={styles.buttonPack}>
            <TouchableOpacity onPress={() => sendDataToESP32('C')} style={styles.button}>
              <FontAwesomeIcon icon={faArrowLeft} size={20} color="#282828" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
              <FontAwesomeIcon icon={faCircle} size={20} color="#9F1F1F" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => sendDataToESP32('O')} style={styles.button}>
              <FontAwesomeIcon icon={faArrowRight} size={20} color="#282828" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.actionCard}>
          <Text style={styles.switchTxt}>Arch Switch</Text>
          <View style={styles.buttonPack}>
            <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
              <FontAwesomeIcon icon={faArrowLeft} size={20} color="#282828" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
              <FontAwesomeIcon icon={faCircle} size={20} color="#9F1F1F" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
              <FontAwesomeIcon icon={faArrowRight} size={20} color="#282828" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.actionCard}>
          <Text style={styles.switchTxt}>Lotus Switch</Text>
          <View style={styles.buttonPack}>
            <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
              <FontAwesomeIcon icon={faArrowLeft} size={20} color="#282828" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
              <FontAwesomeIcon icon={faCircle} size={20} color="#9F1F1F" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
              <FontAwesomeIcon icon={faArrowRight} size={20} color="#282828" />
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
    height: '14%',
    padding: '5%',
    paddingTop: '3%',
    backgroundColor: '#007acc',
    justifyContent: 'center',
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
    margin: '3%',
    alignItems: 'center',
    paddingHorizontal: '4%',
    backgroundColor: '#DCDADA',
    width: '93%',
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
    paddingHorizontal: '30%',
  },
  button: {
    marginHorizontal: '45%',
  },
  disconnectCard: {
    elevation: 2,
    backgroundColor: '#DCDADA',
    height: '10%',
    width: '93%',
    paddingTop: '4%',
    margin: '3%',
    alignItems: 'center',
    paddingHorizontal: '4%',
    borderRadius: 25,
  },
});

export default ConnectedScreen;
