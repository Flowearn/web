import { useState } from "react";
import { WalletModalContext } from "@comp/wallet/useWalletModal";
import WalletModal from "@comp/wallet/WalletModal";

function WalletModalProvider({ children, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <WalletModalContext.Provider
      value={{
        visible,
        setVisible,
      }}
    >
      {children}
      {visible && <WalletModal {...props} />}
    </WalletModalContext.Provider>
  );
}
export default WalletModalProvider;
