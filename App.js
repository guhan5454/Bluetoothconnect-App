import React, { useContext, useEffect } from 'react';
import { AppContext, AppProvider } from './Context/Context';
import ConnectedScreen from './screens/connectedScreen';
import ConnectingScreen from './screens/checkScreen';
import SplashScreen from 'react-native-splash-screen'


const MainNavigator = () => {
  const { isConnected, setIsConnected } = useContext(AppContext);
  return isConnected['connection'] ? <ConnectedScreen /> : <ConnectingScreen />;
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
