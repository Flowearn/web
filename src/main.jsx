/*
 * @description: 描述信息
 * @author: Jack Chen @懒人码农
 * @Date: 2024-07-09 03:36:42
 * @LastEditors: Jack Chen
 * @LastEditTime: 2024-07-09 03:56:08
 */
// import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { Provider } from "react-redux";
import store from "@redux/stores";
import { WalletProviderApt } from "@comp/aptosWallet/WalletProviderApt";
import { AutoConnectProvider } from "@comp/aptosWallet/AutoConnectProvider";
import SolanaWalletProvider from "@comp/wallet/SolanaWalletProvider";
import { WagmiProvider, http, createConfig } from "wagmi";
import { mainnet, base, sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

const config = createConfig({
  chains: [mainnet, base, sepolia],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AutoConnectProvider>
      <WalletProviderApt>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <SolanaWalletProvider>
              <App />
            </SolanaWalletProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </WalletProviderApt>
    </AutoConnectProvider>
  </Provider>
);
