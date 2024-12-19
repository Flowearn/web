/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-02-01 17:21:23
 * @LastEditors: chenhua
 * @LastEditTime: 2024-09-09 16:59:01
 */

// 切换网络后需要改变这个useWeb3文件中checkNetworkConnection方法的下面三个参数
// chainId: chainId,
// chainName: 'Goerli',
// rpcUrls: ['https://mainnet.rangersprotocol.com/api/jsonrpc']

// ETH主网
const contractObj = {
  contractAccount: "0x7E76e99A9b60cb2057cD31b2ffd4a3C02D10b6b7", //'0xbfaf98bBb667E5C26FE812A92E3d842Da3eAeF07', // 合约地址
  TokenId: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  networkId: "1", // 目标网络  networkId: '8274f', // 目标网络 需要16进制
  // imgUrl: 'http://172.16.2.234:8081/',
  imgUrl: "http://www.dboard.trade:8082/api/",
  // rpcUrls: 'https://mainnet.rangersprotocol.com/api/jsonrpc',
  rpcUrls: "https://scroll-sepolia.blockpi.network/v1/rpc/public",
  network: "mainnet",
};

export default contractObj;
