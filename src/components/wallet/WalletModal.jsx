/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-06-11 14:35:40
 * @LastEditors: chenhua
 * @LastEditTime: 2024-06-12 19:26:59
 */
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Collapse from "@comp/wallet/Collapse";
import WalletListItem from "@comp/wallet/WalletListItem";
import WalletSVG from "@comp/wallet/WalletSVG";
import useWalletModal from "@comp/wallet/useWalletModal";
import logo from "@statics/images/logo.svg";
import "./index.scss";
import useMetaMask from "@utils/useWeb3";

function WalletModal({ className = "", container = "body" }) {
  const ref = useRef(null);
  const { wallets, select } = useWallet();
  const { setVisible } = useWalletModal();
  const [expanded, setExpanded] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [portal, setPortal] = useState(null);
  const { connectMetaMask } = useMetaMask();

  const [listedWallets, collapsedWallets] = useMemo(() => {
    const installed = [];
    const notInstalled = [];

    for (const wallet of wallets) {
      if (wallet.readyState === WalletReadyState.Installed) {
        installed.push(wallet);
      } else {
        notInstalled.push(wallet);
      }
    }

    return installed.length ? [installed, notInstalled] : [notInstalled, []];
  }, [wallets]);

  console.log(listedWallets, "--------------------------------------");

  const hideModal = useCallback(() => {
    setFadeIn(false);
    setTimeout(() => setVisible(false), 150);
  }, [setVisible]);

  const handleClose = useCallback(
    (event) => {
      event.preventDefault();
      hideModal();
    },
    [hideModal]
  );

  const handleConnetWallet = async (event, walletName) => {
    if (walletName === "MetaMask") {
      // 连接小狐狸钱包的逻辑
      const data = await connectMetaMask();
      select(walletName);
      handleClose(event);
      console.log(data, "datadatadata======datadata");
    } else {
      handleWalletClick(event, walletName);
    }
  };

  const handleWalletClick = useCallback(
    (event, walletName) => {
      select(walletName);
      handleClose(event);
    },
    [select, handleClose]
  );

  const handleCollapseClick = useCallback(() => setExpanded(!expanded), [expanded]);

  const handleTabKey = useCallback(
    (event) => {
      const node = ref.current;
      if (!node) return;
      const focusableElements = node.querySelectorAll("button");
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          event.preventDefault();
        }
      }
    },
    [ref]
  );

  useLayoutEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        hideModal();
      } else if (event.key === "Tab") {
        handleTabKey(event);
      }
    };

    const { overflow } = window.getComputedStyle(document.body);
    setTimeout(() => setFadeIn(true), 0);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown, false);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", handleKeyDown, false);
    };
  }, [hideModal, handleTabKey]);

  useLayoutEffect(() => setPortal(document.querySelector(container)), [container]);

  return (
    portal &&
    createPortal(
      <div
        aria-labelledby="wallet-adapter-modal-title"
        aria-modal="true"
        className={`wallet-adapter-modal ${fadeIn && "wallet-adapter-modal-fade-in"} ${className}`}
        ref={ref}
        role="dialog"
      >
        <div className="wallet-adapter-modal-container">
          <div className="wallet-adapter-modal-wrapper wrapperModal">
            <button onClick={handleClose} className="wallet-adapter-modal-button-close">
              <svg width="14" height="14">
                <path d="M14 12.461 8.3 6.772l5.234-5.233L12.006 0 6.772 5.234 1.54 0 0 1.539l5.234 5.233L0 12.006l1.539 1.528L6.772 8.3l5.69 5.7L14 12.461z" />
              </svg>
            </button>
            {listedWallets.length ? (
              <>
                <img className="iconLogo" src={logo} />
                <h1 className="wallet-adapter-modal-title">Connect your wallet to traders.tech</h1>
                <div className="wallet-content">
                  By connecting your wallet, you acknowledge that you have read, understand and accept the terms in the
                  disclaimer
                </div>
                <h6 className="select-wallet">Select Wallet</h6>
                <ul className="wallet-adapter-modal-list">
                  {listedWallets.map((wallet) => (
                    <WalletListItem
                      key={wallet.adapter.name}
                      handleClick={(event) => handleWalletClick(event, wallet.adapter.name)}
                      wallet={wallet}
                    />
                  ))}
                  {collapsedWallets.length ? (
                    <Collapse expanded={expanded} id="wallet-adapter-modal-collapse">
                      {collapsedWallets.map((wallet) => (
                        <WalletListItem
                          key={wallet.adapter.name}
                          handleClick={(event) => handleWalletClick(event, wallet.adapter.name)}
                          tabIndex={expanded ? 0 : -1}
                          wallet={wallet}
                        />
                      ))}
                    </Collapse>
                  ) : null}
                </ul>
                {collapsedWallets.length ? (
                  <button className="wallet-adapter-modal-list-more" onClick={handleCollapseClick} tabIndex={0}>
                    <span>{expanded ? "Less " : "More "}options</span>
                    <svg
                      width="13"
                      height="7"
                      viewBox="0 0 13 7"
                      xmlns="http://www.w3.org/2000/svg"
                      className={`${expanded ? "wallet-adapter-modal-list-more-icon-rotate" : ""}`}
                    >
                      <path d="M0.71418 1.626L5.83323 6.26188C5.91574 6.33657 6.0181 6.39652 6.13327 6.43762C6.24844 6.47872 6.37371 6.5 6.50048 6.5C6.62725 6.5 6.75252 6.47872 6.8677 6.43762C6.98287 6.39652 7.08523 6.33657 7.16774 6.26188L12.2868 1.626C12.7753 1.1835 12.3703 0.5 11.6195 0.5H1.37997C0.629216 0.5 0.224175 1.1835 0.71418 1.626Z" />
                    </svg>
                  </button>
                ) : null}
              </>
            ) : (
              <>
                <h1 className="wallet-adapter-modal-title">You&apos;ll need a wallet on Solana to continue</h1>
                <div className="wallet-adapter-modal-middle">
                  <WalletSVG />
                </div>
                {collapsedWallets.length ? (
                  <>
                    <button className="wallet-adapter-modal-list-more" onClick={handleCollapseClick} tabIndex={0}>
                      <span>
                        {expanded ? "Hide " : "Already have a wallet? View "}
                        options
                      </span>
                      <svg
                        width="13"
                        height="7"
                        viewBox="0 0 13 7"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`${expanded ? "wallet-adapter-modal-list-more-icon-rotate" : ""}`}
                      >
                        <path d="M0.71418 1.626L5.83323 6.26188C5.91574 6.33657 6.0181 6.39652 6.13327 6.43762C6.24844 6.47872 6.37371 6.5 6.50048 6.5C6.62725 6.5 6.75252 6.47872 6.8677 6.43762C6.98287 6.39652 7.08523 6.33657 7.16774 6.26188L12.2868 1.626C12.7753 1.1835 12.3703 0.5 11.6195 0.5H1.37997C0.629216 0.5 0.224175 1.1835 0.71418 1.626Z" />
                      </svg>
                    </button>
                    <Collapse expanded={expanded} id="wallet-adapter-modal-collapse">
                      <ul className="wallet-adapter-modal-list">
                        {collapsedWallets.map((wallet) => (
                          <WalletListItem
                            key={wallet.adapter.name}
                            handleClick={(event) => handleWalletClick(event, wallet.adapter.name)}
                            tabIndex={expanded ? 0 : -1}
                            wallet={wallet}
                          />
                        ))}
                      </ul>
                    </Collapse>
                  </>
                ) : null}
              </>
            )}
          </div>
        </div>
        <div className="wallet-adapter-modal-overlay" onMouseDown={handleClose} />
      </div>,
      portal
    )
  );
}
export default WalletModal;
