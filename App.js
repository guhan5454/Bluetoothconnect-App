// import React, {useState, useEffect} from 'react';
// import {
//   Text,
//   View,
//   Platform,
//   StyleSheet,
//   SafeAreaView,
//   NativeModules,
//   ToastAndroid,
//   Alert,
//   TouchableOpacity,
//   NativeEventEmitter,
//   PermissionsAndroid,
//   ActivityIndicator,
//   StatusBar,
// } from 'react-native';
// import BleManager from 'react-native-ble-manager';
// import {
//   faCircle,
//   faArrowLeft,
//   faArrowRight,
//   faCircleCheck,
//   faArrowUp,
//   faArrowDown,
// } from '@fortawesome/free-solid-svg-icons';
// import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

// const BleManagerModule = NativeModules.BleManager;
// const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

// const App = () => {
//   const [isConnected, setIsConnected] = useState({
//     connection: false,
//     bluetooth: false,
//     ble: false,
//     location: false,
//   });

//   useEffect(() => {
//     // turn on bluetooth if it is not on
//     BleManager.enableBluetooth()
//       .then(() => {
//         console.log('Bluetooth is turned on!');
//         setIsConnected(prev => {
//           return {
//             ...prev,
//             bluetooth: true,
//           };
//         });
//       })
//       .catch(err => {
//         console.log('Catched Error:', err);
//         Alert.alert('Bluetooth not enabled', 'Turn on Bluetooth and try again', [
//           {text: 'OK', onPress: () => console.log('alert closed')},
//         ]);
//       });
//     // start bluetooth manager
//     BleManager.start({showAlert: false}).then(() => {
//       console.log('BLE Manager initialized');
//       setIsConnected(prev => {
//         return {
//           ...prev,
//           ble: true,
//         };
//       });
//     });
//     let stopListener = BleManagerEmitter.addListener('BleManagerStopScan', () => {
//       setIsScanning(false);
//       console.log('Scan is stopped');
//       handleGetConnectedDevices();
//     });
//     if (Platform.OS === 'android') {
//       PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(result => {
//         if (result) {
//           console.log('Permission is OK');
//           setIsConnected(prev => {
//             return {
//               ...prev,
//               location: true,
//             };
//           });
//         } else {
//           PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(result => {
//             if (result) {
//               console.log('User accept');
//               setIsConnected(prev => {
//                 return {
//                   ...prev,
//                   location: true,
//                 };
//               });
//             } else {
//               console.log('User refuse');
//               Alert.alert('Permission Needed', 'App requires Location Permission', [
//                 {text: 'OK', onPress: () => console.log('alert closed')},
//               ]);
//             }
//           });
//         }
//       });
//     }
//     return () => {
//       stopListener.remove();
//     };
//   }, []);

//   const connectDevice = () => {
//     setIsConnected(prev => {
//       return {
//         ...prev,
//         connection: true,
//       };
//     });
//     // ToastAndroid.show('Connecting...', 1000);
//     // BleManager.connect('64:E8:33:DA:B9:26')
//     //   .then(() => {
//     //     // Success code
//     //     ToastAndroid.show('Connected', 1000);
//     //     console.log('Connected');
//     //     //state
//     //   })
//     //   .catch(error => {
//     //     // Failure code
//     //     console.log(error);
//     //     Alert.alert("Couldn't Connect", `${error}`, [{text: 'OK', onPress: () => console.log('alert closed')}]);
//     //   });
//   };

//   const disconnectDevice = () => {
//     setIsConnected(prev => {
//       return {
//         ...prev,
//         connection: false,
//       };
//     });
//     // BleManager.disconnect('64:E8:33:DA:B9:26')
//     //   .then(() => {
//     //     // Success code
//     //     console.log('Disconnected');
//     //     //state
//     //   })
//     //   .catch(error => {
//     //     // Failure code
//     //     console.log(error);
//     //     Alert.alert("Couldn't Disconnect", `${error}`, [{text: 'OK', onPress: () => console.log('alert closed')}]);
//     //   });
//   };
//   const sendDataToESP32 = str => {
//     const str1 = str;
//     const data = str1.charCodeAt(0); //converts to ASCII
//     // console.log(data);

//     BleManager.write(
//       '64:E8:33:DA:B9:26',
//       '2e83cb78-c55e-4172-a529-e9597e98aa53',
//       'f101a3de-99aa-4375-bc5d-8e58679e267c',
//       [data],
//     )
//       .then(() => {
//         console.log('Write: ' + data);
//         ToastAndroid.show('Message sent', 1000);
//       })
//       .catch(error => {
//         console.log('Write error:', error);
//         Alert.alert('Message Not Sent', `${error}`, [{text: 'OK', onPress: () => console.log('alert closed')}]);
//       });
//   };

//   const ConnectedView = () => (
//     <View style={styles.bodyContainer}>
//       <View style={styles.actionCard}>
//         <Text style={styles.switchTxt}>Temple Switch</Text>
//         <View style={styles.buttonPack}>
//           <TouchableOpacity onPress={() => sendDataToESP32('C')} style={styles.button}>
//             <FontAwesomeIcon icon={faArrowLeft} size={20} color="#282828" />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
//             <FontAwesomeIcon icon={faCircle} size={20} color="#9F1F1F" />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => sendDataToESP32('O')} style={styles.button}>
//             <FontAwesomeIcon icon={faArrowRight} size={20} color="#282828" />
//           </TouchableOpacity>
//         </View>
//       </View>
//       <View style={styles.actionCard}>
//         <Text style={styles.switchTxt}>Arch Switch</Text>
//         <View style={styles.buttonPack}>
//           <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
//             <FontAwesomeIcon icon={faArrowLeft} size={20} color="#282828" />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
//             <FontAwesomeIcon icon={faCircle} size={20} color="#9F1F1F" />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
//             <FontAwesomeIcon icon={faArrowRight} size={20} color="#282828" />
//           </TouchableOpacity>
//         </View>
//       </View>
//       <View style={styles.actionCard}>
//         <Text style={styles.switchTxt}>Lotus Switch</Text>
//         <View style={styles.buttonPack}>
//           <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
//             <FontAwesomeIcon icon={faArrowLeft} size={20} color="#282828" />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
//             <FontAwesomeIcon icon={faCircle} size={20} color="#9F1F1F" />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => sendDataToESP32('F')} style={styles.button}>
//             <FontAwesomeIcon icon={faArrowRight} size={20} color="#282828" />
//           </TouchableOpacity>
//         </View>
//       </View>
//       <TouchableOpacity
//         onPress={() => {
//           sendDataToESP32('F');
//         }}
//         style={styles.disconnectCard}>
//         <Text style={styles.switchTxt}>All Off</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={() => {
//           disconnectDevice();
//         }}
//         style={styles.disconnectCard}>
//         <Text style={styles.switchTxt}>Disconnect</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const DisconnectedView = () => (
//     <View style={styles.bodyContainer}>
//       <View style={styles.connectionbar}>
//         <Text style={{fontSize: 18, color: '#111', fontFamily: 'Roboto-Regular'}}>Turning bluetooth</Text>
//         {isConnected['bluetooth'] ? (
//           <FontAwesomeIcon icon={faCircleCheck} size={30} color="#005c4b" style={{opacity: 0.9}} />
//         ) : (
//           <ActivityIndicator color="green" size="large" />
//         )}
//       </View>
//       <View style={styles.connectionbar}>
//         <Text style={{fontSize: 18, color: '#111', fontFamily: 'Roboto-Regular'}}>BLE Initialization</Text>
//         {isConnected['ble'] ? (
//           <FontAwesomeIcon icon={faCircleCheck} size={30} color="#005c4b" style={{opacity: 0.9}} />
//         ) : (
//           <ActivityIndicator color="green" size="large" />
//         )}
//       </View>
//       <View style={styles.connectionbar}>
//         <Text style={{fontSize: 18, color: '#111', fontFamily: 'Roboto-Regular'}}>Location Access</Text>
//         {isConnected['location'] ? (
//           <FontAwesomeIcon icon={faCircleCheck} size={30} color="#005c4b" style={{opacity: 0.9}} />
//         ) : (
//           <ActivityIndicator color="green" size="large" />
//         )}
//       </View>
//       <TouchableOpacity
//         onPress={() => {
//           connectDevice();
//         }}
//         style={styles.connectButton}>
//         <Text
//           style={{
//             color: '#d3d3d3',
//             fontFamily: 'Roboto-Regular',
//             fontSize: 20,
//           }}>
//           Connect to device
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.mainBody}>
//       <StatusBar backgroundColor={styles.titleContainer.backgroundColor}/>
//       <View style={styles.titleContainer}>
//         <Text style={styles.titleText}>Jewellery Automation</Text>
//       </View>
//       {isConnected.connection ? ConnectedView() : DisconnectedView()}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   mainBody: {
//     flex: 1,
//     height: '100%',
//     backgroundColor: '#d3d3d3',
//   },
//   titleContainer: {
//     height: '14%',
//     padding: '5%',
//     paddingTop: '3%',
//     backgroundColor: '#007acc',
//     justifyContent: 'center',
//     marginBottom: '5%',
//   },
//   titleText: {
//     fontFamily: 'Roboto-Medium',
//     fontSize: 27,
//     color: '#fff',
//     marginBottom: '2%',
//   },
//   bodyContainer: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//   },
//   connectionbar: {
//     elevation: 20,
//     flexDirection: 'row',
//     backgroundColor: '#DCDADA',
//     height: '10%',
//     width: '80%',
//     justifyContent: 'space-evenly',
//     alignItems: 'center',
//     borderRadius: 20,
//     margin: '2%',
//   },
//   connectButton: {
//     elevation: 100,
//     backgroundColor: '#33AEEE',
//     height: '9.5%',
//     width: '80%',
//     alignItems: 'center',
//     justifyContent: 'space-evenly',
//     borderRadius: 60,
//     marginTop: '30%',
//   },
//   actionCard: {
//     margin: '3%',
//     alignItems: 'center',
//     paddingHorizontal: '4%',
//     backgroundColor: '#d3d3d3',
//     width: '93%',
//     paddingVertical: '5%',
//     borderRadius: 25,
//     elevation: 2,
//   },
//   switchTxt: {
//     color: '#282828',
//     fontSize: 20,
//     fontFamily: 'Roboto-Regular',
//     marginBottom: '6%',
//   },
//   buttonPack: {
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     paddingHorizontal: '30%',
//   },
//   button: {
//     marginHorizontal: '45%',
//   },
//   disconnectCard: {
//     elevation: 2,
//     backgroundColor: '#d3d3d3',
//     height: '10%',
//     width: '93%',
//     paddingTop: '4%',
//     margin: '3%',
//     alignItems: 'center',
//     paddingHorizontal: '4%',
//     borderRadius: 25,
//   },
// });
// export default App;


import { View, Text } from 'react-native'
import React from 'react'

export default function App() {
  return (
    <View>
      <Text>App</Text>
    </View>
  )
}