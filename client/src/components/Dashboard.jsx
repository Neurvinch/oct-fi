import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, Users, DollarSign, Activity, Award } from 'lucide-react';
import { useVaultContract } from '../hooks/useVaultContract';
import { useQFContract } from '../hooks/useQFContract';
import { useEthersProvider } from '../hooks/useEthersProvider';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const { address, isConnected } = useEthersProvider();
  const { getTVL, getUserBalance } = useVaultContract();
  const { getTotalMatchingPool } = useQFContract();

  const [stats, setStats] = useState({
    tvl: '0',
    userBalance: '0',
    totalYieldGenerated: '0',
    matchingPool: '0',
    projectsFunded: 0,
    activeUsers: 0,
  });

  const [loading, setLoading] = useState(true);

  // Mock data for charts - replace with real data from your contracts
  const yieldData = [
    { date: 'Jan', yield: 2400 },
    { date: 'Feb', yield: 3800 },
    { date: 'Mar', yield: 5200 },
    { date: 'Apr', yield: 7100 },
    { date: 'May', yield: 9800 },
    { date: 'Jun', yield: 12400 },
  ];

  const distributionData = [
    { name: 'QF Pool', value: 70, color: '#667eea' },
    { name: 'RetroPGF', value: 20, color: '#764ba2' },
    { name: 'Sustainability', value: 10, color: '#f093fb' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const tvl = await getTVL();
        const matchingPool = await getTotalMatchingPool();
        
        let userBalance = '0';
        if (isConnected && address) {
          userBalance = await getUserBalance(address);
        }

        setStats({
          tvl,
          userBalance,
          totalYieldGenerated: (parseFloat(tvl) * 0.08).toFixed(2), // Mock 8% yield
          matchingPool,
          projectsFunded: 12, // Mock data
          activeUsers: 847, // Mock data
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s

    return () => clearInterval(interval);
  }, [address, isConnected, getTVL, getUserBalance, getTotalMatchingPool]);

  const StatCard = ({ icon: Icon, title, value, subtitle, color, delay }) => (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="stat-icon" style={{ background: `linear-gradient(135deg, ${color}22, ${color}44)` }}>
        <Icon size={24} style={{ color }} />
      </div>
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">
          {loading ? (
            <div className="loading-skeleton" />
          ) : (
            value
          )}
        </h3>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </motion.div>
  );

  return (
    <div className="dashboard" id="dashboard">
      <div className="dashboard-container">
        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Dashboard Overview</h2>
          <p>Real-time metrics and impact statistics</p>
        </motion.div>

        <div className="stats-grid">
          <StatCard
            icon={DollarSign}
            title="Total Value Locked"
            value={`$${parseFloat(stats.tvl).toLocaleString()}`}
            subtitle="Across all strategies"
            color="#667eea"
            delay={0.1}
          />
          <StatCard
            icon={TrendingUp}
            title="Total Yield Generated"
            value={`$${parseFloat(stats.totalYieldGenerated).toLocaleString()}`}
            subtitle="All-time yield donated"
            color="#764ba2"
            delay={0.2}
          />
          <StatCard
            icon={Wallet}
            title="Your Balance"
            value={`$${parseFloat(stats.userBalance).toLocaleString()}`}
            subtitle="Protected principal"
            color="#f093fb"
            delay={0.3}
          />
          <StatCard
            icon={Award}
            title="Matching Pool"
            value={`$${parseFloat(stats.matchingPool).toLocaleString()}`}
            subtitle="Available for QF"
            color="#4facfe"
            delay={0.4}
          />
          <StatCard
            icon={Users}
            title="Projects Funded"
            value={stats.projectsFunded}
            subtitle="Active public goods"
            color="#43e97b"
            delay={0.5}
          />
          <StatCard
            icon={Activity}
            title="Active Users"
            value={stats.activeUsers}
            subtitle="Community members"
            color="#fa709a"
            delay={0.6}
          />
        </div>

        <div className="charts-grid">
          <motion.div
            className="chart-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <h3>Yield Generation Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={yieldData}>
                <defs>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#764ba2" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip 
                  contentStyle={{ 
                    background: '#1a1a1a', 
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="yield" 
                  stroke="#667eea" 
                  fillOpacity={1} 
                  fill="url(#colorYield)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="chart-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <h3>Yield Distribution</h3>
            <div className="distribution-chart">
              {distributionData.map((item, index) => (
                <motion.div
                  key={item.name}
                  className="distribution-item"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  <div className="distribution-bar">
                    <motion.div
                      className="distribution-fill"
                      style={{ background: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
                    />
                  </div>
                  <div className="distribution-label">
                    <span>{item.name}</span>
                    <strong>{item.value}%</strong>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="impact-banner"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Activity size={32} />
          <div>
            <h4>Your Impact</h4>
            <p>
              By depositing ${parseFloat(stats.userBalance).toFixed(2)}, you've helped fund{' '}
              <strong>public goods</strong> while keeping your principal safe.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
