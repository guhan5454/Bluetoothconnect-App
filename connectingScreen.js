import { View, Text } from 'react-native'
import React from 'react'

export default function connectingScreen() {
  return (
    <View style={styles.bodyContainer}>
      <View style={styles.connectionbar}>
        <Text style={{fontSize: 18, color: '#111', fontFamily: 'Roboto-Regular'}}>Turning bluetooth</Text>
        {isConnected['bluetooth'] ? (
          <FontAwesomeIcon icon={faCircleCheck} size={30} color="#005c4b" style={{opacity: 0.9}} />
        ) : (
          <ActivityIndicator color="green" size="large" />
        )}
      </View>
      <View style={styles.connectionbar}>
        <Text style={{fontSize: 18, color: '#111', fontFamily: 'Roboto-Regular'}}>BLE Initialization</Text>
        {isConnected['ble'] ? (
          <FontAwesomeIcon icon={faCircleCheck} size={30} color="#005c4b" style={{opacity: 0.9}} />
        ) : (
          <ActivityIndicator color="green" size="large" />
        )}
      </View>
      <View style={styles.connectionbar}>
        <Text style={{fontSize: 18, color: '#111', fontFamily: 'Roboto-Regular'}}>Location Access</Text>
        {isConnected['location'] ? (
          <FontAwesomeIcon icon={faCircleCheck} size={30} color="#005c4b" style={{opacity: 0.9}} />
        ) : (
          <ActivityIndicator color="green" size="large" />
        )}
      </View>
      <TouchableOpacity
        onPress={() => {
          connectDevice();
        }}
        style={styles.connectButton}>
        <Text
          style={{
            color: '#d3d3d3',
            fontFamily: 'Roboto-Regular',
            fontSize: 20,
          }}>
          Connect to device
        </Text>
      </TouchableOpacity>
    </View>
  )
};