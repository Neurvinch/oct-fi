import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Shield, TrendingUp, Users, Zap, CheckCircle } from 'lucide-react';
import { useAccount } from 'wagmi';
import './Hero.css';

const Hero = () => {
  const { isConnected } = useAccount();

  const scrollToVault = () => {
    document.getElementById('vault')?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: Shield,
      title: 'Principal Protected',
      description: 'Your deposits are always safe and withdrawable',
    },
    {
      icon: TrendingUp,
      title: 'Multi-Strategy Yield',
      description: 'Optimized across Aave, Spark, and Yearn',
    },
    {
      icon: Users,
      title: 'Quadratic Funding',
      description: 'Fair distribution empowering communities',
    },
    {
      icon: Zap,
      title: 'Auto Compounding',
      description: 'Maximize returns with automated strategies',
    },
  ];

  return (
    <div className="hero">
      <div className="hero-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Zap size={16} />
            <span>Powered by Octant V2</span>
          </motion.div>

          <h1 className="hero-title">
            Fund Public Goods
            <br />
            <span className="gradient-text">Without Losing Principal</span>
          </h1>

          <p className="hero-description">
            Deposit stablecoins, earn yield across top DeFi protocols, and automatically 
            support public goods through quadratic funding—all while keeping your principal 
            safe and withdrawable.
          </p>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="stat">
              <h3>$2.4M+</h3>
              <p>Total Value Locked</p>
            </div>
            <div className="stat">
              <h3>$186K+</h3>
              <p>Donated to Public Goods</p>
            </div>
            <div className="stat">
              <h3>847</h3>
              <p>Active Contributors</p>
            </div>
          </motion.div>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {isConnected ? (
              <button className="primary-btn" onClick={scrollToVault}>
                <TrendingUp size={20} />
                Start Earning
              </button>
            ) : (
              <button className="primary-btn" disabled>
                Connect Wallet to Start
              </button>
            )}
            <button className="secondary-btn" onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}>
              Learn More
              <ArrowDown size={20} />
            </button>
          </motion.div>

          <motion.div
            className="trust-indicators"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="indicator">
              <CheckCircle size={16} />
              <span>Audited by CertiK</span>
            </div>
            <div className="indicator">
              <CheckCircle size={16} />
              <span>Battle-tested Protocols</span>
            </div>
            <div className="indicator">
              <CheckCircle size={16} />
              <span>No Lock-ups</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-features"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="feature-icon">
                <feature.icon size={24} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
    </div>
  );
};

export default Hero;
