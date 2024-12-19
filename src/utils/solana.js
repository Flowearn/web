/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-06-13 11:32:32
 * @LastEditors: chenhua
 * @LastEditTime: 2024-09-11 17:09:20
 */
// src/utils/solana.js

import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import contractObj from "@utils/contractAccount";

// Connect to Phantom wallet
const connectPhantom = async () => {
  if (window.solana && window.solana.isPhantom) {
    try {
      // 尝试连接到 Phantom 钱包
      const response = await window.solana.connect();
      // await checkNetWork();
      console.log("Connected to Phantom wallet:", response.publicKey.toString());
      return response.publicKey.toString();
    } catch (err) {
      console.error("Failed to connect to Phantom wallet:", err);
    }
  } else {
    console.error("Phantom wallet not installed");
  }
  return null;
};

// Sign a message
const signSolanaMessage = async (message) => {
  if (window.solana && window.solana.isPhantom) {
    try {
      const encodedMessage = new TextEncoder().encode(message);console.log(encodedMessage, 'encodedMessage----------------encodedMessage')
      const signedMessage = await window.solana.signMessage(encodedMessage, "utf8");
      return signedMessage;
    } catch (err) {
      console.error("Signing failed:", err);
      return null;
    }
  } else {
    console.error("Phantom wallet not found");
    return null;
  }
};

// Get account balance
const getAccountBalance = async (publicKey) => {
  try {
    const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");
    const balance = await connection.getBalance(new PublicKey(publicKey));
    return balance;
  } catch (err) {
    console.error("Failed to get balance:", err);
    return null;
  }
};

// Check or switch network (Solana uses a single network, so this is just an example placeholder)
const checkSolanaNetwork = async () => {
  // For Solana, we generally don't switch networks in the same way as Ethereum
  return clusterApiUrl("mainnet-beta"); // Default to mainnet
};

// Disconnect from Phantom wallet
const disconnectPhantom = async () => {
  if (window.solana && window.solana.isPhantom) {
    try {
      await window.solana.disconnect();
      console.log("Disconnected from Phantom wallet");
      return true;
    } catch (err) {
      console.error("Failed to disconnect:", err);
      return false;
    }
  } else {
    console.error("Phantom wallet not found");
    return false;
  }
};

const getPhantomAccountAddress = () => {
  if (window.solana && window.solana.isPhantom) {
    try {
      const publicKey = window.solana.publicKey.toString();
      console.log("Phantom wallet account address:", publicKey);
      return publicKey;
    } catch (err) {
      console.error("Failed to get Phantom wallet account address:", err);
      return null;
    }
  } else {
    console.error("Phantom wallet not found");
    return null;
  }
};

const checkNetWork = () => {
  let rpcUrl;
  const network = contractObj.network;
  switch (network) {
    case "mainnet-beta":
      rpcUrl = clusterApiUrl("mainnet-beta");
      break;
    case "devnet":
      rpcUrl = clusterApiUrl("devnet");
      break;
    case "testnet":
      rpcUrl = clusterApiUrl("testnet");
      break;
    default:
      rpcUrl = network; // Assuming the provided network is a custom RPC URL
  }

  let currentConnection = new Connection(rpcUrl, "confirmed");
  console.log(`Connected to ${network} at ${rpcUrl}`);
  return currentConnection;
};

export {
  connectPhantom,
  signSolanaMessage,
  getAccountBalance,
  checkSolanaNetwork,
  disconnectPhantom,
  getPhantomAccountAddress,
};
