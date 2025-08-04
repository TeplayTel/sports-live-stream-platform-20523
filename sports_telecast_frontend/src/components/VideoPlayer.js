import React, { useRef, useEffect, useState } from 'react';

// PUBLIC_INTERFACE
const VideoPlayer = ({ currentMatch }) => {
  /**
   * Enhanced video player component with sleek emoji reactions and real-time global count
   * Features dummy video URL, hover-activated emoji bar, flying animations, and websocket reactions
   */
  const videoRef = useRef(null);
  const wsRef = useRef(null);
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [flyingReactions, setFlyingReactions] = useState([]);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [quality, setQuality] = useState('HD');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [globalReactionCount, setGlobalReactionCount] = useState(2847);
  const [emojiCounts, setEmojiCounts] = useState({
    love: 342,
    laugh: 128,
    wow: 89,
    clap: 205,
    fire: 167,
    soccer: 95
  });
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(null);
  
  const emojis = [
    { emoji: '❤️', color: '#ff1744', name: 'love' },
    { emoji: '😂', color: '#ffeb3b', name: 'laugh' },
    { emoji: '😮', color: '#2196f3', name: 'wow' },
    { emoji: '👏', color: '#4caf50', name: 'clap' },
    { emoji: '🔥', color: '#ff5722', name: 'fire' },
    { emoji: '⚽', color: '#ffffff', name: 'soccer' }
  ];

  // Dummy video URL for testing
  const dummyVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  
  const qualityOptions = ['4K', 'HD', '720p', '480p', 'Auto'];

  // Mock WebSocket for real-time reaction updates
  useEffect(() => {
    // Simulate WebSocket connection
    const connectWebSocket = () => {
      console.log('Connecting to mock WebSocket for reactions...');
      
      // Simulate incoming reaction updates
      const interval = setInterval(() => {
        const randomChange = Math.floor(Math.random() * 10) - 5; // -5 to +5
        setGlobalReactionCount(prev => Math.max(0, prev + randomChange));
      }, 3000);

      // Store cleanup function
      wsRef.current = () => clearInterval(interval);
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current();
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = (e) => {
      console.error('Video error:', e);
      setIsPlaying(false);
      setVideoError('Failed to load video. Please try again.');
      setIsVideoLoading(false);
    };
    const handleLoadStart = () => {
      console.log('Video loading started');
      setIsVideoLoading(true);
      setVideoError(null);
    };
    const handleCanPlay = () => {
      setIsVideoLoading(false);
      setVideoError(null);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);

    // Auto-hide controls with improved logic
    let controlsTimeout;
    const resetControlsTimeout = () => {
      clearTimeout(controlsTimeout);
      setShowControls(true);
      if (isPlaying) {
        controlsTimeout = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const handleMouseMove = (e) => {
      // Only reset if mouse is over video area, not emoji bar
      const rect = video.getBoundingClientRect();
      const isOverVideo = e.clientX >= rect.left && e.clientX <= rect.right && 
                         e.clientY >= rect.top && e.clientY <= rect.bottom - 100; // Exclude bottom 100px for emoji bar
      if (isOverVideo) {
        resetControlsTimeout();
      }
    };

    video.addEventListener('mousemove', handleMouseMove);
    video.addEventListener('click', resetControlsTimeout);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('mousemove', handleMouseMove);
      video.removeEventListener('click', resetControlsTimeout);
      clearTimeout(controlsTimeout);
    };
  }, [isPlaying]);

  const handleEmojiReaction = (emojiData) => {
    // Create multiple flying emoji for more dramatic effect
    const numFlying = Math.random() > 0.7 ? 2 : 1; // 30% chance for double emoji
    
    for (let i = 0; i < numFlying; i++) {
      const newFlyingReaction = {
        id: Date.now() + Math.random() + i,
        emoji: emojiData.emoji,
        color: emojiData.color,
        x: Math.random() * 60 + 20, // 20-80% from left
        y: Math.random() * 40 + 35, // 35-75% from top
        rotation: Math.random() * 360,
        scale: 0.9 + Math.random() * 0.6, // 0.9-1.5 scale
        delay: i * 100 // Stagger multiple emojis
      };
      
      setTimeout(() => {
        setFlyingReactions(prev => [...prev, newFlyingReaction]);
      }, newFlyingReaction.delay);
    }
    
    // Update individual emoji count with animation
    setEmojiCounts(prev => ({
      ...prev,
      [emojiData.name]: prev[emojiData.name] + 1
    }));
    
    // Update global count (simulate websocket)
    setGlobalReactionCount(prev => prev + 1);
    
    // Remove flying emoji after animation
    setTimeout(() => {
      setFlyingReactions(prev => prev.filter(r => 
        !r.id.toString().startsWith(Date.now().toString().slice(0, -3))
      ));
    }, 4000);

    // Add haptic feedback for mobile devices
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    // Log reaction for mock websocket
    console.log(`Reaction sent: ${emojiData.name} - Global count: ${globalReactionCount + 1}`);
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * duration;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const toggleFullscreen = () => {
    const container = videoRef.current.parentElement;
    if (!document.fullscreenElement) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative bg-black rounded-xl overflow-hidden shadow-xl hover-lift group">
      {/* Video Element */}
      <div 
        className="relative aspect-video group"
        onMouseEnter={() => setShowEmojiBar(true)}
        onMouseLeave={() => setShowEmojiBar(false)}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster="https://via.placeholder.com/800x450/1a1a1a/ffffff?text=Sports+Stream"
          autoPlay
          muted
          loop
        >
          <source src={dummyVideoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Loading Overlay */}
        {isVideoLoading && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
              <p className="text-white text-lg font-medium">Loading stream...</p>
            </div>
          </div>
        )}
        
        {/* Error Overlay */}
        {videoError && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-20">
            <div className="text-center space-y-4 max-w-md px-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white text-xl font-bold mb-2">Stream Error</h3>
                <p className="text-white/80 text-sm">{videoError}</p>
              </div>
              <button 
                onClick={() => {
                  setVideoError(null);
                  setIsVideoLoading(true);
                  videoRef.current?.load();
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        {/* Flying Emoji Animations */}
        {flyingReactions.map((reaction) => (
          <div
            key={reaction.id}
            className="absolute pointer-events-none z-30"
            style={{
              left: `${reaction.x}%`,
              top: `${reaction.y}%`,
              color: reaction.color,
              fontSize: '2rem',
              transform: `rotate(${reaction.rotation}deg) scale(${reaction.scale})`,
              animation: 'emoji-fly 3s ease-out forwards',
              textShadow: '0 0 20px currentColor, 0 0 40px currentColor',
              filter: 'drop-shadow(0 0 10px currentColor)'
            }}
          >
            {reaction.emoji}
          </div>
        ))}

        {/* Enhanced Emoji Reaction Bar with Modern Design */}
        <div 
          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-out ${
            showEmojiBar ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ 
            bottom: '90px',
            zIndex: 40,
            pointerEvents: showEmojiBar ? 'auto' : 'none'
          }}
          onMouseEnter={() => setShowEmojiBar(true)}
          onMouseLeave={() => setShowEmojiBar(false)}
        >
          <div 
            className="bg-gradient-to-r from-black/80 via-black/90 to-black/80 backdrop-blur-lg border border-white/20 shadow-2xl"
            style={{ 
              borderRadius: '20px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(30,30,30,0.95) 50%, rgba(0,0,0,0.9) 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)'
            }}
          >
            <div className="flex items-center gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiReaction(emoji)}
                  className="group relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 hover:bg-white/15 active:scale-90 hover:scale-105"
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    minHeight: '60px',
                    minWidth: '50px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                  title={`React with ${emoji.name}`}
                  aria-label={`React with ${emoji.name}, current count: ${emojiCounts[emoji.name]}`}
                >
                  {/* Emoji with enhanced glow */}
                  <div 
                    className="relative transition-all duration-300 group-hover:scale-125"
                    style={{ 
                      fontSize: '28px',
                      lineHeight: '1',
                      filter: `drop-shadow(0 0 12px ${emoji.color}60) drop-shadow(0 0 24px ${emoji.color}30)`,
                      textShadow: `0 0 20px ${emoji.color}80`
                    }}
                  >
                    {emoji.emoji}
                    
                    {/* Pulsing ring effect on hover */}
                    <div 
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
                      style={{ 
                        background: `radial-gradient(circle, ${emoji.color}20 0%, transparent 70%)`,
                        animation: 'pulse 1.5s infinite',
                        transform: 'scale(1.5)'
                      }}
                    />
                  </div>
                  
                  {/* Count with modern styling */}
                  <span 
                    className="text-white font-bold transition-all duration-300 group-hover:text-yellow-300"
                    style={{ 
                      fontSize: '12px',
                      fontWeight: '600',
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
                      background: 'linear-gradient(45deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {emojiCounts[emoji.name]}
                  </span>
                  
                  {/* Enhanced hover glow effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-all duration-300 rounded-xl"
                    style={{ 
                      background: `linear-gradient(135deg, ${emoji.color}30 0%, transparent 50%, ${emoji.color}20 100%)`,
                      filter: 'blur(1px)'
                    }}
                  />
                  
                  {/* Ripple effect on click */}
                  <div 
                    className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-100 transition-opacity duration-150"
                    style={{ 
                      background: `radial-gradient(circle, ${emoji.color}40 0%, transparent 70%)`,
                      animation: 'ping 0.5s cubic-bezier(0, 0, 0.2, 1)'
                    }}
                  />
                </button>
              ))}
              
              {/* Enhanced Total Reaction Count */}
              <div className="flex flex-col items-center gap-1 ml-4 pl-4 border-l-2 border-gradient-to-b from-white/30 to-white/10">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full animate-pulse"
                    style={{ 
                      background: 'linear-gradient(45deg, #4ade80, #22c55e)',
                      boxShadow: '0 0 10px #22c55e50'
                    }}
                  />
                  <span 
                    className="font-bold"
                    style={{ 
                      fontSize: '16px',
                      fontWeight: '700',
                      background: 'linear-gradient(45deg, #ffffff, #e5e7eb)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    {globalReactionCount.toLocaleString()}
                  </span>
                </div>
                <span 
                  className="text-white/70"
                  style={{ 
                    fontSize: '10px',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  reactions
                </span>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div 
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/40 rounded-full"
              style={{ boxShadow: '0 0 10px rgba(255,255,255,0.5)' }}
            />
          </div>
        </div>

        {/* Video Player Controls Container */}
        <div className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">

            {/* Progress Bar / Seekbar */}
            <div className="mb-4">
              <div 
                className="h-1 bg-white/20 cursor-pointer hover:h-2 transition-all duration-200"
                onClick={handleSeek}
                style={{ borderRadius: '8px' }}
              >
                <div 
                  className="h-full bg-gradient-primary relative"
                  style={{ 
                    width: `${(currentTime / duration) * 100 || 0}%`,
                    borderRadius: '8px'
                  }}
                >
                  <div 
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ borderRadius: '50%' }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                {/* Play/Pause */}
                <button
                  onClick={togglePlayPause}
                  className="p-2 bg-white/20 hover:bg-white/30 transition-all duration-200 hover-scale"
                  style={{ borderRadius: '8px' }}
                >
                  {isPlaying ? (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>

                {/* Volume - Hidden on mobile for space */}
                <div className="hidden sm:flex items-center space-x-2">
                  <button className="p-1 text-white hover:text-accent-blue transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                    </svg>
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 lg:w-20"
                    style={{
                      accentColor: '#2196f3',
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '4px'
                    }}
                  />
                </div>

                {/* Time Display */}
                <div className="text-white text-xs sm:text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Quality Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="glass-effect text-white p-2 hover:bg-white/20 transition-all duration-200"
                    style={{ borderRadius: '8px' }}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  
                  {showQualityMenu && (
                    <div 
                      className="absolute right-0 bottom-full mb-2 bg-secondary-bg border border-border-color shadow-xl overflow-hidden slide-in-right"
                      style={{ borderRadius: '8px' }}
                    >
                      {qualityOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setQuality(option);
                            setShowQualityMenu(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-hover-bg transition-colors ${
                            quality === option ? 'bg-accent-blue text-white' : 'text-text-primary'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-white hover:text-accent-blue transition-colors hover-scale"
                  style={{ borderRadius: '8px' }}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
