import React, { useRef, useEffect, useState, useCallback } from 'react';
import ReactPlayer from 'react-player';
import ApiService from '../services/api';

// PUBLIC_INTERFACE
const VideoPlayer = ({ currentMatch, apiConnected }) => {
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
  const [availableEmojis, setAvailableEmojis] = useState([]);
  const [wsConnection, setWsConnection] = useState(null);
  
  // Enhanced emoji configuration with sound frequencies and colors (fallback)
  const defaultEmojis = [
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

  // Load emoji data from API and setup WebSocket
  useEffect(() => {
    const loadEmojis = async () => {
      if (!apiConnected || !currentMatch?.id) {
        setAvailableEmojis(defaultEmojis);
        return;
      }

      try {
        // Load available emojis from API
        const emojiResponse = await ApiService.getEmojis(1, 10);
        if (emojiResponse.emojis && emojiResponse.emojis.length > 0) {
          const apiEmojis = emojiResponse.emojis.map(emoji => ({
            emoji: emoji.emoji_char || '❤️',
            color: emoji.color_hex || '#ff1744',
            name: emoji.emoji_type?.toLowerCase() || 'love',
            id: emoji.id,
            sound: defaultEmojis.find(e => e.name === emoji.emoji_type?.toLowerCase())?.sound || defaultEmojis[0].sound,
            gradient: defaultEmojis.find(e => e.name === emoji.emoji_type?.toLowerCase())?.gradient || defaultEmojis[0].gradient
          }));
          setAvailableEmojis(apiEmojis);
        } else {
          setAvailableEmojis(defaultEmojis);
        }

        // Load initial reaction counts
        const reactionsResponse = await ApiService.getEventReactions(currentMatch.id);
        if (reactionsResponse.emoji_counts) {
          setEmojiCounts(reactionsResponse.emoji_counts);
          setGlobalReactionCount(reactionsResponse.total_reactions || 0);
        }
      } catch (error) {
        console.error('Failed to load emoji data:', error);
        setAvailableEmojis(defaultEmojis);
      }
    };

    loadEmojis();
  }, [apiConnected, currentMatch?.id]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!apiConnected || !currentMatch?.id) {
      // Fallback to mock updates
      const interval = setInterval(() => {
        const randomChange = Math.floor(Math.random() * 10) - 5;
        setGlobalReactionCount(prev => Math.max(0, prev + randomChange));
      }, 5000);
      
      wsRef.current = () => clearInterval(interval);
      return () => clearInterval(interval);
    }

    try {
      // Create WebSocket connection for real-time emoji updates
      const ws = ApiService.createWebSocketConnection(currentMatch.id);
      setWsConnection(ws);

      ws.onopen = () => {
        console.log('WebSocket connected for emoji updates');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'emoji_reaction') {
            // Update emoji counts based on real-time data
            setEmojiCounts(prev => ({
              ...prev,
              [data.emoji_id]: (prev[data.emoji_id] || 0) + 1
            }));
            setGlobalReactionCount(prev => prev + 1);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      
      // Fallback to mock updates
      const interval = setInterval(() => {
        const randomChange = Math.floor(Math.random() * 10) - 5;
        setGlobalReactionCount(prev => Math.max(0, prev + randomChange));
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [apiConnected, currentMatch?.id]);

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

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
  // Enhanced emoji reaction handler with sound and improved animations
  const handleEmojiReaction = useCallback((emojiData) => {
=======
  // Enhanced emoji reaction handler with API integration
  const handleEmojiReaction = useCallback(async (emojiData) => {
>>>>>>> cga-cg908b179b
    // Initialize audio on first interaction
    initializeAudio();
>>>>>>> cga-cg908b179b
    
    // Play distinct sound for emoji with <50ms delay
    playEmojiSound(emojiData.sound);
    
    // Submit reaction to API if connected
    if (apiConnected && currentMatch?.id && emojiData.id) {
      try {
        await ApiService.submitEmojiReaction(currentMatch.id, emojiData.id);
        console.log('Emoji reaction submitted to API:', emojiData.name);
      } catch (error) {
        console.error('Failed to submit emoji reaction:', error);
        // Continue with local animation even if API call fails
      }
    }
    
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
    
    // Update counts with smooth animation (local update for immediate feedback)
    setEmojiCounts(prev => ({
      ...prev,
      [emojiData.name]: (prev[emojiData.name] || 0) + 1
    }));
    
    setGlobalReactionCount(prev => prev + 1);
    
<<<<<<< HEAD
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
=======
    // Enhanced cleanup
    setTimeout(() => {
      setFlyingReactions(prev => prev.filter(r => 
        Date.now() - r.id > 4000
      ));
    }, 5000);

    // Enhanced haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]); // Pattern for better feedback
>>>>>>> cga-cg908b179b
    }

    console.log(`🎵 ${emojiData.name} reaction with ${emojiData.sound.type} sound at ${emojiData.sound.frequency}Hz`);
  }, [initializeAudio, playEmojiSound, apiConnected, currentMatch?.id]);

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
        
<<<<<<< HEAD
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
=======
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
            {/* Main Container - Minimal Sleek Design */}
            <div 
              className="relative flex items-center gap-6"
              style={{ 
<<<<<<< HEAD
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
>>>>>>> cga-cg908b179b
              }}
            >
<<<<<<< HEAD
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
=======
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
=======
                padding: '12px 20px',
              }}
            >
                {(availableEmojis.length > 0 ? availableEmojis : defaultEmojis).map((emoji, index) => (
>>>>>>> cga-cg908b179b
                  <button
                    key={index}
                    onClick={() => handleEmojiReaction(emoji)}
                    className="group relative transition-all duration-300 hover:scale-110 active:scale-95 p-2"
                    style={{ 
                      animationDelay: `${index * 0.08}s`,
                    }}
                    title={`React with ${emoji.name}`}
                    aria-label={`React with ${emoji.name}`}
                  >
                    {/* Enhanced Emoji with Dynamic Glow */}
                    <div 
                      className="relative transition-all duration-400"
                      style={{ 
                        fontSize: '36px',
                        lineHeight: '1',
                        filter: `
                          drop-shadow(0 0 12px ${emoji.color}60) 
                          drop-shadow(0 0 24px ${emoji.color}30)
                          brightness(1.2)
                        `,
                        textShadow: `0 0 30px ${emoji.color}80`
                      }}
                    >
                      {emoji.emoji}
                      
                      {/* Dynamic Pulse Ring on Hover */}
                      <div 
                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-40 transition-all duration-500"
                        style={{ 
                          background: `radial-gradient(circle, ${emoji.color}30 0%, ${emoji.color}15 40%, transparent 70%)`,
                          animation: 'pulse 2s infinite',
                          transform: 'scale(2.5)'
                        }}
                      />
                      
                      {/* Click Ripple Effect */}
                      <div 
                        className="absolute inset-0 rounded-full opacity-0 group-active:opacity-80 transition-opacity duration-200"
                        style={{ 
                          background: `radial-gradient(circle, ${emoji.color}40 0%, transparent 60%)`,
                          animation: 'ripple 0.6s ease-out',
                          transform: 'scale(2)'
                        }}
                      />
                    </div>
                  </button>
                ))}
<<<<<<< HEAD
                
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
>>>>>>> cga-cg908b179b
                  >
                    reactions
                  </span>
                </div>
              </div>
=======
=======
>>>>>>> cga-cg908b179b
            </div>
          </div>
        </div>

<<<<<<< HEAD
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

=======
        {/* Video Player Controls Container */}
        <div className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
>>>>>>> cga-cg908b179b
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
