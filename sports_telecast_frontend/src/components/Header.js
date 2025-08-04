import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
const Header = ({ currentMatch, viewerCount }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [notificationCount] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const notifications = [
    { id: 1, type: 'goal', message: 'GOAL! Arsenal 2-1 Chelsea', time: '2m ago' },
    { id: 2, type: 'card', message: 'Yellow card - N. Kante', time: '5m ago' },
    { id: 3, type: 'sub', message: 'Substitution - Liverpool', time: '8m ago' }
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'card': return '🟨';
      case 'sub': return '🔄';
      default: return '📢';
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-primary-bg/95 backdrop-blur-lg border-b border-border-color shadow-lg' 
        : 'bg-primary-bg border-b border-border-color'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-6">
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

          {/* Quick Nav */}
          <nav className="hidden lg:flex items-center space-x-1">
            {['Live', 'Highlights', 'Schedules', 'Stats'].map((item) => (
              <button
                key={item}
                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-hover-bg rounded-lg transition-all duration-200 hover-scale"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Current Match Info - Enhanced */}
        <div className="hidden md:flex items-center space-x-6 scale-in">
          <div className="glass-effect rounded-xl px-4 py-2 hover-lift">
            <div className="flex items-center space-x-4">
              {/* Team Display */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <div className="w-8 h-8 bg-accent-red rounded-full flex items-center justify-center text-xs font-bold transition-transform duration-200 hover:scale-110">
                      A
                    </div>
                    <div className="absolute inset-0 bg-accent-red rounded-full blur opacity-20"></div>
                  </div>
                  <span className="text-sm font-medium text-text-primary">{currentMatch.homeTeam}</span>
                </div>
                
                {/* Animated Score */}
                <div className="relative px-3 py-1 bg-secondary-bg rounded-lg">
                  <div className="font-mono text-lg font-bold text-text-primary">
                    <span className="inline-block transition-all duration-300 hover:scale-110">
                      {currentMatch.homeScore}
                    </span>
                    <span className="mx-2 text-text-muted">:</span>
                    <span className="inline-block transition-all duration-300 hover:scale-110">
                      {currentMatch.awayScore}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-text-primary">{currentMatch.awayTeam}</span>
                  <div className="relative">
                    <div className="w-8 h-8 bg-accent-blue rounded-full flex items-center justify-center text-xs font-bold transition-transform duration-200 hover:scale-110">
                      C
                    </div>
                    <div className="absolute inset-0 bg-accent-blue rounded-full blur opacity-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Match Status */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="bg-accent-red text-white px-3 py-1 rounded-full text-xs font-bold pulse-glow">
                {currentMatch.status}
              </div>
            </div>
            <span className="text-xs text-text-secondary font-mono">{currentMatch.time}</span>
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Viewer Count with Animation */}
          <div className="hidden sm:flex items-center space-x-2 bg-secondary-bg rounded-lg px-3 py-2 hover-glow-blue transition-all duration-300">
            <div className="w-2 h-2 bg-accent-green rounded-full bounce-subtle"></div>
            <span className="text-sm text-text-secondary font-medium">
              <span className="text-accent-green font-bold">
                {viewerCount.toLocaleString()}
              </span>
              <span className="ml-1">watching</span>
            </span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 bg-secondary-bg hover:bg-hover-bg rounded-lg transition-all duration-200 hover-scale group"
            >
              <svg className="w-5 h-5 text-text-secondary group-hover:text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 18.5A2.5 2.5 0 1 0 9.5 16H12v2.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z" />
              </svg>
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-red text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
                  {notificationCount}
                </div>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-secondary-bg border border-border-color rounded-xl shadow-xl overflow-hidden slide-in-right">
                <div className="p-4 border-b border-border-color">
                  <h3 className="font-bold text-text-primary">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-4 hover:bg-hover-bg transition-colors duration-200 border-b border-border-color last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <div className="text-lg">{getNotificationIcon(notif.type)}</div>
                        <div className="flex-1">
                          <p className="text-sm text-text-primary">{notif.message}</p>
                          <p className="text-xs text-text-muted mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <button className="p-2 bg-secondary-bg hover:bg-hover-bg rounded-lg transition-all duration-200 hover-scale group">
            <svg className="w-5 h-5 text-text-secondary group-hover:text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {/* User Profile */}
          <div className="relative group">
            <button className="w-10 h-10 bg-gradient-accent rounded-full flex items-center justify-center text-sm font-bold text-white hover-scale transition-all duration-200 hover-glow">
              U
            </button>
            <div className="absolute inset-0 bg-gradient-accent rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>

      {/* Mobile Match Info */}
      <div className="md:hidden px-4 pb-2">
        <div className="flex items-center justify-between bg-secondary-bg rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-accent-red rounded-full flex items-center justify-center text-xs font-bold">A</div>
            <span className="text-sm">{currentMatch.homeTeam}</span>
          </div>
          <div className="font-mono font-bold">{currentMatch.homeScore} : {currentMatch.awayScore}</div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">{currentMatch.awayTeam}</span>
            <div className="w-6 h-6 bg-accent-blue rounded-full flex items-center justify-center text-xs font-bold">C</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
