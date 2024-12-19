export const AFFILIATE_FEE = 0.001; // 购买代币的百分比手续费0-1.0之间，用户可自定义
export const FEE_RECIPIENT = "0x3983a42C9f4a7Dd2f31519cC88Be76819E81fDc5"; // 手续费接收者地址用户可自定义

export const POLYGON_EXCHANGE_PROXY = "0xDef1C0ded9bec7F1a1670819833240f027b25EfF";

export const MAX_ALLOWANCE = 115792089237316195423570985008687907853269984665640564039457584007913129639935n;

// API接口文档：https://0x.org/docs/0x-swap-api/api-references/get-swap-v1-price
// 获取不同链的API地址
export const getChainApi = (chainName) => {
  switch (chainName) {
    case "solana":
      return "https://quote-api.jup.ag/";
    case "base":
      return "https://base.api.0x.org/";
    case "sepolia":
      return "https://sepolia.api.0x.org/"; // Sepolia测试网
    case "ethereum":
      return "https://api.0x.org/"; // ETH主网
    default:
      return "https://api.0x.org/";
  }
};

export const getBlockExplorer = (chainId) => {
  switch (chainId) {
    case 520:
      return "https://solscan.io";
    case 8453:
      return "https://basescan.org";
    case 11155111:
      return "https://sepolia.etherscan.io";
    default:
      return "https://etherscan.io"; // ETH主网
  }
};

export const ETHEREUM_TOKENS_TEST_SELL = [
  {
    name: "Native Sepolia ETH",
    address: "0x2e5221b0f855be4ea5cefffb8311eed0563b6e87",
    symbol: "SETH",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/eth.svg",
  },
  {
    name: "Wrapped Ether",
    address: "0xfff9976782d46cc05630d1f6ebab18b2324d6b14",
    symbol: "WETH",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/weth.svg",
  },
  {
    name: "Wrapped Link",
    address: "0x779877a7b0d9e8603169ddbd7836e478b4624789",
    symbol: "LINK",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/link.svg",
  },
];

export const ETHEREUM_TOKENS_TEST_BY_SYMBOL = {
  SETH: {
    name: "Native Sepolia ETH",
    address: "0x2e5221b0f855be4ea5cefffb8311eed0563b6e87",
    symbol: "SETH",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/eth.svg",
  },
  WETH: {
    name: "Wrapped Ether",
    address: "0xfff9976782d46cc05630d1f6ebab18b2324d6b14",
    symbol: "WETH",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/weth.svg",
  },
  LINK: {
    name: "Wrapped Link",
    address: "0x779877a7b0d9e8603169ddbd7836e478b4624789",
    symbol: "LINK",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/link.svg",
  },
  // uni: {
  //   name: "Uniswap",
  //   address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  //   symbol: "UNI",
  //   decimals: 18,
  //   logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/uni.svg",
  // },
};

export const ETHEREUM_TOKENS_TEST_BY_ADDRESS = {
  "0x2e5221b0f855be4ea5cefffb8311eed0563b6e87": {
    name: "Native Sepolia ETH",
    address: "0x2e5221b0f855be4ea5cefffb8311eed0563b6e87",
    symbol: "SETH",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/eth.svg",
  },
  "0xfff9976782d46cc05630d1f6ebab18b2324d6b14": {
    name: "Wrapped Ether",
    address: "0xfff9976782d46cc05630d1f6ebab18b2324d6b14",
    symbol: "WETH",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/weth.svg",
  },
  "0x779877a7b0d9e8603169ddbd7836e478b4624789": {
    name: "Wrapped Link",
    address: "0x779877a7b0d9e8603169ddbd7836e478b4624789",
    symbol: "LINK",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/link.svg",
  },
};

export const ETHEREUM_TOKENS_SELL = [
  {
    name: "Ether",
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    symbol: "ETH",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/eth.svg",
  },
  // {
  //   name: "Wrapped Ether",
  //   address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  //   symbol: "WETH",
  //   decimals: 18,
  //   logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/eth.svg",
  // },
  {
    name: "Tether USD",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    symbol: "USDT",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdt.svg",
  },
  {
    name: "USDCoin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
  },
];

export const ETHEREUM_TOKENS_BY_SYMBOL = {
  ETH: {
    name: "Ether",
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    symbol: "ETH",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/eth.svg",
  },
  USDT: {
    name: "Tether USD",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    symbol: "USDT",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdt.svg",
  },
  USDC: {
    name: "USDCoin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
  },
};

export const ETHEREUM_TOKENS_BY_ADDRESS = {
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": {
    name: "Ether",
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    symbol: "ETH",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/eth.svg",
  },
  "0xdac17f958d2ee523a2206206994597c13d831ec7": {
    name: "Tether USD",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    symbol: "USDT",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdt.svg",
  },
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": {
    name: "USDCoin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
  },
};

export const BASE_TOKENS_SELL = [
  {
    name: "Wrapped Ether",
    address: "0x4200000000000000000000000000000000000006",
    symbol: "WETH",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/weth.svg",
  },
  {
    name: "Tether USDT",
    address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
    symbol: "USDT",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdt.svg",
  },
  {
    name: "USD Coin",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
  },
];

export const BASE_TOKENS_BY_SYMBOL = {
  WETH: {
    name: "Wrapped Ether",
    address: "0x4200000000000000000000000000000000000006",
    symbol: "WETH",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/weth.svg",
  },
  USDT: {
    name: "Tether USDT",
    address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
    symbol: "USDT",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdt.svg",
  },
  USDC: {
    name: "USD Coin",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
  },
};

export const BASE_TOKENS_BY_ADDRESS = {
  "0x4200000000000000000000000000000000000006": {
    name: "Wrapped Ether",
    address: "0x4200000000000000000000000000000000000006",
    symbol: "WETH",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/weth.svg",
  },
  "0xfde4c96c8593536e31f229ea8f37b2ada2699bb2": {
    name: "Tether USDT",
    address: "0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2",
    symbol: "USDT",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdt.svg",
  },
  "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913": {
    name: "USD Coin",
    address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    symbol: "USDC",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
  },
};

export const SOLANA_TOKENS_SELL = [
  {
    name: "Wrapped SOL",
    address: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  },
  {
    name: "USD Coin",
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  },
  {
    name: "USDT",
    address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    symbol: "USDT",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
  },
  // {
  //   name: "hello yyok",
  //   address: "XkrhTzEU93Xpd1FkZi2pQ8Y1FMQaubWrGqgnYj6iz9Q",
  //   symbol: "YYOK",
  //   decimals: 6,
  //   logoURI: "https://devnet.irys.xyz/m1m8hP4soZE9XYwjsVN48Dk7HXVP85sg2E7_iPUkxrs",
  // },
  // {
  //   name: "Lan Ren Code",
  //   address: "3qtgG32cUpEguSck9PhHcsuXkbKADb3eoTjr68C1n1ue",
  //   symbol: "LRC",
  //   decimals: 9,
  //   logoURI: "https://salmon-worthy-hawk-674.mypinata.cloud/ipfs/QmfGBBXZmkRFmYMk22v3UKuurJ1i3k4XQC6FU5TVnsBNVF",
  // },
  // {
  //   name: "Wrapper yyds",
  //   address: "GTBPDCbarJCDqo8LsUTKCWCHnK2Ak6NgRDhrEcRhZUrh",
  //   symbol: "YYDS",
  //   decimals: 9,
  //   logoURI: "https://salmon-worthy-hawk-674.mypinata.cloud/ipfs/Qmc2HKWZNoFBzS5o7jYV9dufE6xth7t99dbg4XZqWBKUaa",
  // },
];

export const SOLANA_TOKENS_BY_SYMBOL = {
  // YYOK: {
  //   name: "hello yyok",
  //   address: "XkrhTzEU93Xpd1FkZi2pQ8Y1FMQaubWrGqgnYj6iz9Q",
  //   symbol: "YYOK",
  //   decimals: 6,
  //   logoURI: "https://devnet.irys.xyz/m1m8hP4soZE9XYwjsVN48Dk7HXVP85sg2E7_iPUkxrs",
  // },
  // LRC: {
  //   name: "Lan Ren Code",
  //   address: "3qtgG32cUpEguSck9PhHcsuXkbKADb3eoTjr68C1n1ue",
  //   symbol: "LRC",
  //   decimals: 9,
  //   logoURI: "https://salmon-worthy-hawk-674.mypinata.cloud/ipfs/QmfGBBXZmkRFmYMk22v3UKuurJ1i3k4XQC6FU5TVnsBNVF",
  // },
  // YYDS: {
  //   name: "Wrapper yyds",
  //   address: "GTBPDCbarJCDqo8LsUTKCWCHnK2Ak6NgRDhrEcRhZUrh",
  //   symbol: "YYDS",
  //   decimals: 9,
  //   logoURI: "https://salmon-worthy-hawk-674.mypinata.cloud/ipfs/Qmc2HKWZNoFBzS5o7jYV9dufE6xth7t99dbg4XZqWBKUaa",
  // },
  SOL: {
    name: "Wrapped SOL",
    address: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  },
  USDT: {
    name: "USDT",
    address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    symbol: "USDT",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
  },
  USDC: {
    name: "USD Coin",
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  },
};

export const SOLANA_TOKENS_BY_ADDRESS = {
  // XkrhTzEU93Xpd1FkZi2pQ8Y1FMQaubWrGqgnYj6iz9Q: {
  //   name: "hello yyok",
  //   address: "XkrhTzEU93Xpd1FkZi2pQ8Y1FMQaubWrGqgnYj6iz9Q",
  //   symbol: "YYOK",
  //   decimals: 6,
  //   logoURI: "https://devnet.irys.xyz/m1m8hP4soZE9XYwjsVN48Dk7HXVP85sg2E7_iPUkxrs",
  // },
  // "3qtgG32cUpEguSck9PhHcsuXkbKADb3eoTjr68C1n1ue": {
  //   name: "Lan Ren Code",
  //   address: "3qtgG32cUpEguSck9PhHcsuXkbKADb3eoTjr68C1n1ue",
  //   symbol: "LRC",
  //   decimals: 9,
  //   logoURI: "https://salmon-worthy-hawk-674.mypinata.cloud/ipfs/QmfGBBXZmkRFmYMk22v3UKuurJ1i3k4XQC6FU5TVnsBNVF",
  // },
  // GTBPDCbarJCDqo8LsUTKCWCHnK2Ak6NgRDhrEcRhZUrh: {
  //   name: "Wrapper yyds",
  //   address: "GTBPDCbarJCDqo8LsUTKCWCHnK2Ak6NgRDhrEcRhZUrh",
  //   symbol: "YYDS",
  //   decimals: 9,
  //   logoURI: "https://salmon-worthy-hawk-674.mypinata.cloud/ipfs/Qmc2HKWZNoFBzS5o7jYV9dufE6xth7t99dbg4XZqWBKUaa",
  // },
  so11111111111111111111111111111111111111112: {
    name: "Wrapped SOL",
    address: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    decimals: 9,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  },
  es9vmfrzacermjfrf4h2fyd4kconky11mcce8benwnyb: {
    name: "USDT",
    address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    symbol: "USDT",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg",
  },
  epjfwdd5aufqssqem2qn1xzybapc8g4weggkzwytdt1v: {
    name: "USD Coin",
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    decimals: 6,
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  },
};
