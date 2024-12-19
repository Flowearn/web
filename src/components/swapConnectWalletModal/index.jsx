import { forwardRef, useImperativeHandle, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, message } from "antd";
// import useMetaMask from "@utils/useWeb3";
import { setWalletType } from "@redux/actions/walletTypeAction";
// import { useNavigate } from "react-router-dom";
import ThModal from "@comp/modal";
import log_icon_pha from "@/statics/images/log_icon_pha.svg";
import log_icon_okex from "@/statics/images/log_icon_okex.svg";
import metaMaskImg from "@/statics/images/login_icon_met.svg";
import log_icon_sol from "@/statics/images/log_icon_sol.svg";
import logo from "@statics/images/logo.svg";
// import WalletItem from "@comp/aptosWallet/WalletItem";
// import { getAptosConnectWallets, partitionWallets } from "@aptos-labs/wallet-adapter-react";
// import {
// connectPhantom,
// connectSolanaOKXWallet,
// signSolanaMessage,
// getPhantomAccountAddress,
// } from "@utils/solana";
// import useSolflare from "@utils/useSolflare";
import { useAccount, useConnect, useChainId, useSwitchChain } from "wagmi";
import "./index.scss";

import { useWallet } from "@solana/wallet-adapter-react";

const SwapConnectWalletModal = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const { connectMetaMask, connectOKXWallet, getAccountAddress } = useMetaMask();
  const [showModal, setShowModal] = useState(false);
  // const { connected, isLoading, wallets = [] } = useWallet();
  // const { connectSolflare, signSolflareMessage } = useSolflare();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const { type, chainIdName } = props;

  // solana库处理solana链
  // const { connection } = useConnection();
  const { publicKey, wallet, wallets, select, connecting, connected, connect: connectSolana } = useWallet();

  // Wagmi库处理EVM链
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connectors, connect } = useConnect();
  const { switchChain } = useSwitchChain();

  // console.log("wallet, wallets, connecting, connected", wallet, wallets, connected);

  // 将方法暴露给父组件使用
  useImperativeHandle(ref, () => ({
    handleShowModal,
    setShowModal,
  }));

  const handleConnectWallet = async (chainName) => {
    let typeName =
      chainName === "Phantom"
        ? "phantom"
        : chainName === "OKX Wallet"
        ? "okex"
        : chainName === "Solflare"
        ? "solflare"
        : "";
    setName(chainName);
    dispatch(setWalletType(typeName));
    select(chainName);
    console.log("连接Sol钱包：", type, chainName, typeName, connecting, connected);
  };

  // console.log("walletsol", wallets);

  const initialWalletList = [
    {
      icon: log_icon_pha,
      name: "Phantom",
      type: "phantom",
      id: 1,
      installed: !!(window.solana && window.solana.isPhantom),
      link: "https://chromewebstore.google.com/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa?hl=zh-CN&utm_source=ext_sidebar",
    },
    {
      icon: metaMaskImg,
      name: "MetaMask",
      type: "metamask",
      id: 2,
      installed: !!(window.ethereum && window.ethereum.isMetaMask),
      link: "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=zh-CN&utm_source=ext_sidebar",
    },
    {
      icon: log_icon_okex,
      name: "OKX Wallet",
      type: "okex",
      id: 3,
      installed: !!window.okexchain,
      link: "https://chromewebstore.google.com/detail/mcohilncbfahbmgdjkbpemcciiolgcge",
    },
    {
      icon: log_icon_sol,
      name: "Solflare",
      type: "solflare",
      id: 4,
      installed: !!(window.solflare && window.solflare.isSolflare),
      link: "https://chromewebstore.google.com/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic?hl=zh-CN&utm_source=ext_sidebar",
    },
  ];

  const filteredConnectSol = wallets.filter((item) => {
    item.name = item.adapter.name;
    item.installed = true;
    switch (item.name) {
      case "Phantom":
        item.icon = log_icon_pha;
        break;
      case "MetaMask":
        item.icon = metaMaskImg;
        break;
      case "OKX Wallet":
        item.icon = log_icon_okex;
        break;
      case "Solflare":
        item.icon = log_icon_sol;
        break;
    }

    if (type === "Solana") {
      return item.name === "Phantom" || item.name === "Solflare" || item.name === "OKX Wallet";
    }
  });

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  const customWalletList = initialWalletList.filter((item) => {
    if (type === "EVM") {
      return item.name !== "Phantom" && item.name !== "Solflare";
    } else if (type === "Solana") {
      return item.name !== "MetaMask";
    }
  });

  const filteredConnectEvm = connectors.filter((item) => {
    // console.log("filteredWalletListEvm===", item.name);
    item.installed = true;
    switch (item.name) {
      case "Phantom":
        item.icon = log_icon_pha;
        break;
      case "MetaMask": // id:io.metamask
        item.icon = metaMaskImg;
        break;
      case "OKX Wallet": // id:com.okex.wallet
        item.icon = log_icon_okex;
        break;
      case "Solflare":
        item.icon = log_icon_sol;
        break;
    }

    if (type === "EVM") {
      return item.name === "MetaMask" || item.name === "OKX Wallet";
    }
  });

  const filteredWalletListEvm = Object.assign(customWalletList, filteredConnectEvm);
  const filteredWalletListSol = Object.assign(filteredConnectSol, customWalletList);

  // const { otherWallets } = getAptosConnectWallets(wallets);

  // const { defaultWallets } = partitionWallets(otherWallets);

  // const aptosWalletList = _.uniqBy(
  //   defaultWallets.filter((v) => v.name === "OKX Wallet" || v.name === "Petra" || v.name === "Martian"),
  //   "name"
  // );
  console.log("evm连接器connectors", filteredWalletListEvm, filteredConnectEvm);
  console.log("sol连接器connectors", filteredWalletListSol, wallets);

  return (
    <>
      {contextHolder}
      <ThModal
        width={423}
        styles={{ overflowY: "auto" }}
        className="modal wrapper-modal"
        centered
        title=""
        footer={null}
        open={showModal}
        onCancel={() => {
          setShowModal(false);
          setLoading(false);
        }}
      >
        <div className="modal-content ">
          <div className="logo-img">
            <img className="iconLogo" src={logo} alt="logo" />
          </div>
          <h1 className="wallet-adapter-modal-title">Connect your wallet to traders.tech</h1>
          <div className="wallet-content">
            By connecting your wallet, you acknowledge that you have read, understand and accept the terms in the
            disclaimer
          </div>
          <h6 className="select-wallet">Select Wallet</h6>
          {type === "aptos" ? (
            <ul className="wallet-adapter-modal-list">
              aptosWalletList
              {/* {aptosWalletList.map((item) => {
                return <></>;
                // return <WalletItem key={item.name} wallet={item} loginBtn={handleAptosSignMessage} isAptos={true} />;
              })} */}
            </ul>
          ) : (
            <ul className="wallet-adapter-modal-list">
              {type === "EVM" &&
                filteredWalletListEvm.map((connector) =>
                  connector.installed ? (
                    <ConnectorButton
                      key={connector.uid}
                      connector={connector}
                      onClick={() => {
                        let chain = chainIdName === "base" ? 8453 : chainIdName === "sepolia" ? 11155111 : 1;
                        console.log(
                          "切换链ConnectorButton-------",
                          connector,
                          chainId,
                          chain,
                          chainIdName,
                          type,
                          isConnected
                        );
                        if (!isConnected && chainId === chain) {
                          console.log("!isConnected && chainId === chain");
                          return connect(
                            { connector, chainId },
                            {
                              onSuccess: (res) => {
                                console.log("连接成功-isConnected-false", res);
                                setShowModal(false);
                                setLoading(false);
                              },
                              onError: (error) => {
                                console.error("连接失败", error);
                              },
                            }
                          );
                        } else {
                          console.log("222");
                          if (isConnected && chainId !== chain) {
                            console.log("isConnected && chainId !== chain");
                            switchChain(
                              {
                                chainId: chain,
                              },
                              {
                                onSuccess: (data) => {
                                  console.log("切换链成功-chainId !== chain", chainId, chain, data);
                                  setShowModal(false);
                                  setLoading(false);
                                },
                                onError: (error) => {
                                  console.error("切换链失败", chainId, chain, error);
                                },
                              }
                            );
                          } else {
                            console.log("isConnected && chainId === chain");
                            return connect(
                              { connector, chain },
                              {
                                onSuccess: (res) => {
                                  console.log("连接成功", res);
                                  switchChain(
                                    {
                                      chainId: chain,
                                    },
                                    {
                                      onSuccess: (data) => {
                                        console.log("切换链", chainId, chain, data);
                                        setShowModal(false);
                                        setLoading(false);
                                      },
                                      onError: (error) => {
                                        console.error("连接失败", chainId, chain, error);
                                      },
                                    }
                                  );
                                },
                                onError: (error) => {
                                  console.error("连接失败", error);
                                },
                              }
                            );
                          }
                        }
                      }}
                    />
                  ) : (
                    <li key={connector.id} onClick={() => window.open(connector.link, "_blank")}>
                      <Button className="btnConnect">
                        <img src={connector.icon} />
                        <div className="statusName">
                          <div className="walletName">{connector.name}</div>
                          <div className="walletStatus">Not Detected</div>
                        </div>
                      </Button>
                    </li>
                  )
                )}
              {type === "Solana" &&
                filteredWalletListSol.map((item, index) =>
                  item.installed ? (
                    <li key={index} onClick={() => handleConnectWallet(item.name)}>
                      <Button
                        loading={item.name === name && loading}
                        disabled={item.name === name && loading}
                        className="btnConnect"
                      >
                        <img src={item.icon} />
                        <div className="statusName">
                          <div className="walletName">{item.name}</div>
                          <div className="walletStatus">Installed</div>
                        </div>
                      </Button>
                    </li>
                  ) : (
                    <li key={index} onClick={() => window.open(item.link, "_blank")}>
                      <Button className="btnConnect">
                        <img src={item.icon} />
                        <div className="statusName">
                          <div className="walletName">{item.name}</div>
                          <div className="walletStatus">Not Detected</div>
                        </div>
                      </Button>
                    </li>
                  )
                )}
            </ul>
          )}
        </div>
      </ThModal>
    </>
  );
});

function ConnectorButton({ connector, onClick }) {
  const [ready, setReady] = useState(false);

  // console.log("connector", connector);

  useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector, setReady]);

  return (
    <li onClick={onClick}>
      <Button disabled={!ready} loading={!ready} className="btnConnect">
        <img src={connector.icon} alt={connector.name} />
        <div className="statusName">
          <div className="walletName">{connector.name}</div>
          <div className="walletStatus">Installed</div>
        </div>
      </Button>
    </li>
  );
}

export default SwapConnectWalletModal;
