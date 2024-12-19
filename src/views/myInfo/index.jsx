/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-01-03 19:12:29
 * @LastEditors: chenhua
 * @LastEditTime: 2024-09-13 15:06:58
 */
import { Button, Input, Upload, message, Spin, Modal } from "antd";
import avatar3 from "@/statics/images/avatar3.png";
import ConnectWallet from "@comp/connectWallet";
import home_icon_lo from "@/statics/images/home_icon_lo.png";
import home_icon_telegram from "@/statics/images/home_icon_telegram.svg";
import ThModal from "@comp/modal";
import { useEffect, useState, useCallback } from "react";
import TokenManager from "@utils/TokenManager";
import { pushAccount, getAccountInfo, getUserDetail, getMyKey, bindTg, addDataWallet, tgUrl, unbindTg, mainWallet } from "@/services/index";
import { UploadOutlined } from "@ant-design/icons";
import utils from "@utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { setAvatarUrl } from "@redux/actions/avatarAction";
import { setNickName } from "@redux/actions/nickNameAction";
import { getBalanceReducer, getPurchaseReducer } from "@redux/reselectors";
import "./index.scss";
import DataWallets from "@comp/dataWallets";
import IssueKeys from "@comp/issueKeys";
import HolersTable from "@comp/holersTable";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import AptosContractUtils from "@utils/aptosContractUtils";
import { setBalanceCoin } from "@redux/actions/balanceAction";
import _ from "lodash";
import { useAutoConnect } from "@comp/aptosWallet/AutoConnectProvider";
import { useNavigate } from "react-router-dom";
import roup from "@/statics/images/roup.svg";
import useAptosWallet from "@utils/useAptosWallet";
import telegram from "@/statics/images/telegram.svg";
import Telegramlvse from "@/statics/images/Telegramlvse.svg";

const fileUrl = import.meta.env.VITE_FILE_ACCESS_API;

function MyInfo() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const [editable, setEditable] = useState(false);
  const [value, setValue] = useState();
  const [nickname, setNickname] = useState();
  const [info, setInfo] = useState({});
  const dispatch = useDispatch();
  const balanceCoin = useSelector(getBalanceReducer);
  const priceObj = useSelector(getPurchaseReducer);
  let price = priceObj.usd;
  const [detailsInfo, setDetailsInfo] = useState({});
  const [isIssue, setIsIssue] = useState(false);
  const [isIssueLoading, setIsIssueLoading] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const [tgValue, setTgValue] = useState("");

  const { account, connected, disconnect, network, signAndSubmitTransaction, wallet } = useWallet();
  const { setAutoConnect } = useAutoConnect();
  const { signatureMessage } = useAptosWallet();
  const [loading, setLoading] = useState(true);

  const getBalance = useCallback(async () => {
    const valueInAPT = await AptosContractUtils.fetchAccountInfo(userInfo.address, network); // 获取账户总金额
    console.log("valueInAPT--------------------8888888", valueInAPT);
    dispatch(setBalanceCoin(valueInAPT));
  }, [account, dispatch]);

  useEffect(() => {
    if (connected) {
      getBalance();
      queryMyKeys();
    }
  }, [connected, getBalance]);

  useEffect(() => {
    getAccount();
  }, []);

  useEffect(() => {
    if (userInfo.address) queryUserDetail();
  }, [userInfo.address]);

  const queryMyKeys = async () => {
    const res = await getMyKey();
    setIsIssue(res.status);
    setLoading(false);
  };

  const setTgUrl = async () => {
    const res = await tgUrl();
    window.open(res.tgUrl, "_blank");
  };

  useEffect(() => {
    queryAccountInfo();
  }, [priceObj, balanceCoin, connected]);

  const queryUserDetail = async () => {
    const res = await getUserDetail({ address: userInfo.address });
    setDetailsInfo(res);
  };

  const getAccount = async () => {
    // const allAcc = await getAllAccount();
    // const account = await getAccountAddress();//获取地址
    // setAccount(account);
    // setAllAccounts(allAcc);
  };

  const queryAccountInfo = async () => {
    const res = await getAccountInfo();
    let name = res.nickname ? res.nickname : utils.shortAccount(res.address, 2);
    setNickname(name);
    setImgUrl(res.image);
    setTgValue(res.TgUsername);
    setInfo(
      Object.assign({}, res, {
        totalPrice: (balanceCoin * price).toFixed(2),
        sellingPrice: (res.SellingEarn * price).toFixed(2),
        tradFeePrice: (res.TradFeeEarn * price).toFixed(2),
      })
    );
  };

  const handleLogout = () => {
    setShow(true);
  };

  const logout = async () => {
    if (connected) {
      setShow(false);
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
  };

  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await pushAccount(formData);
    setImgUrl(res.image);
    dispatch(setAvatarUrl(res.image));
    message.success("Upload successful");
  };

  const customRequest = async (options) => {
    try {
      await handleUpload(options);
      options.onSuccess();
    } catch (error) {
      options.onError(error);
    }
  };

  const handleDoubleClick = () => {
    setEditable(true);
  };

  const handleBlur = async () => {
    if (!value) {
      setEditable(false);
      return;
    }
    const formData = new FormData();
    formData.append("nickname", value);
    const res = await pushAccount(formData);
    dispatch(setNickName(res.nickname));
    setNickname(res.nickname);
    setEditable(false);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    // 使用正则表达式检查输入是否为中文字符
    if (/[\u4e00-\u9fa5]/.test(inputValue)) {
      e.preventDefault();
    } else {
      // 允许输入其他字符
      setValue(inputValue);
    }
  };

  const handleRegister = _.debounce(async () => {
    setIsIssueLoading(true);
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
    console.log(value, '-------fetchAccountInfo----------')
    const data = await creatShop();
    console.log(data, 'data------------111-----data')
    if (data) {
      // queryMyKeys();
      // setIsIssueLoading(false)
      handleAddDataWallet();
    } else {
      setIsIssueLoading(false);
      // !data && message.error("failed");
    }
  },500);

  const handleAddDataWallet = async() => { console.log(account, 'account-------------------account')
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
      } else {
        setIsIssueLoading(false);
      }
    }
  };

  const connectWalletObj = {
    content: "Connect Main Wallet to sign up for a Portfolio account and sell NFT Keys",
    btnTitle: "Connect Main Wallet",
  };

  const handleTgChange = (value) => {
    if (value.startsWith("@")) {
      setTgValue(value); // 符合条件，更新状态
    } else {
      message.error("Please start with @!");
    }
  };

  const hanldeUnbindTg = async() => {
    Modal.confirm({
      title: "unbind Telegram",
      content: "Are you sure you want to unbind your Telegram account?",
      async onOk() {
        await unbindTg();
        queryAccountInfo();
        message.success('unbind success!')
      },
      onCancel() {
        console.log("cancel");
      },
    });    
  }

  return (
    <div className="myInfo">
      <h2 className="pageTitle" style={{ marginLeft: 0, marginBottom: "31px" }}>
        My Profile
      </h2>
      <div className="myInfo-top">
        <div className="myInfo-top-left">
          <div className="mtl-avatar mtl-title">
            <Upload customRequest={customRequest} accept="image/*" maxCount={1} showUploadList={false}>
              <Button style={{ display: "none" }} icon={<UploadOutlined />}></Button>
              <div className="avatarBox">
                <img
                  src={imgUrl ? fileUrl + imgUrl : avatar3}
                  alt="Avatar"
                  className="avatar"
                  style={{ width: "100%", height: "100%", cursor: "pointer" }}
                />
                <p className="changep">Change</p>
              </div>
            </Upload>
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h6 onClick={handleDoubleClick} style={{ cursor: "pointer" }}>
                  {editable ? (
                    <Input
                      value={value}
                      onChange={(e) => handleInputChange(e)}
                      onBlur={handleBlur}
                      onPressEnter={handleBlur}
                      autoFocus
                    />
                  ) : (
                    <span>{userInfo.address ? nickname : "-"}</span>
                  )}
                </h6>
              </div>
              <div style={{display: "flex", alignItems: "center"}}>
                <div className="pointsBox">
                  <img src={roup} alt="" />
                  <span>My Points: </span>
                  <span style={{fontWeight: "400"}}>{info.MyPoints}</span>
                </div>
              {
                tgValue && 
                <div className="connectTg" onClick={hanldeUnbindTg}>
                  <img src={Telegramlvse} alt="" />
                  <span>@{tgValue}</span>
                </div>
              }
              </div>
            </div>
          </div>
        </div>
        {
        !tgValue && <div className="TelegramBox" style={{marginTop: '9px'}}>
          <p>Get notification about changes of your watching portfolios</p>
          <Button className="TelegramBox-btn" onClick={setTgUrl}>
            {/* <i className="iconfont">&#xe659;</i> */}
            <img src={telegram} alt="" />
            Connect Telegram
          </Button>
        </div>
        }
      </div>
      <div className="myInfo-balance">
        <h1 className="myInfo-balance-title title mainWallet">Main Wallet</h1>
        <div className="wallet">
          <p>This wallet on Aptos is using to to issue keys and query your Aptos trading history. </p>
          <p>You can find all the money you&apos;ve earned here.</p>
        </div>
        {/* <h1 className="myInfo-balance-title title totalBalance">Wallet Balance</h1>
        <div className="myInfo-balance-money moneyBox usdt" style={{ fontSize: "38px", lineHeight: "38px" }}>
          {userInfo.address && !!balanceCoin ? balanceCoin?.toFixed(2) : 0} APT ≈ $
          {utils.calculatePrice(balanceCoin, price)}
        </div> */}
        <div className="myInfo-balance-list">
          <div className="myInfo-balance-list-item">
            <h6 className="title fontColor keysEarned">Wallet Balance</h6>
            <div className="moneyBox eth" style={{color: '#2ddda4'}}>
              {userInfo.address && !!balanceCoin ? balanceCoin?.toFixed(2) : 0} APT
              <span style={{ color: "rgba(187, 255, 214, 0.6)", fontSize: "18px" }}>
                ≈ ${utils.calculatePrice(balanceCoin, price)}
              </span>
            </div>
          </div>
          <div className="myInfo-balance-list-item">
            <h6 className="title fontColor keysEarned">Issuing Keys Earned</h6>
            <div className="moneyBox eth">
              {userInfo.address ? info.IssueKeyEarn?.toFixed(2) : 0} APT
              <span style={{ color: "rgba(187, 255, 214, 0.6)", fontSize: "18px" }}>
                ≈ ${utils.calculatePrice(info.IssueKeyEarn, price)}
              </span>
            </div>
          </div>
          <div className="myInfo-balance-list-item">
            <h6 className="title fontColor keysEarned">Trading Keys Earned</h6>
            <div className="moneyBox eth">
              {userInfo.address ? info.TradingEarn?.toFixed(2) : 0} APT
              <span style={{ color: "rgba(187, 255, 214, 0.6)", fontSize: "18px" }}>
                ≈ ${utils.calculatePrice(info.TradingEarn, price)}
              </span>
            </div>
          </div>
        </div>
      </div>
      {connected && userInfo.address ? (
        <>
          {!isIssue && userInfo.address === detailsInfo.Address ? (
            <Spin spinning={loading}>
              <IssueKeys handleRegister={handleRegister} />
            </Spin>
          ) : (
            <>
              <DataWallets />
              {/* <div className="myInfo-balance myInfo-latest">
                <h1 className=" myInfo-latest-title">
                  Get latest notification about changes of your watching portfolios
                </h1>
                <div className="myInfo-latest-list">
                  <div className="myInfo-latest-list-item" style={{ width: "100%" }}>
                    <p className="fontColor">Connect your Telegram</p>
                    <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                      <img src={home_icon_telegram} style={{ marginRight: "10px" }} />
                      <Input autoComplete="off" className="comingSoonBox" placeholder="@ Siri" onChange={(e) => handleTgChange(e.target.value)}
                      value={tgValue}/>
                      <div className="bsubButton sencdCode" style={{ background: "#C9FDD9", color: "#000300" }} onClick={handleBindTg}>
                        Connect
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
              <HolersTable />
            </>
          )}
        </>
      ) : (
        <ConnectWallet {...connectWalletObj} isMargin={true} />
      )}
      {userInfo.address && (
        <div className="myInfo-btn">
          <div className="myInfo-btn-cp" onClick={handleLogout}>
            <img src={home_icon_lo} style={{ width: "20px", height: "20px" }} alt="home_icon" />
            <span className="fontColor">Log Out</span>
          </div>
        </div>
      )}
      <ThModal
        width={423}
        styles={{ minHeight: 280, maxHeight: 280, overflowY: "auto" }}
        className="modal logoModal"
        centered
        title=""
        footer={null}
        open={show}
        onCancel={() => setShow(false)}
      >
        <h3 className="logout title">Logout</h3>
        <div className="content">Are you sure you want to log out of {utils.shortAccount(userInfo.address, 2)}？</div>
        <div className="google logOutBox" onClick={logout} style={{ cursor: "pointer" }}>
          <span>Log out</span>
        </div>
      </ThModal>
    </div>
  );
}
export default MyInfo;