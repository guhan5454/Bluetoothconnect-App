import React, { useState, useEffect } from 'react';
import {
    Text, View, StatusBar, Image, StyleSheet, Dimensions, SafeAreaView, NativeModules, ToastAndroid, Alert,
    useColorScheme, ActivityIndicator, Touchable, TouchableOpacity
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { faCircleStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
const App = () => {

    const [isConnected, setIsConnected] = useState({
        'connection': true,
        'bluetooth': true,
        'ble': false,
        'location': false,
    });


    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : "#f6f6f6",
    };
    return (
        <SafeAreaView style={[backgroundStyle, styles.mainBody]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <View style={[backgroundStyle, styles.titleContainer]}>
                <Text style={styles.titleText}>Jewellery Automation</Text>
            </View>
            {/* Checks connection */}
            {isConnected['connection'] ?
                // if connected
                <View style={styles.bodyContainer}>
                    <View style={[backgroundStyle, styles.bluetoothConnect]}>
                        <Text style={styles.switchTxt}>Temple Switch</Text>
                        <View style={styles.buttonPack}>
                            <TouchableOpacity style={styles.button}>
                                <FontAwesomeIcon icon={faCircleStop} color={'#111'} size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <FontAwesomeIcon icon={faCircleStop} color={'#111'} size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <FontAwesomeIcon icon={faCircleStop} color={'#111'} size={20} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[backgroundStyle, styles.bluetoothConnect]}>
                        <Text style={styles.switchTxt}>Arch Switch</Text>
                        <View style={styles.buttonPack}>
                            <TouchableOpacity style={styles.button}>
                                <FontAwesomeIcon icon={faCircleStop} color={'#111'} size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <FontAwesomeIcon icon={faCircleStop} color={'#111'} size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <FontAwesomeIcon icon={faCircleStop} color={'#111'} size={20} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[backgroundStyle, styles.bluetoothConnect]}>
                        <Text style={styles.switchTxt}>Lotus Switch</Text>
                        <View style={styles.buttonPack}>
                            <TouchableOpacity style={styles.button}>
                                <FontAwesomeIcon icon={faCircleStop} color={'#111'} size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <FontAwesomeIcon icon={faCircleStop} color={'#111'} size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button}>
                                <FontAwesomeIcon icon={faCircleStop} color={'#111'} size={20} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                : //if not connected
                <View style={styles.bodyContainer}>
                    <View style={styles.connectionbar}>
                        <Text style={{ fontSize: 18, color: '#434342' }}>Turning bluetooth</Text>
                        {isConnected['bluetooth'] ?
                            <Image source={require('./assets/icons/check_circle.png')} style={styles.tick} />
                            :
                            <ActivityIndicator color='#1b9bd1' size='large' />
                        }
                    </View>
                    <View style={styles.connectionbar}>
                        <Text style={{ fontSize: 18, color: '#434342' }}>BLE Initialization</Text>
                        {isConnected['ble'] ?
                            <Image source={require('./assets/icons/check_circle.png')} style={styles.tick} />
                            :
                            <ActivityIndicator color='#1b9bd1' size='large' />
                        }
                    </View>
                    <View style={styles.connectionbar}>
                        <Text style={{ fontSize: 18, color: '#434342' }}>Location Access</Text>
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
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        height: windowHeight,
    },
    titleContainer: {
        height: '10%',
        padding: '5%',
        paddingTop: '3%',
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
        flexDirection: 'row',
        backgroundColor: '#fff',
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
    bluetoothConnect: {
        height: '20%',
        width: '95%',
        margin: '5%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#8CD4FF',
        paddingHorizontal: '4%',
        borderRadius: 25,
    },
    switchTxt: {
        color: '#fff',
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
