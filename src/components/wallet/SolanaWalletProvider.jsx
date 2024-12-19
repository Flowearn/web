/*
 * @description: solana钱包适配器
 * @author: chenhua
 * @Date: 2024-06-12 16:00:33
 * @LastEditors: chenhua
 * @LastEditTime: 2024-06-12 16:35:03
 */
import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
// import { PhantomWalletAdapter, SolflareWalletAdapter, UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import WalletModalProvider from "@comp/wallet/WalletModalProvider";
import { clusterApiUrl } from "@solana/web3.js";
// import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
// import "@solana/wallet-adapter-react-ui/styles.css";

function SolanaWalletProvider({ children }) {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  console.log("SolanaWalletProvider------------------------", network, endpoint);
  // const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  // https://devnet.helius-rpc.com/?api-key=66793f6c-b81b-4556-afaf-492c0e871422
  return (
    <ConnectionProvider endpoint={"https://mainnet.helius-rpc.com/?api-key=66793f6c-b81b-4556-afaf-492c0e871422"}>
      <WalletProvider wallets={[]} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default SolanaWalletProvider;
