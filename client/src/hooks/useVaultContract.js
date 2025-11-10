import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useEthersProvider } from './useEthersProvider';
import { YieldForgeVaultABI, ERC20ABI } from '../contracts/abis';
import { getContractAddress } from '../contracts/addresses';

export const useVaultContract = () => {
  const { signer, chainId, isConnected } = useEthersProvider();
  const [vaultContract, setVaultContract] = useState(null);
  const [usdcContract, setUsdcContract] = useState(null);

  useEffect(() => {
    if (signer && chainId && isConnected) {
      const vaultAddress = getContractAddress('YieldForgeVault', chainId);
      const usdcAddress = getContractAddress('USDC', chainId);
      
      if (vaultAddress && vaultAddress !== ethers.ZeroAddress) {
        setVaultContract(new ethers.Contract(vaultAddress, YieldForgeVaultABI, signer));
      }
      
      if (usdcAddress && usdcAddress !== ethers.ZeroAddress) {
        setUsdcContract(new ethers.Contract(usdcAddress, ERC20ABI, signer));
      }
    }
  }, [signer, chainId, isConnected]);

  const deposit = async (amount) => {
    if (!vaultContract || !usdcContract) {
      throw new Error('Contracts not initialized');
    }

    const amountWei = ethers.parseUnits(amount.toString(), 6); // USDC has 6 decimals
    
    // Check allowance
    const allowance = await usdcContract.allowance(
      await signer.getAddress(), 
      vaultContract.target
    );
    
    // Approve if needed
    if (allowance < amountWei) {
      const approveTx = await usdcContract.approve(vaultContract.target, amountWei);
      await approveTx.wait();
    }
    
    // Deposit
    const depositTx = await vaultContract.deposit(amountWei, await signer.getAddress());
    const receipt = await depositTx.wait();
    
    return receipt;
  };

  const withdraw = async (amount) => {
    if (!vaultContract) {
      throw new Error('Vault contract not initialized');
    }

    const amountWei = ethers.parseUnits(amount.toString(), 6);
    const tx = await vaultContract.withdraw(
      amountWei, 
      await signer.getAddress(), 
      await signer.getAddress()
    );
    const receipt = await tx.wait();
    
    return receipt;
  };

  const getUserBalance = async (address) => {
    if (!vaultContract) return '0';
    
    const shares = await vaultContract.balanceOf(address);
    const assets = await vaultContract.convertToAssets(shares);
    
    return ethers.formatUnits(assets, 6);
  };

  const getTVL = async () => {
    if (!vaultContract) return '0';
    
    const totalAssets = await vaultContract.totalAssets();
    return ethers.formatUnits(totalAssets, 6);
  };

  const reportYield = async () => {
    if (!vaultContract) {
      throw new Error('Vault contract not initialized');
    }

    const tx = await vaultContract.reportYield();
    const receipt = await tx.wait();
    
    return receipt;
  };

  return {
    vaultContract,
    usdcContract,
    deposit,
    withdraw,
    getUserBalance,
    getTVL,
    reportYield,
  };
};
