import tk_icon_jz from "@/statics/images/tk_icon_jz.gif";
import animation from "@statics/images/animation.webp";
import ethIcon from "@statics/images/ts_icon_dui.svg";
import errorIcon from "@statics/images/tz_icon_ta1.svg";
import { getBlockExplorer } from "@utils/constant";

function QuoteView({ isConfirming, isConfirmed, errorQuote, quoteError, quoteHash, chainId }) {
  // console.log("EVM & SOLANA quote-----------------------", isConfirming, isConfirmed);
  if (isConfirming || isConfirmed || errorQuote) {
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
            <a href={`${getBlockExplorer(chainId)}/tx/${quoteHash}`} target="_blank">
              View Transaction Detail
            </a>
          </div>
        )}
        {quoteError && (
          <div className="text-center">
            <img src={errorIcon} alt="Error" />
            <div>Error: {quoteError?.shortMessage || quoteError?.message}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="quote-loading">
      <img src={tk_icon_jz} alt="Animation" />
    </div>
  );
}

export default QuoteView;
