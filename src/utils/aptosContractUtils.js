/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-06-15 15:04:12
 * @LastEditors: chenhua
 * @LastEditTime: 2024-09-13 09:58:25
 */
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import utils from "@utils/utils";
import { message } from "antd";
const APTOS_MODULE_ADDRESS = import.meta.env.VITE_CONTRACT_ADDR;
const APTOS_MODULE_ADDRESS1 = import.meta.env.VITE_CONTRACT_ADDR1;
const VITE_NETWORK = import.meta.env.VITE_NETWORK;
// const config = new AptosConfig({ network: Network.MAINNET });
const network = VITE_NETWORK === 'MAINNET' ? Network.MAINNET : Network.TESTNET;
console.log(network, 'network------------------------network')
const config = new AptosConfig({ network });
const aptos = new Aptos(config);

const MODULE_NAME = "coin_v1";

const checkNetwork = (walletNetwork) => {
  if (config.network !== walletNetwork.name) {
    console.error(
      "Network mismatch: SDK and Wallet are not on the same network."
    );
    message.error(`Please switch networks`);
    return false;
  }
  return true;
};

const determineWalletName = () => {
  let walletName = localStorage.getItem("AptosWalletName");
  if (walletName === "Martian") {
    return APTOS_MODULE_ADDRESS1;
  } else {
    return APTOS_MODULE_ADDRESS;
  }
};

const AptosContractUtils = {
  async fetchAccountInfo(accountAddr, network) {
    if (!checkNetwork(network)) return;
    try{
      const resource = await aptos.getAccountResource({
        accountAddress: accountAddr,
        resourceType: "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
      });
      const value = utils.unitConvert(resource.coin.value);
      console.log(value, '-------------------------value')
      return value;
    }catch(error){
      const jsonMatch = error.message.match(/{.*}/);
      if (jsonMatch && jsonMatch[0]) {
        const errorJson = JSON.parse(jsonMatch[0]);
        if(errorJson.error_code === 'resource_not_found'){
          message.info(`You need APT as gas to issue keys`);
        }
      }
    }
    
  },

  async onSignAndSubmitTransaction(
    account,
    funName,
    contractName,
    args,
    network
  ) {
    if (!checkNetwork(network)) return;

    try {
      const response = await funName({
        sender: account.address,
        data: {
          function: `${determineWalletName()}::${MODULE_NAME}::${contractName}`,
          typeArguments: [],
          functionArguments: args,
        },
      });
      try {
        const res = await aptos.waitForTransaction({
          transactionHash: response.hash,
        });
        return res;
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.log(error, "----------------------error");
      console.error(error);
    }
  },

  async isAccountRegistered(args, contractName, network, istrue) {
    if (istrue) {
      if (!checkNetwork(network)) return;
    }
    const payload = {
      function: `${determineWalletName()}::${MODULE_NAME}::${contractName}`,
      functionArguments: args, // 使用位置参数传递
      type_arguments: [],
    };
    try {
      const response = await aptos.view({ payload });
      console.log("response:----------------------", response);
      return response[0];
    } catch (error) {
      console.log("Error checking account registration:", error);
      // throw error;
    }
  },
};
export default AptosContractUtils;
