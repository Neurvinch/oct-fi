import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Users, Zap } from 'lucide-react';
import './Header.css';

const Header = () => {
  return (
    <motion.header 
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="header-container">
        <div className="logo-section">
          <div className="logo-icon">
            <Zap size={32} />
          </div>
          <h1 className="logo-text">YieldForge</h1>
          <span className="logo-subtitle">Public Goods Funding</span>
        </div>

        <nav className="nav-menu">
          <a href="#dashboard" className="nav-item">
            <TrendingUp size={18} />
            <span>Dashboard</span>
          </a>
          <a href="#vault" className="nav-item">
            <Wallet size={18} />
            <span>Vault</span>
          </a>
          <a href="#projects" className="nav-item">
            <Users size={18} />
            <span>Projects</span>
          </a>
        </nav>

        <div className="connect-section">
          <ConnectButton 
            chainStatus="icon"
            showBalance={true}
          />
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
