import React, { useRef, useEffect, useState } from 'react';

// PUBLIC_INTERFACE
const VideoPlayer = ({ currentMatch }) => {
  const videoRef = useRef(null);
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState([]);
  const emojis = ['❤️', '😂', '😮', '👏', '🔥'];

  useEffect(() => {
    // Initialize Shaka Player
    const initPlayer = async () => {
      if (window.shaka && videoRef.current) {
        const player = new window.shaka.Player(videoRef.current);
        
        // For demo purposes, we'll use a sample stream
        // In production, this would be the actual live stream URL
        try {
          // await player.load('https://demo-stream-url.m3u8');
          console.log('Shaka Player initialized with player instance:', player);
        } catch (error) {
          console.error('Error loading stream:', error);
        }
      }
    };

    // Load Shaka Player script
    if (!window.shaka) {
      const script = document.createElement('script');
      script.src = '/node_modules/shaka-player/dist/shaka-player.compiled.js';
      script.onload = initPlayer;
      document.head.appendChild(script);
    } else {
      initPlayer();
    }
  }, []);

  const handleEmojiReaction = (emoji) => {
    const newReaction = {
      id: Date.now(),
      emoji,
      x: Math.random() * 80 + 10, // Random position 10-90%
      y: Math.random() * 80 + 10
    };
    
    setReactions(prev => [...prev, newReaction]);
    
    // Remove reaction after animation
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 3000);
  };

  return (
    <div className="relative bg-black rounded-md overflow-hidden shadow-level-2">
      {/* Live Indicator */}
      <div className="absolute top-4 left-4 z-20 bg-accent-red text-white px-2 py-1 rounded-sm text-xs font-bold pulse-animation">
        LIVE
      </div>
      
      {/* Video Element */}
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          controls
          poster="/api/placeholder/800/450"
        >
          <source src="/api/placeholder/video" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Hover Overlay for Reactions */}
        <div 
          className="absolute inset-0 z-10"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          {/* Emoji Reactions */}
          {showReactions && (
            <div className="absolute bottom-4 right-4 flex space-x-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiReaction(emoji)}
                  className="bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2 text-xl transition-standard hover-scale"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
          
          {/* Floating Reactions */}
          {reactions.map((reaction) => (
            <div
              key={reaction.id}
              className="absolute text-2xl animate-bounce pointer-events-none"
              style={{
                left: `${reaction.x}%`,
                top: `${reaction.y}%`,
                animation: 'float 3s ease-out forwards'
              }}
            >
              {reaction.emoji}
            </div>
          ))}
        </div>
      </div>
      
      {/* Match Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <div className="flex items-center justify-between text-white">
          <div>
            <h3 className="text-lg font-bold">
              {currentMatch.homeTeam} vs {currentMatch.awayTeam}
            </h3>
            <p className="text-sm text-gray-300">{currentMatch.competition}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold">
              {currentMatch.homeScore} - {currentMatch.awayScore}
            </div>
            <div className="text-sm text-gray-300">{currentMatch.time}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// CSS for floating animation
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    50% {
      transform: translateY(-50px) scale(1.2);
      opacity: 0.8;
    }
    100% {
      transform: translateY(-100px) scale(0.8);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

export default VideoPlayer;
