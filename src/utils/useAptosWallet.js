/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-07-10 09:35:52
 * @LastEditors: chenhua
 * @LastEditTime: 2024-09-13 14:44:19
 */
// useAptosWallet.js
import { useDispatch } from "react-redux";
import { setConnectWallet } from "@redux/actions/connectWalletAction";
import { login } from "@/services/index";
import TokenManager from "@utils/TokenManager";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { myPortfolio } from "../services";

const useAptosWallet = () => {
  const dispatch = useDispatch();
  const { signMessage } = useWallet();

  const signatureMessage = async (account, type) => {
    try {
      if (!account) throw new Error("Account is not connected");
      let dataTime = Date.now();
      let payload;
      if (type) {
        payload = {
          message: `Please sign to confirm that this address is yours.\nThis wallet will only be used to query trading history and will not request any transaction permissions until you choose to follow a trade with your following portfolio.\n\nWallet address:\n${account.address}`,
          nonce: dataTime,
        };
      } else {
        payload = {
          message: `This wallet on Aptos will be used to issue and trade Portfolio Keys.\n\nWallet address:\n${account.address}`,
          nonce: dataTime,
        };
      }
      const response = await signMessage(payload);
      console.log(response, "response----------response");
      let signature;
      if (localStorage.getItem("AptosWalletName") === "Petra") {
        const uint8Array = new Uint8Array(response.signature.data.data);
        signature = uint8Array.reduce(
          (hexString, byte) => hexString + ("0" + byte.toString(16)).slice(-2),
          ""
        );
      } else if (localStorage.getItem("AptosWalletName") === "OKX Wallet") {
        console.log(/^0[xX]/.test(response.signature), /Mobi|Android/i.test(navigator.userAgent),'response.signature----------response.signature')
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        if (isMobile) {
          signature = response.signature.replace(/^0[xX]/, "");
        } else {
          // signature = response.signature;
          const uint8Array = new Uint8Array(response.signature.data.data);
          signature = uint8Array.reduce(
            (hexString, byte) => hexString + ("0" + byte.toString(16)).slice(-2),
            ""
          );          
        }
      } else {          
        signature = response.signature.replace(/^0x/, "");
        console.log(signature, 'signature----------------------------signature')     
      }
      return {
        signature,
        dataTime,
      };
    } catch (error) {
      console.error("Failed to sign message:", error, account);
      return false;
    }
  };

  return { signatureMessage };
};

export default useAptosWallet;
