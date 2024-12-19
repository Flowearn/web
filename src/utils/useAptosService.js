import { AptosClient, AccountAuthenticator, Deserializer, AccountAddress } from '@aptos-labs/ts-sdk';
const VITE_NETWORK = import.meta.env.VITE_NETWORK;
const baseUrl = "https://paymaster.kanalabs.io";
const projectKey = 'kana2rUhrD23sTcmbc2RXsqMxFVTAslU'; // 确保在 .env 文件中设置该变量
const aptosClient = VITE_NETWORK === 'MAINNET' ? new AptosClient('https://fullnode.aptoslabs.com') : new AptosClient('https://fullnode.devnet.aptoslabs.com');
const headers = {
  'Content-Type': 'application/json',
  'api-key': projectKey,
};
console.log(aptosClient, 'aptosClient--------------------------')
const useAptosService = (wallet, address) => {
  const initAccount = async () => {
    const url = `${baseUrl}/initAccount`;
    const params = { address };
    
    const response = await fetch(`${url}?${params}`, { headers });
    if (!response.ok) {
      throw await response.json();
    }
    return await response.json();
  };

  const sponsoredTxn = async (payload) => {
    const transaction = await aptosClient.transaction.build.simple({
      sender: wallet.accountAddress.toString(),
      data: payload.data,
      options: payload.options,
      withFeePayer: true,
    });

    const rawTransactionBytes = transaction.rawTransaction.bcsToBytes();

    const url = `${baseUrl}/sponsorGas`;
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ data: rawTransactionBytes }),
    });

    if (!response.ok) {
      throw await response.json();
    }

    const responseData = await response.json();
    const feePayerAddress = responseData.feePayerAddress;
    const feepayerSignature = new Uint8Array(Object.values(responseData.feePayerAuth));
    const deserializerFeePayer = new Deserializer(feepayerSignature);
    const feepayerAuth = AccountAuthenticator.deserialize(deserializerFeePayer);
    const senderAuth = aptosClient.transaction.sign({
      signer: wallet,
      transaction,
    });

    const committedTxn = await aptosClient.transaction.submit.simple({
      transaction: {
        rawTransaction: transaction.rawTransaction,
        feePayerAddress: AccountAddress.fromString(feePayerAddress),
      },
      senderAuthenticator: senderAuth,
      feePayerAuthenticator: feepayerAuth,
    });

    const transactionReceipt = await aptosClient.waitForTransaction({
      transactionHash: committedTxn.hash,
      options: { checkSuccess: true },
    });

    console.log("gas used", transactionReceipt.gas_used);
  };

  return { initAccount, sponsoredTxn };
};

export default useAptosService;
