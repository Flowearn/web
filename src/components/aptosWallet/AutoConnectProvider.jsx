/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-06-17 14:48:02
 * @LastEditors: chenhua
 * @LastEditTime: 2024-06-17 15:22:37
 */
import React, { createContext, useContext, useEffect, useState } from "react";

const AUTO_CONNECT_LOCAL_STORAGE_KEY = "AptosWalletAutoConnect";

const AutoConnectContext = createContext({});

export function useAutoConnect() {
  return useContext(AutoConnectContext);
}

export const AutoConnectProvider = ({ children }) => {
  const [autoConnect, setAutoConnect] = useState(true);

  useEffect(() => {
    // Wait until the app hydrates before populating `autoConnect` from local storage
    try {
      const isAutoConnect = localStorage.getItem(AUTO_CONNECT_LOCAL_STORAGE_KEY);
      if (isAutoConnect) return setAutoConnect(JSON.parse(isAutoConnect));
    } catch (e) {
      if (typeof window !== "undefined") {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    try {
      if (!autoConnect) {
        localStorage.removeItem(AUTO_CONNECT_LOCAL_STORAGE_KEY);
      } else {
        localStorage.setItem(AUTO_CONNECT_LOCAL_STORAGE_KEY, JSON.stringify(autoConnect));
      }
    } catch (error) {
      if (typeof window !== "undefined") {
        console.error(error);
      }
    }
  }, [autoConnect]);

  return <AutoConnectContext.Provider value={{ autoConnect, setAutoConnect }}>{children}</AutoConnectContext.Provider>;
};
