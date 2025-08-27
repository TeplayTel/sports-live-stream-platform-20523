import React, { useMemo, useRef, useState } from 'react';
import './emojiBar.css';

/**
 * PUBLIC_INTERFACE
 * Minimal player-like container whose sole purpose is to visually host the Emoji Bar UI.
 * This version intentionally uses a hardcoded emoji set and a CSS-only "fly" animation on click
 * for testing/validation without any backend calls.
 */
const PlayerWithEmojiBarOnly = () => {
  /**
   * Hardcoded emoji set for animation testing (no backend).
   * The first entry is treated as the "special" highlighted emoji.
   */
  const HARD_EMOJIS = useMemo(
    () => ([
      { id: 'spark-heart', name: 'favorite', description: 'Favorite', glyph: '💖', isSpecial: true },
      { id: 'love-eyes', name: 'love-eyes', description: 'Love eyes', glyph: '😍' },
      { id: 'clap', name: 'clap', description: 'Clap', glyph: '👏' },
      { id: 'joy', name: 'joy', description: 'Tears of joy', glyph: '😂' },
      { id: 'wow', name: 'wow', description: 'Wow', glyph: '😮' },
      { id: 'fire', name: 'fire', description: 'Fire', glyph: '🔥' },
      { id: 'soccer', name: 'soccer', description: 'Football', glyph: '⚽' },
    ]),
    []
  );

  const { specialEmoji, regularEmojis } = useMemo(() => {
    const special = HARD_EMOJIS.find(e => e.isSpecial) || HARD_EMOJIS[0];
    const rest = HARD_EMOJIS.filter(e => e !== special);
    return { specialEmoji: special, regularEmojis: rest };
  }, [HARD_EMOJIS]);

  // Local state for transient "flying" emojis
  const [flying, setFlying] = useState([]);
  const idCounter = useRef(0);
  const barRef = useRef(null);

  const handlePrev = () => {};
  const handleNext = () => {};

  /**
   * On click, spawn a transient emoji element that flies upward with CSS animation
   * and gets removed once the animation ends.
   */
  const handleEmojiClick = (emoji) => {
    if (!emoji) return;

    // Determine a slight horizontal curve variation so multiple clicks look natural
    const curve = (Math.random() * 30 - 15).toFixed(1); // -15px..15px
    const rotation = `${Math.random() > 0.5 ? 360 : 540}deg`;
    const id = `fly-${Date.now()}-${idCounter.current++}`;

    const item = {
      id,
      glyph: emoji.glyph,
      curve,
      rotation,
    };

    setFlying(prev => [...prev, item]);

    // Auto-remove after animation completes (~900ms)
    setTimeout(() => {
      setFlying(prev => prev.filter(f => f.id !== id));
    }, 1000);
  };

  // Helper: Alt label for accessibility
  const getEmojiAriaLabel = (emoji) => {
    const name = emoji?.description || emoji?.name || 'emoji';
    return `Send ${name} reaction`;
  };

  // Render helper: single emoji button (Unicode-based)
  const EmojiButton = ({ emoji, isSpecial = false }) => {
    const key = emoji?.id || emoji?.name;

    return (
      <button
        key={key}
        className={`emoji${isSpecial ? ' special' : ''}`}
        aria-label={getEmojiAriaLabel(emoji)}
        onClick={() => handleEmojiClick(emoji)}
        type="button"
        title={emoji?.description || emoji?.name || 'Reaction'}
      >
        <span className="emoji-glyph" aria-hidden="true" style={{ fontSize: 24, display: 'block' }}>
            {emoji.glyph}
        </span>
      </button>
    );
  };

  return (
    <div className="emoji-demo-wrapper">
      {/* Faux player surface just to showcase placement */}
      <div className="emoji-demo-surface" role="img" aria-label="Mock player surface to host emoji bar">
        <div className="emoji-demo-title">Emoji Bar Demo (hardcoded, with fly animation)</div>

        {/* Emoji Bar */}
        <div ref={barRef} className="emoji-bar visible" role="group" aria-label="Emoji reactions toolbar">
          {/* Special emoji first */}
          {specialEmoji && <EmojiButton emoji={specialEmoji} isSpecial />}

          {/* Standard set */}
          {regularEmojis.map((e) => (
            <EmojiButton key={e.id} emoji={e} />
          ))}

          <div className="spacer" aria-hidden="true" />

          {/* Navigation buttons (non-functional) */}
          <button
            className="nav-btn prev"
            aria-label="Previous reactions"
            onClick={handlePrev}
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <button
            className="nav-btn next"
            aria-label="Next reactions"
            onClick={handleNext}
            type="button"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                 strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          {/* Transient flying emojis */}
          <div className="emoji-fly-layer" aria-hidden="true">
            {flying.map((f) => (
              <span
                key={f.id}
                className="flying-emoji"
                style={{
                  '--curve': `${f.curve}px`,
                  '--rotation': f.rotation,
                }}
              >
                {f.glyph}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerWithEmojiBarOnly;
