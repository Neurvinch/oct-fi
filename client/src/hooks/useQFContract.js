import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useEthersProvider } from './useEthersProvider';
import { QuadraticFundingPoolABI, ERC20ABI } from '../contracts/abis';
import { getContractAddress } from '../contracts/addresses';

export const useQFContract = () => {
  const { signer, chainId, isConnected } = useEthersProvider();
  const [qfContract, setQfContract] = useState(null);
  const [usdcContract, setUsdcContract] = useState(null);

  useEffect(() => {
    if (signer && chainId && isConnected) {
      const qfAddress = getContractAddress('QuadraticFundingPool', chainId);
      const usdcAddress = getContractAddress('USDC', chainId);
      
      if (qfAddress && qfAddress !== ethers.ZeroAddress) {
        setQfContract(new ethers.Contract(qfAddress, QuadraticFundingPoolABI, signer));
      }
      
      if (usdcAddress && usdcAddress !== ethers.ZeroAddress) {
        setUsdcContract(new ethers.Contract(usdcAddress, ERC20ABI, signer));
      }
    }
  }, [signer, chainId, isConnected]);

  const getAllProjects = async () => {
    if (!qfContract) return [];
    
    const count = await qfContract.getProjectCount();
    const projects = [];
    
    for (let i = 0; i < count; i++) {
      const project = await qfContract.getProject(i);
      projects.push({
        id: i,
        name: project.name,
        description: project.description,
        recipient: project.recipient,
        totalContributions: ethers.formatUnits(project.totalContributions, 6),
        contributorCount: Number(project.contributorCount),
        votes: Number(project.votes),
        active: project.active,
      });
    }
    
    return projects;
  };

  const contribute = async (projectId, amount) => {
    if (!qfContract || !usdcContract) {
      throw new Error('Contracts not initialized');
    }

    const amountWei = ethers.parseUnits(amount.toString(), 6);
    
    // Check allowance
    const allowance = await usdcContract.allowance(
      await signer.getAddress(), 
      qfContract.target
    );
    
    // Approve if needed
    if (allowance < amountWei) {
      const approveTx = await usdcContract.approve(qfContract.target, amountWei);
      await approveTx.wait();
    }
    
    // Contribute
    const tx = await qfContract.contribute(projectId, amountWei);
    const receipt = await tx.wait();
    
    return receipt;
  };

  const vote = async (projectId) => {
    if (!qfContract) {
      throw new Error('QF contract not initialized');
    }

    const tx = await qfContract.vote(projectId);
    const receipt = await tx.wait();
    
    return receipt;
  };

  const getTotalMatchingPool = async () => {
    if (!qfContract) return '0';
    
    const total = await qfContract.getTotalMatchingPool();
    return ethers.formatUnits(total, 6);
  };

  const getUserContribution = async (address, projectId) => {
    if (!qfContract) return '0';
    
    const contribution = await qfContract.getUserContribution(address, projectId);
    return ethers.formatUnits(contribution, 6);
  };

  return {
    qfContract,
    getAllProjects,
    contribute,
    vote,
    getTotalMatchingPool,
    getUserContribution,
  };
};
