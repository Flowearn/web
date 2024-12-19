import React, { useRef, useImperativeHandle, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import utils from "@utils/utils";
import useMetaMask from "@utils/useWeb3";
import { setWalletType } from "@redux/actions/walletTypeAction";
import { useNavigate } from "react-router-dom";
import ThModal from "@comp/modal";
import log_icon_pha from "@/statics/images/log_icon_pha.svg";
import log_icon_okex from "@/statics/images/log_icon_okex.svg";
import metaMaskImg from "@/statics/images/login_icon_met.svg";
import log_icon_sol from "@/statics/images/log_icon_sol.svg";
import logo from "@statics/images/logo.svg";
import * as anchor from "@project-serum/anchor";
import WalletItem from "@comp/aptosWallet/WalletItem";
import _ from "lodash";
import { getAptosConnectWallets, useWallet, partitionWallets } from "@aptos-labs/wallet-adapter-react";

import { connectPhantom, signSolanaMessage, getPhantomAccountAddress } from "@utils/solana";
import useSolflare from "@utils/useSolflare";
import "./index.scss";
import { resetWarned } from "antd/es/_util/warning";

// function WalletConnectModal(props) {
const WalletConnectModal = React.forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { connectMetaMask, connectOKXWallet, connectSolanaOKXWallet } = useMetaMask();
  const [showModal, setShowModal] = useState(false);
  const { connected, isLoading, wallets } = useWallet();
  const { connectSolflare, signSolflareMessage } = useSolflare();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [walletList, setWalletList] = useState([]);

  // 将方法暴露给父组件使用
  useImperativeHandle(ref, () => ({
    handleShowModal,
  }));

  const handleConnectWallet = async (type, name, item) => {
    const resp = await checkWalletStatus(item);
    console.log(resp, item, "resp----------------------resp");
    if (!resp) return;

    let res;
    setLoading(true);
    setName(name);
    dispatch(setWalletType(type));
    if (type === "metamask") {
      res = await connectMetaMask();
    } else if (type === "okex" && props.type === "EVM") {
      res = await connectOKXWallet();
    } else if (type === "phantom") {
      res = await connectPhantom();
    } else if (type === "solflare") {
      res = await connectSolflare();
    } else if (type === "okex" && props.type === "Solana") {
      res = await connectSolanaOKXWallet();
    }

    if (res) {
      let account;
      if (type === "metamask" || type === "okex") {
        account = res;
      } else if (type === "phantom") {
        account = await getPhantomAccountAddress();
      } else if (type === "solflare") {
        account = res.publicKey;
      }

      handleSignMessage(account, type, name);
    } else {
      setLoading(false);
    }
  };

  const checkWalletStatus = (item) => {
    if (!item.isInstalled) {
      if (item.name === "OKX Wallet") {
        window.open("https://chromewebstore.google.com/detail/mcohilncbfahbmgdjkbpemcciiolgcge", "_blank");
        return false;
      } else if (item.name === "MetaMask") {
        window.open(
          "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=zh-CN&utm_source=ext_sidebar",
          "_blank"
        );
        return false;
      } else if (item.name === "Phantom") {
        window.open(
          "https://chromewebstore.google.com/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa?hl=zh-CN&utm_source=ext_sidebar",
          "_blank"
        );
        return false;
      }
      // else{
      //   window.open('https://chromewebstore.google.com/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic?hl=zh-CN&utm_source=ext_sidebar', '_blank');
      // }
    }
    return true;
  };

  const handleSignMessage = async (accounts, type, name) => {
    if (accounts && accounts.length > 0) {
      try {
        let signature;
        const nonce = Date.now();
        const message = `Please sign to confirm that this address is yours.\nThis wallet will only be used to query trading history and will not request any transaction permissions until you choose to follow a trade with your following portfolio.\n\nWallet address:\n${accounts}\nnonce: ${nonce}`;

        if (type === "metamask" || (type === "okex" && props.type === "EVM")) {
          const provider = utils.getProvider(type);
          signature = await provider.request({
            method: "personal_sign",
            params: [message, accounts],
          });
        } else if (type === "phantom") {
          let sign = await signSolanaMessage(message);
          signature = anchor.utils.bytes.bs58.encode(sign.signature);
          console.log(sign, "signsignsignsign", signature);
        } else if (type === "solflare") {
          signature = await signSolflareMessage(message);
        } else if (type === "okex" && props.type === "Solana") {
          signature = await handleSolanaOkxMsg(message);
        }

        props.handleAdd && props.handleAdd(accounts, signature, name, null, nonce);
        setLoading(false);
        console.log("result:", signature);
      } catch (error) {
        setLoading(false);
        console.error("result:", error);
      }
    }
  };

  const initialWalletList = [
    { icon: log_icon_pha, name: "Phantom", type: "phantom", id: 1 },
    { icon: metaMaskImg, name: "MetaMask", type: "metamask", id: 2 },
    { icon: log_icon_okex, name: "OKX Wallet", type: "okex", id: 3 },
    { icon: log_icon_sol, name: "Solflare", type: "solflare", id: 4 },
  ];

  const checkWalletInstalled = () => {
    return initialWalletList.map((wallet) => {
      let isInstalled = false;
      if (wallet.type === "phantom") {
        isInstalled = !!(window.solana && window.solana.isPhantom);
      } else if (wallet.type === "metamask") {
        isInstalled = !!(window.ethereum && window.ethereum.isMetaMask);
      } else if (wallet.type === "okex") {
        isInstalled = !!window.okexchain;
      } else if (wallet.type === "solflare") {
        isInstalled = !!(window.solflare && window.solflare.isSolflare);
      }
      return { ...wallet, isInstalled };
    });
  };

  // useEffect(() => {
  //   const updatedWalletList = checkWalletInstalled();
  //   console.log(updatedWalletList, '----------------')
  //   setWalletList(updatedWalletList);
  // }, []);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  const filteredWalletList = checkWalletInstalled().filter((item) => {
    if (props.type === "EVM") {
      return item.type !== "phantom" && item.type !== "solflare";
    } else if (props.type === "Solana") {
      return item.type !== "metamask";
    }
  });

  let aptosWalletList = _.uniqBy(
    wallets.filter((v) => v.name === "OKX Wallet" || v.name === "Petra" || v.name === "Martian"),
    "name"
  );

  aptosWalletList.sort((a, b) => {
    const order = { Martian: 1, Petra: 2, "OKX Wallet": 3 };
    return order[a.name] - order[b.name];
  });

  const handleAptosSignMessage = (accounts, signature, walletName, pub_key, nonce) => {
    // if (localStorage.getItem("walletName") === "Martian") {
    //   signature = signature.substring(2);
    // }
    props.handleAdd &&
      props.handleAdd(accounts, signature, localStorage.getItem("walletName") || walletName, pub_key, nonce);
  };

  const handleSolanaOkxMsg = async (messageStr) => {
    try {
      // const solanaAccount = await connetSolanaAccount();
      // const messageStr = `hello Birdman ${solanaAccount}`;
      const encodedMessage = new TextEncoder().encode(messageStr);

      const sign = await window?.okxwallet?.solana.signMessage(encodedMessage, "utf8");
      const signature = anchor.utils.bytes.bs58.encode(sign.signature);
      return signature;
    } catch (error) {
      console.error("Error signing message:", error);
    }
  };

  return (
    <>
      <ThModal
        width={423}
        styles={{ overflowY: "auto" }}
        className={`${filteredWalletList.length <= 2 ? "adapterModal" : ""} modal wrapper-modal`}
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
          {props.type === "aptos" ? (
            <ul className="wallet-adapter-modal-list">
              {aptosWalletList.map((item) => {
                return <WalletItem key={item.name} wallet={item} loginBtn={handleAptosSignMessage} isAptos={true}/>;
              })}
            </ul>
          ) : (
            <ul className="wallet-adapter-modal-list">
              {filteredWalletList.map((item, index) => {
                return (
                  <li key={index} onClick={() => handleConnectWallet(item.type, item.name, item)}>
                    <Button loading={item.name === name && loading} className="btnConnect">
                      <img src={item.icon} />
                      {/* {item.name} */}
                      <div className="statusName">
                        <p className="walletName">{item.name}</p>
                        <p className="walletStatus" style={{ color: item.isInstalled ? "#C9FDD9" : 'rgba(187, 255, 214, 0.6)' }}>{item.isInstalled ? "Installed" : "Not Detected"}</p>
                      </div>
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </ThModal>
    </>
  );
});
export default WalletConnectModal;
