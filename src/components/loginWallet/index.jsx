import { useState, useEffect, useMemo } from "react";
import { Button, Spin } from "antd";
import { login } from "@/services/index";
import TokenManager from "@utils/TokenManager";
import ThModal from "@comp/modal";
import { WalletSelector as AntdWalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import {
  getAptosConnectWallets,
  useWallet,
  partitionWallets,
} from "@aptos-labs/wallet-adapter-react";
import WalletItem from "@comp/aptosWallet/WalletItem";
import useAptosWallet from "@utils/useAptosWallet";
import logo from "@statics/images/logo.svg";
import my_icon_wallet from "@statics/images/my_icon_wallet.svg";
import aptos2 from "@statics/images/aptos-2.svg";
import _ from "lodash";
import "./index.scss";

function LoginWallet(props) {
  const { signatureMessage } = useAptosWallet();
  const [showModal, setShowModal] = useState(false);
  const { connected, isLoading, account, wallets } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    handleShowModal();
    console.log("点击登录");
  };

  const loginBtn = async (accounts, signature, name, publicKey, dataTime) => {console.log(dataTime, 'dataTime------------------dataTime', accounts)
    const res = await login({
      address: accounts,
      signature: signature,
      pub_key: publicKey.substring(2),
      nonce: dataTime,
    });
    
    if (res.Token) {
      setShowModal(!showModal);
      setIsOpen(false);
      TokenManager.setToken(res.Token);
      localStorage.setItem("userInfo", JSON.stringify(res));
      localStorage.removeItem('walletName');
      window.location.reload();
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleLoading = (isTrue) => {
    setIsOpen(isTrue);
  }

  // const { otherWallets } = getAptosConnectWallets(wallets);

  // const { defaultWallets } = partitionWallets(otherWallets);

  const walletList = _.uniqBy(
    wallets.filter((v) => v.name === "OKX Wallet" || v.name === "Petra" || v.name === "Martian"),
    "name"
  );

  walletList.sort((a, b) => {
    const order = { "Martian": 1, "Petra": 2, "OKX Wallet": 3 };
    return order[a.name] - order[b.name];
  });

  console.log("open===connected, isLoading", walletList, wallets)

  return (
    <>
      {props.type ? (
        <>
          <Button className="login notLogin" style={{ padding: "6px 14px", display: 'flex' }} onClick={handleShowModal}>
            {/* <i className="iconfont" style={{ color: "#c9fdd9", fontSize: "25px",marginTop: "2px" }}>
              &#xe687;
            </i> */}
            <img src={my_icon_wallet} />
            <span style={{ fontSize: "18px", color: "#C9FDD9", fontWeight: 600, fontFamily: 'Kumbh Sans, Kumbh Sans' }}>
              Connect Wallet
            </span>
          </Button>
        </>
      ) : (
        <Button className="mainWallet conMainWallet" onClick={handleLogin}>
          <img src={aptos2} style={{width: '30px', height: '30px'}} />
          {props.title}
        </Button>
      )}

      <ThModal
        width={423}
        styles={{ overflowY: "auto" }}
        className="modal wrapper-modal"
        centered
        title=""
        footer={null}
        open={showModal}
        onCancel={() => {setShowModal(false); setIsOpen(false);localStorage.removeItem('walletName');}}
      >
        {/* <Spin spinning={isOpen}> */}
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
            <ul className="wallet-adapter-modal-list">
              {walletList.map((item) => {
                return (
                  <WalletItem
                    key={item.name}
                    wallet={item}
                    loginBtn={loginBtn}
                    isAptos={false}
                    // handleLoading={handleLoading}
                    // handleConnectWallet={handleSignMessage} // 传递 handleSignMessage 以便在 WalletItem 组件中使用
                  />
                );
              })}
            </ul>
          </div>
        {/* </Spin> */}
      </ThModal>
    </>
  );
}
export default LoginWallet;
