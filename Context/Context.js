import React ,{useContext, useState} from 'react';

export const AppContext = React.createContext({});

export const AppProvider = ({ children }) => {
  const[apiresult, setApiResult] = useState()
  const [globalData, setGlobalData] = React.useState([]);
  const [spamdata, setSpamdata] = useState([])

  return (
    <AppContext.Provider value={{ globalData, setGlobalData, apiresult, setApiResult,spamdata, setSpamdata }}>
      {children}
    </AppContext.Provider>
  );
};
