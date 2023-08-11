import React, { useContext, useEffect } from 'react';
import { AppContext, AppProvider } from './Context/Context';
import ConnectedScreen from './screens/connectedScreen';
import ConnectingScreen from './screens/checkScreen';
import LoginScreen from './screens/loginScreen';
import SplashScreen from 'react-native-splash-screen'


const MainNavigator = () => {
  const { isConnected, setIsConnected, isLoggedIn, setIsLoggedIn } = useContext(AppContext);
  return isLoggedIn? (isConnected['connection'] ? <ConnectedScreen /> : <ConnectingScreen />) : <LoginScreen/>;
};

export default function App() {
  useEffect(()=> {
    SplashScreen.hide()
  }, [])

  return (
    <AppProvider>
      <MainNavigator />
    </AppProvider>
  );
}
