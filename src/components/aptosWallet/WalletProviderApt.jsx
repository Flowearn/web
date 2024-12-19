/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-07-11 16:56:44
 * @LastEditors: chenhua
 * @LastEditTime: 2024-07-22 14:17:14
 */
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
// import { BitgetWallet } from "@bitget-wallet/aptos-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";
// import { MSafeWalletAdapter } from "@msafe/aptos-wallet-adapter";
import { OKXWallet } from "@okwallet/aptos-wallet-adapter";
// import { PontemWallet } from "@pontem/wallet-adapter-plugin";
// import { TrustWallet } from "@trustwallet/aptos-wallet-adapter";
// import { FewchaWallet } from "fewcha-plugin-wallet-adapter";
// import { PropsWithChildren } from "react";
// import { Network } from "@aptos-labs/ts-sdk";
import { useAutoConnect } from "./AutoConnectProvider";
// import { useToast } from "./ui/use-toast";

export const WalletProviderApt = ({ children }) => {
  const { autoConnect } = useAutoConnect();
  // const { toast } = useToast();
  const wallets = [
    // new BitgetWallet(),
    // new FewchaWallet(),
    // new MartianWallet(),
    // new MSafeWalletAdapter(),
    // new PontemWallet(),
    // new TrustWallet(),
    new OKXWallet(),
    new MartianWallet(),
  ];

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={autoConnect}
      onError={(error) => {
        console.error("Wallet error:", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};
