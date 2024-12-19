/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-01-03 20:33:18
 * @LastEditors: chenhua
 * @LastEditTime: 2024-08-16 18:41:59
 */
import React, { useEffect, useRef } from "react";
import { Row, Col, Button, Input, message, Modal } from "antd";
import ThModal from "@comp/modal";
import { useState } from "react";
import rk_icon_xiala from "@/statics/images/rk_icon_xiala.png";
import buy_icon_fuzhi from "@/statics/images/buy_icon_fuzhi.png";
import { useNavigate } from "react-router-dom";
import { getMyFollowing, tgUrl, getAccountInfo, unbindTg } from "@/services/index";
import "../ranKing/index.scss";
import timg from "@/statics/images/timg.jpg";
import utils from "@utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { getConnectWalletReducer, getPurchaseReducer } from "@redux/reselectors";
import ConnectWallet from "@comp/connectWallet";
import LineChart from "@comp/charts/LineChart";
import useDynamicLayout from "@comp/layOutCom/useDynamicLayout";
import _ from "lodash";
import TokenManager from "@utils/TokenManager";
import telegram from "@/statics/images/telegram.svg";
import Telegramlvse from "@/statics/images/Telegramlvse.svg";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
const fileUrl = import.meta.env.VITE_FILE_ACCESS_API;

function MyFollowing() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [list, setList] = useState([]);
  const priceObj = useSelector(getPurchaseReducer);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  let token = TokenManager.getToken();
  const [tgValue, setTgValue] = useState("");

  let price = priceObj.usd;

  const { connected } = useWallet();
  const ranKingRef = useRef(null);
  const divRef = useRef(null);
  const { divCount, padding } = useDynamicLayout(ranKingRef, connected, 4, 10, divRef);

  useEffect(() => {
    if (token) {
      queryMyFollowing();
      queryAccountInfo();
    }
  }, [token]);

  const queryMyFollowing = async () => {
    const res = await getMyFollowing();
    // if(!res.message){
    setList(res);
    // }
  };

  const queryAccountInfo = async () => {
    const res = await getAccountInfo();
    setTgValue(res.TgUsername);
  };

  const setSuffix = () => {
    return <img src={rk_icon_xiala} />;
  };

  const handleRanling = (item) => {
    console.log(item, "======================s");
    // navigate(`/Purchase`, { state: { keyId: item.key_id, address: item.address } });
    navigate(`/Purchase?keyId=${item.key_id}&address=${item.address}`);
    // navigate('/ranKing')
    // localStorage.setItem('selectedKey', '/ranKing');
  };

  const connectWalletObj = {
    content: "Connect Main Wallet to sign up for a Portfolio account and sell NFT Keys",
    btnTitle: "Connect Main Wallet",
  };

  const isrankingObj = {
    content: "Trade keys to follow smart money at Ranking page",
    btnTitle: "Ranking Page",
    isRanking: true,
  };

  const handleMainWallet = () => {
    navigate(`/`);
  };

  const setTgUrl = async () => {
    const res = await tgUrl();
    window.open(res.tgUrl, "_blank");
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
    <>
      {connected && !!userInfo.address ? (
        <>
          {list && list?.length > 0 ? (
            <div
              className="ranKing myFollowing"
              ref={ranKingRef}
              style={{ paddingLeft: `${padding}px`, paddingRight: `${padding}px`, textAlign: "left" }}
            >
              <h2 className="pageTitle  ranKing-name">My Following</h2>
              {
                !tgValue && <div className="TelegramBox" style={{textAlign: 'left', margin: '20px 0'}}>
                <p>Get notification about changes of your watching portfolios</p>
                <Button className="TelegramBox-btn" onClick={setTgUrl}>
                  {/* <i className="iconfont">&#xe659;</i> */}
                  <img src={telegram} alt="" />
                  Connect Telegram
                </Button>
              </div>
              }
              {
                tgValue && 
                <div style={{display: 'inline-block'}}>
                  <div className="connectTg" style={{margin: '0 0 20px'}} onClick={hanldeUnbindTg}>
                    {/* <i className="iconfont">&#xe659;</i> */}
                    <img src={Telegramlvse} alt="" />
                    <span>@{tgValue}</span>
                  </div>
                </div>
              }
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {_.map(list || [], (item, idx) => (
                  <div
                    className="ranKing-item divItem"
                    key={idx}
                    style={{
                      width: "265px",
                      marginRight: (idx + 1) % divCount === 0 ? 0 : "10px",
                      marginBottom: "10px",
                    }}
                    ref={divRef}
                  >
                    <Row gutter={16} align="middle" className="avatar">
                      <Col>
                        {/* <Avatar size={55} icon={<UserOutlined />} /> */}
                        <img
                          src={item.image ? fileUrl + item.image : timg}
                          alt="Avatar"
                          style={{ width: "46px", height: "46px", borderRadius: "50%", verticalAlign: "middle" }}
                        />
                      </Col>
                      <Col>
                        <div className="ranKing-item-info">
                          <div className="ranKing-item-info-name">
                            {item.nickname || utils.shortAccount(item.address, 2)}
                          </div>
                          <div className="ranKing-item-info-num">
                            <span className="miin-age miin-comm">
                              <span className="iconfont iconFontTwo">&#xe682;</span> {item.count_owner}
                            </span>
                            <span className="miin-key miin-comm">
                              <span className="iconfont iconFontTwo">&#xe684;</span> {item.count_key}
                            </span>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <div className="bottom" style={{ display: "flex", marginBottom: "15px" }}>
                      <div className="numberInfo" style={{ width: "92px", marginRight: "28px" }}>
                        <h1 className="newName roiTitle">30D ROI</h1>
                        <p style={{ color: utils.dealColor(item.roi_30d) }}>
                          {item.roi_30d >= 0 ? "+" : ""}
                          {(item.roi_30d * 100).toFixed(2)}%
                        </p>
                      </div>
                      <div className="lineBox">
                        <LineChart address={item.address} />
                      </div>
                    </div>
                    <div className="btnBox" style={{ display: "flex", marginBottom: "12px" }}>
                      <div className="numberInfo" style={{ width: "92px", marginRight: "28px" }}>
                        <h1 className="newName pnlTitle">30D PnL</h1>
                        <p style={{ color: utils.dealColor(item.roi_30d) }}>{item.pnl_str}</p>
                      </div>
                      <div className="lineBox">
                        <div className="numberBox rol newName" style={{ marginTop: "-6px" }}>
                          7D ROI
                          <span style={{ color: "rgba(187, 255, 214, 0.6)", fontWeight: "normal", fontSize: "12px" }}>
                            90D ROI
                          </span>
                        </div>
                        <div className="numberBox roiBox newName" style={{ marginTop: "13px" }}>
                          <span style={{ marginLeft: 0 }}>{(item.roi_7d * 100).toFixed(2)}%</span>
                          <span>{(item.roi_90d * 100).toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginBottom: "11px" }}>
                      <div className="numberInfo keyPrice" style={{ width: "100%" }}>
                        <h1 className="newName">Key Price </h1>
                        <p>
                          {item.key_price.toFixed(2)} APT
                          <span style={{ fontSize: "22px", color: "rgba(187,255,214,0.6)" }}>
                            {" "}
                            ≈ $ {utils.calculatePrice(item.key_price, price)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div
                      className="bsubButton"
                      style={{ backgroundColor: "#2DDDA4" }}
                      onClick={() => handleRanling(item)}
                    >
                      Open
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="ranKing myFollowing connectWalletfollowing">
              <h2 className="pageTitle ranKing-name">My Following</h2>
              <ConnectWallet {...isrankingObj} handleMainWallet={handleMainWallet} />
            </div>
          )}
        </>
      ) : (
        <div className="ranKing myFollowing connectWalletfollowing">
          <h2 className="pageTitle ranKing-name">My Following</h2>
          <ConnectWallet {...connectWalletObj} />
        </div>
      )}
      <ThModal
        width={423}
        styles={{ minHeight: 544, maxHeight: 544, overflowY: "auto" }}
        className="modal"
        centered
        title=""
        footer={null}
        open={showModal}
        onCancel={() => setShowModal(false)}
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
              <img src={buy_icon_fuzhi} style={{ verticalAlign: "middle", marginLeft: "10px" }} />
            </div>
          </div>
          <div className="moneyList-item" style={{ marginBottom: 0 }}>
            <div className="moneyList-item-price">Available</div>
            <div className="moneyList-item-money">2.5 ETH</div>
          </div>
          <p style={{ textAlign: "right", color: "#FF4D00", fontSize: "14px" }}>(Insufficient Balance)</p>
        </div>
        <div className="google logOutBox">
          <span>Purchase</span>
        </div>
        <p className="content key">Market Price： 0.0054 ETH</p>
      </ThModal>
    </>
  );
}
export default MyFollowing;
