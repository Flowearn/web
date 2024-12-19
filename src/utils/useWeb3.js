import { message } from "antd";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import contractObj from "@utils/contractAccount";
import utils from "@utils/utils";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";

const useMetaMask = () => {
  const [account, setAccount] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [error, setError] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [walletType, setWalletType] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  // const [provider, setProvider] = useState(null);

  // const web3 = new Web3(window?.ethereum);
  // utils.getProvider(walletType)
  // let web3 = null;

  const connectMetaMask = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        setWeb3(web3Instance);
        setWalletType("metamask");
        // await checkNetworkConnection(true);
        await switchNetwork();
        return accounts[0];
      } catch (err) {
        console.error("MetaMask connection error:", err);
        if (err.code === -32002) {
          message.error(err.message);
        } else {
          message.error("Failed to connect MetaMask");
        }
      }
    } else {
      message.error("Please install MetaMask");
    }
  };

  const connectOKXWallet = async () => {
    if (window.okexchain) {
      try {
        const web3Instance = new Web3(window.okexchain);
        await window.okexchain.enable();
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        setWeb3(web3Instance);
        setWalletType("okex");
        // await checkNetworkConnection(false);
        await switchNetwork();
        return accounts[0];
      } catch (err) {
        console.error("OKX Wallet connection error:", err);
        message.error("Failed to connect OKX Wallet");
        return false;
      }
    } else {
      message.error("Please install OKX Wallet");
    }
  };

  const connectSolanaOKXWallet = async () => {
    try {
      const provider = window.okxwallet.solana;
      const resp = await provider.connect();
      const account = resp.publicKey.toString();
      return account;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // 判断网络 ID
  const checkNetwork = async () => {
    if (window?.ethereum) {
      const id = await window?.ethereum.request({ method: "net_version" });
      setNetworkId(id);
    }
  };

  // 添加新网络（需要指定新网络的参数）
  const addNewNetwork = async (networkParams) => {
    try {
      if (window?.ethereum) {
        await window?.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [networkParams],
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // 切换网络（需要指定网络的 chainId）
  const switchNetwork = async () => {
    const chainId = `0x${contractObj.networkId.toString(16)}`;
    try {
      if (window?.ethereum) {
        await window?.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // 获取用户账号地址
  const getAccountAddress = async () => {
    if (web3) {
      const accounts = await web3?.eth.getAccounts();
      setAccount(accounts[0]);
      return accounts[0];
    }
  };

  // 获取用户账户余额
  const getAccountBalance = async (account) => {
    if (web3 && account) {
      const balance = await web3?.eth?.getBalance(account);
      return balance;
    }
    return null;
  };

  // 将 Wei 转换为其他单位
  const fromWei = (value = 0, unit = "ether") => {
    if (web3 && value) {
      return web3?.utils?.fromWei(value, unit);
    }
    return value;
  };

  // 调用合约方法
  const callContractMethod = async (
    contractABI,
    contractAddress,
    methodName,
    isReadOnly,
    args,
    value = 0,
    walletType
  ) => {
    const provider = utils.getProvider(walletType);
    setWeb3(new Web3(provider));
    if (!web3) {
      return null;
    }

    const contract = new web3.eth.Contract(contractABI, contractAddress);
    const accounts = await web3.eth.getAccounts();
    const account = userInfo.address; //accounts[0];
    try {
      let result;
      if (isReadOnly) {
        result = await contract.methods[methodName](...args).call({ from: account });
      } else {
        const gasPrice = await web3.eth.getGasPrice();
        const gasEstimate = await contract.methods[methodName](...args).estimateGas({ from: account, value });
        console.log(methodName, args, value, account, web3.utils.toWei("50", "gwei"), gasEstimate);
        result = await contract.methods[methodName](...args).send({
          from: account,
          value,
          gasPrice,
          gas: gasEstimate + 10000,
        });
      }
      return result;
    } catch (err) {
      console.log(err);
      setError(err.message);
      return null;
    }
  };

  // 监听帐户变更和网络变更
  useEffect(() => {
    if (window?.ethereum) {
      window?.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts.length > 0 ? accounts[0] : null);
      });
      window?.ethereum.on("chainChanged", () => {
        checkNetwork();
      });
    }
  }, []);

  const checkNetworkConnection = async (type) => {
    // 切换网络
    const chainId = `0x${contractObj.networkId.toString(16)}`;
    let provider = type ? window?.ethereum : window?.okxwallet;
    if (provider) {
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [{ chainId: chainId, rpcUrls: [contractObj.rpcUrls] }],
        });
        return true;
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: chainId,
                  chainName: "Scroll Sepolia Testnet",
                  rpcUrls: [contractObj.rpcUrls],
                },
              ],
            });
            // 添加成功，返回结果
            return true;
          } catch (addError) {
            // 添加失败，抛出异常
            // throw addError;
            return addError;
          }
        }
        // 切换失败，抛出异常
        throw switchError;
      }
    }
  };

  const disconnectMetaMask = async () => {
    setAccount(null);
    // setProvider(null);
    setWeb3(null);
  };

  const disconnectFromMetaMask = async () => {
    if (window.ethereum) {
      try {
        // Reset MetaMask connection state if necessary
        if (window.ethereum.isMetaMask) {
          localStorage.removeItem("metamask_session"); // Example placeholder
          console.log("Disconnected from MetaMask");
        }

        // Reset OKX Wallet connection state if necessary
        if (window.okxwallet) {
          await window.okxwallet.disconnect();
          localStorage.removeItem("okxwallet_session"); // Example placeholder
          console.log("Disconnected from OKX Wallet");
        }
      } catch (error) {
        console.error("Error disconnecting wallets:", error);
      }
    }
  };

  const getAllAccount = async () => {
    if (window?.ethereum) {
      const allAccounts = await web3?.eth.getAccounts();
      return allAccounts;
    }
  };

  return {
    networkId,
    checkNetworkConnection,
    connectMetaMask,
    connectOKXWallet,
    checkNetwork,
    addNewNetwork,
    switchNetwork,
    callContractMethod,
    getAccountAddress,
    getAccountBalance,
    fromWei,
    disconnectFromMetaMask,
    getAllAccount,
    error,
    connectSolanaOKXWallet,
  };
};

export default useMetaMask;
