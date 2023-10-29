import React, { useState, useContext, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  StatusBar,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { faLock, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { AppContext } from '../Context/Context';

export default function checkScreen() {
  const [username, setUsername] = useState('');
  const [password, setPasssword] = useState('');
  const { isLoggedIn, setIsLoggedIn } = useContext(AppContext);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const passwordInputRef = useRef(null);

  const storeData = async (username, password) => {
    try {
      const jsonValue = JSON.stringify({ id: username, pass: password });
      await AsyncStorage.setItem('login-key', jsonValue);
      // console.log('done');
    } catch (e) {
      // saving error
      // console.log('saving error');
    }
  };

  function loginHandler() {
    if (username.trim() == 'swarnamandhir' && password == 'admin') {
      storeData(username.trim(), password);
      setIsLoggedIn(true);
      // console.log('done saving');
    } else {
      Alert.alert('Invalid Login Credential', 'Try Again', [
        { text: 'OK', onPress: () => console.log('alert closed') },
      ]);
    }
  }

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <LinearGradient
          colors={['#f0b52b', '#e67446']}
          locations={[0, 0.9]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0.5, y: 0.5 }}
          style={styles.Container}>
          <StatusBar translucent={true} backgroundColor={'transparent'} />
          <View style={styles.TitleContainer}>
            <Image source={require('../assets/logo.png')} style={styles.imageStyle} />
          </View>
          <View style={styles.BodyContainer}>
            <Text style={styles.Heading}>Welcome</Text>
            <View style={styles.InputContainer}>
              <TextInput
                placeholder="Username"
                placeholderTextColor={'#434242'}
                value={username}
                autoCapitalize="none"
                onChangeText={val => {
                  setUsername(val);
                }}
                returnKeyType="next" // Set returnKeyType to "next"
                onSubmitEditing={() => passwordInputRef.current.focus()} // Move focus to the password input
                style={styles.TxtInput}
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TextInput
                  ref={passwordInputRef} // Set the ref for password input
                  placeholder="Password"
                  placeholderTextColor={'#434242'}
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  autoCapitalize="none"
                  onChangeText={val => {
                    setPasssword(val);
                  }}
                  style={styles.TxtInput}
                  onSubmitEditing={() => loginHandler()}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle password visibility
                  style={{
                    position: 'absolute',
                    top: '40%',
                    marginHorizontal: '3%',
                  }}>
                  <Text style={{ color: '#000' }}>
                    {isPasswordVisible ? (
                      <FontAwesomeIcon icon={faUnlock} size={20} color="#434242" />
                    ) : (
                      <FontAwesomeIcon icon={faLock} size={20} color="#434242" />
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
              <LinearGradient
                colors={['#f0b52b', '#e67446']}
                locations={[0, 0.7]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.ButtonContainer}>
                <TouchableOpacity style={styles.Button} onPress={() => loginHandler()}>
                  <Text style={styles.Txt}>Login</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FF',
  },
  TitleContainer: {
    width: '100%',
    height: '35%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  BodyContainer: {
    width: '100%',
    height: '65%',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  imageStyle: {
    justifyContent: 'center',
    width: '90%',
    height: '50%',
    resizeMode: 'contain',
    alignItems: 'center',
  },
  Heading: {
    color: '#EC5315',
    fontSize: 34,
    fontWeight: 'bold',
    marginHorizontal: '7%',
    marginTop: 18,
  },
  InputContainer: {
    alignItems: 'center',
    marginVertical: 18,
    display: 'flex',
  },
  TxtInput: {
    borderWidth: 2,
    borderColor: '#f0b22b',
    borderRadius: 18,
    width: '90%',
    height: 58,
    paddingHorizontal: '5%',
    marginVertical: 15,
    color: '#000',
    fontSize: 15.5,
    // marginBottom:100
  },
  ButtonContainer: {
    opacity: 0.9,
    elevation: 2,
    backgroundColor: '#F8F9FF',
    borderRadius: 13,
    width: '90%',
    height: 55,
    marginTop: '30%',
  },
  Button: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Txt: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
});
