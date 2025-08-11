import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
const Header = ({ viewerCount }) => {
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
            {/* Replacing violet/purple gradient with transparent bg for logo box */}
            <div className="w-10 h-10 bg-transparent rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 border border-border-color shadow">
              <span className="text-white font-bold text-lg" aria-label="Fan Engagement Live" title="Fan Engagement Live">🏟️</span>
            </div>
            {/* Remove purple/violet overlay */}
            {/* <div className="absolute inset-0 bg-gradient-primary rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div> */}
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-white">
              Fan Engagement Live
            </h1>
            <p className="text-xs text-text-muted">Engage with Sports, Live!</p>
          </div>
        </div>
        

        
        {/* Right Section - Simplified */}
        <div className="flex items-center space-x-4">
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

          {/* (Search button removed as part of 'Remove Search Feature' task) */}
          
          {/* User Profile */}
          <div className="relative group">
            <button
              className="w-10 h-10 bg-gradient-accent rounded-full outline-none shadow-lg flex items-center justify-center text-xl font-bold text-white hover-scale hover-glow transition-all duration-200 focus:ring-2 focus:ring-accent-blue"
              aria-label="User profile"
              style={{
                fontFamily: 'Inter, sans-serif',
                letterSpacing: 0.8,
                border: "2.5px solid #f5576c90",
                boxShadow: "0 0 14px #f5576c44"
              }}
              tabIndex={0}
            >
              <svg width="25" height="25" fill="none" aria-hidden="true" viewBox="0 0 25 25">
                <circle cx="12.5" cy="8.5" r="5.5" fill="#fff" fillOpacity="0.9" />
                <ellipse cx="12.5" cy="18" rx="8.5" ry="6" fill="#fff" fillOpacity="0.6" />
              </svg>
            </button>
            {/* Drop-down (future): <div>...</div> */}
            <div className="absolute inset-0 bg-gradient-accent rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
