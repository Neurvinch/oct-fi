import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Twitter, Github, MessageCircle, ExternalLink } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <motion.div
          className="footer-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="footer-section">
            <div className="footer-logo">
              <Zap size={28} />
              <h3>YieldForge</h3>
            </div>
            <p className="footer-description">
              The all-in-one public goods funding engine for DeFi. 
              Deposit stablecoins, earn yield, and support public goods—all while keeping your principal safe.
            </p>
            <div className="social-links">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter size={20} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github size={20} />
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="#dashboard">Dashboard</a></li>
              <li><a href="#vault">Vault</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="#docs">Documentation</a></li>
              <li><a href="#whitepaper">Whitepaper</a></li>
              <li><a href="#github">GitHub</a></li>
              <li><a href="#audit">Security Audit</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Community</h4>
            <ul>
              <li><a href="#discord">Discord</a></li>
              <li><a href="#forum">Forum</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#grants">Grants Program</a></li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>&copy; 2025 YieldForge. Built with ❤️ for public goods.</p>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#contact">Contact</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
