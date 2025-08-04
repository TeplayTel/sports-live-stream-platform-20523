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

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Auto-hide controls
    let controlsTimeout;
    const resetControlsTimeout = () => {
      clearTimeout(controlsTimeout);
      setShowControls(true);
      controlsTimeout = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    };

    video.addEventListener('mousemove', resetControlsTimeout);
    video.addEventListener('click', resetControlsTimeout);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('mousemove', resetControlsTimeout);
      video.removeEventListener('click', resetControlsTimeout);
      clearTimeout(controlsTimeout);
    };
  }, [isPlaying]);

  const handleEmojiReaction = (emojiData) => {
    // Create dynamic flying emoji animation with randomized trajectory
    const trajectoryType = Math.random();
    let trajectory = {};
    
    if (trajectoryType < 0.33) {
      // Arc trajectory - parabolic curve
      trajectory = {
        x: Math.random() * 60 + 20, // 20-80% from left
        y: Math.random() * 40 + 20, // 20-60% from top
        trajectory: 'arc',
        arcDirection: Math.random() > 0.5 ? 'left' : 'right',
        arcHeight: 80 + Math.random() * 40, // Arc height variation
      };
    } else if (trajectoryType < 0.66) {
      // Spiral trajectory
      trajectory = {
        x: Math.random() * 70 + 15, // 15-85% from left
        y: Math.random() * 50 + 25, // 25-75% from top
        trajectory: 'spiral',
        spiralDirection: Math.random() > 0.5 ? 'clockwise' : 'counterclockwise',
        spiralRadius: 30 + Math.random() * 20,
      };
    } else {
      // Zigzag trajectory
      trajectory = {
        x: Math.random() * 60 + 20, // 20-80% from left
        y: Math.random() * 40 + 30, // 30-70% from top
        trajectory: 'zigzag',
        zigzagAmplitude: 20 + Math.random() * 15,
        zigzagFrequency: 2 + Math.random() * 2,
      };
    }

    const newFlyingReaction = {
      id: Date.now() + Math.random(),
      emoji: emojiData.emoji,
      color: emojiData.color,
      ...trajectory,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 720, // -360 to 360 degrees per animation
      scale: 0.9 + Math.random() * 0.4, // 0.9-1.3 scale
      duration: 2500 + Math.random() * 1000, // 2.5-3.5s duration variation
      opacity: 0.9 + Math.random() * 0.1, // Slight opacity variation
    };
    
    setFlyingReactions(prev => [...prev, newFlyingReaction]);
    
    // Update individual emoji count
    setEmojiCounts(prev => ({
      ...prev,
      [emojiData.name]: prev[emojiData.name] + 1
    }));
    
    // Update global count (simulate websocket)
    setGlobalReactionCount(prev => prev + 1);
    
    // Remove flying emoji after animation with dynamic duration
    setTimeout(() => {
      setFlyingReactions(prev => prev.filter(r => r.id !== newFlyingReaction.id));
    }, newFlyingReaction.duration);

    // Log reaction for mock websocket
    console.log(`Reaction sent: ${emojiData.name} (${trajectory.trajectory}) - Global count: ${globalReactionCount + 1}`);
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
        
        {/* Dynamic Flying Emoji Animations */}
        {flyingReactions.map((reaction) => {
          let animationName = 'emoji-fly';
          let animationKeyframes = '';
          
          // Generate custom keyframes based on trajectory type
          if (reaction.trajectory === 'arc') {
            const direction = reaction.arcDirection === 'left' ? -1 : 1;
            animationKeyframes = `
              @keyframes emoji-arc-${reaction.id} {
                0% { 
                  transform: translateY(0) translateX(0) scale(${reaction.scale * 0.8}) rotate(${reaction.rotation}deg);
                  opacity: ${reaction.opacity};
                }
                25% { 
                  transform: translateY(-${reaction.arcHeight * 0.4}px) translateX(${direction * 40}px) scale(${reaction.scale * 1.1}) rotate(${reaction.rotation + reaction.rotationSpeed * 0.25}deg);
                  opacity: ${reaction.opacity * 0.9};
                }
                50% { 
                  transform: translateY(-${reaction.arcHeight * 0.8}px) translateX(${direction * 60}px) scale(${reaction.scale * 1.3}) rotate(${reaction.rotation + reaction.rotationSpeed * 0.5}deg);
                  opacity: ${reaction.opacity * 0.7};
                }
                75% { 
                  transform: translateY(-${reaction.arcHeight}px) translateX(${direction * 40}px) scale(${reaction.scale * 1.1}) rotate(${reaction.rotation + reaction.rotationSpeed * 0.75}deg);
                  opacity: ${reaction.opacity * 0.4};
                }
                100% { 
                  transform: translateY(-${reaction.arcHeight + 40}px) translateX(${direction * 20}px) scale(${reaction.scale * 0.6}) rotate(${reaction.rotation + reaction.rotationSpeed}deg);
                  opacity: 0;
                }
              }
            `;
            animationName = `emoji-arc-${reaction.id}`;
          } else if (reaction.trajectory === 'spiral') {
            const direction = reaction.spiralDirection === 'clockwise' ? 1 : -1;
            animationKeyframes = `
              @keyframes emoji-spiral-${reaction.id} {
                0% { 
                  transform: translateY(0) translateX(0) scale(${reaction.scale * 0.8}) rotate(${reaction.rotation}deg);
                  opacity: ${reaction.opacity};
                }
                25% { 
                  transform: translateY(-40px) translateX(${direction * reaction.spiralRadius * 0.7}px) scale(${reaction.scale * 1.1}) rotate(${reaction.rotation + direction * 90}deg);
                  opacity: ${reaction.opacity * 0.9};
                }
                50% { 
                  transform: translateY(-80px) translateX(0px) scale(${reaction.scale * 1.3}) rotate(${reaction.rotation + direction * 180}deg);
                  opacity: ${reaction.opacity * 0.7};
                }
                75% { 
                  transform: translateY(-120px) translateX(${-direction * reaction.spiralRadius * 0.7}px) scale(${reaction.scale * 1.1}) rotate(${reaction.rotation + direction * 270}deg);
                  opacity: ${reaction.opacity * 0.4};
                }
                100% { 
                  transform: translateY(-160px) translateX(0px) scale(${reaction.scale * 0.6}) rotate(${reaction.rotation + direction * 360}deg);
                  opacity: 0;
                }
              }
            `;
            animationName = `emoji-spiral-${reaction.id}`;
          } else if (reaction.trajectory === 'zigzag') {
            animationKeyframes = `
              @keyframes emoji-zigzag-${reaction.id} {
                0% { 
                  transform: translateY(0) translateX(0) scale(${reaction.scale * 0.8}) rotate(${reaction.rotation}deg);
                  opacity: ${reaction.opacity};
                }
                20% { 
                  transform: translateY(-30px) translateX(${reaction.zigzagAmplitude}px) scale(${reaction.scale * 1.0}) rotate(${reaction.rotation + reaction.rotationSpeed * 0.2}deg);
                  opacity: ${reaction.opacity * 0.9};
                }
                40% { 
                  transform: translateY(-60px) translateX(-${reaction.zigzagAmplitude}px) scale(${reaction.scale * 1.2}) rotate(${reaction.rotation + reaction.rotationSpeed * 0.4}deg);
                  opacity: ${reaction.opacity * 0.8};
                }
                60% { 
                  transform: translateY(-90px) translateX(${reaction.zigzagAmplitude * 0.7}px) scale(${reaction.scale * 1.3}) rotate(${reaction.rotation + reaction.rotationSpeed * 0.6}deg);
                  opacity: ${reaction.opacity * 0.6};
                }
                80% { 
                  transform: translateY(-120px) translateX(-${reaction.zigzagAmplitude * 0.5}px) scale(${reaction.scale * 1.1}) rotate(${reaction.rotation + reaction.rotationSpeed * 0.8}deg);
                  opacity: ${reaction.opacity * 0.3};
                }
                100% { 
                  transform: translateY(-150px) translateX(0px) scale(${reaction.scale * 0.6}) rotate(${reaction.rotation + reaction.rotationSpeed}deg);
                  opacity: 0;
                }
              }
            `;
            animationName = `emoji-zigzag-${reaction.id}`;
          }

          return (
            <React.Fragment key={reaction.id}>
              {/* Inject custom keyframes */}
              {animationKeyframes && (
                <style key={`style-${reaction.id}`}>
                  {animationKeyframes}
                </style>
              )}
              <div
                className="absolute pointer-events-none z-30"
                style={{
                  left: `${reaction.x}%`,
                  top: `${reaction.y}%`,
                  color: reaction.color,
                  fontSize: '2rem',
                  animation: `${animationName} ${reaction.duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                  textShadow: `0 0 20px ${reaction.color}, 0 0 40px ${reaction.color}, 0 0 60px ${reaction.color}40`,
                  filter: `drop-shadow(0 0 15px ${reaction.color}) brightness(1.2)`,
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden'
                }}
              >
                {reaction.emoji}
              </div>
            </React.Fragment>
          );
        })}

        {/* Responsive Emoji Reaction Bar - 40-50% width, above controls */}
        {(showEmojiBar || showControls) && (
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 z-35 pointer-events-none slide-in-down transition-all duration-300 ease-out"
            style={{ 
              bottom: showControls ? '90px' : '20px', // Dynamic positioning based on controls
              width: '45%', // 45% of video player width
              minWidth: '320px', // Minimum width for mobile
              maxWidth: '480px' // Maximum width for larger screens
            }}
          >
            <div 
              className="bg-black/80 backdrop-blur-md px-4 py-3 flex items-center justify-center gap-2 pointer-events-auto shadow-2xl border border-white/10"
              style={{ 
                borderRadius: '16px',
                width: '100%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: showEmojiBar ? 1 : (showControls ? 0.7 : 0),
                transform: showEmojiBar ? 'scale(1)' : 'scale(0.95)'
              }}
              onMouseEnter={() => setShowEmojiBar(true)}
              onMouseLeave={() => setShowEmojiBar(false)}
            >
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiReaction(emoji)}
                  className="group relative flex flex-col items-center justify-center px-2 py-2 rounded-lg transition-all duration-300 hover:bg-white/15 active:scale-90 hover:shadow-lg"
                  style={{ 
                    animationDelay: `${index * 0.08}s`,
                    borderRadius: '10px',
                    minHeight: '52px',
                    minWidth: '48px',
                    background: 'transparent',
                    border: '1px solid transparent',
                    flex: '1 1 0'
                  }}
                  title={`React with ${emoji.name}`}
                  aria-label={`React with ${emoji.name}, current count: ${emojiCounts[emoji.name]}`}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${emoji.color}60`;
                    e.currentTarget.style.backgroundColor = `${emoji.color}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span 
                    className="transition-all duration-200 group-hover:scale-125 group-active:scale-110"
                    style={{ 
                      fontSize: 'clamp(20px, 2.5vw, 26px)', // Responsive emoji size
                      lineHeight: '1',
                      filter: `drop-shadow(0 0 10px ${emoji.color}60) drop-shadow(0 0 20px ${emoji.color}30)`,
                      marginBottom: '2px'
                    }}
                  >
                    {emoji.emoji}
                  </span>
                  
                  <span 
                    className="text-white font-semibold transition-all duration-200 group-hover:text-opacity-100"
                    style={{ 
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)',
                      fontSize: 'clamp(11px, 1.2vw, 13px)', // Responsive text size
                      fontWeight: '600',
                      opacity: '0.95'
                    }}
                  >
                    {emojiCounts[emoji.name]}
                  </span>
                  
                  {/* Enhanced hover glow effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-all duration-300 pointer-events-none"
                    style={{ 
                      background: `radial-gradient(circle at center, ${emoji.color}30 0%, ${emoji.color}15 40%, transparent 70%)`,
                      borderRadius: '10px',
                      transform: 'scale(1.1)',
                      filter: 'blur(2px)'
                    }}
                  />
                </button>
              ))}
              
              {/* Total Reaction Count - Responsive */}
              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-white/30">
                <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse shadow-sm" />
                <div className="flex flex-col items-center">
                  <span 
                    className="text-white font-bold leading-none"
                    style={{ 
                      fontSize: 'clamp(12px, 1.3vw, 14px)',
                      fontWeight: '700',
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)'
                    }}
                  >
                    {globalReactionCount.toLocaleString()}
                  </span>
                  <span 
                    className="text-white/70 text-center leading-none mt-0.5"
                    style={{ fontSize: 'clamp(9px, 1vw, 11px)' }}
                  >
                    reactions
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Player Controls Container - Unified with emoji bar */}
        <div 
          className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-300 ${
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          onMouseEnter={() => {
            setShowControls(true);
            setShowEmojiBar(true);
          }}
          onMouseLeave={() => {
            // Don't immediately hide - let the timeout handle it
          }}
        >
          <div className="bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 pt-8">

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
                    className="w-16 lg:w-20 accent-accent-blue"
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
