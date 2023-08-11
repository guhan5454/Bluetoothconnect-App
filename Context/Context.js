import React, { useContext, useState } from 'react';

export const AppContext = React.createContext({});

export const AppProvider = ({ children }) => {
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);

  const [isConnected, setIsConnected] = useState({
    connection: false,
    bluetooth: false,
    ble: false,
    permission: false,
  });

  return <AppContext.Provider value={{ isConnected, setIsConnected, isLoggedIn, setIsLoggedIn }}>{children}</AppContext.Provider>;
};
