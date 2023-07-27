import React, { useContext, useState } from 'react';

export const AppContext = React.createContext({});

export const AppProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState({
    connection: false,
    bluetooth: false,
    ble: false,
    location: true,
  });

  return <AppContext.Provider value={{ isConnected, setIsConnected }}>{children}</AppContext.Provider>;
};
