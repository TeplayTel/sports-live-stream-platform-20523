import React, { useRef, useEffect, useState, useCallback } from 'react';
import ReactPlayer from 'react-player';
import ApiService from '../services/api';

// PUBLIC_INTERFACE
const VideoPlayer = ({ currentMatch, apiConnected }) => {
  /**
   * This is a stable, simplified version of the VideoPlayer that compiles cleanly.
   * It preserves key features: ReactPlayer, play/pause, volume, simple emoji reactions,
   * and error/loading states. Complex, previously malformed sections were removed.
   */

  const playerRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(null);
  const [showControls, setShowControls] = useState(true);

  // Basic emoji reactions (local only to avoid API and WebSocket complexity)
  const emojis = [
    { emoji: '❤️', name: 'love', color: '#ff1744' },
    { emoji: '😂', name: 'laugh', color: '#ffeb3b' },
    { emoji: '😮', name: 'wow', color: '#2196f3' },
    { emoji: '👏', name: 'clap', color: '#4caf50' },
    { emoji: '🔥', name: 'fire', color: '#ff5722' },
    { emoji: '⚽', name: 'soccer', color: '#ffffff' },
  ];

  const [emojiCounts, setEmojiCounts] = useState({
    love: 0,
    laugh: 0,
    wow: 0,
    clap: 0,
    fire: 0,
    soccer: 0,
  });
  const [globalReactionCount, setGlobalReactionCount] = useState(0);

  const videoUrl =
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  // Handlers
  const onReady = () => {
    setIsVideoLoading(false);
    setVideoError(null);
  };
  const onStart = () => setIsVideoLoading(false);
  const onPlay = () => setIsPlaying(true);
  const onPause = () => setIsPlaying(false);
  const onBuffer = () => setIsVideoLoading(true);
  const onBufferEnd = () => setIsVideoLoading(false);
  const onProgress = (state) => setCurrentTime(state.playedSeconds);
  const onDuration = (d) => setDuration(d);
  const onError = (err) => {
    console.error('ReactPlayer error:', err);
    setVideoError('Failed to load video. Please try again.');
    setIsVideoLoading(false);
    setIsPlaying(false);
  };

  // Controls auto-hide
  useEffect(() => {
    let timeout;
    const reset = () => {
      clearTimeout(timeout);
      setShowControls(true);
      if (isPlaying) {
        timeout = setTimeout(() => setShowControls(false), 3000);
      }
    };

    const container = containerRef.current;
    if (!container) return;

    const onMove = () => reset();
    const onClick = () => reset();

    container.addEventListener('mousemove', onMove);
    container.addEventListener('click', onClick);

    return () => {
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('click', onClick);
      clearTimeout(timeout);
    };
  }, [isPlaying]);

  const togglePlayPause = () => setIsPlaying((p) => !p);

  const handleSeek = (e) => {
    if (!playerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = percent * duration;
    playerRef.current.seekTo(seekTime, 'seconds');
  };

  const handleVolumeChange = (e) => setVolume(parseFloat(e.target.value));

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleEmojiReaction = useCallback((emoji) => {
    setEmojiCounts((prev) => ({
      ...prev,
      [emoji.name]: (prev[emoji.name] || 0) + 1,
    }));
    setGlobalReactionCount((prev) => prev + 1);
  }, []);

  return (
    <div className="relative bg-black rounded-xl overflow-hidden shadow-xl hover-lift group">
      {/* Player container */}
      <div ref={containerRef} className="relative aspect-video group">
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
          onReady={onReady}
          onStart={onStart}
          onPlay={onPlay}
          onPause={onPause}
          onBuffer={onBuffer}
          onBufferEnd={onBufferEnd}
          onProgress={onProgress}
          onDuration={onDuration}
          onError={onError}
          config={{
            file: {
              attributes: {
                poster:
                  'https://via.placeholder.com/800x450/1a1a1a/ffffff?text=Sports+Stream',
              },
            },
          }}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />

        {/* Loading Overlay */}
        {(isVideoLoading) && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
              <p className="text-white text-lg font-medium">
                Loading stream...
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

        {/* Simple Emoji Bar */}
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
          style={{ bottom: '56px', zIndex: 30 }}
        >
          <div className="bg-black/80 backdrop-blur-md px-3 py-2 flex items-center gap-2 rounded-2xl border border-white/10">
            {emojis.map((emoji) => (
              <button
                key={emoji.name}
                onClick={() => handleEmojiReaction(emoji)}
                className="px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
                title={`React with ${emoji.name}`}
                aria-label={`React with ${emoji.name}, current count: ${emojiCounts[emoji.name]}`}
                style={{ color: emoji.color }}
              >
                <span style={{ fontSize: 22, lineHeight: 1 }}>{emoji.emoji}</span>
                <span className="text-white/80 ml-1 text-xs font-semibold">{emojiCounts[emoji.name]}</span>
              </button>
            ))}
            <div className="ml-3 pl-3 border-l border-white/20 text-white/90 text-xs font-bold">
              {globalReactionCount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        >
          <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
            {/* Progress */}
            <div className="mb-4">
              <div
                className="h-1 bg-white/20 cursor-pointer hover:h-2 transition-all duration-200 rounded"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 relative rounded"
                  style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white shadow-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={togglePlayPause}
                  className="p-2 bg-white/20 hover:bg-white/30 transition-all rounded"
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                <div className="hidden sm:flex items-center space-x-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20"
                    style={{ accentColor: '#2196f3' }}
                  />
                </div>

                <div className="text-white text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
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
