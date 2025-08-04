import React, { useRef, useEffect, useState } from 'react';

// PUBLIC_INTERFACE
const VideoPlayer = ({ currentMatch }) => {
  const videoRef = useRef(null);
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [quality, setQuality] = useState('HD');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  
  const emojis = [
    { emoji: '❤️', color: '#ff1744' },
    { emoji: '😂', color: '#ffeb3b' },
    { emoji: '😮', color: '#2196f3' },
    { emoji: '👏', color: '#4caf50' },
    { emoji: '🔥', color: '#ff5722' },
    { emoji: '⚽', color: '#ffffff' }
  ];

  const qualityOptions = ['4K', 'HD', '720p', '480p', 'Auto'];

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

  const handleEmojiReaction = (emoji, color) => {
    const newReaction = {
      id: Date.now() + Math.random(),
      emoji: emoji.emoji,
      color,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20
    };
    
    setReactions(prev => [...prev, newReaction]);
    
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 3000);
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
      {/* Live Indicators */}
      <div className="absolute top-4 left-4 z-30 flex items-center space-x-3">
        <div className="bg-accent-red text-white px-3 py-1 rounded-full text-xs font-bold pulse-glow flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full bounce-subtle"></div>
          <span>LIVE</span>
        </div>
        <div className="glass-effect text-white px-3 py-1 rounded-full text-xs font-medium">
          {quality}
        </div>
      </div>

      {/* Quality Selector */}
      <div className="absolute top-4 right-4 z-30">
        <div className="relative">
          <button
            onClick={() => setShowQualityMenu(!showQualityMenu)}
            className="glass-effect text-white p-2 rounded-lg hover:bg-white/20 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          
          {showQualityMenu && (
            <div className="absolute right-0 top-full mt-2 bg-secondary-bg border border-border-color rounded-lg shadow-xl overflow-hidden slide-in-right">
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
      </div>
      
      {/* Video Element */}
      <div className="relative aspect-video group">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster="/api/placeholder/800/450"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          <source src="/api/placeholder/video" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Hover Overlay for Reactions */}
        <div className="absolute inset-0 z-20">
          {/* Floating Reactions */}
          {reactions.map((reaction) => (
            <div
              key={reaction.id}
              className="absolute text-2xl pointer-events-none z-30"
              style={{
                left: `${reaction.x}%`,
                top: `${reaction.y}%`,
                color: reaction.color,
                animation: 'float-up 3s ease-out forwards',
                textShadow: '0 0 10px currentColor'
              }}
            >
              {reaction.emoji}
            </div>
          ))}

          {/* Reaction Buttons */}
          {showReactions && (
            <div className="absolute bottom-20 right-4 flex flex-col space-y-2 slide-in-right">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiReaction(emoji, emoji.color)}
                  className="glass-effect hover:bg-white/20 rounded-full p-3 text-xl transition-all duration-200 hover-scale transform hover:rotate-12"
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    boxShadow: `0 0 20px ${emoji.color}40`
                  }}
                >
                  {emoji.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Custom Video Controls */}
        <div className={`absolute bottom-0 left-0 right-0 z-25 transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <div 
                className="h-1 bg-white/20 rounded-full cursor-pointer hover:h-2 transition-all duration-200"
                onClick={handleSeek}
              >
                <div 
                  className="h-full bg-gradient-primary rounded-full relative"
                  style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Play/Pause */}
                <button
                  onClick={togglePlayPause}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 hover-scale"
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>

                {/* Volume */}
                <div className="flex items-center space-x-2">
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
                    className="w-20 accent-accent-blue"
                  />
                </div>

                {/* Time Display */}
                <div className="text-white text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-white hover:text-accent-blue transition-colors hover-scale"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Match Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
        <div className="flex items-end justify-between text-white">
          <div className="space-y-1">
            <h3 className="text-xl font-bold">
              {currentMatch.homeTeam} vs {currentMatch.awayTeam}
            </h3>
            <p className="text-sm text-gray-300 flex items-center space-x-2">
              <span>{currentMatch.competition}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-accent-green rounded-full bounce-subtle"></div>
                <span>Live</span>
              </span>
            </p>
          </div>
          <div className="text-right space-y-1">
            <div className="text-3xl font-mono font-bold">
              {currentMatch.homeScore} - {currentMatch.awayScore}
            </div>
            <div className="text-sm text-gray-300">{currentMatch.time}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
