import { WalletReadyState } from "@solana/wallet-adapter-base";
import React from "react";
import WalletButton from "@comp/wallet/WalletButton";
import WalletIcon from "@comp/wallet/WalletIcon";

function WalletListItem({ handleClick, tabIndex, wallet }) {
  return (
    <li>
      <WalletButton
        // disabled={wallet.adapter.name !== "Phantom"}
        onClick={handleClick}
        startIcon={<WalletIcon wallet={wallet} />}
        tabIndex={tabIndex}
      >
        {wallet.adapter.name}
      </WalletButton>
    </li>
  );
}
export default WalletListItem;
