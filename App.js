import React, { useContext, useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext, AppProvider } from './Context/Context';
import ConnectedScreen from './screens/connectedScreen';
import ConnectingScreen from './screens/checkScreen';
import LoginScreen from './screens/loginScreen';

const MainNavigator = () => {
  const { isConnected, setIsConnected, isLoggedIn, setIsLoggedIn } = useContext(AppContext);

  const checkStoredCredentials = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('login-key');
      if (jsonValue) {
        const { id, pass } = JSON.parse(jsonValue);
        if (id === 'swarnamandhir' && pass === 'admin') {
          setIsLoggedIn(true);
        }
      }
    } catch (e) {
      // error reading value
      console.log('error fetching: ', e);
    }
  };

  useEffect(() => {
    checkStoredCredentials();
  }, []);

  return isLoggedIn ? isConnected['connection'] ? <ConnectedScreen /> : <ConnectingScreen /> : <LoginScreen />;
};

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <AppProvider>
      <MainNavigator />
    </AppProvider>
  );
}
