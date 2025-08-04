import React, { useRef, useEffect, useState, useCallback } from 'react';
import ReactPlayer from 'react-player';

// PUBLIC_INTERFACE
const VideoPlayer = ({ currentMatch }) => {
  /**
   * Enhanced video player component with ReactPlayer, premium emoji reactions, sound effects, and natural flying animations
   * Features sleek glassmorphism design, smooth animations, distinct sounds per emoji, and improved user experience
   */
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const soundCacheRef = useRef({});
  
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
  const [isBuffering, setIsBuffering] = useState(false);
  
  // Enhanced emoji configuration with sound frequencies and colors
  const emojis = [
    { 
      emoji: '❤️', 
      color: '#ff1744', 
      name: 'love',
      sound: { frequency: 523.25, type: 'sine', duration: 0.3 }, // C5 - warm, loving
      gradient: 'from-pink-500 via-red-500 to-rose-600'
    },
    { 
      emoji: '😂', 
      color: '#ffeb3b', 
      name: 'laugh',
      sound: { frequency: 659.25, type: 'triangle', duration: 0.4 }, // E5 - bright, cheerful
      gradient: 'from-yellow-400 via-amber-500 to-orange-500'
    },
    { 
      emoji: '😮', 
      color: '#2196f3', 
      name: 'wow',
      sound: { frequency: 440, type: 'sawtooth', duration: 0.5 }, // A4 - surprising
      gradient: 'from-blue-400 via-blue-500 to-indigo-600'
    },
    { 
      emoji: '👏', 
      color: '#4caf50', 
      name: 'clap',
      sound: { frequency: 349.23, type: 'square', duration: 0.2 }, // F4 - percussive
      gradient: 'from-green-400 via-emerald-500 to-green-600'
    },
    { 
      emoji: '🔥', 
      color: '#ff5722', 
      name: 'fire',
      sound: { frequency: 783.99, type: 'sawtooth', duration: 0.3 }, // G5 - intense
      gradient: 'from-orange-500 via-red-500 to-red-600'
    },
    { 
      emoji: '⚽', 
      color: '#ffffff', 
      name: 'soccer',
      sound: { frequency: 293.66, type: 'sine', duration: 0.25 }, // D4 - sports-like
      gradient: 'from-gray-300 via-gray-100 to-white'
    }
  ];

  // Video URL for ReactPlayer
  const videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  const qualityOptions = ['4K', 'HD', '720p', '480p', 'Auto'];

  // Initialize Web Audio API for sound effects
  const initializeAudio = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    }
  }, []);

  // Generate and cache sound for each emoji
  const createEmojiSound = useCallback((soundConfig) => {
    const { frequency, type, duration } = soundConfig;
    const cacheKey = `${frequency}-${type}-${duration}`;
    
    if (soundCacheRef.current[cacheKey]) {
      return soundCacheRef.current[cacheKey];
    }

    if (!audioContextRef.current) return null;

    const audioBuffer = audioContextRef.current.createBuffer(1, audioContextRef.current.sampleRate * duration, audioContextRef.current.sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    
    for (let i = 0; i < channelData.length; i++) {
      const time = i / audioContextRef.current.sampleRate;
      const envelope = Math.exp(-time * 3); // Natural decay
      
      let sample = 0;
      switch (type) {
        case 'sine':
          sample = Math.sin(2 * Math.PI * frequency * time);
          break;
        case 'triangle':
          sample = 2 * Math.abs(2 * ((frequency * time) % 1) - 1) - 1;
          break;
        case 'sawtooth':
          sample = 2 * ((frequency * time) % 1) - 1;
          break;
        case 'square':
          sample = Math.sin(2 * Math.PI * frequency * time) > 0 ? 1 : -1;
          break;
        default:
          sample = Math.sin(2 * Math.PI * frequency * time);
      }
      
      channelData[i] = sample * envelope * 0.1; // Gentle volume
    }

    soundCacheRef.current[cacheKey] = audioBuffer;
    return audioBuffer;
  }, []);

  // Play emoji sound with <50ms delay
  const playEmojiSound = useCallback((soundConfig) => {
    if (!audioContextRef.current || audioContextRef.current.state === 'suspended') {
      audioContextRef.current?.resume();
    }

    try {
      const audioBuffer = createEmojiSound(soundConfig);
      if (!audioBuffer) return;

      const source = audioContextRef.current.createBufferSource();
      const gainNode = audioContextRef.current.createGain();
      
      source.buffer = audioBuffer;
      source.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      // Quick fade in/out for smooth sound
      gainNode.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + soundConfig.duration);
      
      source.start(audioContextRef.current.currentTime);
      source.stop(audioContextRef.current.currentTime + soundConfig.duration);
    } catch (error) {
      console.warn('Error playing emoji sound:', error);
    }
  }, [createEmojiSound]);

  // Mock WebSocket for real-time reaction updates
  useEffect(() => {
    const connectWebSocket = () => {
      console.log('Connecting to mock WebSocket for reactions...');
      
      const interval = setInterval(() => {
        const randomChange = Math.floor(Math.random() * 10) - 5;
        setGlobalReactionCount(prev => Math.max(0, prev + randomChange));
      }, 3000);

      wsRef.current = () => clearInterval(interval);
    };

    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current();
      }
    };
  }, []);

  // ReactPlayer event handlers
  const handleReady = () => {
    console.log('ReactPlayer ready');
    setIsVideoLoading(false);
    setVideoError(null);
  };

  const handleStart = () => {
    console.log('ReactPlayer started');
    setIsVideoLoading(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleBuffer = () => {
    setIsBuffering(true);
  };

  const handleBufferEnd = () => {
    setIsBuffering(false);
  };

  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleError = (error) => {
    console.error('ReactPlayer error:', error);
    setIsPlaying(false);
    setVideoError('Failed to load video. Please try again.');
    setIsVideoLoading(false);
  };

  // Enhanced controls auto-hide logic
  useEffect(() => {
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
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const isOverVideo = e.clientX >= rect.left && e.clientX <= rect.right && 
                         e.clientY >= rect.top && e.clientY <= rect.bottom - 120;
      if (isOverVideo) {
        resetControlsTimeout();
      }
    };

    const handleClick = () => {
      resetControlsTimeout();
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('click', handleClick);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('click', handleClick);
      }
      clearTimeout(controlsTimeout);
    };
  }, [isPlaying]);

  // Enhanced emoji reaction handler with sound and improved animations
  const handleEmojiReaction = useCallback((emojiData) => {
    // Initialize audio on first interaction
    initializeAudio();
    
    // Play distinct sound for emoji with <50ms delay
    playEmojiSound(emojiData.sound);
    
    // Create enhanced flying animations with natural arcs
    const numFlying = Math.random() > 0.65 ? 2 : 1; // 35% chance for double emoji
    
    for (let i = 0; i < numFlying; i++) {
      const startX = Math.random() * 70 + 15; // 15-85% from left
      const startY = Math.random() * 30 + 40; // 40-70% from top
      const endX = startX + (Math.random() - 0.5) * 40; // Natural arc movement
      const endY = startY - 60 - Math.random() * 40; // Upward movement with variation
      
      const newFlyingReaction = {
        id: Date.now() + Math.random() + i,
        emoji: emojiData.emoji,
        color: emojiData.color,
        gradient: emojiData.gradient,
        startX,
        startY,
        endX,
        endY,
        rotation: Math.random() * 720 - 360, // Full rotation range
        scale: 0.8 + Math.random() * 0.7, // 0.8-1.5 scale
        delay: i * 120, // Stagger multiple emojis
        duration: 2.5 + Math.random() * 1.5, // 2.5-4s duration
        curve: Math.random() * 60 - 30 // Bezier curve variation
      };
      
      setTimeout(() => {
        setFlyingReactions(prev => [...prev, newFlyingReaction]);
      }, newFlyingReaction.delay);
    }
    
    // Update counts with smooth animation
    setEmojiCounts(prev => ({
      ...prev,
      [emojiData.name]: prev[emojiData.name] + 1
    }));
    
    setGlobalReactionCount(prev => prev + 1);
    
    // Enhanced cleanup
    setTimeout(() => {
      setFlyingReactions(prev => prev.filter(r => 
        Date.now() - r.id > 4000
      ));
    }, 5000);

    // Enhanced haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]); // Pattern for better feedback
    }

    console.log(`🎵 ${emojiData.name} reaction with ${emojiData.sound.type} sound at ${emojiData.sound.frequency}Hz`);
  }, [initializeAudio, playEmojiSound]);

  // ReactPlayer controls
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    if (!playerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = percent * duration;
    playerRef.current.seekTo(seekTime, 'seconds');
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
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
      {/* ReactPlayer Container */}
      <div 
        ref={containerRef}
        className="relative aspect-video group"
        onMouseEnter={() => setShowEmojiBar(true)}
        onMouseLeave={() => setShowEmojiBar(false)}
      >
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          width="100%"
          height="100%"
          playing={isPlaying}
          volume={volume}
          muted={false}
          loop={true}
          controls={false} // We'll use custom controls
          onReady={handleReady}
          onStart={handleStart}
          onPlay={handlePlay}
          onPause={handlePause}
          onBuffer={handleBuffer}
          onBufferEnd={handleBufferEnd}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onError={handleError}
          config={{
            file: {
              attributes: {
                poster: "https://via.placeholder.com/800x450/1a1a1a/ffffff?text=Sports+Stream"
              }
            }
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0
          }}
        />
        
        {/* Loading Overlay */}
        {(isVideoLoading || isBuffering) && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
              <p className="text-white text-lg font-medium">
                {isBuffering ? 'Buffering...' : 'Loading stream...'}
              </p>
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
                  if (playerRef.current) {
                    playerRef.current.seekTo(0);
                  }
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        {/* Enhanced Flying Emoji Animations with Natural Movement */}
        {flyingReactions.map((reaction) => (
          <div
            key={reaction.id}
            className="absolute pointer-events-none z-30"
            style={{
              left: `${reaction.startX}%`,
              top: `${reaction.startY}%`,
              fontSize: `${1.5 + reaction.scale * 0.5}rem`,
              filter: `drop-shadow(0 0 15px ${reaction.color}) brightness(1.2)`,
              animation: `naturalFlyUp ${reaction.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
              '--end-x': `${reaction.endX}%`,
              '--end-y': `${reaction.endY}%`,
              '--rotation': `${reaction.rotation}deg`,
              '--curve': `${reaction.curve}px`
            }}
          >
            {reaction.emoji}
          </div>
        ))}

        {/* Premium Sleek Emoji Reaction Bar */}
        <div 
          className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-700 ease-out ${
            showEmojiBar ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'
          }`}
          style={{ 
            bottom: '100px',
            zIndex: 40,
            pointerEvents: showEmojiBar ? 'auto' : 'none'
          }}
          onMouseEnter={() => setShowEmojiBar(true)}
          onMouseLeave={() => setShowEmojiBar(false)}
        >
          {/* Premium Glassmorphism Container */}
          <div className="relative">
            {/* Main Container */}
            <div 
              className="relative bg-gradient-to-r from-black/60 via-gray-900/80 to-black/60 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden"
              style={{ 
                borderRadius: '28px',
                padding: '16px 24px',
                background: 'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(20,20,20,0.85) 30%, rgba(40,40,40,0.90) 70%, rgba(0,0,0,0.75) 100%)',
                boxShadow: `
                  0 20px 40px rgba(0,0,0,0.5),
                  0 8px 16px rgba(0,0,0,0.3),
                  inset 0 1px 0 rgba(255,255,255,0.1),
                  inset 0 -1px 0 rgba(0,0,0,0.2)
                `,
                backdropFilter: 'blur(24px) saturate(180%)'
              }}
            >
              {/* Subtle animated background */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%)',
                  animation: 'shimmer 3s ease-in-out infinite'
                }}
              />
              
              <div className="relative flex items-center gap-3">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleEmojiReaction(emoji)}
                    className="group relative flex flex-col items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-300 hover:bg-white/10 active:scale-95"
                    style={{ 
                      animationDelay: `${index * 0.08}s`,
                      minHeight: '72px',
                      minWidth: '56px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(8px)'
                    }}
                    title={`React with ${emoji.name}`}
                    aria-label={`React with ${emoji.name}, current count: ${emojiCounts[emoji.name]}`}
                  >
                    {/* Enhanced Emoji with Dynamic Glow */}
                    <div 
                      className="relative transition-all duration-400 group-hover:scale-125 group-active:scale-110"
                      style={{ 
                        fontSize: '32px',
                        lineHeight: '1',
                        filter: `
                          drop-shadow(0 0 8px ${emoji.color}40) 
                          drop-shadow(0 0 16px ${emoji.color}20)
                          brightness(1.1)
                        `,
                        textShadow: `0 0 20px ${emoji.color}60`
                      }}
                    >
                      {emoji.emoji}
                      
                      {/* Dynamic Pulse Ring on Hover */}
                      <div 
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-500"
                        style={{ 
                          background: `radial-gradient(circle, ${emoji.color}25 0%, ${emoji.color}10 40%, transparent 70%)`,
                          animation: 'pulse 2s infinite',
                          transform: 'scale(2)'
                        }}
                      />
                      
                      {/* Click Ripple Effect */}
                      <div 
                        className="absolute inset-0 rounded-full opacity-0 group-active:opacity-80 transition-opacity duration-200"
                        style={{ 
                          background: `radial-gradient(circle, ${emoji.color}30 0%, transparent 60%)`,
                          animation: 'ripple 0.6s ease-out',
                          transform: 'scale(1.5)'
                        }}
                      />
                    </div>
                    
                    {/* Elegant Count Display */}
                    <span 
                      className="text-white font-semibold transition-all duration-300 group-hover:text-yellow-200 group-hover:scale-110"
                      style={{ 
                        fontSize: '13px',
                        fontWeight: '600',
                        textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                        background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                    >
                      {emojiCounts[emoji.name]}
                    </span>
                    
                    {/* Hover Glow Enhancement */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-all duration-400 rounded-2xl"
                      style={{ 
                        background: `linear-gradient(135deg, ${emoji.color}20 0%, transparent 50%, ${emoji.color}15 100%)`,
                        filter: 'blur(2px)'
                      }}
                    />
                  </button>
                ))}
                
                {/* Premium Global Counter */}
                <div className="flex flex-col items-center gap-2 ml-6 pl-6" style={{
                  borderLeft: '2px solid rgba(255,255,255,0.15)',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                }}>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full animate-pulse"
                      style={{ 
                        background: 'linear-gradient(45deg, #10b981, #059669)',
                        boxShadow: '0 0 12px #10b98150, 0 0 24px #10b98130'
                      }}
                    />
                    <span 
                      className="font-bold tracking-wide"
                      style={{ 
                        fontSize: '18px',
                        fontWeight: '700',
                        background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        textShadow: '0 2px 8px rgba(0,0,0,0.4)'
                      }}
                    >
                      {globalReactionCount.toLocaleString()}
                    </span>
                  </div>
                  <span 
                    className="text-white/60 tracking-widest"
                    style={{ 
                      fontSize: '11px',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                  >
                    reactions
                  </span>
                </div>
              </div>
            </div>
            
            {/* Decorative Top Indicator */}
            <div 
              className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-white/40 to-white/20 rounded-full"
              style={{ 
                boxShadow: '0 0 15px rgba(255,255,255,0.3), inset 0 1px 0 rgba(255,255,255,0.4)' 
              }}
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
