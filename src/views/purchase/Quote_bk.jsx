import { useEffect } from "react";
import { Button, Flex, Tooltip, Skeleton, Spin } from "antd";
import {
  FEE_RECIPIENT,
  AFFILIATE_FEE,
  ETHEREUM_TOKENS_TEST_BY_ADDRESS,
  ETHEREUM_TOKENS_BY_ADDRESS,
  BASE_TOKENS_BY_ADDRESS,
} from "@/utils/constant";
import { formatUnits } from "ethers";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import tk_icon_jz from "@/statics/images/tk_icon_jz.gif";
import questionIcon from "@statics/images/question.svg";
import animation from "@statics/images/animation.webp";
import ethIcon from "@statics/images/ts_icon_dui.svg";
import unknown from "@statics/images/unknown.svg";
import qs from "qs";
import { getBlockExplorer } from "@utils/constant";

function QuoteView({ takerAddress, price, quote, setQuote, slippage, thirdApi, buyData, chainId, priceInvert }) {
  // 根据地址获取出售代币信息
  const sellTokenInfo = (chainId) => {
    switch (chainId) {
      case 11155111:
        return ETHEREUM_TOKENS_TEST_BY_ADDRESS[price.sellTokenAddress.toLowerCase()];
      case 8453:
        return BASE_TOKENS_BY_ADDRESS[price.sellTokenAddress.toLowerCase()];
      case 1:
        return ETHEREUM_TOKENS_BY_ADDRESS[price.sellTokenAddress.toLowerCase()];
      default:
        return ETHEREUM_TOKENS_BY_ADDRESS[price.sellTokenAddress.toLowerCase()];
    }
  };

  // 获取第三方报价数据quote
  useEffect(() => {
    const params = {
      sellToken: price.sellTokenAddress,
      buyToken: price.buyTokenAddress,
      sellAmount: price.sellAmount,
      takerAddress,
      slippagePercentage: slippage / 100, // 默认为0.01
      feeRecipient: FEE_RECIPIENT,
      buyTokenPercentageFee: AFFILIATE_FEE,
      feeRecipientTradeSurplus: FEE_RECIPIENT,
    };

    async function main() {
      const response = await fetch(`${thirdApi}swap/v1/quote?${qs.stringify(params)}`, {
        headers: {
          "0x-api-key": import.meta.env.VITE_PUBLIC_ZEROEX_API_KEY,
        },
      });
      const data = await response.json();
      setQuote(data);
    }
    main();
  }, [price?.sellTokenAddress, price?.buyTokenAddress, price?.sellAmount, takerAddress, slippage, thirdApi, setQuote]);

  const { data: hash, isPending, error, sendTransaction } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // logoURI图片加载错误处理
  const handleImageError = (e) => {
    e.target.onerror = null; // 防止在错误处理函数中再次触发错误
    e.target.src = unknown; // 设置一个备用图片
  };

  if (!quote) {
    return (
      <div className="quote-loading">
        <img src={tk_icon_jz} alt="Animation" />
      </div>
    );
  }

  console.log("EVM quote-----------------------", quote, isConfirming, isConfirmed);

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
            <a href={`${getBlockExplorer(chainId)}/tx/${hash}`} target="_blank">
              View Transaction Detail
            </a>
          </div>
        )}
        {error && (
          <div className="text-center" style={{ color: "red" }}>
            Error: {error.shortMessage || error.message}
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
                    src={sellTokenInfo(chainId)?.logoURI}
                    className="token-img"
                    onError={handleImageError}
                    alt={sellTokenInfo(chainId)?.symbol}
                  />
                  <span className="token-balance">
                    {formatUnits(quote?.sellAmount, sellTokenInfo(chainId)?.decimals)} {sellTokenInfo(chainId)?.symbol}
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
                    src={`https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/${buyData?.symbol?.toLowerCase()}.svg`}
                    className="token-img"
                    onError={handleImageError}
                    alt={buyData?.symbol}
                  />
                  <span className="token-balance">
                    {formatUnits(quote?.buyAmount, buyData?.decimals)} {buyData?.symbol}
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
              {quote && quote.grossBuyAmount
                ? Number(formatUnits(BigInt(quote.grossBuyAmount), buyData?.decimals)) * AFFILIATE_FEE +
                  " " +
                  buyData?.symbol
                : null}
            </div>
          </div>
        </div>
      </div>
      <Button
        type="primary"
        disabled={isPending}
        className="swap-btn google logOutBox"
        style={{ marginBottom: "20px" }}
        onClick={() => {
          console.log("submitting quote to blockchain");
          console.log("to", quote?.to);
          console.log("value", quote?.value);

          sendTransaction &&
            sendTransaction({
              gas: quote?.gas,
              to: quote?.to,
              value: quote?.value, // only used for native tokens
              data: quote?.data,
              gasPrice: quote?.gasPrice,
            });
        }}
      >
        {isPending ? "Confirming..." : "Confirm Swap"}
      </Button>
    </div>
  );
}

export default QuoteView;
