import React, { useEffect, useRef, useCallback } from "react";
import { Row, Col, Avatar, Input, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { myPortfolio, getRanking, listMinChart } from "@/services/index";
import Purchase from "@views/purchase";
import timg from "@/statics/images/timg.jpg";
import utils from "@utils/utils";
import { getPurchaseReducer } from "@redux/reselectors";
import { useDispatch, useSelector } from "react-redux";
import LineChart from "@comp/charts/LineChart";
import useDynamicLayout from "@comp/layOutCom/useDynamicLayout";
import _ from "lodash";
import rankOne from "@statics/images/Ranking_icon_1.svg";
import rankTwo from "@statics/images/Ranking_icon_2.svg";
import rankThree from "@statics/images/Ranking_icon_3.svg";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import "./index.scss";

const fileUrl = import.meta.env.VITE_FILE_ACCESS_API;
const pageSize = 15;
const scrollThreshold = 550;
let cursor = { last_id: null, last_roi: null };
let hasMore = true;
let loading = false;
function MyFollowing() {
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [list, setList] = useState([]);
  const [isShow, setIshow] = useState(true);
  const [keyId, setKeyId] = useState(null);
  const priceObj = useSelector(getPurchaseReducer);
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const ranKingRef = useRef(null);
  const divRef = useRef(null);
  const { connected } = useWallet();
  const { divCount, padding } = useDynamicLayout(ranKingRef, connected, 4, 10, divRef);
  const containerRef = useRef(null);

  let price = priceObj.usd;

  const fetchData = async () => {
    console.log(hasMore, loading, "loadingloadingloading");
    if (!hasMore || loading ) return;
    try {
      loading = true;
      const res = await getRanking({
        address: userInfo.address,
        last_id: cursor.last_id,
        last_roi: cursor.last_roi,
        page_size: pageSize,
      });
      console.log("Received data:", res.length);

      if (res && res.length > 0) {
        const lastItem = res[res.length - 1];
        setList((prevList) => [...prevList, ...res]);
        cursor = {
          last_id: lastItem.ID,
          last_roi: lastItem.roi_30d,
        };
      } else {
        console.log(hasMore, loading, "000000000000000000000000");
        hasMore = false;
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      console.log("finally-----------------------finally");
      loading = false;
    }
  };

  // const debouncedFetchData = useRef(_.debounce(fetchData, 200)).current;
  const throttledFetchData = useRef(_.throttle(fetchData, 200)).current;

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - scrollThreshold) {
      if (hasMore) {
        throttledFetchData();
      }
    }
  };

  useEffect(() => {
    console.log("8888888888888888888");
    cursor = { last_id: null, last_roi: null };
    hasMore = true;
    loading = false;
    fetchData(); // 初始化加载数据

    const container = containerRef.current;
   
    if (container) {
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      console.log(isMobile, 'isMobile---------------------------isMobile');
      if (isMobile) {
        container.addEventListener("touchmove", handleScroll);
      } else {
        container.addEventListener("scroll", handleScroll);
      }
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
        container.removeEventListener("touchmove", handleScroll);
      }
    };
  }, []);

  const handleRanling = (item) => {
    if (!userInfo.address || !connected) {
      navigate(`/myFollowing`);
    } else {
      navigate(`/Purchase?keyId=${item.key_id}&address=${item.address}`);
    }
  };

  return (
    <>
      {isShow ? (
        <div ref={containerRef} className="scrollContainer" style={{ height: "790px" }}>
          <div
            className="ranKing myFollowing"
            ref={ranKingRef}
            style={{ paddingLeft: `${padding}px`, paddingRight: `${padding}px` }}
          >
            <h2 className="pageTitle ranKing-name">Ranking</h2>
            <div className="itemBox" style={{ display: "flex", flexWrap: "wrap" }}>
              {list.length > 0 &&
                _.map(list || [], (item, idx) => (
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
                    {idx < 3 && (
                      <img
                        src={idx === 0 ? rankOne : idx === 1 ? rankTwo : rankThree}
                        alt="SVG_Image"
                        className="ranImg"
                      />
                    )}
                    <Row gutter={16} align="middle" className="avatar">
                      <Col className="avatar-imgBox">
                        <img
                          src={item.image ? fileUrl + item.image : timg}
                          alt="Avatar"
                          style={{ width: "46px", height: "46px", borderRadius: "50%", verticalAlign: "middle" }}
                        />
                      </Col>
                      <Col className="avatar-info">
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
                          <span style={{color: item.roi_90d >= 0 ? "#c9fdd9" : "rgb(255, 77, 0)"}}>{(item.roi_90d * 100).toFixed(2)}%</span>
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
                      onClick={() => handleRanling(item)}
                      style={{ backgroundColor: (item.followed || item.address === userInfo.address) && "#2DDDA4" }}
                    >
                      {item.followed || item.address === userInfo.address ? "Open" : "Follow"}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <Purchase handleRanling={handleRanling} keyId={keyId} />
      )}
    </>
  );
}
export default MyFollowing;
