import { useState } from "react";
import { Button, Flex, Tooltip } from "antd";
import { FEE_RECIPIENT, AFFILIATE_FEE, SOLANA_TOKENS_BY_ADDRESS } from "@/utils/constant";
// import { formatUnits } from "ethers";
// import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import tk_icon_jz from "@/statics/images/tk_icon_jz.gif";
import questionIcon from "@statics/images/question.svg";
import animation from "@statics/images/animation.webp";
import ethIcon from "@statics/images/ts_icon_dui.svg";
import unknown from "@statics/images/unknown.svg";
// import qs from "qs";
import { getBlockExplorer } from "@utils/constant";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";
import { Buffer } from "buffer";

function QuoteViewSol({ takerAddress, price, slippage, thirdApi, buyData, priceInvert }) {
  const { connection } = useConnection();
  const { signTransaction } = useWallet();
  const [isConfirming, setConfirming] = useState(false);
  const [isConfirmed, setConfirmed] = useState(false);
  const [hash, setHash] = useState(null);
  const [error, setError] = useState(null);

  // 根据地址获取SOL出售代币信息
  const sellTokenInfoSolana = () => {
    // console.log("sol price=======", price);
    return SOLANA_TOKENS_BY_ADDRESS[price.inputMint.toLowerCase()];
  };

  // 获取SOL第三方swap数据
  async function sendTransction() {
    setConfirming(true);
    const data = {
      quoteResponse: price, // 从/quote api接口获取报价
      userPublicKey: takerAddress, // 用户公钥地址
      // auto wrap and unwrap SOL. default is true
      wrapAndUnwrapSol: true,
      // computeUnitPriceMicroLamports: 100000,
      dynamicComputeUnitLimit: true, // allow dynamic compute limit instead of max 1,400,000
      // custom priority fee
      // 自动为交易设置优先费用，上限为 5,000,000 lamports / 0.005 SOL
      prioritizationFeeLamports: "auto", // or custom lamports: 1000
      // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
      // feeAccount: "fee_account_public_key"
    };
    // 获取序列化交易并执行兑换
    const response = await fetch(`${thirdApi}v6/swap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const { swapTransaction } = await response.json();
    // console.log("获取序列化交易", swapTransaction);

    // deserialize the transaction
    const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
    let transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    // console.log("反序列化并签署交易", transaction);

    try {
      // sign the transaction
      const tx = await signTransaction(transaction);
      // console.log("签署交易", tx);

      // get the latest block hash
      const latestBlockHash = await connection.getLatestBlockhash();

      // Execute the transaction
      const rawTransaction = tx.serialize();

      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        // maxRetries: 2,
      });

      setConfirmed(false);
      await connection.confirmTransaction(
        {
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: txid,
        },
        "confirmed"
      );
      setHash(txid);
      setConfirming(false);
      setConfirmed(true); // 交易确认后，重置确认状态
      console.log(`https://solscan.io/tx/${txid}`); // 打印交易链接
    } catch (error) {
      console.error("交易失败", error);
      setError(error); // 交易失败时，设置错误状态
      setConfirming(false);
    }
  }

  // logoURI图片加载错误处理
  const handleImageError = (e) => {
    e.target.onerror = null; // 防止在错误处理函数中再次触发错误
    e.target.src = unknown; // 设置一个备用图片
  };

  console.log("get sol buyData-----------------------", buyData);

  if (!price) {
    return (
      <div className="quote-loading">
        <img src={tk_icon_jz} alt="Animation" />
      </div>
    );
  }

  if (isConfirming || isConfirmed || error) {
    return (
      <div className="tx-info">
        {isConfirming && (
          <div className="text-center">
            <img src={tk_icon_jz} alt="Animation" />
            <div>Waiting for confirmation ⏳</div>
          </div>
        )}
        {isConfirmed && (
          <div className="text-center">
            <div className="successBox">
              <img className="animationBox" src={animation} alt="SVG" />
              <img className="eth ethImg" src={ethIcon} alt="SVG" />
            </div>
            <div style={{ marginTop: "20px" }}>Transaction Confirmed! 🎉 </div>
            <a href={`${getBlockExplorer(520)}/tx/${hash}`} target="_blank">
              View Transaction Detail
            </a>
          </div>
        )}
        {error && (
          <div className="text-center" style={{ color: "red" }}>
            Error: {error.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="quote-wrap">
      {!isConfirmed && (
        <div className="swap-title modalTitle" style={{ marginTop: "30px" }}>
          Confirm Swap
        </div>
      )}
      <div className="swap-main">
        <div className="swap-input">
          <div className="from">From</div>
          <div className="userInfo moneyList" style={{ padding: "16px" }}>
            <Flex justify="space-between" style={{ width: "100%" }}>
              <div className="userInfo-item">
                <Flex align="center">
                  <img
                    src={sellTokenInfoSolana()?.logoURI || unknown}
                    className="token-img"
                    onError={handleImageError}
                    alt={sellTokenInfoSolana()?.symbol}
                  />
                  <span className="token-balance">
                    {price?.sellAmount} {sellTokenInfoSolana()?.symbol}
                  </span>
                </Flex>
              </div>
            </Flex>
          </div>
        </div>
        <div className="swap-output" style={{ paddingTop: "30px" }}>
          <div className="to">To</div>
          <div className="userInfo moneyList">
            <Flex justify="space-between" style={{ width: "100%" }}>
              <div className="userInfo-item">
                <Flex align="center">
                  <img
                    src={buyData?.logoURI || unknown}
                    className="token-img"
                    onError={handleImageError}
                    alt={buyData?.symbol}
                  />
                  <span className="token-balance">
                    {price?.buyAmount} {buyData?.symbol}
                  </span>
                </Flex>
              </div>
            </Flex>
          </div>
        </div>
        <div className="swap-detail">
          <div className="swap-detail-item">
            <div className="swap-detail-item-left">Price</div>
            <div className="swap-detail-item-right">{priceInvert}</div>
          </div>
          <div className="swap-detail-item">
            <div className="swap-detail-item-left">Slippage Tolerance</div>
            <div className="swap-detail-item-right">{slippage}%</div>
          </div>
          <div className="swap-detail-item">
            <div className="swap-detail-item-left">
              Trading Fee
              <Tooltip placement="top" title={"For each trade, a 1% is paid to Liquidity Provider"}>
                <img src={questionIcon} alt="" />
              </Tooltip>
            </div>
            <div className="swap-detail-item-right">
              {price && price.buyAmount ? Number(price?.buyAmount) * AFFILIATE_FEE + " " + buyData?.symbol : null}
            </div>
          </div>
        </div>
      </div>
      <Button
        type="primary"
        disabled={isConfirming}
        className="swap-btn google logOutBox"
        style={{ marginBottom: "20px" }}
        onClick={sendTransction}
      >
        {isConfirming ? "Confirming..." : "Confirm Swap"}
      </Button>
    </div>
  );
}

export default QuoteViewSol;
