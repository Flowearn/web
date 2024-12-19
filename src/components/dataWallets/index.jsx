/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2023-02-07 19:08:16
 * @LastEditors: chenhua
 * @LastEditTime: 2024-09-11 17:23:02
 */
import { Layout, Menu, Button, Image, Modal, message } from "antd";
import { useEffect, useState, useRef } from "react";
import { addDataWallet, getDataWallet, delDataWallet, getMyKey } from "@/services/index";
import utils from "@utils/utils";
import WalletConnectModal from "@comp/walletConnectModal";
import solanaIcon from "@statics/images/solana_icon.svg";
import ethIcon from "@statics/images/eth_icon.svg";
import btcIcon from "@statics/images/home_icon_btc.svg";
import okexIcon from "@statics/images/okex_icon.svg";
import aptos from "@statics/images/mp_icon_aptos.svg";
import log_icon_pha from "@statics/images/log_icon_pha.svg";
import petra from "@statics/images/wallet_icon_petra.svg";
import metaMask from "@statics/images/login_icon_met.svg";
import martian  from "@statics/images/wallet_icon_Martian.svg";

import bnb_1  from "@statics/images/bnb_1.svg";
import base1  from "@statics/images/base1.svg";

import log_icon_sol from "@/statics/images/log_icon_sol.svg";
import "./index.scss";

function DataWallets({ isRefresh }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const [accountsList, setAccountsList] = useState([]);
  const [solanaAccountsList, setSolanaAccountsList] = useState([]);
  const [aptosList, setAptosList] = useState([]);
  const [isIssue, setIsIssue] = useState(false);
  const walletConnectModalRef = useRef();
  const [type, setType] = useState(null);
  const [isAptos, setIsAptos] = useState(false);
  const [isWalletType, setIsWalletType] = useState('');

  useEffect(() => {
    queryDataWallet();
  }, [isRefresh]);

  useEffect(() => {
    queryMyKeys();
  }, []);

  const queryMyKeys = async () => {
    const res = await getMyKey();
    setIsIssue(res.status);
  };

  const handleAptos = () => {
    if (walletConnectModalRef.current) {
      setIsAptos(true);
      // setIsWalletType('aptos');
      walletConnectModalRef.current.handleShowModal();
    }    
  }

  const handleAddDataWallet = async (type) => {    
    if (walletConnectModalRef.current) {
      setType(type);
      // setIsWalletType('EVM');
      walletConnectModalRef.current.handleShowModal();
    }
  };

  const handleAdd = async (address, signature, walletName, pub_key, nonce) => { 
    const res = await addDataWallet({
      address,
      signature,
      wallet_name: walletName,
      nonce,
      pub_key: pub_key ? pub_key.substring(2) : ''
    });
    queryDataWallet();
    handleAddDataWallet(type);
    message.success("Signature successfully");
  };

  // const handleAdd_1 = async (address, signature, walletName, pub_key, nonce) => { 
  //   const res = await addDataWallet({
  //     address,
  //     signature,
  //     wallet_name: walletName,
  //     nonce,
  //     pub_key: pub_key.substring(2)
  //   });
  //   queryDataWallet();
  //   handleAddDataWallet(type);
  //   message.success("Signature successfully");
  // };

  const queryDataWallet = async () => {
    const res = await getDataWallet();
    const filteredData = res.filter((item) => item.chain === "ethereum");
    const solanaAccount = res.filter((item) => item.chain === "solana");
    const aptosData = res.filter((item) => item.chain === "aptos");
    setAccountsList(filteredData);
    setSolanaAccountsList(solanaAccount);
    setAptosList(aptosData);
  };

  const handleDeleteDataWallet = (item) => {
    if(item.data_address === userInfo.address) return;
    Modal.confirm({
      title: "Unbind wallet",
      content: "Are you sure you want to cancel the binding of the data wallet?",
      async onOk() {
        const res = await delDataWallet({ address: item.data_address });
        queryDataWallet();
      },
      onCancel() {
        console.log("cancel");
      },
    });
  };
  const getButtonClassName = (arr, chainType) => {
    return arr.some((item) => item.chain === chainType)
      ? "connectBox ethereum-connected" // You can modify this class name as needed
      : "connectBox";
  };

  return (
    <>
      {isIssue && (
        <div className="myInfo-balance myInfo-latest dataWallets" style={{ paddingBottom: 0 }}>
          <h1 className="myInfo-balance-title title dataWallets-name">Data Query Wallets</h1>
          <div className="wallet">
            <p>Connect more wallets to increase ROI and PnL of portfolio to make your key more valuable</p>
            <p style={{ color: "#C9FDD9" }}>
              *All the wallets connected here will not be asked for any transaction, only using for onchain data query
            </p>
          </div>
          <div className="myInfo-balance-list dataWallets-list">
            <div className="itemBox">
              <div className={`myInfo-balance-list-item connectInfo ${aptosList.length > 0 ? 'aptos' : ''}`}>
                <img className="iconX" src={aptos} alt=""/>
                <h6 className="title fontColor typeTitle" style={{ marginTop: "10px" }}>
                  Connect your Aptos Wallet
                </h6>
                {/* <Button className="connectBox ComingSoonBox">Coming Soon</Button> */}
                <Button
                  className={getButtonClassName(aptosList, "aptos")}
                  style={{ fontWeight: 600, textAlign: "center" }}
                  onClick={() => handleAddDataWallet('aptos')}
                >
                { aptosList.length === 0 ? 'Connect' : '+ Connect More'} 
                </Button>
              </div>              
              <div className="connected listBox" style={{marginRight: "3px"}}>
                {aptosList.map((item) => (
                    <div
                      className={`${item.data_address === userInfo.address ? 'disableBtn' : ''} bsubButton connectBox walletInfo`}
                      onClick={() => handleDeleteDataWallet(item)}
                      key={item.ID}
                    >
                      <div>
                        <img className="iconX" src={item.wallet_name === 'Petra' ? petra : (item.wallet_name === 'Martian' ? martian : okexIcon)} style={{ marginTop: "-4px", width: '28px', height: '27px' }}/>
                        <span>{utils.shortAccount(item.data_address, 2)}</span>
                      </div>
                      <span className="connectSpan">Connected</span>
                    </div>
                  ))}
              </div>
            </div>
              
            <div className="itemBox">
              <div className={`myInfo-balance-list-item connectInfo ${accountsList.length > 0 ? 'aptos' : ''}`}>
                <img className="iconX" src={ethIcon} /> 
                {/* <img className="iconX" src={bnb_1} style={{ margin: "0 20px" }}/> */}
                <img className="iconX" src={base1} style={{ margin: "0 20px" }}/>
                <h6 className="title fontColor typeTitle" style={{ marginTop: "10px" }}>
                  Connect more EVM
                </h6>
                <Button
                  className={getButtonClassName(accountsList, "ethereum")}
                  style={{ fontWeight: 600, textAlign: "center" }}
                  onClick={() => handleAddDataWallet('EVM')}
                >
                  {/* + Connect More */}
                  { accountsList.length === 0 ? 'Connect' : '+ Connect More'} 
                </Button>
              </div>
              <div className="connected listBox" style={{marginRight: "3px"}}>
                {accountsList
                  .filter((item) => item.chain === "ethereum")
                  .map((item) => (
                    <div
                      className="bsubButton connectBox walletInfo"
                      onClick={() => handleDeleteDataWallet(item)}
                      key={item.ID}
                    >
                      <div>
                        <img className="iconX" src={item.wallet_name === 'MetaMask' ? metaMask : okexIcon} style={{ marginTop: "-4px", width: '28px', height: '27px' }}/>
                        <span>{utils.shortAccount(item.data_address, 2)}</span>
                      </div>
                      <span className="connectSpan">Connected</span>
                    </div>
                  ))}
              </div>   
            </div>

            <div className="itemBox">
              <div className={`myInfo-balance-list-item connectInfo ${solanaAccountsList.length > 0 ? 'aptos' : ''}`}>
                <img className="iconX" src={solanaIcon} />
                <h6 className="title fontColor typeTitle" style={{ marginTop: "10px" }}>
                  Connect your Solana wallet
                </h6>
                <Button
                  className={getButtonClassName(solanaAccountsList, "solana")}
                  style={{ fontWeight: 600, textAlign: "center" }}
                  onClick={() => handleAddDataWallet('Solana')}
                >
                  {/* + Connect More */}
                  { solanaAccountsList.length === 0 ? 'Connect' : '+ Connect More'} 
                </Button>
              </div>
              <div className="connected listBox">
                {solanaAccountsList
                  .filter((item) => item.chain === "solana")
                  .map((item) => (
                    <div
                      className="bsubButton connectBox walletInfo"
                      onClick={() => handleDeleteDataWallet(item)}
                      key={item.ID}
                    >
                      <div>
                        <img className="iconX" src={item.wallet_name === 'Solflare' ? log_icon_sol : (item.wallet_name === 'Phantom' ? log_icon_pha : okexIcon)} style={{marginTop: "-4px", width: '28px', height: '29px'}}/>
                        <span>{utils.shortAccount(item.data_address, 2)}</span>
                      </div>                    
                      <span className="connectSpan">Connected</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="itemBox">
              <div className="myInfo-balance-list-item connectInfo connectInfo other">
                <img className="iconX" src={btcIcon} />
                <h6 className="title fontColor typeTitle" style={{ marginTop: "10px" }}>
                  Connect your BTC Wallet
                </h6>
                <Button className="connectBox ComingSoonBox">Coming Soon</Button>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            {/* <div className="connected" style={{marginRight: "3px"}}>
              {aptosList.map((item) => (
                  <div
                    className="bsubButton connectBox walletInfo"
                    onClick={() => handleDeleteDataWallet(item)}
                    key={item.ID}
                  >
                    <div>
                      <img className="iconX" src={item.wallet_name === 'Petra' ? petra : (item.wallet_name === 'Martian' ? martian : okexIcon)} style={{ marginTop: "-4px", width: '28px', height: '27px' }}/>
                      <span>{utils.shortAccount(item.data_address, 2)}</span>
                    </div>
                    <span className="connectSpan">Connected</span>
                  </div>
                ))}
            </div> */}
            {/* <div className="connected" style={{marginRight: "3px"}}>
              {accountsList
                .filter((item) => item.chain === "ethereum")
                .map((item) => (
                  <div
                    className="bsubButton connectBox walletInfo"
                    onClick={() => handleDeleteDataWallet(item)}
                    key={item.ID}
                  >
                    <div>
                      <img className="iconX" src={item.wallet_name === 'MetaMask' ? metaMask : okexIcon} style={{ marginTop: "-4px", width: '28px', height: '27px' }}/>
                      <span>{utils.shortAccount(item.data_address, 2)}</span>
                    </div>
                    <span className="connectSpan">Connected</span>
                  </div>
                ))}
            </div> */}
            {/* <div className="connected">
              {solanaAccountsList
                .filter((item) => item.chain === "solana")
                .map((item) => (
                  <div
                    className="bsubButton connectBox walletInfo"
                    onClick={() => handleDeleteDataWallet(item)}
                    key={item.ID}
                  >
                    <div>
                      <img className="iconX" src={item.wallet_name === 'MetaMask' ? metaMask : (item.wallet_name === 'Phantom' ? log_icon_pha : okexIcon)} style={{marginTop: "-4px", width: '28px', height: '29px'}}/>
                      <span>{utils.shortAccount(item.data_address, 2)}</span>
                    </div>                    
                    <span className="connectSpan">Connected</span>
                  </div>
                ))}
            </div> */}
          </div>
        </div>
      )}
      <WalletConnectModal ref={walletConnectModalRef} type={type} handleAdd={handleAdd} />
    </>
  );
}
export default DataWallets;

