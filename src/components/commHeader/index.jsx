/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-01-04 19:55:03
 * @LastEditors: chenhua
 * @LastEditTime: 2024-09-13 15:00:11
 */
import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Button, message, InputNumber, Spin, Tooltip } from "antd";
import rk_icon_yaoshi from "@/statics/images/rk_icon_yaoshi.png";
import Buy_icon_top from "@/statics/images/Buy_icon_top.png";
import Buy_icon_down from "@/statics/images/Buy_icon_down.png";
import tk_icon_jz from "@/statics/images/tk_icon_jz.gif";
import ethIcon from "@statics/images/ts_icon_dui.svg";
import ThModal from "@comp/modal";
import { getPurchaseReducer, getConnectWalletReducer } from "@redux/reselectors";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import { getUserDetail, getRefreshEvent, myFollowingLog } from "@/services/index";
import { useDispatch, useSelector } from "react-redux";
import { setBalanceCoin } from "@redux/actions/balanceAction";
import utils from "@utils/utils";
import TokenManager from "@utils/TokenManager";
import Decimal from "@comp/decimal";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import AptosContractUtils from "@utils/aptosContractUtils";
import logo from "@/statics/images/logo1.svg";
import { QuestionCircleOutlined } from "@ant-design/icons";
import aptHeader from "@statics/images/apt_logo.svg";
import animation from "@statics/images/animation.webp";
import animation2 from "@statics/images/animation-2.webp";
// import { useHistory } from 'react-router-dom';
import _ from "lodash";

const fileUrl = import.meta.env.VITE_FILE_ACCESS_API;
const placeholderImg = "path_to_placeholder_image";
const sellRatio = 0.6;
const sellRatio2 = 0.975;

const CommHeader = forwardRef(
  ({ KeyID, address, isShow, handleRegister, registerLoading, isNotBack, toggleIsShow }, ref) => {
    const navigate = useNavigate();
    // const history = useHistory();
    const [showModalBuyKeys, setShowModalBuyKeys] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const priceObj = useSelector(getPurchaseReducer);
    const [ethPrice, setEthPrice] = useState(0);
    const [dollar, setDollar] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalDollar, setTotalDollar] = useState(0);
    const [value, setValue] = useState(1);
    const [balance, setBalance] = useState(0);
    const [pushModal, setPushModal] = useState(false);
    const [item, setItem] = useState({});
    const [unitPrice, setUnitPrice] = useState(null);
    const dispatch = useDispatch();
    const [sellItemModal, setSellItemModal] = useState(false);
    const [sellModal, setSellModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [keyPriceApt, setKeyPriceApt] = useState(0);
    const [tradeText, setTradeText] = useState("");
    const [tradeKeysList, setTradeKeysList] = useState([]);
    const [sellObj, setSellObj] = useState({});
    const [sellkeyPrice, setSellkeyPrice] = useState(0);
    const [isBuyLoading, setIsBuyLoading] = useState(false);
    const [isSellLoading, setIsSellLoading] = useState(false);

    const { account, connected, network, disconnect, signAndSubmitTransaction, wallet } = useWallet();
    const use = useWallet();
    let price = priceObj.usd;
    let isConnected = useSelector(getConnectWalletReducer);
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};

    // KeyID = 13;
    console.log(account, connected, "KeyID55KeyIDKeyIDKeyID55555555555555555", price, use, wallet);

    useEffect(() => {
      // checkWalletConnection();

      if (userInfo.address) {
        queryMyPortfolio();
        checkWalletConnection();
        queryAptPrice();
        // queryAccountInfo();
      }
    }, [userInfo.address, connected]);

    useEffect(() => {
      if(balance){
        toggleIsShow && toggleIsShow(true);
      }
    },[balance])

    // useEffect(() => {

    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    useEffect(() => {
      if (KeyID) {
        queryMyFollowingLog();
      }
    }, [KeyID]);

    const queryMyFollowingLog = async () => {
      const res = await myFollowingLog({ keyId: KeyID });
      setTradeKeysList(res);
    };

    const handleSellItem = (item) => {
      let purchasedApt = calculateFormula(item.buy_supply);
      let purchasedDollar = Number(calculateFormula(item.buy_supply) * price);
      let sellApt = calculateFormula(keyPriceApt) * sellRatio;
      let sellDollar = Number(calculateFormula(keyPriceApt) * price) * sellRatio;
      let profitApt = sellApt - purchasedApt;
      let profitDollar = sellDollar - purchasedDollar;
      let obj = {
        purchasedApt,
        purchasedDollar,
        sellApt,
        sellDollar,
        profitApt,
        profitDollar,
        ...item,
      };
      console.log(obj, "obj-----------------obj");
      setSellObj(obj);
      setSellModal(!sellModal);
    };

    const calculateFormula = (X) => {
      return (X * X) / 28;
    };

    const calculateSumFormula = (supply, count) => {
      let sum = 0;
      for (let i = 1; i <= count; i++) {
        supply++;
        sum += (supply * supply) / 28;
      }
      return sum;
    };

    const handleSellKeys = () => {
      handleBuy(false);
      queryMyFollowingLog();
    };

    const handleBuy = async (type) => {
      if (!connected) return;
      type ? setIsBuyLoading(true) : setIsSellLoading(true);
      await initWeb3();
      type ? setShowModalBuyKeys(!showModalBuyKeys) : setSellItemModal(!sellItemModal);
      setValue(1);
      setIsBuyLoading(false);
      setIsSellLoading(false);
      handleChange(1);
    };

    const queryAptPrice = async () => {
      const key_price = await AptosContractUtils.isAccountRegistered([KeyID], "token_supply", network);
      console.log(key_price, "key_price-------------key_price");
      setKeyPriceApt(Number(key_price));
    };

    const checkWalletConnection = async () => {
      if (connected) {
        const account = userInfo.address;
        const res = await AptosContractUtils.isAccountRegistered([account, KeyID], "balance", network, true);
        setBalance(Number(res) || 0);
      }
    };

    const isNumber = (value) => {
      return typeof value === 'number' && !isNaN(value) && isFinite(value);
    };

    const handleChange = async (e) => {
      let value = Number(e?.target?.value) || Number(e);console.log(value, isNumber(value), 'valuevaluevalue')
      if(!isNumber(value)) value = 1;
      if (value > 50) {
        return;
      }
      const keyPriceInEth = calculateSumFormula(keyPriceApt, value);
      const sellkeyPrice = calculateSumFormula(keyPriceApt - 1, value) * sellRatio;
      const totlaPrice = Number((keyPriceInEth * price).toFixed(2));console.log(keyPriceInEth, sellkeyPrice,totlaPrice,'-----------keyPriceInEth--keyPriceInEth')
      setSellkeyPrice(sellkeyPrice);
      setEthPrice(keyPriceInEth);
      console.log(keyPriceInEth,  "keyPriceInEth--------------");
      value === 1 && setUnitPrice(keyPriceInEth);
      setDollar(totlaPrice);
      setValue(value);
    };

    

    const handlePurchase = _.debounce(async () => {
      const accounts = userInfo.address;
      let unitAccount = utils.uint8ArrayToHex(account.address)
      console.log(unitAccount, accounts, account,"accountsaccountsaccountsaccounts-------------");
      
      // if (utils.normalizeAddress(unitAccount) !== accounts.toLowerCase()) {
      //   message.error("Please change the address in the wallet to the login address");
      //   return;
      // }

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
      
      setPushModal(true);
      setTradeText("Purchase succeeded");
      const buyPrice = await AptosContractUtils.isAccountRegistered([KeyID, value], "get_key_price_by_id", network);
      const res = await AptosContractUtils.onSignAndSubmitTransaction(
        accounts,
        signAndSubmitTransaction,
        "subscribe",
        [KeyID, value, buyPrice],
        network
      );

      if (res && res.success) {
        setShowModal(false);
        setShowModalBuyKeys(false);
        initWeb3();
        setPushModal(false);
        setSuccessModal(!successModal);
        queryMyFollowingLog();
        queryAptPrice();
        setTimeout(() => queryMyPortfolio(), 1000);
        console.log(toggleIsShow, 'toggleIsShowtoggleIsShowtoggleIsShow')
        toggleIsShow && toggleIsShow(true);
        await getRefreshEvent();
      } else {
        message.error("Purchase failed");
        setPushModal(false);
      }
    }, 500);

    const handleSell = _.debounce(async () => {
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
      

      // if (account.address !== accounts) {
      //   message.error("Please change the address in the wallet to the login address");
      //   return;
      // }
      setPushModal(true);
      setTradeText("Successfully sold");
      let walletName = localStorage.getItem("AptosWalletName");
      
      let amount = BigInt(Math.floor(sellObj?.sellApt * 100000000)) - BigInt(100);
      let moneyAmount = walletName === "Martian" ? amount.toString() : amount;

      const res = await AptosContractUtils.onSignAndSubmitTransaction(
        accounts,
        signAndSubmitTransaction,
        "sell",
        [KeyID, moneyAmount, sellObj.remark],
        network
      );
      if (res && res.success) {
        setPushModal(false);
        setShowModal(false);
        setSellModal(false);
        setSellItemModal(false);
        setSuccessModal(!successModal);
        toggleIsShow && toggleIsShow(true);
        await getRefreshEvent();
        // 处理成功逻辑
      } else {
        message.error("Sell failed");
        // 处理失败逻辑
      }
    }, 500);

    const queryMyPortfolio = async () => {
      const res = await getUserDetail({ address });
      const time = deatTime(res.CreatedAt);
      const obj = Object.assign({}, res, { time });
      setItem(obj);
    };

    const deatTime = (time) => {
      const givenTime = new Date(time);
      const currentTime = new Date();
      const timeDiff = currentTime - givenTime;
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
      return Math.floor(daysDiff);
    };

    const initWeb3 = async () => {
      // 获取账户金额
      const accounts = userInfo.address; //await getAccountAddress();//获取地址
      const valueInAPT = await AptosContractUtils.fetchAccountInfo(accounts, network); // 获取账户总金额
      const totalDollar = valueInAPT * price;
      setTotalDollar(totalDollar);
      console.log(valueInAPT, "=======================valueInApt");
      setTotalPrice(valueInAPT);
      dispatch(setBalanceCoin(valueInAPT));
    };

    // 使用 useImperativeHandle 来暴露方法给父组件
    useImperativeHandle(ref, () => ({
      handleChild: handleChild,
      getData: getData,
      handleTradeKeys: handleTradeKeys,
      checkWalletConnection: checkWalletConnection,
    }));

    const handleChild = () => {
      handleBuy(true);
    };

    const handleBack = () => {
      // const keyUrl = localStorage.getItem("selectedKey");
      // navigate(keyUrl);
      window.history.back();
    };

    const handleTradeKeys = () => {
      if (!TokenManager.getToken()) return message.info("Please login");
      handleChange(1);
      setShowModal(!showModal);
      queryMyFollowingLog();
      setValue(1);
      checkWalletConnection();
      // queryMyPortfolio();
    };

    const upArrow = <img src={Buy_icon_top} alt="up-arrow" />;

    const downArrow = <img src={Buy_icon_down} alt="down-arrow" />;

    // const CustomCloseButton = () => (
    //   <i className="iconfont" style={{ color: "rgba(187, 255, 214, 0.6)" }}>
    //     &#xe68b;
    //   </i>
    // );

    const getData = () => {
      return {
        isConnected,
        balance,
      };
    };

    const CustomTooltipContent = () => (
      <div className="tooltipBox">
        <h3>Why selling price is different from the market price?</h3>
        <p>
          Since when users buy the key, only 60% of the fund goes to the bonding curve&apos;s liquidity pool (30% goes
          to the key issuer and 10% goes to the platform), the liquidity pool can only cash out amount as 60% of the
          market price when users trying to sell the key. (This is also a scheme that keeps the liquidity healthy, and
          all key holders can sell the keys back to the pool)
        </p>
        <p>
          lt&apos;s also a protection to prevent users buy the key and copy the smart money&apos;s address and sell it
          immediately. Key holders can only directly profit from the key when they hold the key till themarket price
          goes up by 70% at least.
        </p>
      </div>
    );

    const maxLoop = 10;
    const sortUnit = ["st", "nd", "rd", "th", "ve", "ix", "en", "ht", "ne", "en"];
    const generateArray = () => {
      const length = Math.min(value, maxLoop);
      return Array.from({ length }, (_, index) => index + 1);
    };

    return (
      <div>
        <Spin spinning={!connected}>
          <div className="commHeader">
            {/* <div className='cil-title' style> */}
            <div style={{ marginRight: "10px", cursor: "pointer", textAlign: "left" }}>
              {!isNotBack && (
                <i
                  onClick={handleBack}
                  className="iconfont backIcon"
                  style={{ fontSize: "19px", color: "#c9fdd9", marginBottom: "22px", display: "inline-block" }}
                >
                  &#xe68b;
                </i>
              )}
            </div>
            {/* </div> */}
            <div className="commHeader-info">
              <div className="commHeader-info-left">
                <div className="cil-avatar cil-title">
                  <img className="avatar" src={item.Image ? fileUrl + item.Image : placeholderImg} />
                  <div style={{ textAlign: "left" }}>
                    <h6>{item.Nickname || utils.shortAccount(item.Address, 2)}</h6>
                  </div>
                </div>
                <div className="cil-list">
                  <div className="cil-list-item nameItem">
                    <div className="cil-list-item-imgBox">
                      <i className="iconfont">&#xe68a;</i>
                      <span>Joined Days</span>
                    </div>
                    <p>{item.time} Days</p>
                  </div>
                  <div className="cil-list-item nameItem">
                    <div className="cil-list-item-imgBox">
                      <i className="iconfont">&#xe682;</i>
                      <span style={{ marginLeft: "11px" }}>Holders</span>
                    </div>
                    <p>{item.count_owner}</p>
                  </div>
                  <div className="cil-list-item nameItem">
                    <div className="cil-list-item-imgBox">
                      <i className="iconfont">&#xe684;</i>
                      <span style={{ marginLeft: "8px" }}>Total Keys</span>
                    </div>
                    <p>{item.count_key}</p>
                  </div>
                </div>
              </div>
              <div className="commHeader-info-right">
                <div className="cir-left leftBox">
                  <div style={{ display: "flex" }}>
                    <div className="cir-left-top" style={{ width: "136px" }}>
                      <p>30D ROl</p>
                      <div style={{ color: utils.dealColor(item.roi_30d) }}>
                        {item.roi_30d >= 0 ? "+" : ""}
                        {(item.roi_30d * 100).toFixed(2)}%
                      </div>
                    </div>
                    <div className="cir-left-top">
                      <p>30D Pnl</p>
                      <div style={{ color: utils.dealColor(item.roi_30d) }}>{item.pnl_str}</div>
                    </div>
                  </div>
                  <div className="cir-left-bottom cil-list" style={{ marginTop: 0 }}>
                    <div className="cil-list-item itemWidth" style={{ width: "136px" }}>
                      <div className="cil-list-item-imgBox">
                        <i className="iconfont">&#xe683;</i>
                        <span>7D ROl</span>
                      </div>
                      <p>{(item.roi_7d * 100).toFixed(2)}%</p>
                    </div>
                    <div className="cil-list-item marginLeft">
                      <div className="cil-list-item-imgBox">
                        <i className="iconfont">&#xe683;</i>
                        <span>90D ROl</span>
                      </div>
                      <p>{(item.roi_90d * 100).toFixed(2)}%</p>
                    </div>
                  </div>
                </div>
                <div className="cir-right">
                  <div className="cir-right-top cir-left">
                    <div className="cir-right-top-left cir-left-top marketKeys">
                      <p>Market Key Price</p>
                      <div className="priceKeys" style={{ fontSize: "30px" }}>
                        {item.key_price?.toFixed(2)} APT
                        <span style={{ color: "rgba(187, 255, 214, 0.6)" }}>
                          ≈ ${utils.calculatePrice(item.key_price, price)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {connected ? (
                    // (balance > 0 ?
                    <>
                      {!isNotBack && (
                        <div
                          className={balance <= 0 ? "bsubButton traderKeys" : "bsubButton"}
                          onClick={() => handleTradeKeys()}
                          style={{ width: "218px" }}
                        >
                          Trade Keys
                        </div>
                      )}
                    </>
                  ) : (
                    // : <div className='bsubButton' onClick={() => handleBuy(true)} style={{background: '#C9FDD9', width: '264px'}}>Buy Keys</div> )
                    <div className="bsubButton" onClick={checkWalletConnection} style={{ width: "264px" }}>
                      Connect wallet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Spin>
        {
          console.log(isShow, '----------------777')
        }
        {!isShow && (
          <div className="rankingBox">
            <img src={rk_icon_yaoshi} alt="yaoshi" />
            <div className="title">Obtain at least one key to check the details</div>
            {connected ? (
              // (balance > 0 ?
              <Button className={balance <= 0 ? "buy" : "buy tradeKeys"} onClick={() => handleTradeKeys()}>
                Trade Keys
              </Button>
            ) : (
              // : <Button className='buy' onClick={() => handleBuy(true)} style={{color: '#000300 !important'}}>Buy Keys</Button> )
              <Button className="buy" style={{ background: "rgb(201, 253, 217)" }} onClick={checkWalletConnection}>
                Connect wallet
              </Button>
            )}
          </div>
        )}
        <ThModal
          width={528}
          styles={{ minHeight: 527, maxHeight: 527, overflowY: "auto" }}
          className="modal totalModal"
          centered
          title=""
          footer={null}
          open={showModalBuyKeys}
          onCancel={() => setShowModalBuyKeys(false)}
        >
          <h1 className="title modalTitle">
            <img src={logo} style={{ width: "216px", height: "27px" }} alt="logo" />
          </h1>
          <div className="traderBox">
            <div className="traderBox-left">
              <img src={animation2} alt="apt-logo" />
            </div>
            <div className="traderBox-right">
              <p className="traderBox-right-total">Total</p>
              <div className="traderBox-right-money" style={{ display: "flex" }}>
                <img className="iconLogo" src={aptHeader} alt="apt-logo" />
                <Decimal decimal={ethPrice * 1.025} position={8} /> APT ≈ ${dollar}
              </div>
              <div className="traderBox-right-wallet">
                Wallet Balance: <Decimal decimal={totalPrice} position={8} /> APT ≈ ${totalDollar.toFixed(2)}
              </div>
              <InputNumber
                className="custom-input-number"
                min={1}
                onBlur={handleChange}
                onChange={(e) => setValue(e)}
                value={value}
                upHandler={upArrow}
                downHandler={downArrow}
              />
              <Button
                className={
                  totalPrice < ethPrice ? "google logOutBox disabledButton commBtn" : "commBtn google logOutBox"
                }
                disabled={totalPrice < ethPrice}
                type="primary"
                onClick={handlePurchase}
              >
                <span>Buy</span>
              </Button>
            </div>
          </div>
          <div className="keyPrice-box">
            {generateArray().map((item, index) => {
              return (
                <div className="keyPrice-box-item" key={index}>
                  <span>
                    {item}
                    {sortUnit[index]} Key Price
                  </span>
                  <span>
                    {calculateFormula(keyPriceApt + item).toFixed(2)} APT ≈ $
                    {(calculateFormula(keyPriceApt + item) * price).toFixed(2)}
                  </span>
                </div>
              );
            })}
            <div className="keyPrice-box-item">
              <span>Service Fee（2.5% of the total）</span>
              <span>
                {(ethPrice * 0.025).toFixed(2)} APT ≈ ${(ethPrice * 0.025 * price).toFixed(2)}
              </span>
            </div>
          </div>
        </ThModal>
        <ThModal
          width={528}
          styles={{ minHeight: 437, maxHeight: 437, overflowY: "auto" }}
          className="modal buyKeysModal"
          centered
          title=""
          footer={null}
          open={showModal}
          onCancel={() => setShowModal(false)}
          // closeIcon={<CustomCloseButton />}
        >
          <div className="title modalTitle" style={{ marginTop: "30px" }}>
            <img src={logo} style={{ width: "216px", height: "27px" }} alt="logo" />
          </div>
          <div className="userInfo moneyList">
            <img src={item.Image ? fileUrl + item.Image : fileUrl + userInfo.image} alt="userInfo" />
            <div className="userInfo-item">
              <h6>{item.Nickname || utils.shortAccount(item.Address || userInfo.address, 2)}</h6>
              <p>You own {balance} keys</p>
            </div>
            <div className="userInfo-item keyPrice">
              <h6 style={{ display: "flex" }}>
                <Decimal decimal={unitPrice} position={6.5} distance={4} /> APT
              </h6>
              <p>Key Price</p>
            </div>
          </div>
          <Button
            type="primary"
            loading={isBuyLoading}
            className="google logOutBox"
            style={{ cursor: "pointer", marginBottom: "20px" }}
            onClick={handleBuy}
          >
            <span>Buy Keys</span>
          </Button>
          <Button
            loading={isSellLoading}
            className={
              tradeKeysList.length === 0
                ? "google logOutBox buyKeys sellKeys disabledBox"
                : "google logOutBox buyKeys sellKeys"
            }
            disabled={tradeKeysList.length === 0}
            onClick={handleSellKeys}
            style={{ marginBottom: "17px" }}
          >
            <span>Sell Keys</span>
          </Button>
          {/* <p className="content key" style={{ display: "flex", justifyContent: "center" }}>
            Sell Price： <Decimal decimal={sellkeyPrice} position={4} distance={4} />
            APT
          </p> */}
        </ThModal>
        <ThModal
          width={528}
          styles={{ minHeight: 603, maxHeight: 603, overflowY: "auto" }}
          className="modal keysListModal"
          centered
          title=""
          footer={null}
          open={sellItemModal}
          onCancel={() => setSellItemModal(false)}
        >
          <h1 className="title modalTitle" style={{ marginTop: "30px" }}>
            <img src={logo} style={{ width: "216px", height: "27px" }} />
          </h1>
          <div className="keysList">
            {tradeKeysList.map((item, index) => {
              return (
                <div className="keysList-item" key={index}>
                  <div className="keysList-item-imgBox" onClick={() => handleSellItem(item)}>
                    <img src={animation} />
                    <p className="keysList-item-imgBox-p">Sell</p>
                  </div>
                  <div className="purchased">Purchased: {calculateFormula(item.buy_supply).toFixed(2)} APT</div>
                  <div className="position purchased">Position:{item.buy_supply}th</div>
                </div>
              );
            })}
          </div>
        </ThModal>
        <ThModal
          width={528}
          styles={{ minHeight: 603, maxHeight: 603, overflowY: "auto" }}
          className="modal sellModal"
          centered
          title=""
          footer={null}
          open={sellModal}
          onCancel={() => setSellModal(false)}
        >
          <h1 className="title modalTitle" style={{ marginTop: "16px" }}>
            <img src={logo} style={{ width: "216px", height: "27px" }} />
          </h1>
          <div className="sell-modal-title">
            You will receive {(sellObj.sellApt * sellRatio2).toFixed(2)} APT≈$
            {(sellObj?.sellDollar * sellRatio2)?.toFixed(2)}
            <Tooltip overlay={<CustomTooltipContent />}>
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
          <div className="keyPrice-box" style={{ marginTop: "17px" }}>
            <div className="keyPrice-box-item">
              <span>Selling Price</span>
              <span style={{ color: "#2DDDA4", fontWeight: "bold" }}>
                {sellObj?.sellApt?.toFixed(2)} APT ≈ ${sellObj?.sellDollar?.toFixed(2)}
              </span>
            </div>
            <div className="keyPrice-box-item">
              <span>Service Fee (2.5%)</span>
              <span style={{ color: "#2DDDA4", fontWeight: "bold" }}>
                {(sellObj?.sellApt * 0.025)?.toFixed(2)} APT ≈ ${(sellObj?.sellDollar * 0.025)?.toFixed(2)}
              </span>
            </div>
            <div className="keyPrice-box-item">
              <span>Purchased Price</span>
              <span>
                {sellObj?.purchasedApt?.toFixed(2)} APT ≈ ${sellObj?.purchasedDollar?.toFixed(2)}
              </span>
            </div>
            <div className="keyPrice-box-item">
              <span>Proposed Profit</span>
              <span>
                {sellObj?.profitApt?.toFixed(2)} APT ≈{" "}
                {sellObj?.profitDollar?.toFixed(2) < 0 ? (
                  <span>-${Math.abs(sellObj?.profitDollar)?.toFixed(2)}</span>
                ) : (
                  <span>${sellObj?.profitDollar?.toFixed(2)}</span>
                )}
              </span>
            </div>
          </div>
          <div
            className="google logOutBox buyKeys"
            style={{ cursor: "pointer", margin: "36px 0 12px" }}
            onClick={handleSell}
          >
            <span>Sell Keys</span>
          </div>
        </ThModal>
        <ThModal
          width={423}
          styles={{ minHeight: 260, maxHeight: 260, overflowY: "auto" }}
          className="modal promptModal"
          centered
          title=""
          footer={null}
          open={pushModal}
          onCancel={() => setPushModal(false)}
        >
          <div style={{ textAlign: "center", margin: "40.3px 0" }} className="animationBox">
            <img src={tk_icon_jz} alt="Animation" />
            <p style={{ fontSize: "20px", color: "#C9FDD9" }}>Purchase submitted</p>
          </div>
        </ThModal>
        <ThModal
          width={528}
          styles={{ minHeight: 260, maxHeight: 260, overflowY: "auto" }}
          className="modal successModal"
          centered
          title=""
          footer={null}
          open={successModal}
          onCancel={() => setSuccessModal(false)}
        >
          <div style={{ textAlign: "center", margin: "30px 0 16px" }}>
            <div className="successBox">
              <img className="animationBox" src={animation} alt="SVG" />
              <img className="eth ethImg" src={ethIcon} alt="SVG" />
            </div>
            <p style={{ fontSize: "20px", color: "#C9FDD9", marginTop: "5px" }}>{tradeText}</p>
          </div>
        </ThModal>
      </div>
    );
  }
);
export default CommHeader;
