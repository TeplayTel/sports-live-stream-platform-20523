import React from 'react';
import PlayerWithEmojiBarOnly from './components/PlayerWithEmojiBarOnly';
import './App.css';

/**
 * PUBLIC_INTERFACE
 * App renders ONLY the minimal player surface that hosts the emoji bar on a blank background.
 * All other UI (headers, filters, sidebars, routes, etc.) has been removed per requirements.
 */
function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--primary-bg)', color: 'var(--text-primary)' }}>
      <div style={{ paddingTop: '48px' }}>
        <PlayerWithEmojiBarOnly />
      </div>
    </div>
  );
}

export default App;
