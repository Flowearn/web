/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-06-11 18:26:40
 * @LastEditors: chenhua
 * @LastEditTime: 2024-09-12 17:08:16
 */
import ReactDOM from "react-dom";
// import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
// import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
// import { clusterApiUrl } from "@solana/web3.js";
// import WalletModalProvider from "@comp/wallet/WalletModalProvider";
// import "@solana/wallet-adapter-react-ui/styles.css";
import { useMemo } from "react";
import "./App.css";
import LayoutContainer from "./layout";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setPurchasePrice } from "@redux/actions/purchaseAction";
import TokenManager from "@utils/TokenManager";
import { getMyKey } from "@/services/index";

console.log(import.meta.env);

function App() {
  const dispatch = useDispatch();
  let token = TokenManager.getToken();

  useEffect(() => {
    queryPrice();
    // hendleCheckNetwork();
  }, []);

  useEffect(() => {
    if(token){
      localStorage.setItem("selectedKey", '/');
      // queryMyKeys();
      // queryPrice();
    }  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const queryMyKeys = async () => {
    const res = await getMyKey();
    console.log(res, '=====================res----------res')
    // setIsIssue(res.status);
  };

  const queryPrice = async () => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=aptos&vs_currencies=usd")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const res = data.aptos;
        dispatch(setPurchasePrice(res));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/*" exact={true} element={<LayoutContainer />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;