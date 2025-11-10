import { useState, useEffect } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';

export const useEthersProvider = () => {
  const { address, isConnected, chain } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    if (walletClient && isConnected) {
      const ethersProvider = new ethers.BrowserProvider(walletClient);
      setProvider(ethersProvider);
      
      ethersProvider.getSigner().then(setSigner).catch(console.error);
    } else {
      setProvider(null);
      setSigner(null);
    }
  }, [walletClient, isConnected]);

  return { provider, signer, address, isConnected, chainId: chain?.id };
};
