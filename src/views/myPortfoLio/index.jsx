/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-01-03 20:33:18
 * @LastEditors: chenhua
 * @LastEditTime: 2024-09-13 15:03:20
 */
import React, { useEffect, useState } from "react";
import { Row, Col, Avatar, Button, Form, Input, Select, message, Table, Spin } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import CommHeader from "@comp/commHeader";
import ConnectWallet from "@comp/connectWallet";
import rk_icon_xiala from "@/statics/images/rk_icon_xiala.png";
import rk_icon_btc from "@/statics/images/rk_icon_btc.png";
import ThModal from "@comp/modal";
import timg from "@/statics/images/timg.jpg";
import "./index.scss";
import buy_icon_fuzhi from "@/statics/images/buy_icon_fuzhi.png";
import { useNavigate } from "react-router-dom";
import {
  myPortfolio,
  getTokenList,
  savePortfolio,
  getUserDetail,
  getMyKey,
  detailChart,
  addDataWallet,
  mainWallet
} from "@/services/index";
import utils from "@utils/utils";
import { getPortfolioDetail } from "@/services/index";
import { getConnectWalletReducer, getPurchaseReducer } from "@redux/reselectors";
import { useSelector } from "react-redux";
import DataWallets from "@comp/dataWallets";
import IssueKeys from "@comp/issueKeys";
import HolersTable from "@comp/holersTable";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Decimal from "@comp/decimal";

import AptosContractUtils from "@utils/aptosContractUtils";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import PositiveLineChart from "@comp/charts/PositiveLineChart";
import _ from "lodash";
import useAptosWallet from "@utils/useAptosWallet";
import solanaIcon from "@statics/images/solana_icon.svg";
import ethIcon from "@statics/images/eth_icon.svg";
import btcIcon from "@statics/images/home_icon_btc.svg";
import aptos from "@statics/images/mp_icon_aptos.svg";
import mp_bj_mr from "@statics/images/mp_bj_mr.svg";
import base from "@statics/images/base.svg";
import TokenManager from "@utils/TokenManager";
import ChatRoom from "@comp/chatRoom";
import TradeList from "@comp/tradeList";

const fileUrl = import.meta.env.VITE_FILE_ACCESS_API;
const elementWidth = import.meta.env.VITE_ELEMENT_WIDTH;

function MyPortfoLio() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isIssue, setIsIssue] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalBuyKeys, setShowModalBuyKeys] = useState(false);
  const [showModalSellKeys, setShowModalSellKeys] = useState(false);
  const [showModalSelectToken, setShowModalSelectToken] = useState(false);
  const [formList, setFormList] = useState([]);
  const [tokenList, setTokenList] = useState([]);
  const [selectList, setSelectList] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const [isRegister, setIsRegister] = useState(true);
  const [list, setList] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [selectItem, setSelectItem] = useState({});
  const [selectIndex, setSelectIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [detailsInfo, setDetailsInfo] = useState({});
  const isConnected = useSelector(getConnectWalletReducer);
  const priceObj = useSelector(getPurchaseReducer);
  const [isIssueloading, setIsIssueLoading] = useState(true);
  let price = priceObj.usd;

  const { account, connected, network, signAndSubmitTransaction, wallet, disconnect } = useWallet();
  const [dataPoints, setDataPoints] = useState([]);
  const [selectedTab, setSelectedTab] = useState("30D");
  const { signatureMessage } = useAptosWallet();
  const [xLabels, setXLabels] = useState([]);
  let token = TokenManager.getToken();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= elementWidth);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= elementWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const setSuffix = () => {
    return <img src={rk_icon_xiala} alt="" />;
  };

  const setPrefix = () => {
    return <img src={rk_icon_btc} alt="" />;
  };

  const formItemList = [
    {
      key: 1,
      children: [
        { name: "token_id1", suffix: setSuffix(), prefix: setPrefix() },
        { name: "amount1", suffix: "BTC", disabled: false },
        { name: "usdc1", suffix: "USDC", disabled: false },
      ],
    },
    {
      key: 2,
      children: [
        { name: "token_id2", suffix: setSuffix(), prefix: setPrefix() },
        { name: "amount2", suffix: "BTC", disabled: false },
        { name: "usdc2", suffix: "USDC", disabled: false },
      ],
    },
    {
      key: 3,
      children: [
        { name: "token_id3", suffix: setSuffix(), prefix: setPrefix() },
        { name: "amount3", suffix: "BTC", disabled: false },
        { name: "usdc3", suffix: "USDC", disabled: false },
      ],
    },
    {
      key: 4,
      children: [
        { name: "token_id4", suffix: setSuffix(), prefix: setPrefix() },
        { name: "amount4", suffix: "BTC", disabled: false },
        { name: "usdc4", suffix: "USDC", disabled: false },
      ],
    },
    {
      key: 5,
      children: [
        { name: "token_id5", suffix: setSuffix(), prefix: setPrefix() },
        { name: "amount5", suffix: "BTC", disabled: false },
        { name: "usdc5", suffix: "USDC", disabled: false },
      ],
    },
    {
      key: 6,
      children: [
        { name: "token_id6", suffix: setSuffix(), prefix: setPrefix() },
        { name: "amount6", suffix: "BTC", disabled: false },
        { name: "usdc6", suffix: "USDC", disabled: false },
      ],
    },
    {
      key: 7,
      children: [
        { name: "token_id7", suffix: setSuffix(), prefix: setPrefix() },
        { name: "amount7", suffix: "BTC", disabled: false },
        { name: "usdc7", suffix: "USDC", disabled: false },
      ],
    },
    {
      key: 8,
      children: [
        { name: "token_id8", suffix: setSuffix(), prefix: setPrefix() },
        { name: "amount8", suffix: "BTC", disabled: false },
        { name: "usdc8", suffix: "USDC", disabled: false },
      ],
    },
    {
      key: 9,
      children: [
        { name: "token_id9", suffix: setSuffix(), prefix: setPrefix() },
        { name: "amount9", suffix: "BTC", disabled: false },
        { name: "usdc9", suffix: "USDC", disabled: false },
      ],
    },
    {
      key: 10,
      children: [
        { name: "token_id10", suffix: setSuffix(), prefix: setPrefix() },
        { name: "amount10", suffix: "BTC", disabled: false },
        { name: "usdc10", suffix: "USDC", disabled: false },
      ],
    },
  ];

  useEffect(() => {
    // queryTokenList();
    // checkAuthor();
    // getAllAccList();
    if (token) {
      queryPortfolioDetail();
      queryMyKeys();
      // queryDetailChart(selectedTab);
    }
  }, [connected, token]);

  useEffect(() => {
    queryDetailChart(selectedTab);
  }, []);

  const queryMyKeys = async () => {
    const res = await getMyKey();
    setIsIssue(res.status);
    setIsIssueLoading(false);
  };

  useEffect(() => {
    // queryMyHolders();
  }, []);

  useEffect(() => {
    if (userInfo.address) queryUserDetail();
  }, [userInfo.address]);

  const queryUserDetail = async () => {
    const res = await getUserDetail({ address: userInfo.address });
    setDetailsInfo(res);
  };
  const checkAuthor = async () => {
    // const data = await connectMetaMask();
    if (isConnected && Object.keys(userInfo).length !== 0) {
      // const account = await getAccountAddress();//获取地址 userInfo
      // const res = await callContractMethod(contractABI, contractObj.contractAccount, "getAuthor", true, [userInfo.ID]);
      // setAccount(userInfo.address);
      // if (res) {
      //   let isAuthor = res === "0x0000000000000000000000000000000000000000";
      //   setIsRegister(isAuthor);
      //   queryPortfolioDetail(userInfo.address);
      //   setLoading(false);
      // } else {
      //   setLoading(false);
      // }
    } else {
      setLoading(false);
    }
  };

  const getMyPortfolio = async (arr) => {
    const data = await myPortfolio();
    const combinedArray = formItemList?.map((item, index) => {
      item.options = arr;
      // item.children = children;
      return { ...item, ...data[index] };
    });
    dealFormData(combinedArray);
    setFormList(combinedArray);
  };

  const dealFormData = (data) => {
    const formData = form.getFieldsValue();
    data.forEach((item, index) => {
      formData[`amount${index + 1}`] = item.amount;
      formData[`token_id${index + 1}`] = item.Symbol;
      // formData[`id${index + 1}`] = item.token_id;
      formData[`usdc${index + 1}`] = item.amount && (item.amount * item.price).toFixed(6);
    });
    form.setFieldsValue(formData);
  };

  const queryTokenList = async () => {
    const res = await getTokenList();
    setTokenList(res || []);
    setSelectList(res || []);
    getMyPortfolio(res || []);
  };

  const handleBuyKeys = () => {
    setShowModal(true);
  };

  const handleBuy = () => {
    setShowModalBuyKeys(true);
  };

  const handleSellKeys = () => {
    setShowModalSellKeys(true);
  };

  const handlePurchase = () => {
    navigate("/myWatchimg");
  };

  const dealPrefix = (icon, index) => {
    if (index === 3 * index - 2) {
      return icon ? <img src={icon} className="iconImg transaction-btn imgComm" /> : null;
    }
  };

  const dealIcon = (icon) => {
    return icon ? (
      <img src={fileUrl + icon} className="iconImg transaction-btn imgComm" style={{ width: "26px", height: "26px" }} />
    ) : null;
  };

  const handleSave = () => {
    form.validateFields().then(async (values) => {
      setSaveLoading(true);
      const keys = Object.keys(values);
      const count = keys.filter((key) => key.startsWith("amount")).length;
      const arr = [];
      // const data = await creatShop();
      // if(!data) return;

      for (let i = 1; i <= count; i++) {
        const amount = values[`amount${i}`] * 1;
        const name = values[`token_id${i}`];
        const token_id = _.find(tokenList, (item) => item.Symbol === name)?.TokenId;
        if (token_id && amount > 0) {
          arr.push({
            amount,
            token_id,
          });
        }
      }
      const res = await savePortfolio(arr);
      // console.log(res, '----------------------------res------------------')
      if (!res.code) message.success("successfully!");
      queryTokenList();
      checkAuthor();
      setSaveLoading(false);
    });
  };

  const creatShop = async () => {
    if (!connected) return;
    const isRegistered = await AptosContractUtils.isAccountRegistered(
      [userInfo.address],
      "is_account_registered",
      network
    );
    let result;
    if (!isRegistered) {
      result = await AptosContractUtils.onSignAndSubmitTransaction(
        userInfo,
        signAndSubmitTransaction,
        "register",
        [],
        network
      );
    }
    
    if ((!isIssue && isRegistered) || (!isIssue && result)) {
      const res = await AptosContractUtils.onSignAndSubmitTransaction(
        userInfo,
        signAndSubmitTransaction,
        "launch",
        [userInfo.ID],
        network
      );
      if (res?.success) {
        return true;
      }
    }
  };

  // const creatShop = async () => {
  //   if (!connected) return;
  //   console.log("000000000000001-------------------res", userInfo);
  //   const isRegistered = await AptosContractUtils.isAccountRegistered([userInfo.address], "is_account_registered", network);
  //   console.log(isRegistered, "111111111111-------------------res");
  //   if (!isRegistered) {
  //     const result = await AptosContractUtils.onSignAndSubmitTransaction(
  //       userInfo,
  //       signAndSubmitTransaction,
  //       "register",
  //       [],
  //       network
  //     );
  //     console.log(result, "2222222222222-------------------res");
  //     if (result && result?.success) {
  //       const res = await AptosContractUtils.onSignAndSubmitTransaction(userInfo, signAndSubmitTransaction, "launch", [
  //         userInfo.ID,
  //       ], network);
  //       console.log(res, "33333-------------------res");
  //       if (res.success) {
  //         return true;
  //       }
  //     }
  //   }
  // };

  const handleChange = (e, idx, v, name) => {
    let value = e.target.value * 1;
    const formData = form.getFieldsValue();
    name.includes("amount")
      ? (formData[`usdc${idx + 1}`] = (value * v.price).toFixed(6))
      : (formData[`amount${idx + 1}`] = (value / v.price).toFixed(6));
    form.setFieldsValue(formData);
  };

  const handleSelectChange = (tokenData, v, idx) => {
    // const tokenData = JSON.parse(selectedOption.dataToken);
    const formData = form.getFieldsValue();
    let price = priceObj[tokenData.TokenId];
    if (formList.find((h) => h.token_id === tokenData.TokenId)) {
      formData[`amount${idx + 1}`] = formList[idx].amount;
      formData[`usdc${idx + 1}`] = (formList[idx].amount * price).toFixed(6);
      formData[`token_id${idx + 1}`] = tokenData.Symbol;
      formList[idx].Symbol = tokenData.Symbol;
      formList[idx].icon = tokenData.Icon;
      form.setFieldsValue(formData);
      setFormList([...formList]);
      return message.error("The currency has been added");
    } else {
      formData[`amount${idx + 1}`] = null;
      formData[`usdc${idx + 1}`] = null;
      formData[`token_id${idx + 1}`] = tokenData.Symbol;
      formList[idx].price = price;
      form.setFieldsValue(formData);
    }
    dealData(tokenData, v, idx);
  };

  const dealData = (tokenData, v, idx) => {
    const updatedFormItemList = formList?.map((item, index) => {
      if (idx === index) {
        return {
          ...item,
          icon: tokenData.Icon,
          TokenAddress: tokenData.TokenAddress,
          token_name: tokenData.TokenName,
          Symbol: tokenData.Symbol,
        };
      }
      return item;
    });
    setFormList(updatedFormItemList);
    setShowModalSelectToken(false);
  };

  // const dealSuffix = (v, item) => {
  //   return item.name.includes("usdc") ? "USDC" : v?.Symbol || "";
  //   // return v?.Symbol || ''
  // };

  const handleRegister = _.debounce(async () => {
    setRegisterLoading(true);
    const accounts = userInfo.address;
    let unitAccount = utils.uint8ArrayToHex(account.address);      

    if(localStorage.getItem("AptosWalletName") === wallet.name){
      if (utils.normalizeAddress(unitAccount) !== accounts.toLowerCase()) {
        message.error("Please change the address in the wallet to the login address");
        return;
      }
    }else{
      if (connected) {
        try {
          disconnect();
          TokenManager.removeAll();
          console.log("Disconnecting wallet...1");
        } catch (disconnectError) {
          TokenManager.removeAll();
          console.log("Disconnecting wallet...2", disconnectError);
        }
        navigate(`/`);
      } else {
        TokenManager.removeAll();
        navigate(`/`);
      }
      window.location.reload();
    }

    let value = await AptosContractUtils.fetchAccountInfo(userInfo.address, network);
    if(!value || value === 0){
      value === 0 && message.info("You need APT as gas to issue keys");
      return;
    }
   
    const data = await creatShop();
    if (data) {
      handleAddDataWallet();
    } else {
      setRegisterLoading(false);
    }
  }, 500);

  const handleAddDataWallet = async() => {
    try{
      const res = await mainWallet(localStorage.getItem("AptosWalletName"));
      if (res) {
        setIsIssueLoading(false);
        queryMyKeys();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const queryPortfolioDetail = async () => {
    const res = await getPortfolioDetail({ address: userInfo.address });
    console.log(res, "resresresresres");
    setList(res);
    setIsShow(true);
  };

  const handleSearch = (e) => {
    const target = e.target.value;
    let newArr = _.filter(tokenList, (item) => item.Symbol.toLowerCase().includes(target.toLowerCase()));
    setTokenList(target ? newArr : [...selectList]);
  };

  const columns = [
    {
      title: "Tokens",
      dataIndex: "symbol",
      key: "symbol",
      render: (text, record) => (
        <div>
          <img
            src={record.logo_uri ? record.logo_uri : mp_bj_mr}
            alt="Avatar"
            className="avatar"
            style={{ width: "30px", height: "30px", borderRadius: "50%", verticalAlign: "middle", marginRight: "7px" }}
          />
          {text}
        </div>
      ),
    },
    {
      title: "Chain",
      dataIndex: "chain_id",
      key: "chain_id",
      render: (text) => (
        <img
          src={
            text === "solana"
              ? solanaIcon
              : text === "ethereum"
              ? ethIcon
              : text === "btc"
              ? btcIcon
              : text === "base"
              ? base
              : aptos
          }
          alt="Avatar"
          className="avatar"
          style={{ width: "26px", height: "26px", borderRadius: "50%", verticalAlign: "middle", marginRight: "7px" }}
        />
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount_str",
      key: "amount_str",
      // render: (text, record, index) => <span>{text.toFixed(2)}</span>,
    },
    {
      title: "ROI",
      dataIndex: "roi",
      key: "roi",
      render: (text, record, index) => {
        const color = text >= 0 ? "#19D076" : "#FF4D00";
        return <span style={{ color }}>{(record.roi * 100).toFixed(2)} %</span>;
      },
    },
    {
      title: "Pnl",
      dataIndex: "pnl",
      key: "pnl",
      width: 180,
      render: (text, record, index) => {
        const color = record.roi >= 0 ? "#19D076" : "#FF4D00";
        return <span style={{ color }}>{text}</span>;
      },
    },
    {
      title: "Address",
      dataIndex: "token_id",
      key: "token_id",
      render: (text) => (
        <div>
          <CopyToClipboard text={text} onCopy={utils.handleCopy}>
            <i
              className="iconfont"
              style={{ color: "rgba(187, 255, 214, 0.6)", marginRight: "7px", cursor: "pointer" }}
            >
              &#xe68d;
            </i>
          </CopyToClipboard>
          {utils.shortAccount(text, 2)}
        </div>
      ),
    },
    {
      title: "Entry Price",
      dataIndex: "price",
      key: "price",
      render: (text, record, index) => <Decimal decimal={text} position={6.5} />,
    },
    {
      title: "Current Price",
      dataIndex: "current_price",
      key: "current_price",
      width: 120,
      render: (text, record, index) => <Decimal decimal={text} position={6.5} />,
    },
    {
      title: "Entry Time",
      dataIndex: "created_at",
      key: "created_at",
      width: 160,
      render: (text, record, index) => <span style={{ color: "rgba(187,255,214,0.6)" }}>{utils.showYear(text)}</span>,
    },
  ];

  const columns1 = [
    {
      title: "Tokens",
      dataIndex: "Symbol",
      key: "Symbol",
      render: (text) => (
        <div>
          <img
            src={timg}
            alt="Avatar"
            className="avatar"
            style={{ width: "30px", height: "30px", borderRadius: "50%", verticalAlign: "middle", marginRight: "7px" }}
          />
          {text}
        </div>
      ),
    },
    {
      title: "ROI",
      dataIndex: "roi",
      key: "roi",
      render: (text, record, index) => <span style={{ color: "#FF4D00" }}>{(record.roi * 100).toFixed(2)} %</span>,
    },
    {
      title: "Pnl",
      dataIndex: "roi",
      key: "roi",
      render: (text, record, index) => <span style={{ color: "#19D076" }}>{(record.roi * 100).toFixed(2)} %</span>,
    },
    {
      title: "Holding  Time",
      dataIndex: "current_price",
      key: "current_price",
      render: (text, record, index) => <span style={{ color: "rgba(187,255,214,0.6)" }}>{text.toFixed(6)}</span>,
    },
  ];

  const connectWalletObj = {
    content: "Connect Main Wallet to sign up for a Portfolio account and sell NFT Keys ",
    btnTitle: "Connect Main Wallet",
  };

  const queryDetailChart = async (type) => {
    const res = await detailChart({ address: userInfo?.address, type });
    console.log(res || [], '-------------------------4555555555')
    setDataPoints(res || []);
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    let type = tab === "ALL" ? "" : tab;
    queryDetailChart(type);
  };

  return (
    <div className="myPortfoLioDiv">
      <h2 className="pageTitle">My Portfolio</h2>
      {console.log(userInfo, "userInfo?.address--------555-------------userInfouserInfo")}
      {connected && userInfo.address ? (
        <div className="myPortfoLio">
          <CommHeader
            address={userInfo.address}
            isShow={true}
            KeyID={userInfo.ID}
            handleRegister={handleRegister}
            registerLoading={registerLoading}
            isNotBack={true}
          />
          {!isIssue && userInfo.address === detailsInfo.Address ? (
            <Spin spinning={isIssueloading}>
              <IssueKeys handleRegister={handleRegister} />
            </Spin>
          ) : (
            <>
              <DataWallets isRefresh={registerLoading} />
              <div style={{ marginBottom: "20px" }} className="holdingBox">
                {/* {list.length > 0 && <h2 className="holdTitle">Trade in 90 Days</h2>} */}
                {!(list.length === 0 && isMobile) && <h2 className="holdTitle">Trade in 90 Days</h2>}
                <div className="myWatchimg-table" style={{ marginTop: "20px" }}>
                {!isMobile ? <Table
                    dataSource={list}
                    columns={columns}
                    pagination={false}
                    scroll={{ y: 450, x: isMobile && 1400 }}
                    locale={{
                      emptyText: <p style={{ color: "rgba(187, 255, 214, 0.6)", marginTop: "60px" }}>No Data</p>,
                    }}
                  />
                  : <TradeList list={list}/>
                }
                </div>
              </div>
              <ChatRoom KeyID={userInfo.ID} />
              <div style={{ marginTop: "24px" }}>
                <HolersTable />
              </div>
              {/* <div className="myPortfoLio-form">
                <div className="titleBox">
                  <h2 className="title">ROI Chart</h2>
                  <div className="titleBox-right">
                    {["7D", "30D", "90D"].map((tab) => (
                      <div
                        key={tab}
                        className={`tab ${selectedTab === tab ? "active" : ""}`}
                        onClick={() => handleTabClick(tab)}
                      >
                        {tab}
                      </div>
                    ))}
                  </div>
                </div>
                <PositiveLineChart address={userInfo.address} data={dataPoints} selectedTab={selectedTab}/>
              </div> */}
            </>
          )}
        </div>
      ) : (
        <ConnectWallet {...connectWalletObj} />
      )}
      <ThModal
        width={423}
        styles={{ minHeight: 437, maxHeight: 437, overflowY: "auto" }}
        className="modal"
        centered
        title=""
        footer={null}
        open={showModal}
        onCancel={() => setShowModal(false)}
      >
        <h1 className="title">traders.tech</h1>
        <div className="userInfo moneyList">
          <img src={timg} />
          <div className="userInfo-item">
            <h6>Sajib Rahman</h6>
            <p>You own 3 keys</p>
          </div>
          <div className="userInfo-item keyPrice">
            <h6>0.0054 ETH</h6>
            <p>Key Price</p>
          </div>
        </div>
        <div className="google logOutBox buyKeys" style={{ cursor: "pointer" }} onClick={handleBuy}>
          <span>Buy Keys</span>
        </div>
        <div className="google logOutBox" style={{ cursor: "pointer" }} onClick={handleSellKeys}>
          <span>Sell Keys</span>
        </div>
        <p className="content key">Sell Price: 0.0054 ETH</p>
      </ThModal>
      <ThModal
        width={423}
        styles={{ minHeight: 544, maxHeight: 544, overflowY: "auto" }}
        className="modal"
        centered
        title=""
        footer={null}
        open={showModalBuyKeys}
        onCancel={() => setShowModalBuyKeys(false)}
      >
        <h1 className="title">traders.tech</h1>
        <p className="ethInfo" style={{ fontSize: "12px" }}>
          Buy 3 keys from 0x1f9....c326 for 0.02 ETH
        </p>
        <div className="moneyList">
          <div style={{ marginBottom: "22px" }}>
            <p style={{ fontSize: "14px", color: "#C9FDD9", marginBottom: "16px" }}>Amount</p>
            <Input suffix={setSuffix()} />
          </div>
          <div className="moneyList-item">
            <div className="moneyList-item-price">Total (including Fees)</div>
            <div className="moneyList-item-money">0.025 ETH ≈ $189</div>
          </div>
          <div className="moneyList-item">
            <div className="moneyList-item-price">Wallet address</div>
            <div className="moneyList-item-money hidden">
              0x1f9....c326
              <img src={buy_icon_fuzhi} style={{ verticalAlign: "middle", marginLeft: "10px" }} alt="buy_icon" />
            </div>
          </div>
          <div className="moneyList-item" style={{ marginBottom: 0 }}>
            <div className="moneyList-item-price">Available</div>
            <div className="moneyList-item-money">2.5 ETH</div>
          </div>
          <p style={{ textAlign: "right", color: "#FF4D00", fontSize: "14px" }}>(Insufficient Balance)</p>
        </div>
        <div className="google logOutBox" onClick={handlePurchase}>
          <span>Purchase</span>
        </div>
        <p className="content key">Market Price： 0.0054 ETH</p>
      </ThModal>
      <ThModal
        width={423}
        styles={{ minHeight: 544, maxHeight: 544, overflowY: "auto" }}
        className="modal"
        centered
        title=""
        footer={null}
        open={showModalSellKeys}
        onCancel={() => setShowModalSellKeys(false)}
      >
        <h1 className="title">traders.tech</h1>
        <p className="content key">Sell 0xC2&apos;s portfolio key</p>
        <p className="ethInfo">You will receive 0.02 ETH</p>
        <div className="moneyList">
          <div className="moneyList-item">
            <div className="moneyList-item-price">Selling Price</div>
            <div className="moneyList-item-money">0.025 ETH ≈ $189</div>
          </div>
          <div className="moneyList-item">
            <div className="moneyList-item-price">Service Fee</div>
            <div className="moneyList-item-money">0.025 ETH ≈ $189</div>
          </div>
          <div className="moneyList-item">
            <div className="moneyList-item-price">Builder&apos;s Fee</div>
            <div className="moneyList-item-money">0.025 ETH ≈ $189</div>
          </div>
          <div className="moneyList-item">
            <div className="moneyList-item-price">Wallet address</div>
            <div className="moneyList-item-money">0.025 ETH ≈ $189</div>
          </div>
          <div className="moneyList-item">
            <div className="moneyList-item-price">Available</div>
            <div className="moneyList-item-money">0.025 ETH ≈ $189</div>
          </div>
        </div>
        <div className="google logOutBox">
          <span>Sell</span>
        </div>
        <p className="content key">Sell Price: 0.0054 ETH</p>
      </ThModal>
      <ThModal
        width={560}
        styles={{ minHeight: 400, maxHeight: 400, overflowY: "auto" }}
        className="modal"
        centered
        onOk={handleSave}
        open={showModalSelectToken}
        onCancel={() => setShowModalSelectToken(false)}
        footer={[]}
      >
        {/* <div style={{width: '100%', marginTop: '35px', paddingBottom: '30px'}}>
            <Select
              optionFilterProp="children"
              onChange={(value, option) => handleSelectChange(option)}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            >
              {_.map(tokenList || [],(opt) => (
                <Option value={opt.TokenId} key={opt.TokenId} dataToken={JSON.stringify(opt)}>
                  {opt.Symbol}
                </Option>
              ))}
            </Select>
          </div> */}
        <h1 className="title" style={{ marginTop: 0 }}>
          Select a Token
        </h1>
        <div className="inputBox">
          <Input placeholder="Search name or paste address" prefix={<SearchOutlined />} onChange={handleSearch} />
        </div>
        {_.map(tokenList || [], (opt, idx) => (
          <div className="optionBox" onClick={() => handleSelectChange(opt, selectItem, selectIndex)} key={idx}>
            <img src={fileUrl + opt.Icon} className="imgBtc" />
            <div className="nameBox">
              <span>{opt.Symbol}</span>
              <p>{opt.TokenName}</p>
            </div>
            <div className="priceBox">{priceObj[opt.TokenId]}</div>
          </div>
        ))}
      </ThModal>
    </div>
  );
}
export default MyPortfoLio;

