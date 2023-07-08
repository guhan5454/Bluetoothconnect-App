import React, { useState, useEffect } from 'react';
import {
    Text, View, Platform, StatusBar, StyleSheet, Dimensions, SafeAreaView, NativeModules, ToastAndroid,
    useColorScheme, TouchableOpacity, NativeEventEmitter, PermissionsAndroid, Image, Switch
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function App() {

    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : "#f6f6f6",
    };
    const device = '64:E8:33:DA:B9:26';
    const [switchVal, setSwitchVal] = useState(false);

    return (
        <SafeAreaView style={[backgroundStyle, styles.mainBody]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <View style={[backgroundStyle, styles.titleContainer]}>
                <Text style={styles.titleText}>Jewellery Automation</Text>
            </View>
            <View style={[backgroundStyle, styles.bluetoothConnect]}>
                <View>
                    <Text style={{ color: '#fff', fontSize: 18 }}>Connect to your Device</Text>
                    <Text style={{ color: '#fff', fontSize: 15 }}>{device}</Text>
                </View>
                <Switch
                    rackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={switchVal ? '#fff' : '#f4f3f4'}
                    onValueChange={() => setSwitchVal(!switchVal)}
                    value={switchVal}
                />
            </View>
            <View style={[backgroundStyle, styles.buttonContainer]}>
                <View style={styles.segmentContainer}>
                    <TouchableOpacity
                        style={styles.actuateButton}>
                        <Text style={styles.buttonTxt}>Button</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actuateButton}>
                        <Text style={styles.buttonTxt}>Connect</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.segmentContainer}>
                    <TouchableOpacity
                        style={styles.actuateButton}>
                        <Text style={styles.buttonTxt}>Connect</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actuateButton}>
                        <Text style={styles.buttonTxt}>Connect</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.segmentContainer}>
                    <TouchableOpacity
                        style={styles.actuateButton}>
                        <Text style={styles.buttonTxt}>Button</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actuateButton}>
                        <Text style={styles.buttonTxt}>Connect</Text>
                    </TouchableOpacity>
                </View >
                <View style={{ width: "100%", height:"10%" }}>
                    <TouchableOpacity
                        style={styles.allButton}>
                        <Text style={styles.buttonTxt}>All Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: windowHeight,
    },
    titleContainer: {
        height: '10%',
        width: '97%',
        padding: '2%',
        paddingTop:'5%',
        // backgroundColor: 'grey',
        justifyContent: 'center',
    },
    titleText: {
        fontFamily: 'Roboto-Medium',
        fontSize: 27,
        color: '#1b473e',
        marginBottom: '2%',
    },
    bluetoothConnect: {
        height: '15%',
        width: '95%',
        margin: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#86ced0',
        paddingHorizontal: '4%',
        paddingTop: '4.5%',
        borderRadius: 25,
    },
    buttonContainer: {
        height: '70%',
        backgroundColor: '#fff',
        shadowOpacity:'2%',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius:25,
        borderTopLeftRadius:25,
        paddingHorizontal: '2%',
        paddingTop: '5%',
    },
    segmentContainer: {
        flexDirection: 'row',
        height: '30%'
    },
    actuateButton: {
        height: '50%',
        width: '43%',
        // backgroundColor: '#a2d4d4',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        margin: '3%',
    },
    buttonTxt: {
        fontSize: 18,
        fontFamily: 'Roboto-Bold',
        color: '#f8f8f8'
    },
    allButton: {
        height: '90%',
        width: '100%',
        paddingHorizontal:'20%',
        // backgroundCol+
        or: '#a2d4d4',
        borderRadius:25,
        justifyContent:'center',
    }
});
