import React, { useContext, useState } from 'react';

export const AppContext = React.createContext({});

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [deviceId, setDeviceId] = useState('');

  const [isConnected, setIsConnected] = useState({
    bluetoothAccess: false,
    locationAccess: false,
    enableBluetooth: false,
    ble:false,
    locationEnabled:false,
    scan: false,
    connection: false,
  });

  return (
    <AppContext.Provider value={{ isConnected, setIsConnected, isLoggedIn, setIsLoggedIn, deviceId, setDeviceId }}>
      {children}
    </AppContext.Provider>
  );
};
