import React, {useState, useEffect} from 'react';
import {Text, View, Platform, StatusBar, ScrollView, StyleSheet, Dimensions, SafeAreaView, NativeModules,
  useColorScheme, TouchableOpacity, NativeEventEmitter, PermissionsAndroid} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {Colors} from 'react-native/Libraries/NewAppScreen';
const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);
const App = () => {
  // const peripherals = new Map();
  // const [isScanning, setIsScanning] = useState(false);
  // const [connected, setConnected] = useState(false);
  // const [bluetoothDevices, setBluetoothDevices] = useState([]);
  useEffect(() => {
    // turn on bluetooth if it is not on
    BleManager.enableBluetooth().then(() => {
      console.log('Bluetooth is turned on!');
    });
    // start bluetooth manager
    BleManager.start({showAlert: false}).then(() => {
      console.log('BLE Manager initialized');
    });
    let stopListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setIsScanning(false);
        console.log('Scan is stopped');
        handleGetConnectedDevices();
      },
    );
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(result => {
            if (result) {
              console.log('User accept');
            } else {
              console.log('User refuse');
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
      })
      .catch((error) => {
        // Failure code
        console.log(error);
      });
  }
  const disconnectDevice= ()=> {BleManager.disconnect("64:E8:33:DA:B9:26")
  .then(() => {
    // Success code
    console.log("Disconnected");
  })
  .catch((error) => {
    // Failure code
    console.log(error);
  });
}
  const sendDataToESP32 = () => {
    const hexData = "65"; // Replace with your desired hexadecimal data
  
    // Convert hexadecimal data to number array
    const data = hexData
      .match(/.{1,2}/g) // Split hexadecimal data into pairs of characters
      .map((byte) => parseInt(byte, 16)); // Convert each pair to a number
  
    BleManager.write(
      '64:E8:33:DA:B9:26',
      '2e83cb78-c55e-4172-a529-e9597e98aa53',
      'f101a3de-99aa-4375-bc5d-8e58679e267c',
      data
    )
      .then(() => {
        console.log("Write: " + hexData);
      })
      .catch((error) => {
        console.log("Write error:", error);
      });
  };
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  // render list of bluetooth devices
  // const RenderItem = ({peripheral}) => {
  //   const color = peripheral.connected ? 'green' : '#fff';
  //   return (
  //     <>
        
  //     </>
  //   );
  // };
  return (
    <SafeAreaView style={[backgroundStyle, styles.mainBody]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        style={backgroundStyle}
        contentContainerStyle={styles.mainBody}
        contentInsetAdjustmentBehavior="automatic">
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
            marginBottom: 40,
          }}>
          <View>
            <Text
              style={{
                fontSize: 30,
                textAlign: 'center',
                color: isDarkMode ? Colors.white : Colors.black,
              }}>
              Jewellery Automation
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.buttonStyle}
            onPress={connectDevice}>
            <Text style={styles.buttonTextStyle}>
              Connect device
              {/* {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'} */}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.buttonStyle}
            onPress={disconnectDevice}>
            <Text style={styles.buttonTextStyle}>
              Disconnect
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.buttonStyle}
            onPress={sendDataToESP32}>
            <Text style={styles.buttonTextStyle}>
              Send data
              {/* {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'} */}
            </Text>
          </TouchableOpacity>
        </View>
        {/* list of scanned bluetooth devices */}
        
      </ScrollView>
    </SafeAreaView>
  );
};
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    height: windowHeight,
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
});
export default App;
