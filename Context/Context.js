import React, { useContext, useState } from 'react';

export const AppContext = React.createContext({});

export const AppProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState({
    connection: false,
    bluetooth: false,
    ble: false,
    location: false,
  });
  const [timing, setTiming] = useState(false);

  return <AppContext.Provider value={{ isConnected, setIsConnected, timing, setTiming }}>{children}</AppContext.Provider>;
};
