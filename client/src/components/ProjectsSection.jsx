import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Users, DollarSign, TrendingUp, Search, 
  Filter, CheckCircle, AlertCircle, Loader, Award,
  ExternalLink
} from 'lucide-react';
import { useQFContract } from '../hooks/useQFContract';
import { useEthersProvider } from '../hooks/useEthersProvider';
import './ProjectsSection.css';

const ProjectsSection = () => {
  const { address, isConnected } = useEthersProvider();
  const { getAllProjects, contribute, vote, getTotalMatchingPool } = useQFContract();

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [matchingPool, setMatchingPool] = useState('0');
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [contributeAmount, setContributeAmount] = useState('');
  const [txStatus, setTxStatus] = useState(null);
  const [error, setError] = useState('');

  // Mock categories - extend based on your needs
  const categories = [
    { id: 'all', name: 'All Projects', icon: Users },
    { id: 'opensource', name: 'Open Source', icon: TrendingUp },
    { id: 'research', name: 'Research', icon: Award },
    { id: 'education', name: 'Education', icon: Users },
  ];

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterProjects();
  }, [searchTerm, filterCategory, projects]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const [allProjects, poolAmount] = await Promise.all([
        getAllProjects(),
        getTotalMatchingPool(),
      ]);
      
      setProjects(allProjects);
      setFilteredProjects(allProjects);
      setMatchingPool(poolAmount);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      // Add your category filtering logic here
      // For now, showing all projects
    }

    setFilteredProjects(filtered);
  };

  const handleContribute = async (projectId) => {
    if (!contributeAmount || parseFloat(contributeAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setTxStatus('pending');
    setError('');

    try {
      await contribute(projectId, contributeAmount);
      setTxStatus('success');
      setContributeAmount('');
      setSelectedProject(null);
      await fetchProjects();
    } catch (error) {
      console.error('Contribute error:', error);
      setError(error.message || 'Transaction failed');
      setTxStatus('error');
    } finally {
      setTimeout(() => setTxStatus(null), 5000);
    }
  };

  const handleVote = async (projectId) => {
    setTxStatus('pending');
    setError('');

    try {
      await vote(projectId);
      setTxStatus('success');
      await fetchProjects();
    } catch (error) {
      console.error('Vote error:', error);
      setError(error.message || 'Transaction failed');
      setTxStatus('error');
    } finally {
      setTimeout(() => setTxStatus(null), 5000);
    }
  };

  const calculateMatchingEstimate = (contributions, contributors) => {
    // Simplified quadratic matching formula
    const sqrtSum = Math.sqrt(parseFloat(contributions) || 0);
    const matchingMultiplier = parseFloat(matchingPool) / (filteredProjects.length || 1);
    return (sqrtSum * matchingMultiplier * 0.5).toFixed(2);
  };

  return (
    <div className="projects-section" id="projects">
      <div className="projects-container">
        <motion.div
          className="projects-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2>Public Goods Projects</h2>
          <p>Support impactful projects with quadratic funding—every contribution matters</p>
        </motion.div>

        {/* Matching Pool Banner */}
        <motion.div
          className="matching-banner"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Award size={32} />
          <div>
            <h3>Total Matching Pool</h3>
            <p className="matching-amount">${parseFloat(matchingPool).toLocaleString()}</p>
            <span>Available for quadratic matching</span>
          </div>
          <div className="matching-info">
            <p>🎯 Many small contributions = More matching funds!</p>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          className="search-filter-bar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-btn ${filterCategory === cat.id ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat.id)}
              >
                <cat.icon size={16} />
                {cat.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Status Messages */}
        <AnimatePresence>
          {txStatus && (
            <motion.div
              className={`tx-status ${txStatus}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
                  <span>{error || 'Transaction failed'}</span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Projects Grid */}
        {loading ? (
          <div className="loading-state">
            <Loader size={48} className="spinner" />
            <p>Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <h3>No projects found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="projects-grid">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                className="project-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="project-header">
                  <h3>{project.name}</h3>
                  <span className={`status-badge ${project.active ? 'active' : 'inactive'}`}>
                    {project.active ? 'Active' : 'Closed'}
                  </span>
                </div>

                <p className="project-description">{project.description}</p>

                <div className="project-stats">
                  <div className="stat">
                    <DollarSign size={18} />
                    <div>
                      <span className="stat-label">Raised</span>
                      <strong>${parseFloat(project.totalContributions).toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="stat">
                    <Users size={18} />
                    <div>
                      <span className="stat-label">Contributors</span>
                      <strong>{project.contributorCount}</strong>
                    </div>
                  </div>

                  <div className="stat">
                    <Heart size={18} />
                    <div>
                      <span className="stat-label">Votes</span>
                      <strong>{project.votes}</strong>
                    </div>
                  </div>
                </div>

                <div className="matching-estimate">
                  <TrendingUp size={16} />
                  <span>
                    Est. Matching: ${calculateMatchingEstimate(
                      project.totalContributions,
                      project.contributorCount
                    )}
                  </span>
                </div>

                <div className="project-actions">
                  <button
                    className="vote-btn"
                    onClick={() => handleVote(project.id)}
                    disabled={!isConnected || !project.active}
                  >
                    <Heart size={16} />
                    Vote
                  </button>

                  <button
                    className="contribute-btn"
                    onClick={() => setSelectedProject(project)}
                    disabled={!isConnected || !project.active}
                  >
                    <DollarSign size={16} />
                    Contribute
                  </button>
                </div>

                <a
                  href={`https://etherscan.io/address/${project.recipient}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="recipient-link"
                >
                  <ExternalLink size={14} />
                  View Recipient
                </a>
              </motion.div>
            ))}
          </div>
        )}

        {/* Contribute Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                className="modal-content"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3>Contribute to {selectedProject.name}</h3>
                <p className="modal-description">{selectedProject.description}</p>

                <div className="modal-input">
                  <label>Amount (USDC)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={contributeAmount}
                    onChange={(e) => {
                      setContributeAmount(e.target.value);
                      setError('');
                    }}
                  />
                </div>

                {error && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    className="cancel-btn"
                    onClick={() => setSelectedProject(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="confirm-btn"
                    onClick={() => handleContribute(selectedProject.id)}
                    disabled={!contributeAmount || parseFloat(contributeAmount) <= 0}
                  >
                    <DollarSign size={16} />
                    Contribute
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProjectsSection;
