/*
 * @description: purchase界面
 * @author: chenhua
 * @Date: 2024-01-03 19:12:29
 * @LastEditors: chenhua
 * @LastEditTime: 2024-09-13 15:29:07
 */
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Table, Button, Flex, Tooltip, Input, Skeleton, Radio } from "antd";
import CommHeader from "@comp/commHeader";
import ThModal from "@comp/modal";
import { MoveDown, ChevronDown } from "lucide-react";
import "./index.scss";
import { useLocation } from "react-router-dom";
import { getPortfolioDetail, getRecentChange, detailChart } from "@/services/index";
import utils from "@utils/utils";
import tz_icon_ta from "@statics/images/tz_icon_ta.png";
import wd_icon_shanchu from "@statics/images/wd_icon_shanchu.png";
import wd_icon_tianjia from "@statics/images/wd_icon_tianjia.png";
import tz_icon_ta2 from "@statics/images/tz_icon_ta2.png";
import mp_bj_mr from "@statics/images/mp_bj_mr.svg";

import { CopyToClipboard } from "react-copy-to-clipboard";
import Decimal from "@comp/decimal";
// import { useWallet } from "@aptos-labs/wallet-adapter-react";
import ChatRoom from "@comp/chatRoom";
import PositiveLineChart from "@comp/charts/PositiveLineChart";
// import log_icon_pha from "@/statics/images/log_icon_pha.svg";
// import log_icon_okex from "@/statics/images/log_icon_okex.svg";
// import log_icon_metamask from "@/statics/images/login_icon_met.svg";
import solanaIcon from "@statics/images/solana_icon.svg";
import ethIcon from "@statics/images/eth_icon.svg";
import btcIcon from "@statics/images/home_icon_btc.svg";
import aptos from "@statics/images/mp_icon_aptos.svg";
import questionIcon from "@statics/images/question.svg";
import settingIcon from "@statics/images/swap_icon_sz.svg";
import base from "@statics/images/base.svg";
import unknown from "@statics/images/unknown.svg";
import swap_icon_0x from "@statics/images/swap_icon-0x.svg";
import swap_icon_jup from "@statics/images/swap_icon_jup.svg";
import TradeList from "@comp/tradeList";

import {
  getChainApi,
  FEE_RECIPIENT,
  AFFILIATE_FEE,
  POLYGON_EXCHANGE_PROXY,
  MAX_ALLOWANCE,
  ETHEREUM_TOKENS_TEST_SELL,
  ETHEREUM_TOKENS_TEST_BY_SYMBOL,
  ETHEREUM_TOKENS_SELL,
  ETHEREUM_TOKENS_BY_SYMBOL,
  BASE_TOKENS_SELL,
  BASE_TOKENS_BY_SYMBOL,
  SOLANA_TOKENS_SELL,
  SOLANA_TOKENS_BY_SYMBOL,
} from "@/utils/constant";
import { formatUnits, parseUnits } from "ethers";
import {
  useReadContract,
  useBalance,
  useAccount,
  useChainId,
  // useChains,
  useDisconnect,
  useSimulateContract,
  useWriteContract,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { erc20Abi } from "viem";
import _ from "lodash";
import qs from "qs";
import SwapConnectWalletModal from "@comp/swapConnectWalletModal";
import QuoteView from "./Quote";
// import QuoteViewSol from "./QuoteSol";

// 导入solana swap相关库
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, VersionedTransaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Buffer } from "buffer";

const elementWidth = import.meta.env.VITE_ELEMENT_WIDTH;

const txSpeedOptions = [
  { label: "Standard(5)", value: 5000000 },
  { label: "Fast(6)", value: 6000000 },
  { label: "Instant(7)", value: 7000000 },
];

const slippageOptions = [
  { label: "0.5%", value: 0.5 },
  { label: "1%", value: 1 },
  { label: "5%", value: 5 },
];

function Purchase({ handleRanling }) {
  const location = useLocation();
  // const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const queryParams = new URLSearchParams(location.search);
  const keyId = queryParams.get("keyId");
  const address = queryParams.get("address");
  const [list, setList] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  // const [info, setInfo] = useState({});
  // const [recentChangeInfo, setRecentChangeInfo] = useState({});
  const [selectedTab, setSelectedTab] = useState("30D");
  const [dataPoints, setDataPoints] = useState([]);
  const [xLabels, setXLabels] = useState([]);
  const [recentChangeList, setRecentChangeList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectTokenModal, setSelectTokenModal] = useState(false);
  

  const [output, setOutput] = useState({});
  const swapConnectWalletModalRef = useRef();
  const childRef = useRef();
  const [type, setType] = useState(null);
  const [chainIdName, setChainIdName] = useState(null);
  const [outputVal, setOutputVal] = useState({});
  const [isConnectWallet, setConnectWallet] = useState(false);

  // evm
  const { address: accountEvm, connector, isConnected } = useAccount();
  const chainId = useChainId();
  const [chainIdEVM, setChainIdEVM] = useState(undefined);
  // const chains = useChains();
  const { disconnect: disconnectEvm } = useDisconnect();

  // solana
  const [outputSol, setOutputSol] = useState({});
  const [priceSol, setPriceSol] = useState(null);
  const [sellBalanceSol, setSellBalanceSol] = useState("0.00");
  const [buyBalanceSol, setBuyBalanceSol] = useState("0.00");
  const [sellAmountSol, setSellAmountSol] = useState("");
  const [buyTokenObjectSol, setBuyTokenObjectSol] = useState({});
  const [buyAmountSol, setBuyAmountSol] = useState("");
  const { connection } = useConnection();
  const { publicKey, wallet, connected, disconnect: disconnectSol, signTransaction } = useWallet();
  const [isConfirmingSol, setConfirmingSol] = useState(false);
  const [isPendingSol, setPendingSol] = useState(false);
  const [isConfirmedSol, setConfirmedSol] = useState(false);
  const [hashSol, setHashSol] = useState(null);
  const [errorQuoteSol, setErrorQuoteSol] = useState(null);
  const [sellTokenObjectSol, setSellTokenObjectSol] = useState({});
  const [parsedSellAmountSol, setParsedSellAmountSol] = useState("");

  // swap 初始状态
  const [price, setPrice] = useState(null);
  // const [quote, setQuote] = useState(null);
  const [sellAmount, setSellAmount] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [tradeDirection, setTradeDirection] = useState("sell");
  const [error, setError] = useState([]);
  const [errorQuote, setErrorQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [buyTokenObject, setBuyTokenObject] = useState({});
  const [parsedBuyAmount, setParsedBuyAmount] = useState("");
  const [thirdApi, setThirdApi] = useState("");
  const [slippage, setSlippage] = useState(0.5); // 默认滑点0.5%
  const [gasPrice, setGasPrice] = useState(6000000); // wei单位 fast:6000000
  const [priceInvert, setPriceInvert] = useState("");
  const [sellTokenObject, setSellTokenObject] = useState({});
  const [parsedSellAmount, setParsedSellAmount] = useState("");

  const [isMobile, setIsMobile] = useState(window.innerWidth <= elementWidth);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= elementWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 第三方兑换API交易所代理合约
  const exchangeProxy = (chainId) => {
    switch (chainId) {
      case 11155111:
        return POLYGON_EXCHANGE_PROXY;
      default:
        return POLYGON_EXCHANGE_PROXY;
    }
  };

  // 获取EVM出售代币列表数据
  const getSellTokenList = (chainId) => {
    switch (chainId) {
      case 11155111:
        return ETHEREUM_TOKENS_TEST_SELL;
      case 8453:
        return BASE_TOKENS_SELL;
      case 1:
        return ETHEREUM_TOKENS_SELL;
      default:
        return ETHEREUM_TOKENS_SELL;
    }
  };

  // 获取EVM对应链的代币单位数据
  const tokensByChain = (chainId) => {
    // console.log("tokensByChain===", chainId);
    switch (chainId) {
      case 11155111:
        return ETHEREUM_TOKENS_TEST_BY_SYMBOL;
      case 8453:
        return BASE_TOKENS_BY_SYMBOL;
      case 1:
        return ETHEREUM_TOKENS_BY_SYMBOL;
      default:
        return ETHEREUM_TOKENS_BY_SYMBOL;
    }
  };

  // 获取Solana出售代币列表数据
  const getSellTokenListSol = () => {
    return SOLANA_TOKENS_SELL;
  };

  // 获取Sol对应链的代币单位数据
  const tokensByChainSol = () => {
    return SOLANA_TOKENS_BY_SYMBOL;
  };

  // Sol代币数据
  const [sellTokenSol, setSellTokenSol] = useState("");

  // EVM代币数据
  const [sellToken, setSellToken] = useState("");

  // solana钱包地址
  const accountSol = useMemo(() => publicKey?.toBase58(), [publicKey]);
  const followAccountSol = useMemo(() => {
    // if (children) return children;
    if (!wallet || !accountSol) return null;
    return accountSol.slice(0, 3) + "..." + accountSol.slice(-3);
  }, [wallet, accountSol]);

  // console.log("solana链相关信息=========", accountSol, wallet, connected);

  // 获取SOL用户指定代币余额
  useEffect(() => {
    async function getSellTokenSolBalance() {
      console.log("sellTokenObjectSol", sellTokenObjectSol);
      try {
        if (sellTokenObjectSol.address === "So11111111111111111111111111111111111111112") {
          let nativeBalance = await connection.getBalance(publicKey, "confirmed");

          let balance = nativeBalance / 10 ** sellTokenObjectSol.decimals;
          console.log("获取SOL原生代币余额", balance);
          setSellBalanceSol(balance || "0.00");
          return;
        }
        let mintAccount = new PublicKey(sellTokenObjectSol.address);
        const [associatedTokenAddress] = PublicKey.findProgramAddressSync(
          [
            publicKey.toBuffer(), // 用户公钥地址
            TOKEN_PROGRAM_ID.toBuffer(),
            mintAccount.toBuffer(), // 铸币厂地址
          ],
          ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const token = await connection.getTokenAccountBalance(associatedTokenAddress);
        console.log("获取出售代币余额", token.value.amount);
        let balance = token.value.amount / 10 ** token.value.decimals;
        setSellBalanceSol(balance);
      } catch (error) {
        console.warn("获取出售代币余额失败：", error);
        if (error.message.includes("could not find account")) {
          setSellBalanceSol("0.00");
        }
      }
    }

    if (publicKey && JSON.stringify(sellTokenObjectSol) !== "{}") {
      getSellTokenSolBalance();
    } else {
      setSellBalanceSol("0.00");
    }

    async function getBuyTokenSolBalance() {
      try {
        let mintAccount = new PublicKey(buyTokenObjectSol.address);
        const [associatedTokenAddress] = PublicKey.findProgramAddressSync(
          [
            publicKey.toBuffer(), // 用户公钥地址
            TOKEN_PROGRAM_ID.toBuffer(),
            mintAccount.toBuffer(), // 铸币厂地址
          ],
          ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const tokenBuy = await connection.getTokenAccountBalance(associatedTokenAddress);
        console.log("获取购买代币余额", tokenBuy.value.amount);
        let balanceBuy = tokenBuy.value.amount / 10 ** tokenBuy.value.decimals;
        setBuyBalanceSol(balanceBuy);
      } catch (error) {
        console.warn("获取购买代币余额失败：", error);
        if (error.message.includes("could not find account")) {
          setBuyBalanceSol("0.00");
        }
      }
    }

    if (publicKey && JSON.stringify(buyTokenObjectSol) !== "{}") {
      getBuyTokenSolBalance();
    } else {
      setBuyBalanceSol("0.00");
    }
  }, [connection, publicKey, sellTokenObjectSol, buyTokenObjectSol]);

  // evm钱包地址
  const followAccount = useMemo(() => {
    if (!accountEvm) return null;
    return accountEvm.slice(0, 3) + "..." + accountEvm.slice(38, accountEvm.length);
  }, [accountEvm]);

  /*****************start******************/

  // 获取最近变动列表数据
  const queryRecentChange = useCallback(async () => {
    const res = await getRecentChange({ address });
    // const arr = [
    //   {
    //     ID: 106,
    //     CreatedAt: "2024-08-11T15:48:35+08:00",
    //     portfolio_id: "118189244739584",
    //     address: "0x27a2abc312bd2a626bd5a44363d317442674974d91a8bc8cda41703c18cf0e17",
    //     asset_id: "118193061556224",
    //     decimals: 6,
    //     token_id: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    //     token_name: "USDT",
    //     amount: 2.1293999999999998e-12,
    //     price: 3294.985359380688,
    //     portion: -7.777491229518372e-11,
    //     chain_id: "ethereum",
    //     op_type: "decrease",
    //   },
    //   {
    //     ID: 105,
    //     CreatedAt: "2024-08-31T15:48:35+08:00",
    //     portfolio_id: "118189244739584",
    //     address: "0x27a2abc312bd2a626bd5a44363d317442674974d91a8bc8cda41703c18cf0e17",
    //     asset_id: "118193061556224",
    //     decimals: 9,
    //     token_id: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
    //     token_name: "POPCAT",
    //     amount: 2.1293999999999998e-12,
    //     price: 3294.985359380688,
    //     portion: -7.777491229518372e-11,
    //     chain_id: "solana",
    //     op_type: "decrease",
    //   },
    //   {
    //     ID: 104,
    //     CreatedAt: "2024-08-11T15:48:35+08:00",
    //     portfolio_id: "118189244739584",
    //     address: "0x27a2abc312bd2a626bd5a44363d317442674974d91a8bc8cda41703c18cf0e17",
    //     asset_id: "118193061556224",
    //     decimals: 18,
    //     token_id: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    //     token_name: "UNI",
    //     amount: 2.1293999999999998e-12,
    //     price: 3294.985359380688,
    //     portion: -7.777491229518372e-11,
    //     chain_id: "sepolia",
    //     op_type: "decrease",
    //   },
    //   // {
    //   //   ID: 103,
    //   //   CreatedAt: "2024-08-11T15:48:35+08:00",
    //   //   portfolio_id: "118189244739584",
    //   //   address: "0x27a2abc312bd2a626bd5a44363d317442674974d91a8bc8cda41703c18cf0e17",
    //   //   asset_id: "118193061556224",
    //   //   decimals: 18,
    //   //   token_id: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    //   //   token_name: "ETH",
    //   //   amount: 2.1293999999999998e-12,
    //   //   price: 3294.985359380688,
    //   //   portion: -7.777491229518372e-11,
    //   //   chain_id: "base",
    //   //   op_type: "decrease",
    //   // },
    // ];
    console.log("queryRecentChange===", res.All);
    setRecentChangeList(res.All);
  }, [address]);

  const queryPortfolioDetail = useCallback(async () => {
    const res = await getPortfolioDetail({ address });
    setList(res);
    setIsShow(true);
  }, [address]);

  const columns = [
    {
      title: "Tokens",
      dataIndex: "symbol",
      key: "symbol",
      render: (text, record) => (
        <div>
          <img
            src={record.logo_uri ? record.logo_uri : mp_bj_mr}
            alt="Avatar"
            className="avatar"
            style={{ width: "30px", height: "30px", borderRadius: "50%", verticalAlign: "middle", marginRight: "7px" }}
          />
          {text}
        </div>
      ),
    },
    {
      title: "Chain",
      dataIndex: "chain_id",
      key: "chain_id",
      render: (text) => (
        <img
          src={
            text === "solana"
              ? solanaIcon
              : text === "ethereum"
              ? ethIcon
              : text === "btc"
              ? btcIcon
              : text === "base"
              ? base
              : aptos
          }
          alt="Avatar"
          className="avatar"
          style={{ width: "26px", height: "26px", borderRadius: "50%", verticalAlign: "middle", marginRight: "7px" }}
        />
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount_str",
      key: "amount_str",
      // render: (text, record, index) => <span>{text.toFixed(2)}</span>,
    },
    {
      title: "ROI",
      dataIndex: "roi",
      key: "roi",
      render: (text, record) => {
        const color = text >= 0 ? "#19D076" : "#FF4D00";
        return <span style={{ color }}>{(record.roi * 100).toFixed(2)} %</span>;
      },
    },
    {
      title: "Pnl",
      dataIndex: "pnl",
      key: "pnl",
      render: (text, record) => {
        const color = record.roi >= 0 ? "#19D076" : "#FF4D00";
        return <span style={{ color }}>{text}</span>;
      },
    },
    {
      title: "Address",
      dataIndex: "token_id",
      key: "token_id",
      render: (text) => (
        <div>
          <CopyToClipboard text={text} onCopy={utils.handleCopy}>
            <i
              className="iconfont"
              style={{ color: "rgba(187, 255, 214, 0.6)", marginRight: "7px", cursor: "pointer" }}
            >
              &#xe68d;
            </i>
          </CopyToClipboard>
          {utils.shortAccount(text, 2)}
        </div>
      ),
    },
    {
      title: "Entry Price",
      dataIndex: "price",
      key: "price",
      render: (text) => <Decimal decimal={text} position={6.5} />,
    },
    {
      title: "Current Price",
      dataIndex: "current_price",
      key: "current_price",
      width: 120,
      render: (text) => <Decimal decimal={text} position={6.5} />,
    },
    {
      title: "Entry Time",
      dataIndex: "created_at",
      key: "created_at",
      width: 160,
      render: (text) => <span style={{ color: "rgba(187,255,214,0.6)" }}>{utils.showYear(text)}</span>,
    },
  ];

  const dealImg = (type) => {
    if (type === "increase") {
      return tz_icon_ta;
    } else if (type === "add") {
      return wd_icon_tianjia;
    } else if (type === "delete") {
      return wd_icon_shanchu;
    } else {
      return tz_icon_ta2;
    }
  };

  useEffect(() => {
    queryRecentChange();
  }, [queryRecentChange]);

  useEffect(() => {
    if (address) queryPortfolioDetail();
  }, [address, queryPortfolioDetail]);

  // 点击标签时的处理函数
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    let type = tab === "ALL" ? "" : tab;
    queryDetailChart(type);
  };

  const queryDetailChart = useCallback(
    async (type) => {
      const res = await detailChart({ address: address, type });
      // const data = await mergeTimeSeries(res.Times || [], res.Rois || [], type);
      setDataPoints(res);
    },
    [address]
  );

  useEffect(() => {
    queryDetailChart(selectedTab);
  }, [queryDetailChart]);   

  const detalPortfolio = (item) => {
    const portion = item.portion * 100;
    const formattedPortion = <Decimal decimal={Math.abs(portion * 1)} position={4} />;
    const type = portion * 1 < 0 ? true : false;
    return {
      formattedPortion,
      type,
    };
  };

  /****************end*******************/

  // 选择出售代币弹框列表
  const handleSelectToken = () => {
    setShowModal(false);
    setSelectTokenModal(true);
  };

  // 选中出售代币
  const handleSellTokenChange = (row, type) => {
    if (type === "evm") {
      setSellToken(row.symbol);
      setSellTokenObject(tokensByChain(chainIdEVM)[row.symbol]);
      setSellAmount("");
      setBuyAmount("");
    } else {
      setSellTokenSol(row.symbol);
      setSellTokenObjectSol(tokensByChainSol()[row.symbol]);
      setSellAmountSol("");
      setBuyAmountSol("");
      setSellBalanceSol("0.00");
    }
    setShowModal(true);
    setSelectTokenModal(false);
  };

  // 连接钱包弹框
  const handleConnectWallet = (row) => {
    console.log("handleConnectWallet----连接钱包", row);
    const chainType =
      row.chain_id === "solana"
        ? "Solana"
        : row.chain_id === "base" || row.chain_id === "ethereum" || row.chain_id === "sepolia"
        ? "EVM"
        : "aptos";

    if (swapConnectWalletModalRef.current) {
      setType(chainType);
      setChainIdName(row.chain_id);
      swapConnectWalletModalRef.current.handleShowModal();
    }
  };

  // 输入卖出的代币数量
  const onChangeInput = (e, name) => {
    // console.log("input value", name, e.target.value);
    if (name === "solana") {
      setSellAmountSol(e.target.value);
    } else {
      setSellAmount(e.target.value);
    }
    debouncedHandleChange(e.target.value, name);
  };

  // 创建一个debounced函数，延迟500毫秒执行
  const debouncedHandleChange = _.debounce((value, name) => {
    // console.log("Input value changed:", value, name);
    setTradeDirection("sell");
    if (name === "solana") {
      if (!Number(value)) setBuyAmountSol("");
      return;
    }
    if (!Number(value)) setBuyAmount("");
  }, 800);

  // follow trade swap兑换弹框
  const handleFollowTrade = async (row, isConnectedWallet) => {
    const getUrl = getChainApi(row.chain_id);
    console.log("handleFollowTrade--------", row, isConnectedWallet);
    setThirdApi(getUrl);
    setShowModal(true);
    setChainIdName(row.chain_id);
    setOutputVal(row);

    if (row.chain_id === "solana") {
      const solTokenSol = getSellTokenListSol();
      setSellTokenSol(solTokenSol[0]?.symbol);
      setSellTokenObjectSol(tokensByChainSol()[solTokenSol[0]?.symbol]);
      setConnectWallet(connected);

      setPriceSol(null);
      setSellAmountSol("");
      setBuyAmountSol("");
      setConfirmedSol(false);
      setConfirmingSol(false);
      setPendingSol(false);
      setHashSol(null);
      setErrorQuoteSol(null);
      // solana查询代币详情
      try {
        const response = await fetch(`https://tokens.jup.ag/token/${row.token_id}`);
        const tokenSol = await response.json();
        setOutputSol(
          tokenSol
            ? tokenSol
            : {
                logoURI: unknown,
                symbol: row.token_name,
              }
        );
        setBuyTokenObjectSol({
          address: row.token_id,
          decimals: row.decimals,
          symbol: row.token_name,
          logoURI: tokenSol ? tokenSol.logoURI : unknown,
        });
      } catch (error) {
        setOutputSol({
          logoURI: unknown,
          symbol: row.token_name,
        });
        setBuyTokenObjectSol({
          address: row.token_id,
          decimals: row.decimals,
          symbol: row.token_name,
          logoURI: unknown,
        });
        console.log("error===", error);
      }
    } else {
      let chain = row.chain_id === "ethereum" ? 1 : row.chain_id === "sepolia" ? 11155111 : 8453;
      setChainIdEVM(chain); // 设置evm chainId
      let evmToken = getSellTokenList(chain); // 获取EVM代币列表
      setSellToken(evmToken[0]?.symbol);
      setSellTokenObject(tokensByChain(chain)[evmToken[0]?.symbol]);

      // evm
      const parsedBuyAmountNew =
        buyAmount && tradeDirection === "buy" ? parseUnits(buyAmount, row.decimals).toString() : undefined;
      setParsedBuyAmount(parsedBuyAmountNew);

      setConnectWallet(isConnected);
      setPrice(null);
      setSellAmount("");
      setBuyAmount("");
      setErrorQuote("");
      setOutput(row);
      setBuyTokenObjectSol({});
      setBuyTokenObject({
        address: row.token_id,
        decimals: row.decimals,
        symbol: row.token_name,
        logoURI: `https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/${row?.token_name?.toLowerCase()}.svg`,
      });
    }
  };

  useEffect(() => {
    // SOL代币输入价格格式转换
    let parsedSellAmountVal =
      sellAmountSol && tradeDirection === "sell"
        ? parseUnits(sellAmountSol, sellTokenObjectSol?.decimals)?.toString()
        : "";
    setParsedSellAmountSol(parsedSellAmountVal);
  }, [sellAmountSol, sellTokenObjectSol?.decimals, tradeDirection]);

  useEffect(() => {
    // EVM代币输入价格格式转换
    let parsedSellAmountVal =
      sellAmount && tradeDirection === "sell" ? parseUnits(sellAmount, sellTokenObject?.decimals)?.toString() : "";
    setParsedSellAmount(parsedSellAmountVal);
  }, [sellAmount, sellTokenObject?.decimals, tradeDirection]);

  // 1.获取EVM第三方价格数据price
  useEffect(() => {
    const params = {
      sellToken: sellTokenObject?.address,
      buyToken: buyTokenObject?.address,
      sellAmount: parsedSellAmount,
      buyAmount: parsedBuyAmount,
      takerAddress: accountEvm,
      slippagePercentage: slippage / 100, // 默认为0.01=1%
      gasPrice: gasPrice, // gas价格, fast:1000000
      feeRecipient: FEE_RECIPIENT,
      buyTokenPercentageFee: AFFILIATE_FEE,
      feeRecipientTradeSurplus: FEE_RECIPIENT,
    };

    console.log("parsedSellAmount-----------", parsedSellAmount, sellAmount);

    // 获取价格信息
    async function getEvmPrice() {
      const response = await fetch(`${thirdApi}swap/v1/price?${qs.stringify(params)}`, {
        headers: {
          "0x-api-key": import.meta.env.VITE_PUBLIC_ZEROEX_API_KEY,
        },
      });
      const data = await response.json();
      console.log("price data EVM ================", data);

      if (data?.validationErrors?.length > 0) {
        // error for sellAmount too low
        setError(data.validationErrors);
      } else {
        setError([]);
      }

      if (data.buyAmount) {
        // console.log("data.buyAmount-sellAmount", data.buyAmount);
        let formatSellAmount = formatUnits(data.sellAmount, buyTokenObject?.decimals);
        let formatBuyAmount = formatUnits(data.buyAmount, sellTokenObject?.decimals);
        // console.log("formatSellAmount-------formatBuyAmount", formatSellAmount, formatBuyAmount);
        setBuyAmount(formatBuyAmount);
        setPrice(data);

        const formatPrice = `${Number((formatSellAmount / formatBuyAmount).toFixed(6))} ${
          sellTokenObject?.symbol
        } per ${buyTokenObject?.symbol}`;
        setPriceInvert(formatPrice);
      }
    }

    if (sellAmount !== "" && Number(sellAmount) !== 0) {
      getEvmPrice();
    }
  }, [
    accountEvm,
    sellTokenObject?.address,
    sellTokenObject?.symbol,
    sellTokenObject?.decimals,
    buyTokenObject?.address,
    buyTokenObject?.decimals,
    buyTokenObject?.symbol,
    parsedBuyAmount,
    parsedSellAmount,
    sellAmount,
    thirdApi,
    slippage,
    gasPrice,
  ]);

  const { data: quoteHash, isPending: isPendingQuote, error: quoteError, sendTransaction } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: quoteHash,
  });

  useEffect(() => {
    setErrorQuote(quoteError);
  }, [quoteError]);

  // 获取SOL第三方价格数据quote
  useEffect(() => {
    const params = {
      inputMint: sellTokenObjectSol?.address, // 输入代币地址
      outputMint: buyTokenObjectSol?.address, // 输出代币地址
      amount: parsedSellAmountSol, // 输入代币数量-示例：USDC有6位小数，1USDC传入API时，其整数为1000000
      slippageBps: slippage * 100, // 滑点默认百分比0.5%
      platformFeeBps: AFFILIATE_FEE * 1000, // 平台费用百分比0.01%
    };

    async function getSolQuote() {
      try {
        const response = await fetch(`${thirdApi}v6/quote?${qs.stringify(params)}`);
        const data = await response.json();
        console.log("price data SOL quote ================", data);

        if (data.outAmount) {
          let formatOutAmount = formatUnits(data.outAmount, buyTokenObjectSol?.decimals);
          let formatInAmount = formatUnits(data.inAmount, sellTokenObjectSol?.decimals);
          // console.log("data.buyAmount-sellAmount", formatInAmount, formatOutAmount);

          setBuyAmountSol(formatOutAmount);
          data.sellAmount = formatInAmount;
          data.buyAmount = formatOutAmount;
          setPriceSol(data);

          const formatPrice = `${Number((formatInAmount / formatOutAmount).toFixed(6))} ${
            sellTokenObjectSol?.symbol
          } per ${buyTokenObjectSol?.symbol}`;
          setPriceInvert(formatPrice);
        }
      } catch (error) {
        console.error("获取sol报价失败", error);
        setError([]);
      }
    }

    if (sellAmountSol !== "" && Number(sellAmountSol) !== 0) {
      getSolQuote();
    }
  }, [
    buyTokenObjectSol?.address,
    sellTokenObjectSol?.address,
    sellTokenObjectSol?.symbol,
    sellTokenObjectSol?.decimals,
    buyTokenObjectSol?.symbol,
    buyTokenObjectSol?.decimals,
    parsedSellAmountSol,
    sellAmountSol,
    thirdApi,
    slippage,
  ]);

  // 获取EVM出售代币地址余额信息
  const { data, isError, isLoading } = useBalance({
    address: accountEvm,
    token:
      sellTokenObject?.address === "0x2e5221b0f855be4ea5cefffb8311eed0563b6e87" ||
      sellTokenObject?.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
        ? null
        : sellTokenObject?.address,
  });

  // 获取EVM购买代币地址余额信息
  const { data: buyData } = useBalance({
    address: accountEvm,
    token: buyTokenObject?.address,
  });
  // console.log("查询EVM余额-sell-buy", data, accountEvm, sellTokenObject?.address, chainId, chainIdEVM);

  // evm出售余额不足
  const inSufficientBalance =
    data && sellAmount ? parseUnits(sellAmount, sellTokenObject?.decimals) > data.value : true;

  // solana出售余额不足
  const inSufficientBalanceSol =
    Number(sellBalanceSol) && Number(sellAmountSol) ? Number(sellAmountSol) > Number(sellBalanceSol) : true;

  // logoURI图片加载错误处理
  const handleImageError = (e) => {
    e.target.onerror = null; // 防止在错误处理函数中再次触发错误
    e.target.src = unknown; // 设置一个备用图片
  };

  // 公共头部组件是否显示
  const toggleIsShow = () => {
    setIsShow(true);
    setTimeout(() => queryPortfolioDetail(), 1000);
  };

  // 填充出售代币最大数量
  const onMax = (type) => {
    // console.log("输入最大数量", data?.value, type);
    // console.log("onMax-sellBalanceSol", sellBalanceSol);
    if (type === "evm") {
      if (data.value === 0n) {
        return;
      }
      setSellAmount(formatUnits(data.value, sellTokenObject?.decimals));
    } else {
      if (Number(sellBalanceSol) === 0) {
        return;
      }
      setSellAmountSol(sellBalanceSol.toString());
    }
  };

  // 设置交易速度
  const onChangeTxSpeed = (e) => {
    console.log("设置交易速度", e.target.value);
    setGasPrice(e.target.value);
  };

  // 设置滑点
  const onChangeSlippage = (e) => {
    console.log("设置滑点", e.target.value);
    setSlippage(e.target.value);
  };

  useEffect(() => {
    // console.log("----------钱包是否连接", isConnected, connected);
    if (isConnected || connected) {
      setConnectWallet(true);
      swapConnectWalletModalRef.current.setShowModal(false);
    }
  }, [isConnected, connected]);

  return (
    <>
      <div className="ranking" style={{ paddingTop: "0" }}>
        <h2 className="pageTitle ranKing-name">
          {localStorage.getItem("selectedKey") === "/" ? "Ranking" : "My Following"}
        </h2>
        <CommHeader
          handleShowModal={handleRanling}
          ref={childRef}
          KeyID={keyId}
          address={address}
          isShow={isShow}
          toggleIsShow={toggleIsShow}
        />
        {console.log("isShow-------------99999999999", isShow, recentChangeList?.length)}
        {isShow && recentChangeList?.length !== 0 && (
          <>
            <div>
              {recentChangeList?.length > 0 && <h2 className="holdTitle">Recent Change</h2>}
              <div className="recent">
                <div className="recent-comm">
                  {recentChangeList?.length > 0 &&
                    recentChangeList?.map((item, index) => {
                      return (
                        <div className="itemBox" key={index}>
                          <div className="recent-comm-item">
                            <img src={dealImg(item.op_type)} />
                            <div>
                              <div
                                className="itemBox-content"
                                style={{ color: item.op_type === "decrease" ? "#FF4D00" : "#2DDDA4" }}
                              >
                                {item.Nickname || utils.shortAccount(item.address, 2)}
                                {item.op_type === "decrease" ? " decrease" : " add"}
                                <Decimal decimal={item.amount} position={4} distance={5} /> “{item.token_name}”
                                {item.op_type === "decrease" ? "from" : "to"} the portfolio, comprising
                                {detalPortfolio(item).type ? `-` : ``}
                                {detalPortfolio(item).formattedPortion}% of the previous total “{item.token_name}”
                              </div>
                              <div
                                className="time"
                                style={{
                                  color:
                                    item.op_type === "decrease" ? "rgba(255, 77, 0, 0.8)" : "rgba(187, 255, 214, 0.6)",
                                  fontWeight: 100,
                                  fontSize: "12px",
                                }}
                              >
                                {utils.showYear(item.CreatedAt)}
                              </div>
                            </div>
                          </div>
                          {((connector?.name === "OKX Wallet" || connector?.name === "MetaMask") &&
                            item.chain_id !== "solana" &&
                            isConnected &&
                            ((item.chain_id === "sepolia" && chainId === 11155111) ||
                              (item.chain_id === "ethereum" && chainId === 1) ||
                              (item.chain_id === "base" && chainId === 8453))) ||
                          ((connector?.name === "Phantom" || connector?.name === "OKX Wallet" || wallet) &&
                            item.chain_id === "solana" &&
                            connected) ? (
                            <>
                              {/* <div className="followBox custom-wallet">
                                {accountEvm && item.chain_id !== "solana" && (
                                  <>
                                    <div>{connector?.name}</div>
                                    <div>{followAccount}</div>
                                  </>
                                )}
                                {wallet && item.chain_id === "solana" && (
                                  <>
                                    <div>{wallet?.name}</div>
                                    <div>{followAccountSol}</div>
                                  </>
                                )}
                              </div>
                              <div
                                className="followBox"
                                onClick={() => (item.chain_id === "solana" ? disconnectSol() : disconnectEvm())}
                              >
                                Disconnect
                              </div> */}

                              <div className="followBox" onClick={() => handleFollowTrade(item, true)}>
                                Follow Trade
                              </div>
                            </>
                          ) : (
                            <div className="followBox" onClick={() => handleFollowTrade(item, false)}>
                              Follow Trade
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* <h2 className="holdTitle">Trade in 90 Days</h2> */}
            {!(list.length === 0 && isMobile) && <h2 className="holdTitle">Trade in 90 Days</h2>}
            <div className="myWatchimg-table" style={{ margin: "24px 0 24px" }}>
              {!isMobile ? <Table
                dataSource={list}
                columns={columns}
                rowKey={"ID"}
                pagination={false}
                locale={{
                  emptyText: <p style={{ color: "rgba(187, 255, 214, 0.6)", marginTop: "60px" }}>No Data</p>,
                }}
                scroll={{ y: 450, x: isMobile && 1400 }}
              />
              : <TradeList list={list}/>
              }
            </div>
            {/* <div className="myPortfoLio-form" style={{ margin: "0 0 24px" }}>
              <div className="titleBox">
                <h2 className="title">ROI Chart</h2>
                <div className="titleBox-right">
                  {["7D", "30D", "90D"].map((tab) => (
                    <div
                      key={tab}
                      className={`tab ${selectedTab === tab ? "active" : ""}`}
                      onClick={() => handleTabClick(tab)}
                    >
                      {tab}
                    </div>
                  ))}
                </div>
              </div>
              <PositiveLineChart address={address} data={dataPoints} selectedTab={selectedTab}/>
            </div> */}
            <ChatRoom KeyID={keyId} />
          </>
        )}
      </div>

      {/* 连接钱包弹框 */}
      <SwapConnectWalletModal ref={swapConnectWalletModalRef} type={type} chainIdName={chainIdName} />

      {/* swap dialog */}
      <ThModal
        width={528}
        styles={{ minHeight: 437, maxHeight: 437, overflowY: "auto" }}
        className="modal swap swapModal"
        centered
        title=""
        footer={null}
        open={showModal}
        onCancel={() => {
          setSellAmount("");
          setSellAmountSol("");
          setBuyAmount("");
          setBuyAmountSol("");
          setPriceSol(null);
          setPrice(null);
          setShowModal(false);
        }}
        // closeIcon={<CustomCloseButton />}
      >
        {/* <img src={settingIcon} alt="setting" className="swap-setting" onClick={() => setShowSetting(true)} /> */}
        <div className="swap-title modalTitle" style={{ marginTop: "30px" }}>
          Swap
        </div>
        <div className="swap-main">
          <div className="swap-input">
            <div className="from">From</div>
            <div className="userInfo moneyList">
              <Flex justify="space-between" style={{ width: "100%" }}>
                <div className="userInfo-item">
                  {chainIdName === "solana" ? (
                    <Input
                      placeholder="0.00"
                      className="swap-input-value"
                      type="number"
                      value={sellAmountSol}
                      onChange={(e) => onChangeInput(e, "solana")}
                    />
                  ) : (
                    <Input
                      placeholder="0.00"
                      className="swap-input-value"
                      type="number"
                      value={sellAmount}
                      onChange={(e) => onChangeInput(e, "evm")}
                    />
                  )}
                  <Flex align="flex-end">
                    {chainIdName === "solana" ? (
                      <>
                        <span>Balance: {sellBalanceSol}</span>
                        {Number(sellBalanceSol) !== 0 && (
                          <span className="wallet-max" onClick={() => onMax("solana")}>
                            MAX
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span>
                          Balance:{" "}
                          {chainId === chainIdEVM && data?.value ? formatUnits(data.value, data.decimals) : "0.00"}
                        </span>
                        {data?.value !== 0n && data?.value && (
                          <span className="wallet-max" onClick={() => onMax("evm")}>
                            MAX
                          </span>
                        )}
                      </>
                    )}
                  </Flex>
                </div>
                <Button className="select-token" onClick={() => (sellTokenSol || sellToken) && handleSelectToken()}>
                  <Flex align="center">
                    {chainIdName === "solana" ? (
                      sellTokenSol ? (
                        <>
                          <img
                            src={tokensByChainSol()[sellTokenSol]?.logoURI}
                            alt={sellTokenSol}
                            onError={handleImageError}
                            className="borderRadius-50"
                          />
                          <span style={{ margin: "0 10px" }}>{sellTokenObjectSol?.symbol}</span>
                          <ChevronDown color="#bbffd6" size="18px" style={{ verticalAlign: "middle" }} />
                        </>
                      ) : (
                        <Skeleton.Button active size="large" />
                      )
                    ) : sellToken ? (
                      <>
                        <img
                          src={tokensByChain(chainIdEVM)[sellToken]?.logoURI}
                          alt={sellToken}
                          onError={handleImageError}
                          className="borderRadius-50"
                        />
                        <span style={{ margin: "0 10px" }}>{sellTokenObject?.symbol}</span>
                        <ChevronDown color="#bbffd6" size="18px" style={{ verticalAlign: "middle" }} />
                      </>
                    ) : (
                      <Skeleton.Button active size="large" />
                    )}
                  </Flex>
                </Button>
              </Flex>
            </div>
          </div>
          <div className="swap-arrow">
            <MoveDown color="#bbffd6" size="18px" style={{ verticalAlign: "middle" }} />
          </div>
          <div className="swap-output">
            <div className="to">To</div>
            <div className="userInfo moneyList">
              <Flex justify="space-between" style={{ width: "100%" }}>
                <div className="userInfo-item">
                  <Input
                    placeholder="0.00"
                    value={chainIdName === "solana" ? buyAmountSol : buyAmount}
                    className="swap-input-value"
                    type="number"
                    disabled
                  />
                  <Flex align="flex-end">
                    {chainIdName === "solana" ? (
                      <span>Balance: {buyBalanceSol}</span>
                    ) : (
                      <span>Balance: {buyData?.value ? formatUnits(buyData.value, buyData.decimals) : "0.00"}</span>
                    )}
                  </Flex>
                </div>
                <Button className="select-token" style={{ cursor: "auto" }}>
                  <Flex align="center">
                    {chainIdName === "solana" ? (
                      outputSol?.logoURI ? (
                        <>
                          <img
                            src={outputSol?.logoURI}
                            alt={outputSol?.symbol}
                            className="borderRadius-50"
                            onError={handleImageError}
                          />
                          <span style={{ margin: "0 8px" }}>{outputSol?.symbol}</span>
                        </>
                      ) : (
                        <Skeleton.Button active size="large" />
                      )
                    ) : output ? (
                      <>
                        <img
                          src={`https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/${output?.token_name?.toLowerCase()}.svg`}
                          alt={output?.token_name}
                          onError={handleImageError}
                          className="borderRadius-50"
                        />
                        <span style={{ margin: "0 8px" }}>{output?.token_name}</span>
                      </>
                    ) : (
                      <Skeleton.Button active size="large" />
                    )}
                    {/* <ChevronDown color="#bbffd6" size="18px" style={{ verticalAlign: "middle" }} /> */}
                  </Flex>
                </Button>
              </Flex>
            </div>
          </div>

          <div className="swap-detail">
            {((price && !!sellAmount) || (priceSol && !!sellAmountSol)) && (
              <div className="swap-detail-item">
                <div className="swap-detail-item-left">Price</div>
                <div className="swap-detail-item-right">{priceInvert}</div>
              </div>
            )}
            <div className="swap-detail-item">
              <div className="swap-detail-item-left">Slippage Tolerance</div>
              <div className="swap-detail-item-right">{slippage}%</div>
            </div>
            {((price && price.grossBuyAmount && !!sellAmount) || (priceSol && !!sellAmountSol)) && (
              <div className="swap-detail-item">
                <div className="swap-detail-item-left">
                  Trading Fee
                  <Tooltip placement="top" title={"For each trade, a 0.1% is paid to Liquidity Provider"}>
                    <img src={questionIcon} alt="" />
                  </Tooltip>
                </div>
                <div className="swap-detail-item-right">
                  {chainIdName === "solana"
                    ? Number(priceSol?.buyAmount) * AFFILIATE_FEE + " " + buyTokenObjectSol?.symbol
                    : Number(formatUnits(BigInt(price?.grossBuyAmount), buyData?.decimals)) * AFFILIATE_FEE +
                      " " +
                      buyTokenObject?.symbol}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* accountEvm &&  */}
        {chainIdName !== "solana" && (
          <ApproveOrReviewButton
            sellTokenAddress={tokensByChain(chainIdEVM)[sellToken]?.address}
            takerAddress={accountEvm}
            disabled={inSufficientBalance}
          />
        )}
        {/* accountSol && */}
        {chainIdName === "solana" && (
          <ApproveOrReviewButton
            sellTokenAddress={tokensByChainSol()[sellTokenSol]?.address}
            takerAddress={accountSol}
            disabled={inSufficientBalanceSol}
          />
        )}
      </ThModal>

      {/* confirm swap dialog */}
      <ThModal
        width={528}
        styles={{ minHeight: 437, maxHeight: 437, overflowY: "auto" }}
        className="modal swap"
        centered
        title=""
        footer={null}
        open={showConfirmModal}
        closable={chainIdName !== "solana" ? !isPendingQuote : !isPendingSol}
        onCancel={() => {
          setErrorQuote("");
          setShowConfirmModal(false);
        }}
      >
        {chainIdName !== "solana" ? (
          <QuoteView
            isConfirming={isConfirming}
            isConfirmed={isConfirmed}
            errorQuote={errorQuote}
            quoteError={quoteError}
            quoteHash={quoteHash}
            chainId={chainId}
          />
        ) : (
          <QuoteView
            isConfirming={isConfirmingSol}
            isConfirmed={isConfirmedSol}
            errorQuote={errorQuoteSol}
            quoteError={errorQuoteSol}
            quoteHash={hashSol}
            chainId={520}
          />
        )}
      </ThModal>

      {/* select a token */}
      <ThModal
        width={528}
        styles={{ minHeight: 437, maxHeight: 437, overflowY: "auto" }}
        className="modal swap"
        centered
        title=""
        footer={null}
        open={selectTokenModal}
        onCancel={() => {
          setSelectTokenModal(false);
          setShowModal(true);
        }}
        // closeIcon={<CustomCloseButton />}
      >
        <div className="swap-title modalTitle" style={{ marginTop: "30px" }}>
          Select a Token
        </div>
        <div className="swap-main">
          <div className="swap-input">
            <div className="swap-select">
              <div className="tokenList">
                {chainIdName === "solana"
                  ? (getSellTokenListSol() || []).map((item, index) => (
                      <CurrencyRow key={index} item={item} type="solana" />
                    ))
                  : (getSellTokenList(chainIdEVM) || []).map((item, index) => (
                      <CurrencyRow key={index} item={item} type="evm" />
                    ))}
              </div>
            </div>
          </div>
        </div>
      </ThModal>

      {/* setting modal */}
      <ThModal
        width={528}
        styles={{ minHeight: 437, maxHeight: 437, overflowY: "auto" }}
        className="modal swap"
        centered
        title=""
        footer={null}
        open={showSetting}
        onCancel={() => {
          setShowSetting(false);
        }}
      >
        <div className="swap-title modalTitle" style={{ marginTop: "30px" }}>
          Settings
        </div>
        <div className="swap-main">
          <div className="swap-input">
            <div className="from">Default Transaction Speed</div>
            <div className="userInfo moneyList">
              <Radio.Group
                options={txSpeedOptions}
                onChange={onChangeTxSpeed}
                value={gasPrice}
                optionType="button"
                buttonStyle="solid"
              />
            </div>
          </div>
          <div className="swap-output mt0">
            <div className="to">
              Slippage Tolerance
              <Tooltip placement="top" title={"For each trade, a 0.1% is paid to Liquidity Provider"}>
                <img src={questionIcon} alt="" />
              </Tooltip>
            </div>
            <div className="userInfo moneyList">
              <Flex justify="space-between" align="center">
                <Radio.Group
                  options={slippageOptions}
                  onChange={onChangeSlippage}
                  value={slippage}
                  optionType="button"
                  buttonStyle="solid"
                />
              </Flex>
            </div>
          </div>
        </div>
      </ThModal>
    </>
  );

  // 代币列表项组件
  function CurrencyRow({ item, index, type }) {
    const [balance, setBalance] = useState("0.00");
    const { data: sellData } = useBalance({
      address: accountEvm,
      token:
        item.address === "0x2e5221b0f855be4ea5cefffb8311eed0563b6e87" ||
        item.address === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
          ? null
          : item.address,
    });

    useEffect(() => {
      // 获取出售代币余额-列表
      async function getBalanceSol() {
        try {
          if (item.address === "So11111111111111111111111111111111111111112") {
            let nativeBalance = await connection.getBalance(publicKey, "confirmed");
            let balance = nativeBalance / 10 ** item.decimals;
            console.log("获取原生代币余额", balance);
            setBalance(balance || "0.00");
            return;
          }
          let mintAccount = new PublicKey(item.address);
          const [associatedTokenAddress] = PublicKey.findProgramAddressSync(
            [
              publicKey?.toBuffer(), // 用户公钥地址
              TOKEN_PROGRAM_ID.toBuffer(),
              mintAccount.toBuffer(), // 铸币厂地址
            ],
            ASSOCIATED_TOKEN_PROGRAM_ID
          );
          const token = await connection.getTokenAccountBalance(associatedTokenAddress);
          console.log("获取出售代币余额-list", token);
          let balance = token.value.amount / 10 ** token.value.decimals;
          setBalance(balance);
        } catch (error) {
          console.warn("获取出售代币余额失败-list", error);
          if (error.message.includes("could not find account")) {
            setBalance("0.00");
          }
        }
      }

      if (type === "solana" && publicKey) {
        getBalanceSol(); // 调用获取sell余额的方法
      }
    }, [item.address, item.decimals, type]);

    return (
      <Flex
        key={index}
        align="center"
        justify="space-between"
        className="tokenList-item"
        onClick={() => handleSellTokenChange(item, type)}
      >
        <Flex align="center">
          <img src={item.logoURI} alt={item.name} onError={handleImageError} className="borderRadius-50" />
          <Flex vertical>
            <span>{item.symbol}</span>
            <span className="tokenList-item-name">{item.name}</span>
          </Flex>
        </Flex>
        {chainIdName === "solana" ? (
          <div className="token-right">{balance}</div>
        ) : (
          <div className="token-right">
            {chainId === chainIdEVM && sellData?.value ? formatUnits(sellData.value, sellData.decimals) : "0.00"}
          </div>
        )}
      </Flex>
    );
  }

  function DisconnectButton() {
    const disconnectFn = () => {
      setConnectWallet(false);
      if (outputVal.chain_id === "solana") {
        disconnectSol();
      } else {
        disconnectEvm();
      }
    };

    return (
      <Button
        type="text"
        className="disconnect-button"
        onClick={disconnectFn}
        disabled={isPendingQuote || isPendingSol}
      >
        {outputVal.chain_id !== "solana" && (
          <Flex align="center">
            <img src={connector?.icon} alt={connector?.name} className="disconnect-w-h" />
            <div className="pl12">{followAccount}</div>
          </Flex>
        )}
        {outputVal.chain_id === "solana" && (
          <Flex align="center">
            <img src={wallet?.icon} alt={wallet?.name} className="disconnect-w-h" />
            <div className="pl12">{followAccountSol}</div>
          </Flex>
        )}
      </Button>
    );
  }

  // 批准授权、查看报价、确认交易
  function ApproveOrReviewButton({ takerAddress, sellTokenAddress, disabled }) {
    const [isSwap, setSwap] = useState(false);
    // 1. Read from erc20, does spender (0x Exchange Proxy) have allowance?
    const { data: allowance, refetch } = useReadContract({
      address: sellTokenAddress,
      abi: erc20Abi,
      functionName: "allowance",
      args: [takerAddress, exchangeProxy(chainId)],
    });

    // 2. (only if no allowance): write to erc20, approve a token allowance for 0x Exchange Proxy
    const { data } = useSimulateContract({
      address: sellTokenAddress,
      abi: erc20Abi,
      functionName: "approve",
      args: [exchangeProxy(chainId), MAX_ALLOWANCE],
    });

    // Define useWriteContract for the 'approve' operation
    const { data: approveHash, isPending, writeContractAsync: writeContract, error: approveError } = useWriteContract();

    // useWaitForTransactionReceipt to wait for the approval transaction to complete
    const { data: approvalReceiptData, isLoading: isApproving } = useWaitForTransactionReceipt({
      hash: approveHash,
    });

    // 获取SOL第三方swap数据
    async function sendTransctionSol() {
      setPendingSol(true);
      const dataSol = {
        quoteResponse: priceSol, // 从/quote api接口获取报价
        userPublicKey: publicKey, // 用户公钥地址
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
        body: JSON.stringify(dataSol),
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
        setPendingSol(false);
        setConfirmingSol(true);
        // get the latest block hash
        const latestBlockHash = await connection.getLatestBlockhash();
        // Execute the transaction
        const rawTransaction = tx.serialize();
        const txid = await connection.sendRawTransaction(rawTransaction, {
          skipPreflight: true,
          // maxRetries: 2,
        });

        setConfirmedSol(false);
        await connection.confirmTransaction(
          {
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: txid,
          },
          "confirmed"
        );
        setErrorQuoteSol(null);
        setHashSol(txid);
        setConfirmingSol(false);
        setConfirmedSol(true); // 交易确认后，重置确认状态
        // console.log(`https://solscan.io/tx/${txid}`); // 打印交易链接
      } catch (error) {
        console.error("交易失败", error);
        setErrorQuoteSol(error); // 交易失败时，设置错误状态
        setConfirmingSol(false);
        setPendingSol(false);
      }
    }

    // 获取EVM第三方swap数据
    async function sendTransction() {
      setSwap(true);
      const params = {
        sellToken: sellTokenObject?.address,
        buyToken: buyTokenObject?.address,
        sellAmount: parsedSellAmount,
        buyAmount: parsedBuyAmount,
        takerAddress: accountEvm,
        slippagePercentage: slippage / 100, // 默认为0.01
        feeRecipient: FEE_RECIPIENT,
        buyTokenPercentageFee: AFFILIATE_FEE,
        feeRecipientTradeSurplus: FEE_RECIPIENT,
      };
      try {
        const response = await fetch(`${thirdApi}swap/v1/quote?${qs.stringify(params)}`, {
          headers: {
            "0x-api-key": import.meta.env.VITE_PUBLIC_ZEROEX_API_KEY,
          },
        });
        const quoteVal = await response.json();
        setSwap(false);
        // setQuote(quoteVal);
        sendTransaction &&
          sendTransaction({
            gas: quoteVal.gas,
            to: quoteVal.to,
            value: quoteVal.value,
            data: quoteVal.data,
            gasPrice: quoteVal.gasPrice,
          });
      } catch (error) {
        setSwap(false);
        console.error("发送交易失败EVM", error);
      }
    }

    // 发送swap交易
    const swapSendTx = async () => {
      // console.log("swapSendTx----chainIdName", chainIdName);
      if (chainIdName === "solana") {
        setErrorQuoteSol(null);
        setShowConfirmModal(true);
        await sendTransctionSol();
      } else {
        setErrorQuote("");
        await sendTransction();
        setShowConfirmModal(true);
      }
    };

    // console.log("useWriteContract===", allowance, buyAmount, data, approveHash, isPending, error, approvalReceiptData);

    // 读取合约授权额度重新调用refectch方法
    useEffect(() => {
      if (data) {
        refetch();
        console.log("读取合约授权额度回调===", data);
      }
    }, [data, refetch]);

    console.log("accountEvm-accountSol", accountEvm, accountSol, isConnectWallet);
    console.log("连接钱包", chainIdName, isConnected, connected, chainId, chainIdEVM);

    // 连接钱包按钮
    if (
      (chainIdName !== "solana" && (chainId !== chainIdEVM || !isConnected)) ||
      (chainIdName === "solana" && !connected)
    ) {
      return (
        <Button
          type="default"
          className="swap-btn google btnWalletBox"
          style={{ marginBottom: "20px" }}
          onClick={() => handleConnectWallet(outputVal)}
        >
          Connect Wallet
        </Button>
      );
    }

    // 批准授权按钮
    if (chainIdName !== "solana" && allowance === 0n) {
      return (
        <Flex align="center" justify="space-between" className="mt30 mb20">
          {isConnectWallet && <DisconnectButton />}
          <Button
            type="primary"
            className="google logOutBox"
            disabled={loading || !sellAmount}
            onClick={async () => {
              setLoading(true);
              await writeContract({
                abi: erc20Abi,
                address: sellTokenAddress,
                functionName: "approve",
                args: [exchangeProxy(chainId), MAX_ALLOWANCE],
              })
                .then((res) => {
                  console.log("批准授权操作成功===", res);
                  setLoading(false);
                })
                .catch((err) => {
                  console.log("Something went wrong:", err);
                  setLoading(false);
                });
              refetch();
            }}
          >
            {loading || isApproving
              ? "Approving…"
              : !sellAmount
              ? "Enter an amount"
              : disabled
              ? "Insufficient " + sellToken + " balance"
              : "Approve"}
          </Button>
        </Flex>
      );
    }

    if (chainIdName !== "solana") {
      return (
        <>
          <Flex align="center" justify="space-between" className="mt30 mb20">
            {isConnectWallet && <DisconnectButton />}
            <Button
              type="primary"
              // loading={isBuyLoading}
              className="google logOutBox"
              disabled={disabled || !sellAmount || !buyAmount || error.length > 0 || isPendingQuote}
              onClick={swapSendTx}
            >
              {!sellAmount
                ? "Enter an amount"
                : disabled
                ? "Insufficient " + sellToken + " balance"
                : error.length > 0
                ? error[0]?.code == 1004 && "Insufficient " + buyTokenObject?.symbol + " liquidity"
                : isPendingQuote || isSwap
                ? "Confirming..."
                : "Swap"}
            </Button>           
          </Flex>
          <div className="powered">Powered by <img src={swap_icon_0x}/> 0x.org</div>
        </>
      );
    }

    return (
      <>
        <Flex align="center" justify="space-between" className="mt30 mb20">
          {isConnectWallet && <DisconnectButton />}
          <Button
            type="primary"
            // loading={isBuyLoading}
            className="google logOutBox"
            disabled={disabled || !parsedSellAmountSol || !buyAmountSol || error.length > 0 || isPendingSol}
            onClick={swapSendTx}
          >
            {!parsedSellAmountSol
              ? "Enter an amount"
              : disabled
              ? "Insufficient " + sellTokenSol + " balance"
              : isPendingSol
              ? "Confirming..."
              : "Swap"}
          </Button>          
        </Flex>
        <div className="powered">Powered by <img src={swap_icon_jup}/> Jupiter</div>
      </>
    );
  }
}
export default Purchase;