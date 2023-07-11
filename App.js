import React, { useContext } from 'react';
import { AppContext, AppProvider } from './Context/Context';
import ConnectedScreen from './screens/connectedScreen';
import ConnectingScreen from './screens/connectingScreen';

const MainNavigator = () => {
  const { isConnected, setIsConnected } = useContext(AppContext);
  return isConnected['connection'] ? <ConnectedScreen /> : <ConnectingScreen />;
};

export default function App() {
  return (
    <AppProvider>
      <MainNavigator />
    </AppProvider>
  );
}
