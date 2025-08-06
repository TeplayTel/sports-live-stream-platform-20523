import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
const Header = ({ viewerCount, apiConnected, apiError }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-primary-bg/95 backdrop-blur-lg border-b border-border-color shadow-lg' 
        : 'bg-primary-bg border-b border-border-color'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <div className="absolute inset-0 bg-gradient-primary rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              SportsStream
            </h1>
            <p className="text-xs text-text-muted">Live Sports Hub</p>
          </div>
        </div>
        

        
        {/* Right Section - Simplified */}
        <div className="flex items-center space-x-4">
          {/* API Status Indicator */}
          <div className="hidden md:flex items-center space-x-2 bg-secondary-bg rounded-lg px-3 py-2">
            <div className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-accent-green' : 'bg-red-500'} ${apiConnected ? 'bounce-subtle' : 'animate-pulse'}`}></div>
            <span className="text-xs text-text-muted">
              {apiConnected ? 'Live' : 'Offline'}
            </span>
          </div>

          {/* Viewer Count */}
          <div className="hidden sm:flex items-center space-x-2 bg-secondary-bg rounded-lg px-4 py-2 hover-glow-blue transition-all duration-300">
            <div className="w-2 h-2 bg-accent-green rounded-full bounce-subtle"></div>
            <span className="text-sm text-text-secondary font-medium">
              <span className="text-accent-green font-bold">
                {viewerCount.toLocaleString()}
              </span>
              <span className="ml-1">watching</span>
            </span>
          </div>

          {/* Search */}
          <button className="p-2 bg-secondary-bg hover:bg-hover-bg rounded-lg transition-all duration-200 hover-scale group">
            <svg className="w-5 h-5 text-text-secondary group-hover:text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {/* User Profile */}
          <div className="relative group">
            <button className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center text-sm font-bold text-white hover-scale transition-all duration-200 hover-glow">
              U
            </button>
            <div className="absolute inset-0 bg-gradient-accent rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
