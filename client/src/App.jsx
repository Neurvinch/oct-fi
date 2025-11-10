import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import VaultSection from './components/VaultSection';
import ProjectsSection from './components/ProjectsSection';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Hero />
        <Dashboard />
        <VaultSection />
        <ProjectsSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
