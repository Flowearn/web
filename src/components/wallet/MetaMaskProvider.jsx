/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-06-12 16:18:35
 * @LastEditors: chenhua
 * @LastEditTime: 2024-06-12 16:26:52
 */
// MetaMaskProvider.js
import React, { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";

const MetaMaskContext = React.createContext();

export const useMetaMaskWallet = () => {
  return React.useContext(MetaMaskContext);
};

function MetaMaskProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const initMetaMask = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        setProvider(provider);
        const accounts = await provider.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
        provider.on("accountsChanged", (accounts) => {
          setAccount(accounts[0]);
        });
      } else {
        console.error("MetaMask not detected");
      }
    };

    initMetaMask();
  }, []);

  return <MetaMaskContext.Provider value={{ provider, account }}>{children}</MetaMaskContext.Provider>;
}

export default MetaMaskProvider;
