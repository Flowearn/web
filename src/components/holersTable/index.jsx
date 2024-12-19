/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2023-02-07 19:08:16
 * @LastEditors: chenhua
 * @LastEditTime: 2024-08-19 14:41:12
 */
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { myPortfolio, getTokenList, getPrice, savePortfolio, getUserDetail, getMyHolders } from "@/services/index";
import { getPurchaseReducer } from "@redux/reselectors";
import { useSelector } from "react-redux";
import contractObj from "@utils/contractAccount";
import utils from "@utils/utils";

const fileUrl = import.meta.env.VITE_FILE_ACCESS_API;
function HolersTable() {
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const [detailsInfo, setDetailsInfo] = useState({});
  const [keyList, setKeyList] = useState([]);
  const priceObj = useSelector(getPurchaseReducer);
  let price = priceObj.usd;

  useEffect(() => {
    queryMyHolders();
  }, []);

  useEffect(() => {
    if (userInfo.address) queryUserDetail();
  }, [userInfo.address]);

  const queryMyHolders = async () => {
    const res = await getMyHolders();
    // if(!res.message){
    setKeyList(res);
    // }
  };

  const queryUserDetail = async () => {
    const res = await getUserDetail({ address: userInfo.address });
    setDetailsInfo(res);
  };

  const keyColumns = [
    {
      title: "Key Holders",
      dataIndex: "nickname",
      key: "nickname",
      render: (text, record) => (
        <div>
          <img
            src={fileUrl + record.Image}
            alt="Avatar"
            className="avatar"
            style={{ width: "30px", height: "30px", borderRadius: "50%", verticalAlign: "middle", marginRight: "7px" }}
          />
          {record.Nickname || utils.shortAccount(record.address, 2)}
        </div>
      ),
    },
    {
      title: "Current Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Key Bought",
      dataIndex: "listing",
      key: "listing",
      render: (text, record) => {
        return record.amount + record.sold;
      },
    },
    {
      title: "Key Sold",
      dataIndex: "sold",
      key: "sold",
    },
  ];

  return (
    <div>
      <h1 className=" myInfo-latest-title" style={{ textAlign: "left" }}>
        Key Management
      </h1>
      <div className="keysInfo" style={{ display: "flex" }}>
        <div className="keysBox myInfo-balance myInfo-latest" style={{ marginTop: "16px", padding: "25px 15px 23px" }}>
          <div className="keysBox-item" style={{ lineHeight: "20px" }}>
            <p>
              <span className="iconfont iconFontTwo">&#xe684;</span>
              Total Keys
            </p>
            <h1 style={{ lineHeight: "30px" }}>{detailsInfo.count_key}</h1>
          </div>
          <div className="keysBox-item" style={{ lineHeight: "20px" }}>
            <p>
              <span className="iconfont iconFontTwo">&#xe682;</span>
              Total Holers
            </p>
            <h1 style={{ lineHeight: "30px" }}>{detailsInfo.count_owner}</h1>
          </div>
          <div className="keysBox-item" style={{ lineHeight: "20px" }}>
            <p>
              <span className="iconfont iconFontTwo">&#xe683;</span>
              Market Key Price
            </p>
            {console.log(detailsInfo.key_price, "detailsInfo.key_pricedetailsInfo.key_price", price)}
            <h1 style={{ lineHeight: "30px" }}>
              ${(detailsInfo.key_price && price)  ? (detailsInfo.key_price * price).toFixed(2) : 0}
            </h1>
          </div>
        </div>
        <div className="myInfo-balance myInfo-latest table keysTable" style={{ marginTop: "16px" }}>
          <Table dataSource={keyList} columns={keyColumns} pagination={false} locale={{
            emptyText: <p style={{color: 'rgba(187, 255, 214, 0.6)',marginTop: '60px'}} >No Data</p>
          }}/>
        </div>
      </div>
    </div>
  );
}
export default HolersTable;
