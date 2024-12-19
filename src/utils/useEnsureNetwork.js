import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useState, useEffect } from 'react';

const useEnsureNetwork = (sdkNetwork) => {
  const { network } = useWallet();
  const [isNetworkConsistent, setIsNetworkConsistent] = useState(false);

  useEffect(() => {
    if (network && sdkNetwork) {
      setIsNetworkConsistent(network === sdkNetwork);
    }
  }, [network, sdkNetwork]);

  return isNetworkConsistent;
};

export default useEnsureNetwork;
