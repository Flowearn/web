import React from "react";

function WalletIcon({ wallet, ...props }) {
  console.log(wallet.adapter.icon, wallet.adapter.name);
  return wallet && <img src={wallet.adapter.icon} alt={`${wallet.adapter.name} icon`} {...props} />;
}
export default WalletIcon;
