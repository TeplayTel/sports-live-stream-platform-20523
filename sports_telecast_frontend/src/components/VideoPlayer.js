import React, { useRef, useEffect, useState, useCallback } from 'react';
import ReactPlayer from 'react-player';
import emojiService from '../services/emojiService';
import websocketService from '../services/websocketService';

import { useUser, MOCK_USER } from '../UserContext';

// PUBLIC_INTERFACE
const VideoPlayer = ({ currentMatch, user: propUser }) => {
  /**
   * Enhanced video player component with ReactPlayer, premium emoji reactions, sound effects, and natural flying animations
   * Features sleek glassmorphism design, smooth animations, distinct sounds per emoji, and improved user experience
   * Integrates with backend API and WebSocket for real-time reactions
   */
  // Always call useUser() at the top of the function component
  const { user: contextUser } = useUser();
  const playerRef = useRef(null);
  const containerRef = useRef(null);
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
  const [globalReactionCount, setGlobalReactionCount] = useState(0);
  const [emojiCounts, setEmojiCounts] = useState({});
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(null);
  const [isBuffering, setIsBuffering] = useState(false);
  
  // Backend integration states
  const [availableEmojis, setAvailableEmojis] = useState([]);
  const [emojiMapping, setEmojiMapping] = useState({});
  const [isLoadingEmojis, setIsLoadingEmojis] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [reactionError, setReactionError] = useState(null);

  // Enhanced emoji configuration with sound frequencies and colors (fallback)
  const fallbackEmojis = [
    {
      emoji: '❤️',
      color: '#ff1744',
      name: 'love',
      emoji_id: 'EMJ001',
      emoji_type: 'heart',
      sound: { frequency: 523.25, type: 'sine', duration: 0.3 },
      gradient: 'from-pink-500 via-red-500 to-rose-600'
    },
    {
      emoji: '😂',
      color: '#ffeb3b',
      name: 'laugh',
      emoji_id: 'EMJ002',
      emoji_type: 'laugh',
      sound: { frequency: 659.25, type: 'triangle', duration: 0.4 },
      gradient: 'from-yellow-400 via-amber-500 to-orange-500'
    },
    {
      emoji: '😮',
      color: '#2196f3',
      name: 'wow',
      emoji_id: 'EMJ003',
      emoji_type: 'shocked',
      sound: { frequency: 440, type: 'sawtooth', duration: 0.5 },
      gradient: 'from-blue-400 via-blue-500 to-indigo-600'
    },
    {
      emoji: '👏',
      color: '#4caf50',
      name: 'clap',
      emoji_id: 'EMJ004',
      emoji_type: 'clap',
      sound: { frequency: 349.23, type: 'square', duration: 0.2 },
      gradient: 'from-green-400 via-emerald-500 to-green-600'
    },
    {
      emoji: '🔥',
      color: '#ff5722',
      name: 'fire',
      emoji_id: 'EMJ005',
      emoji_type: 'fire',
      sound: { frequency: 783.99, type: 'sawtooth', duration: 0.3 },
      gradient: 'from-orange-500 via-red-500 to-red-600'
    },
    {
      emoji: '⚽',
      color: '#ffffff',
      name: 'soccer',
      emoji_id: 'EMJ006',
      emoji_type: 'goal',
      sound: { frequency: 293.66, type: 'sine', duration: 0.25 },
      gradient: 'from-gray-300 via-gray-100 to-white'
    }
  ];

  // Get current emoji set (from API or fallback)
  const emojis = availableEmojis.length > 0 ? availableEmojis : fallbackEmojis;

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

  // Load available emojis from backend
  useEffect(() => {
    const loadEmojis = async () => {
      try {
        setIsLoadingEmojis(true);
        setApiError(null);
        const response = await emojiService.getEmojis(1, 10);
        if (response && response.emojis) {
          // Transform backend emojis to frontend format
          const transformedEmojis = response.emojis.map((apiEmoji, index) => {
            const fallback = fallbackEmojis[index] || fallbackEmojis[0];
            return {
              emoji: getEmojiSymbol(apiEmoji.emoji_type),
              color: getEmojiColor(apiEmoji.emoji_type),
              name: apiEmoji.name.toLowerCase(),
              emoji_id: apiEmoji.emoji_id,
              emoji_type: apiEmoji.emoji_type,
              sound: fallback.sound,
              gradient: fallback.gradient
            };
          });
          setAvailableEmojis(transformedEmojis);
          // Create mapping for counts
          const mapping = {};
          transformedEmojis.forEach(emoji => {
            mapping[emoji.name] = emoji.emoji_id;
          });
          setEmojiMapping(mapping);
          // Initialize emoji counts
          const initialCounts = {};
          transformedEmojis.forEach(emoji => {
            initialCounts[emoji.name] = 0;
          });
          setEmojiCounts(initialCounts);
        }
      } catch (error) {
        console.error('Failed to load emojis, using fallback:', error);
        setApiError('Failed to load emojis from server');
        // Fallback emojis are already set as default
        const initialCounts = {};
        fallbackEmojis.forEach(emoji => {
          initialCounts[emoji.name] = Math.floor(Math.random() * 100);
        });
        setEmojiCounts(initialCounts);
      } finally {
        setIsLoadingEmojis(false);
      }
    };
    loadEmojis();
  }, []);

  // Helper functions for emoji transformation
  const getEmojiSymbol = (emojiType) => {
    const symbols = {
      heart: '❤️',
      laugh: '😂',
      shocked: '😮',
      clap: '👏',
      fire: '🔥',
      goal: '⚽'
    };
    return symbols[emojiType] || '👍';
  };
  const getEmojiColor = (emojiType) => {
    const colors = {
      heart: '#ff1744',
      laugh: '#ffeb3b',
      shocked: '#2196f3',
      clap: '#4caf50',
      fire: '#ff5722',
      goal: '#ffffff'
    };
    return colors[emojiType] || '#ffffff';
  };

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!currentMatch?.matchId) return;
    const eventId = currentMatch.matchId;
    
    // Set up WebSocket event listeners
    const handleReactionUpdate = (data) => {
      if (data.emoji_counts) {
        // Update emoji counts from WebSocket data
        const updatedCounts = {};
        Object.entries(data.emoji_counts).forEach(([emojiId, count]) => {
          // Find emoji name by ID
          const emoji = emojis.find(e => e.emoji_id === emojiId);
          if (emoji) {
            updatedCounts[emoji.name] = count;
          }
        });
        setEmojiCounts(prev => ({ ...prev, ...updatedCounts }));
      }
      if (data.total_reactions !== undefined) {
        setGlobalReactionCount(data.total_reactions);
      }
    };

    const handleConnect = () => setWsConnected(true);
    const handleDisconnect = () => setWsConnected(false);
    const handleError = () => setWsConnected(false);

    websocketService.on('reaction', handleReactionUpdate);
    websocketService.on('connect', handleConnect);
    websocketService.on('disconnect', handleDisconnect);
    websocketService.on('error', handleError);
    websocketService.connect(eventId);

    const loadInitialReactions = async () => {
      try {
        const summary = await emojiService.getEventReactions(eventId);
        if (summary.emoji_counts) {
          const updatedCounts = {};
          Object.entries(summary.emoji_counts).forEach(([emojiId, count]) => {
            const emoji = emojis.find(e => e.emoji_id === emojiId);
            if (emoji) {
              updatedCounts[emoji.name] = count;
            }
          });
          setEmojiCounts(prev => ({ ...prev, ...updatedCounts }));
        }
        if (summary.total_reactions !== undefined) {
          setGlobalReactionCount(summary.total_reactions);
        }
      } catch (error) {
        // ignore
      }
    };
    loadInitialReactions();

    // Cleanup
    return () => {
      websocketService.off('reaction', handleReactionUpdate);
      websocketService.off('connect', handleConnect);
      websocketService.off('disconnect', handleDisconnect);
      websocketService.off('error', handleError);
      websocketService.disconnect();
      setWsConnected(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMatch?.matchId, emojis]);

  // ReactPlayer event handlers
  const handleReady = () => {
    setIsVideoLoading(false);
    setVideoError(null);
  };
  const handleStart = () => setIsVideoLoading(false);
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleBuffer = () => setIsBuffering(true);
  const handleBufferEnd = () => setIsBuffering(false);
  const handleProgress = (state) => setCurrentTime(state.playedSeconds);
  const handleDuration = (duration) => setDuration(duration);
  const handleError = (error) => {
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

  // Enhanced emoji reaction handler with backend integration
  const handleEmojiReaction = useCallback(async (emojiData) => {
    initializeAudio();
    playEmojiSound(emojiData.sound);

    const numFlying = Math.random() > 0.65 ? 2 : 1;
    for (let i = 0; i < numFlying; i++) {
      const startX = Math.random() * 70 + 15;
      const startY = Math.random() * 30 + 40;
      const endX = startX + (Math.random() - 0.5) * 40;
      const endY = startY - 60 - Math.random() * 40;
      const newFlyingReaction = {
        id: Date.now() + Math.random() + i,
        emoji: emojiData.emoji,
        color: emojiData.color,
        gradient: emojiData.gradient,
        startX,
        startY,
        endX,
        endY,
        rotation: Math.random() * 720 - 360,
        scale: 0.8 + Math.random() * 0.7,
        delay: i * 120,
        duration: 2.5 + Math.random() * 1.5,
        curve: Math.random() * 60 - 30
      };
      setTimeout(() => {
        setFlyingReactions(prev => [...prev, newFlyingReaction]);
      }, newFlyingReaction.delay);
    }

    setEmojiCounts(prev => ({
      ...prev,
      [emojiData.name]: (prev[emojiData.name] || 0) + 1
    }));
    setGlobalReactionCount(prev => prev + 1);

    setTimeout(() => {
      setFlyingReactions(prev => prev.filter(r =>
        Date.now() - r.id > 4000
      ));
    }, 5000);

    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }

    const effectiveUser = propUser || contextUser || MOCK_USER;

    try {
      setReactionError(null);
      if (!currentMatch?.matchId) {
        throw new Error('No event ID available');
      }
      await emojiService.submitReaction(
        currentMatch.matchId,
        emojiData.emoji_id,
        effectiveUser?.user_id,
        effectiveUser
      );
      // The WebSocket will handle the real-time update, do nothing further here.
    } catch (error) {
      setReactionError(`Failed to submit ${emojiData.name} reaction`);
      setEmojiCounts(prev => ({
        ...prev,
        [emojiData.name]: Math.max(0, (prev[emojiData.name] || 0) - 1)
      }));
      setGlobalReactionCount(prev => Math.max(0, prev - 1));
      setTimeout(() => setReactionError(null), 3000);
    }
  }, [initializeAudio, playEmojiSound, currentMatch?.matchId, propUser, contextUser]);

  // ReactPlayer controls
  const togglePlayPause = () => setIsPlaying(!isPlaying);
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

  // --- Netflix-inspired Player Render ---
  // The .emoji-bar-overlay styles are inlined here for independence from JS window/resize checks
  // It uses a responsive bottom offset to remain clearly above the seekbar at all times
  return (
    <div className="relative player-theme-bg-black rounded-2xl overflow-hidden shadow-xl hover-lift group" style={{ boxShadow: '0 8px 32px #000a' }}>
      {/* ReactPlayer container */}
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
          controls={false}
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
                poster: "https://via.placeholder.com/800x450/161616/ffffff?text=SportsStream"
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
          <div className="absolute inset-0 flex items-center justify-center z-30" style={{
            background: "linear-gradient(180deg, #121212e6 70%, #000d 100%)"
          }}>
            <div className="text-center space-y-5">
              <svg className="animate-spin mx-auto" style={{ width: 64, height: 64, color: '#fff', opacity: 0.92 }} viewBox="0 0 50 50" fill="none">
                <circle cx="25" cy="25" r="22" stroke="#fff2" strokeWidth="7" />
                <path d="M47 25A22 22 0 0 1 25 47" stroke="#E50914" strokeWidth="8" strokeLinecap="round" />
              </svg>
              <p className="text-white text-lg font-semibold tracking-wide drop-shadow">{isBuffering ? "Buffering..." : "Loading stream..."}</p>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {videoError && (
          <div className="absolute inset-0 bg-black/95 flex items-center justify-center z-40">
            <div className="text-center space-y-6 max-w-md px-6">
              <div className="flex items-center justify-center">
                <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" strokeWidth="5" className="text-red-800" fill="#2e0000" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M24 16v12m0 7h.01" /></svg>
              </div>
              <h3 className="text-white text-2xl font-bold mb-1">Playback Error</h3>
              <p className="text-white/80 text-base font-medium">{videoError}</p>
              <button
                onClick={() => {
                  setVideoError(null);
                  setIsVideoLoading(true);
                  if (playerRef.current) {
                    playerRef.current.seekTo(0);
                  }
                }}
                className="px-7 py-2 bg-accent-red rounded-xl text-white text-base font-bold mt-2 shadow-lg hover:bg-accent-red-hover transition"
                style={{ letterSpacing: "0.05em" }}
              >Retry</button>
            </div>
          </div>
        )}

        {/* Flying emojis (unchanged) */}
        {flyingReactions.map((reaction) => (
          <div
            key={reaction.id}
            className="absolute pointer-events-none z-50"
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
          >{reaction.emoji}</div>
        ))}

        {/* Top overlays: LIVE badge, etc. */}
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between px-6 pt-5 pointer-events-none select-none">
          <div>
            <span className="bg-accent-red/90 rounded px-3 py-1 text-xs font-black uppercase tracking-widest text-white shadow-lg"
                  style={{ letterSpacing: "0.15em", boxShadow: "0 0 16px #e5091470" }}>
              LIVE
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white/60 font-medium">{quality}</span>
          </div>
        </div>

        {/* ----------- Responsive/raised Emoji Bar Overlay ------------ */}
        {/* 
          Moved higher above seekbar! 
          Uses only CSS for distance:
            - 130px bottom on desktop,
            - 104px on tablet,
            - 80px on mobile (clamped for safety).
          All positions guarantee no overlap or crowding with seekbar/controls.
        */}
        <div
          className={`emoji-bar-overlay absolute left-1/2 transition-all will-change-transform ease-in-out duration-500 pointer-events-none
            ${showEmojiBar ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-4"}`}
          style={{
            bottom: 0,
            zIndex: 1000,
            transform: `translateX(-50%)`,
            minWidth: "min(440px, 92vw)",
            maxWidth: "96vw",
            pointerEvents: 'none'
          }}
        >
          {/* Responsive spacing using styled-in block */}
          <style>{`
            @media (min-width: 1024px) {
              .emoji-bar-overlay { bottom: 130px !important; }
            }
            @media (min-width: 640px) and (max-width: 1023px) {
              .emoji-bar-overlay { bottom: 104px !important; }
            }
            @media (max-width: 639px) {
              .emoji-bar-overlay { bottom: 80px !important; }
            }
          `}</style>
          <div
            className="flex items-center justify-between emoji-bar"
            style={{
              background: "rgba(20, 20, 20, 0.92)",
              borderRadius: "22px",
              boxShadow: "0 6px 36px 0 #0009, 0 1.5px 12px 0 #2226",
              border: "1.5px solid #fff2",
              padding: "0 28px",
              height: "54px",
              minHeight: 48,
              maxHeight: 62,
              gap: 20,
              pointerEvents: 'auto',
              alignItems: 'center'
            }}
          >
            {/* Emoji Buttons */}
            <div className="flex items-center gap-2" style={{ gap: 20 }}>
              {isLoadingEmojis ? (
                [...Array(6)].map((_, idx) => (
                    <div key={idx} className="w-10 h-10 bg-white/10 rounded-full animate-pulse" />
                ))
              ) : (
                emojis.map((emoji, idx) => (
                  <button
                    key={emoji.emoji_id || idx}
                    onClick={() => handleEmojiReaction(emoji)}
                    disabled={reactionError !== null}
                    className={`emoji-button flex items-center justify-center cursor-pointer transition-transform duration-150
                        rounded-full hover:scale-125 focus:scale-110 active:scale-95 select-none bg-transparent border-none`}
                    style={{
                      width: 40, height: 40,
                      outline: "none", userSelect: "none",
                      filter: `drop-shadow(0 0 8px ${emoji.color}50)`,
                    }}
                    tabIndex={0}
                    title={`React with ${emoji.name} (${emojiCounts[emoji.name] || 0})`}
                    aria-label={`React with ${emoji.name}, current count: ${emojiCounts[emoji.name] || 0}`}
                  >
                    <span style={{
                      fontSize: 26,
                      lineHeight: 1.1,
                      filter: `drop-shadow(0 0 7px ${emoji.color}50) brightness(1.12)`
                    }}>{emoji.emoji}</span>
                  </button>
                ))
              )}
            </div>
            {/* Total reaction count */}
            <div
              className="font-bold flex items-center tracking-tight select-none"
              style={{
                minWidth: 82,
                height: 30,
                padding: "0 14px",
                background: wsConnected ? "rgba(64,255,120,0.13)" : "rgba(255,255,255,0.10)",
                borderRadius: 14,
                border: wsConnected ? "1.5px solid #5fa" : "none",
                color: "#fff",
                fontSize: 15,
                textShadow: "0 1px 4px #000a"
              }}
              aria-live="polite"
              aria-label={`Currently ${globalReactionCount} fan reactions, ${wsConnected ? "live" : "offline"}`}
            >
              <svg width="24" height="20" style={{ marginRight: 6, opacity: 0.8, verticalAlign: "middle" }} fill="none" viewBox="0 0 24 20">
                <path d="M2 18V8c0-3.866 3.134-7 7-7 3.108 0 5.743 1.997 6.675 4.75C16.79 6.583 18.848 7 22 7v11" stroke="#fff" strokeWidth="2" opacity="0.2"/>
                <ellipse cx="19.5" cy="17" rx="2.5" ry="2.5" fill={wsConnected ? "#35eb85" : "#fff5"} />
              </svg>
              {globalReactionCount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Connection Status / Errors */}
        <div className="absolute top-5 left-6 z-40">
          {!wsConnected && (
            <div className="bg-[#2a194f] text-accent-red px-3 py-1 rounded-lg text-xs flex items-center font-semibold shadow"
                 style={{ letterSpacing: ".02em", border: "1.5px solid #e5091440" }}>
              <div className="w-2 h-2 bg-accent-red rounded-full mr-2 animate-pulse"></div> Connecting…
            </div>
          )}
          {(apiError || reactionError) && (
            <div className="mt-2">
              {apiError && <div className="bg-yellow-900/95 text-yellow-300 px-3 py-1 rounded text-xs mb-2 shadow">{apiError}</div>}
              {reactionError && <div className="bg-red-900/95 text-red-400 px-3 py-1 rounded text-xs shadow">{reactionError}</div>}
            </div>
          )}
        </div>

        {/* Netflix-Style Player Controls */}
        <div
          className={
            "absolute bottom-0 left-0 right-0 z-50 pointer-events-none transition-all duration-300" +
            (showControls ? " opacity-100 visible" : " opacity-0 invisible scale-100")
          }
        >
          <div
            className="flex items-end justify-center w-full" style={{
              background: "linear-gradient(0, #101114d6 65%, #1a1e29a8 85%, transparent 100%)"
            }}
          >
            <div
              className="w-full max-w-3xl mx-auto px-8 pb-6 flex flex-col pointer-events-auto"
              style={{ userSelect: "none" }}
            >
              {/* Progress/Seek Bar */}
              <div className="w-full mb-4 cursor-pointer group" onClick={handleSeek}>
                <div style={{
                  height: 7,
                  background: "rgba(245,245,250,0.08)",
                  borderRadius: 6,
                  position: "relative",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: `${(currentTime / duration) * 100 || 0}%`,
                    background: "linear-gradient(90deg, #d81233 0%, #b10237 65%, #fff 100%)",
                    height: "100%",
                    borderRadius: 6,
                    transition: "width .18s cubic-bezier(.4,0,.2,1)"
                  }}>
                    <div style={{
                      position: "absolute",
                      right: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 18,
                      height: 18,
                      borderRadius: 12,
                      background: "linear-gradient(90deg, #e50914 65%, #fff 100%)",
                      boxShadow: "0 2px 8px #e509144f",
                      opacity: 0.85,
                    }}></div>
                  </div>
                </div>
              </div>
              {/* Main Controls Section */}
              <div className="flex w-full flex-row items-center justify-between space-x-4">
                {/* Left Controls */}
                <div className="flex space-x-2 sm:space-x-3 items-center">
                  {/* Play / Pause */}
                  <button
                    aria-label={isPlaying ? "Pause" : "Play"}
                    onClick={togglePlayPause}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/15 hover:bg-accent-red/90 hover:scale-110 shadow
                      border-2 border-white/10 focus:outline-none transition-colors transition-transform duration-150 pointer-events-auto"
                  >
                    {isPlaying ? (
                      // Netflix pause
                      <svg width="27" height="27" viewBox="0 0 68 68" fill="none">
                        <rect x="16" y="15" width="8" height="38" rx="4" fill="#fff"/>
                        <rect x="44" y="15" width="8" height="38" rx="4" fill="#fff"/>
                      </svg>
                    ) : (
                      // Netflix Play
                      <svg width="27" height="27" viewBox="0 0 68 68" fill="none">
                        <path d="M20 14L56 34L20 54V14Z" fill="#fff" />
                      </svg>
                    )}
                  </button>
                  {/* Time */}
                  <span className="text-white/90 font-mono ml-2 text-xs sm:text-sm" style={{ minWidth: 64, textAlign: "right" }}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                {/* Center Controls: (Reserved for future, could add 10sec backward/forward, etc.) */}
                <div></div>
                {/* Right Controls */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {/* Volume (hide mobile) */}
                  <div className="hidden sm:flex items-center space-x-1 bg-black/15 px-2 py-1 rounded-lg">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" style={{ opacity: 0.8 }}>
                      <path d="M4 9v6h4l5 5V4L8 9H4z" fill="#fff"/>
                      <path d="M16 7c1.657 1.657 1.657 4.343 0 6" stroke="#fff" strokeWidth="1.7"/>
                    </svg>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-18 h-2 accent-accent-red border-none"
                      style={{
                        accentColor: "#E50914",
                        background: "transparent"
                      }}
                    />
                  </div>
                  {/* Quality */}
                  <div className="relative">
                    <button
                      onClick={() => setShowQualityMenu(!showQualityMenu)}
                      className="rounded bg-white/15 hover:bg-white/25 px-3 py-2 mr-1 text-sm text-white/90 focus:outline-none border border-white/10 pointer-events-auto"
                      aria-label="Select video quality"
                      style={{ fontWeight: 400, letterSpacing: ".01em" }}
                    >
                      {quality}
                      <svg width={16} height={12} fill="none" viewBox="0 0 16 16" className="inline-block ml-1">
                        <path d="M4 6l4 4 4-4" stroke="#fff" strokeWidth={2} strokeLinecap="round"/>
                      </svg>
                    </button>
                    {showQualityMenu && (
                      <div className="absolute right-0 bottom-full mb-2 bg-[#211C29EF] shadow-xl rounded w-28 text-left border border-[#fff2] overflow-hidden z-40"
                        style={{fontSize: 14}}>
                        {qualityOptions.map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setQuality(option);
                              setShowQualityMenu(false);
                            }}
                            className={`px-4 py-2 w-full block hover:bg-accent-red/70 text-white transition-all duration-150 text-left ${quality === option ? "bg-accent-red text-white font-semibold" : ""}`}
                            style={{ letterSpacing: 0.03 }}
                          >{option}</button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="rounded-full bg-white/15 hover:bg-accent-blue/70 focus:outline-none p-2 w-10 h-10 flex items-center justify-center transition"
                    aria-label="Toggle fullscreen"
                    title="Fullscreen"
                  >
                    <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="6" height="2" rx="1" fill="#fff"/>
                      <rect x="3" y="3" width="2" height="6" rx="1" fill="#fff"/>
                      <rect x="15" y="3" width="6" height="2" rx="1" fill="#fff"/>
                      <rect x="19" y="3" width="2" height="6" rx="1" fill="#fff"/>
                      <rect x="3" y="19" width="6" height="2" rx="1" fill="#fff"/>
                      <rect x="3" y="15" width="2" height="6" rx="1" fill="#fff"/>
                      <rect x="15" y="19" width="6" height="2" rx="1" fill="#fff"/>
                      <rect x="19" y="15" width="2" height="6" rx="1" fill="#fff"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoPlayer;
