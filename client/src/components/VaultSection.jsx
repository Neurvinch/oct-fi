import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, ArrowDown, ArrowUp, TrendingUp, Shield, 
  AlertCircle, CheckCircle, Loader, Info, DollarSign 
} from 'lucide-react';
import { useVaultContract } from '../hooks/useVaultContract';
import { useEthersProvider } from '../hooks/useEthersProvider';
import './VaultSection.css';

const VaultSection = () => {
  const { address, isConnected } = useEthersProvider();
  const { deposit, withdraw, getUserBalance, getTVL, reportYield, usdcContract } = useVaultContract();

  const [activeTab, setActiveTab] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [userBalance, setUserBalance] = useState('0');
  const [usdcBalance, setUsdcBalance] = useState('0');
  const [tvl, setTvl] = useState('0');
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected || !address) return;

      try {
        const [balance, totalLocked] = await Promise.all([
          getUserBalance(address),
          getTVL(),
        ]);

        setUserBalance(balance);
        setTvl(totalLocked);

        if (usdcContract) {
          const usdc = await usdcContract.balanceOf(address);
          setUsdcBalance((Number(usdc) / 1e6).toFixed(2));
        }
      } catch (error) {
        console.error('Error fetching vault data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, [isConnected, address, getUserBalance, getTVL, usdcContract]);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > parseFloat(usdcBalance)) {
      setError('Insufficient USDC balance');
      return;
    }

    setLoading(true);
    setError('');
    setTxStatus('pending');

    try {
      await deposit(amount);
      setTxStatus('success');
      setAmount('');
      
      // Refresh balances
      const balance = await getUserBalance(address);
      const totalLocked = await getTVL();
      setUserBalance(balance);
      setTvl(totalLocked);
      
      if (usdcContract) {
        const usdc = await usdcContract.balanceOf(address);
        setUsdcBalance((Number(usdc) / 1e6).toFixed(2));
      }
    } catch (error) {
      console.error('Deposit error:', error);
      setError(error.message || 'Transaction failed');
      setTxStatus('error');
    } finally {
      setLoading(false);
      setTimeout(() => setTxStatus(null), 5000);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > parseFloat(userBalance)) {
      setError('Insufficient vault balance');
      return;
    }

    setLoading(true);
    setError('');
    setTxStatus('pending');

    try {
      await withdraw(amount);
      setTxStatus('success');
      setAmount('');
      
      // Refresh balances
      const balance = await getUserBalance(address);
      const totalLocked = await getTVL();
      setUserBalance(balance);
      setTvl(totalLocked);
      
      if (usdcContract) {
        const usdc = await usdcContract.balanceOf(address);
        setUsdcBalance((Number(usdc) / 1e6).toFixed(2));
      }
    } catch (error) {
      console.error('Withdraw error:', error);
      setError(error.message || 'Transaction failed');
      setTxStatus('error');
    } finally {
      setLoading(false);
      setTimeout(() => setTxStatus(null), 5000);
    }
  };

  const handleReportYield = async () => {
    setLoading(true);
    setError('');
    setTxStatus('pending');

    try {
      await reportYield();
      setTxStatus('success');
    } catch (error) {
      console.error('Report yield error:', error);
      setError(error.message || 'Transaction failed');
      setTxStatus('error');
    } finally {
      setLoading(false);
      setTimeout(() => setTxStatus(null), 5000);
    }
  };

  const setMaxAmount = () => {
    if (activeTab === 'deposit') {
      setAmount(usdcBalance);
    } else {
      setAmount(userBalance);
    }
  };

  return (
    <div className="vault-section" id="vault">
      <div className="vault-container">
        <motion.div
          className="vault-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>YieldForge Vault</h2>
          <p>Deposit, earn yield, and fund public goods—all while keeping your principal safe</p>
        </motion.div>

        <div className="vault-grid">
          {/* Info Cards */}
          <motion.div
            className="info-cards"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="info-card">
              <div className="info-icon" style={{ background: 'linear-gradient(135deg, #667eea22, #667eea44)' }}>
                <Wallet size={24} style={{ color: '#667eea' }} />
              </div>
              <div className="info-content">
                <p>Your Deposit</p>
                <h3>${parseFloat(userBalance).toLocaleString()}</h3>
                <span>Protected principal</span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon" style={{ background: 'linear-gradient(135deg, #764ba222, #764ba244)' }}>
                <TrendingUp size={24} style={{ color: '#764ba2' }} />
              </div>
              <div className="info-content">
                <p>Total Value Locked</p>
                <h3>${parseFloat(tvl).toLocaleString()}</h3>
                <span>Across all strategies</span>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon" style={{ background: 'linear-gradient(135deg, #43e97b22, #43e97b44)' }}>
                <DollarSign size={24} style={{ color: '#43e97b' }} />
              </div>
              <div className="info-content">
                <p>USDC Balance</p>
                <h3>${parseFloat(usdcBalance).toLocaleString()}</h3>
                <span>Available to deposit</span>
              </div>
            </div>

            <div className="feature-box">
              <Shield size={20} />
              <div>
                <h4>Principal Protected</h4>
                <p>Only yield is donated. Your deposit is always safe and withdrawable.</p>
              </div>
            </div>

            <div className="feature-box">
              <TrendingUp size={20} />
              <div>
                <h4>Multi-Strategy Yield</h4>
                <p>Automatically optimized across Aave, Spark, and Yearn/Kalani.</p>
              </div>
            </div>
          </motion.div>

          {/* Main Action Card */}
          <motion.div
            className="action-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="tab-buttons">
              <button
                className={`tab-button ${activeTab === 'deposit' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('deposit');
                  setAmount('');
                  setError('');
                }}
              >
                <ArrowDown size={18} />
                Deposit
              </button>
              <button
                className={`tab-button ${activeTab === 'withdraw' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('withdraw');
                  setAmount('');
                  setError('');
                }}
              >
                <ArrowUp size={18} />
                Withdraw
              </button>
            </div>

            <div className="input-section">
              <label>Amount (USDC)</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError('');
                  }}
                  disabled={!isConnected || loading}
                />
                <button className="max-button" onClick={setMaxAmount} disabled={!isConnected || loading}>
                  MAX
                </button>
              </div>
              <div className="balance-info">
                <span>
                  Available: ${activeTab === 'deposit' ? usdcBalance : userBalance}
                </span>
              </div>
            </div>

            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}

            <AnimatePresence>
              {txStatus && (
                <motion.div
                  className={`tx-status ${txStatus}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  {txStatus === 'pending' && (
                    <>
                      <Loader size={18} className="spinner" />
                      <span>Transaction pending...</span>
                    </>
                  )}
                  {txStatus === 'success' && (
                    <>
                      <CheckCircle size={18} />
                      <span>Transaction successful!</span>
                    </>
                  )}
                  {txStatus === 'error' && (
                    <>
                      <AlertCircle size={18} />
                      <span>Transaction failed</span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              className="action-button"
              onClick={activeTab === 'deposit' ? handleDeposit : handleWithdraw}
              disabled={!isConnected || loading || !amount}
            >
              {!isConnected ? (
                'Connect Wallet'
              ) : loading ? (
                <>
                  <Loader size={18} className="spinner" />
                  Processing...
                </>
              ) : activeTab === 'deposit' ? (
                <>
                  <ArrowDown size={18} />
                  Deposit USDC
                </>
              ) : (
                <>
                  <ArrowUp size={18} />
                  Withdraw USDC
                </>
              )}
            </button>

            <button
              className="report-button"
              onClick={handleReportYield}
              disabled={!isConnected || loading}
            >
              <TrendingUp size={18} />
              Report Yield (Admin)
            </button>

            <div className="info-banner">
              <Info size={16} />
              <p>
                {activeTab === 'deposit'
                  ? 'Your funds will be split optimally across Aave, Spark, and Kalani strategies. Yield is automatically donated to public goods.'
                  : 'Withdraw your principal anytime. Only accrued yield goes to funding public goods.'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VaultSection;
