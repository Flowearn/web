import React from "react";
import WalletButton from "@comp/wallet/WalletButton";
import WalletIcon from "@comp/wallet/WalletIcon";

function BaseWalletConnectionButton({
  walletIcon,
  walletName,
  ...props
}) {
  return (
    <WalletButton
      {...props}
      className="wallet-adapter-button-trigger"
      startIcon={
        walletIcon && walletName ? (
          <WalletIcon
            wallet={{ adapter: { icon: walletIcon, name: walletName } }}
          />
        ) : undefined
      }
    />
  );
}
export default BaseWalletConnectionButton;