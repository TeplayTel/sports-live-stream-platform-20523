import React, { useMemo, useRef, useState } from 'react';
import './emojiBar.css';

/**
 * PUBLIC_INTERFACE
 * Minimal player-like container whose sole purpose is to visually host the Emoji Bar UI.
 * This version intentionally uses a hardcoded emoji set and a refined CSS animation on click
 * that matches the "easy breezy" spec from assets/emoji_fly_animation_notes.md.
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

  // Util: random within range
  const rand = (min, max) => Math.random() * (max - min) + min;

  /**
   * On click, spawn one or more transient emoji elements with randomized motion seeds.
   * Each element sets CSS variables to control duration, delay, drift, wobble, scale and rotation.
   * Nodes are removed automatically on animationend for proper cleanup.
   */
  const handleEmojiClick = (emoji) => {
    if (!emoji) return;

    // Small chance to spawn a second emoji for lively bursts
    const count = Math.random() < 0.25 ? 2 : 1;

    const newItems = Array.from({ length: count }).map((_, i) => {
      const id = `fly-${Date.now()}-${idCounter.current++}`;

      // Motion parameters based on spec
      const dur = rand(1.7, 2.0).toFixed(2);                 // seconds
      const delay = (i === 0 ? rand(0, 0.08) : rand(0.06, 0.12)).toFixed(2); // stagger
      const baseX = 32;                                      // px drift to the right bias
      const jitter = rand(-20, 20);                          // px
      const flyX = baseX + jitter;
      const wobbleAmp = rand(6, 10).toFixed(1);              // px
      const scaleStart = rand(0.86, 0.94).toFixed(2);
      const scalePeak = rand(1.05, 1.12).toFixed(2);
      const scaleEnd = rand(0.98, 1.00).toFixed(2);
      const rot = `${rand(-4, 4).toFixed(1)}deg`;
      const flyY = '-62vh';                                  // travel up before top HUD

      return {
        id,
        glyph: emoji.glyph,
        vars: {
          '--fly-dur': `${dur}s`,
          '--fly-delay': `${delay}s`,
          '--fly-x': `${flyX}px`,
          '--fly-y': flyY,
          '--wobble-amp': `${wobbleAmp}px`,
          '--scale-start': scaleStart,
          '--scale-peak': scalePeak,
          '--scale-end': scaleEnd,
          '--rot': rot
        }
      };
    });

    setFlying(prev => [...prev, ...newItems]);
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
                style={f.vars}
                onAnimationEnd={() => {
                  // Cleanup DOM node after the fly animation completes
                  setFlying(prev => prev.filter(x => x.id !== f.id));
                }}
              >
                <span className="flying-emoji-wobble">{f.glyph}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerWithEmojiBarOnly;
