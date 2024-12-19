/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-06-11 13:56:45
 * @LastEditors: chenhua
 * @LastEditTime: 2024-06-11 21:48:36
 */
import { createContext, useContext } from "react";

const DEFAULT_CONTEXT = {
  setVisible(_open) {
    console.error(constructMissingProviderErrorMessage("call", "setVisible"));
  },
  visible: false,
};
Object.defineProperty(DEFAULT_CONTEXT, "visible", {
  get() {
    console.error(constructMissingProviderErrorMessage("read", "visible"));
    return false;
  },
});

function constructMissingProviderErrorMessage(action, valueName) {
  return (
    "You have tried to " +
    ` ${action} "${valueName}"` +
    " on a WalletModalContext without providing one." +
    " Make sure to render a WalletModalProvider" +
    " as an ancestor of the component that uses " +
    "WalletModalContext"
  );
}

export const WalletModalContext = createContext(DEFAULT_CONTEXT);

function useWalletModal() {
  return useContext(WalletModalContext);
}

export default useWalletModal;