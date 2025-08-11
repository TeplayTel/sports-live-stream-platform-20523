import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import VideoPlayer from './components/VideoPlayer';
import AnalyticsPanel from './components/AnalyticsPanel';
import MatchInfoSection from './components/MatchInfoSection';
import './App.css';
import { useUser, MOCK_USER } from './UserContext';

// PUBLIC_INTERFACE
function App() {
  const [viewerCount, setViewerCount] = useState(12847);
  const [isLoading, setIsLoading] = useState(true);
  const [theme] = useState('dark');

  // Attach global window.mockUser for API services
  const { user } = useUser(); // always call hooks unconditionally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.mockUser = user || MOCK_USER;
    }
  }, [user]);

  // Set page/document title
  useEffect(() => {
    document.title = 'Fan Engagement Live';
  }, []);

  // Simulate real-time viewer count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 200) - 100; // -100 to +100
        const newCount = Math.max(1000, prev + change);
        return newCount;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // App loading screen (just for show, transition to loaded)
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const LoadingScreen = () => (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          {/* Remove violet/purple bg from loading logo, use border only */}
          <div className="w-20 h-20 bg-transparent border-2 border-border-color rounded-2xl flex items-center justify-center mx-auto shadow">
            <span className="text-3xl" aria-label="Fan Engagement Live" title="Fan Engagement Live">🏟️</span>
          </div>
          {/* Remove gradient overlay */}
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">
            Fan Engagement Live
          </h2>
          <p className="text-text-secondary">Loading your interactive sports experience...</p>
        </div>
        <div className="flex space-x-1 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-accent-red rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`min-h-screen bg-primary-bg text-text-primary font-primary ${theme}`}>
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-red/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-purple/3 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <Header viewerCount={viewerCount} />

      {/* Main Content */}
      <div className="pt-16 relative z-10">
        {/* Video/Analytics Section */}
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Video Area */}
            <div className="lg:col-span-8 space-y-6">
              <div className="slide-in-left">
                <VideoPlayer
                  currentMatch={{
                    matchId: "123",
                    homeTeam: 'Home', homeScore: 0, awayTeam: 'Away', awayScore: 0,
                    status: 'LIVE', time: "67'", competition: 'Fan Event',
                    homeLogo: "",
                    awayLogo: ""
                  }}
                  user={user}
                />
                {/* Premium compact MatchInfoSection: Netflix-inspired */}
                <MatchInfoSection match={{
                  homeTeam: 'Home',
                  homeScore: 0,
                  awayTeam: 'Away',
                  awayScore: 0,
                  status: 'LIVE',
                  time: "67'",
                  competition: 'Fan Event',
                  homeLogo: "",
                  awayLogo: ""
                }} />
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4">
              <div className="slide-in-right">
                <AnalyticsPanel />
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer className="mt-16 bg-secondary-bg/90 border-t border-border-color glass-morphism shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 md:gap-20">
              {/* Brand and Mission */}
              <div className="flex flex-col items-center md:items-start md:w-1/2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-11 h-11 bg-transparent border border-border-color rounded-xl flex items-center justify-center shadow">
                    <span className="text-white font-bold text-2xl" aria-label="Fan Engagement Live" title="Fan Engagement Live">🏟️</span>
                  </div>
                  <span>
                    <h3 className="text-2xl font-bold text-white leading-snug">Fan Engagement Live</h3>
                    <p className="text-sm text-text-muted leading-tight">Where Fans & Sports Connect — Instantly</p>
                  </span>
                </div>
                <p className="text-text-secondary text-base leading-relaxed font-medium max-w-md pt-2">
                  Your modern platform for interactive sports — Join streams, react live, and amplify your fan voice. Made for the next generation of engagement.
                </p>
              </div>
              {/* Navigation/Links */}
              <div className="flex flex-col items-center md:items-end gap-6">
                <nav className="flex flex-col md:items-end gap-2 text-text-muted text-sm font-semibold">
                  <a href="#" className="hover:text-accent-blue transition-colors">Home</a>
                  <a href="#" className="hover:text-accent-blue transition-colors">Upcoming Events</a>
                  <a href="#" className="hover:text-accent-blue transition-colors">Highlights</a>
                  <a href="#" className="hover:text-accent-blue transition-colors">Contact</a>
                  <a href="#" className="hover:text-accent-blue transition-colors">Support</a>
                </nav>
                {/* Social Media Icons */}
                <div className="flex items-center space-x-4 mt-3">
                  <a href="https://twitter.com/" className="text-text-muted hover:text-accent-blue transition-colors" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.534C19.23 3.116 18.1 2.55 17 2.55c-2.19 0-3.98 1.726-3.98 3.857 0 .302.03.597.09.877-3.31-.165-6.243-1.68-8.201-4.006-.363.605-.57 1.31-.57 2.063 0 1.425.781 2.68 1.973 3.417A3.92 3.92 0 012 6.74v.052c0 1.99 1.496 3.654 3.482 4.029A4.078 4.078 0 012 11.1c.26.75.988 1.3 1.86 1.317A8.273 8.273 0 013 13.12c-1.06.693-2.42 1.102-3.94.914C1.65 15.136 3.62 15.7 5.66 15.7c8.45 0 13.078-6.698 13.078-12.515 0-.19-.004-.376-.013-.562A9.14 9.14 0 0023 3z" fill="currentColor"/></svg>
                  </a>
                  <a href="https://facebook.com/" className="text-text-muted hover:text-accent-blue transition-colors" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5.018 3.676 9.157 8.438 9.877v-6.987H7.898v-2.89h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.634.772-1.634 1.562v1.904h2.773l-.443 2.89h-2.33v6.986C18.324 21.157 22 17.018 22 12z" fill="currentColor"/></svg>
                  </a>
                  <a href="https://youtube.com/" className="text-text-muted hover:text-accent-blue transition-colors" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M21.8 8.001A2.828 2.828 0 0020.045 6.2C18.249 5.6 12 5.6 12 5.6s-6.247 0-8.045.601A2.828 2.828 0 002.2 8.001C1.6 9.798 1.6 12.001 1.6 12.001s0 2.204.601 4.001A2.829 2.829 0 003.955 17.8c1.798.6 8.045.6 8.045.6s6.249 0 8.045-.6a2.828 2.828 0 001.755-1.8C22.4 14.205 22.4 12 22.4 12s0-2.204-.6-4.001zM9.75 15.101V8.901l6.389 3.1-6.389 3.1z" fill="currentColor"/></svg>
                  </a>
                </div>
              </div>
            </div>
            {/* Divider */}
            <div className="border-t border-border-color mt-10 pt-5 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-text-muted text-sm">
                © 2024 Fan Engagement Live. Made with <span className="text-accent-red">♥</span> for sports fans everywhere.
              </p>
              <div className="flex items-center space-x-6 mt-4 sm:mt-0">
                <a href="#" className="text-text-muted hover:text-accent-blue transition-colors">Privacy Policy</a>
                <a href="#" className="text-text-muted hover:text-accent-blue transition-colors">Terms of Use</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
