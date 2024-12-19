/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-06-24 16:28:37
 * @LastEditors: chenhua
 * @LastEditTime: 2024-09-11 19:14:35
 */
import { useEffect, useCallback, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button, message } from "antd";
import useAptosWallet from "@utils/useAptosWallet";
import wallet_icon_petra from "@/statics/images/wallet_icon_petra.svg";
import wallet_icon_Martian from "@/statics/images/wallet_icon_Martian.svg";
import log_icon_okex from "@/statics/images/log_icon_okex.svg";

let num = 1;

function WalletItem({ wallet, loginBtn, isAptos }) {
  const { account, connected, connect, disconnect } = useWallet();
  const [name, setName] = useState("");
  const { signatureMessage } = useAptosWallet();

  const handleClick = async (item) => {
    const name = item.name;
    localStorage.setItem("walletName", name);
    setName(name);
    num = 1;
    if(item.readyState === "NotDetected"){
      if(name === 'Petra'){
        window.open('https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci', '_blank');
      }else if(name === 'Martian'){
        window.open('https://chromewebstore.google.com/detail/martian-aptos-sui-wallet/efbglgofoippbgcjepnhiblaibcnclgk', '_blank');
      }else if(name === 'OKX Wallet'){
        window.open('https://chromewebstore.google.com/detail/mcohilncbfahbmgdjkbpemcciiolgcge', '_blank');
      }
    }
    if (connected && localStorage.getItem("AptosWalletName") === name) {
      handleSignMessage(account, 1, name);
      return false;
    }

    try {
      await connect(wallet.name); // 尝试连接钱包
    } catch (error) {
      setName("");
      console.error("Failed to connect wallet:", error);
    } finally {
      console.log(connected, connected, localStorage.getItem("AptosWalletName"), name);
    }
  };

  const handleSignMessage = useCallback(
    async (account, status, name) => {
      if (status === 2) {
        num = num + 1;
      }

      if (num > 2 || (num === 2 && isAptos)) {
        return false;
      }
      if (account?.address) {
        console.log(isAptos, "isAptos-----------------------isaptos");
        const { signature, dataTime } = await signatureMessage(account, isAptos);
        num = 1;
        if (signature) {
          loginBtn(account.address, signature, name, account.publicKey, dataTime);
        } else {
          localStorage.removeItem("walletName");
          setName("");
        }
      }
    },
    [signatureMessage, loginBtn, isAptos]
  );

  useEffect(() => {
    if (
      connected &&
      account &&
      localStorage.getItem("AptosWalletName") &&
      localStorage.getItem("AptosWalletName") === localStorage.getItem("walletName")
    ) {
      handleSignMessage(account, 2, localStorage.getItem("AptosWalletName"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, account]);

  wallet.icon =
    wallet.name === "Martian" ? wallet_icon_Martian : wallet.name === "Petra" ? wallet_icon_petra : log_icon_okex;

  return (
    <li onClick={() => handleClick(wallet)} style={{padding: 0}}>
      <Button className="btnName" type="text" loading={(name === wallet.name && wallet.readyState === "Installed") ? true : false}>
        <img src={wallet.icon} alt={`${wallet.name} icon`} />
        <div className="statusName">
          <p className="walletName">{wallet.name}</p>
          <p className="walletStatus" style={{ color: wallet.readyState === 'Installed' ? "#C9FDD9" : 'rgba(187, 255, 214, 0.6)' }}>
            {wallet.readyState === 'Installed' ? wallet.readyState : 'Not Detected'}
          </p>
        </div>        
      </Button>
    </li>
  );
}

export default WalletItem;
