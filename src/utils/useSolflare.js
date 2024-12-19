// hooks/useSolflare.js
import { useState, useEffect } from 'react';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import bs58 from 'bs58';

const SOLANA_NETWORK = clusterApiUrl('mainnet-beta'); // devnet 或 'mainnet-beta', 'testnet' 取决于你的需求

const useSolflare = () => {
  const [wallet, setWallet] = useState(new SolflareWalletAdapter());
  const [publicKey, setPublicKey] = useState(null);
  const [connection] = useState(new Connection(SOLANA_NETWORK));
  let connectedWallet = null; // 存储连接后的钱包对象

  const connectSolflare = async () => {
    if (connectedWallet) {
      return connectedWallet; // 如果已经连接，则直接返回现有的钱包对象
    }
  
    const solflare = new SolflareWalletAdapter();
    try {
      await solflare.connect();
      setWallet(solflare);
      setPublicKey(solflare.publicKey.toBase58());
      console.log('Wallet connected:', solflare.publicKey.toBase58());
      connectedWallet = {
        publicKey: solflare.publicKey.toBase58(),
        wallet: solflare,
      };
      return connectedWallet;
    } catch (error) {
      console.error('Solflare connection error:', error);
      return false;      
    }
  };
  
  const signSolflareMessage = async (msg) => {
    try {
      const { wallet, publicKey } = connectedWallet || await connectSolflare(); // 使用已连接的钱包或者进行连接
  
      if (!wallet || !publicKey) {
        console.error('Wallet not connected');
        return;
      }    

      const message = new TextEncoder().encode(msg);
      const response = await connectedWallet.wallet.signMessage(message);
      const signature = bs58.encode(response);
      return signature;
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw error;
    }
  };
  return { connectSolflare, signSolflareMessage };
};

export default useSolflare;
