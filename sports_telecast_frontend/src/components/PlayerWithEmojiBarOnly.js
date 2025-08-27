import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import './emojiBar.css';

/**
 * PUBLIC_INTERFACE
 * Minimal player-like container whose sole purpose is to visually host the Emoji Bar UI.
 * Now fetches emojis from a local Flask server (http://localhost:5050) and renders all icons as images.
 * The click animation logic is preserved but uses an <img> as the flying node content.
 */
const PlayerWithEmojiBarOnly = () => {
  /**
   * Local Flask server for emoji images and listing:
   * GET http://localhost:5050/fan-engagement/emoji/v1/listEmojis
   * Expected shape (per item, relevant fields):
   *   { id: string, name: string, description?: string, imageUrl: string, isSpecial?: boolean }
   */
  const [emojiList, setEmojiList] = useState([]);
  const [isLoadingEmojis, setIsLoadingEmojis] = useState(false);
  const [emojiError, setEmojiError] = useState(null);

  // Local state for transient "flying" emoji images
  const [flying, setFlying] = useState([]);
  const idCounter = useRef(0);
  const barRef = useRef(null);

  const handlePrev = () => {};
  const handleNext = () => {};

  // Fetch emojis from local Flask server
  useEffect(() => {
    let isMounted = true;
    const loadEmojis = async () => {
      setIsLoadingEmojis(true);
      setEmojiError(null);
      try {
        const res = await fetch('http://localhost:5050/fan-engagement/emoji/v1/listEmojis');
        if (!res.ok) {
          throw new Error(`Failed to fetch emojis: ${res.status}`);
        }
        const data = await res.json();
        // Accept both {emojis: []} or an array directly
        const list = Array.isArray(data) ? data : (Array.isArray(data.emojis) ? data.emojis : []);
        // Ensure imageUrl present; filter invalid
        const cleaned = list
          .filter(e => e && e.imageUrl)
          .map((e, idx) => ({
            id: e.id ?? `emoji-${idx}`,
            name: e.name ?? `emoji-${idx}`,
            description: e.description ?? e.name ?? 'emoji',
            imageUrl: e.imageUrl,
            isSpecial: Boolean(e.isSpecial)
          }));
        if (isMounted) setEmojiList(cleaned);
      } catch (err) {
        console.error(err);
        if (isMounted) setEmojiError('Unable to load emoji set from backend.');
      } finally {
        if (isMounted) setIsLoadingEmojis(false);
      }
    };
    loadEmojis();
    return () => {
      isMounted = false;
    };
  }, []);

  // Split into special + regular (first isSpecial or first item as special fallback)
  const { specialEmoji, regularEmojis } = useMemo(() => {
    if (!emojiList || emojiList.length === 0) return { specialEmoji: null, regularEmojis: [] };
    const special = emojiList.find(e => e.isSpecial) || emojiList[0];
    const rest = emojiList.filter(e => e !== special);
    return { specialEmoji: special, regularEmojis: rest };
  }, [emojiList]);

  /**
   * Create a deterministic set of items for testing if a seed is provided (optional).
   * Uses the emoji imageUrl as the visual for flying nodes.
   */
  const makeBurstItems = useCallback((imageUrl, spawnOffsetX, seed = null) => {
    const random = seed != null
      ? (() => {
          // Simple LCG for predictable pseudo-randoms in tests
          let s = seed;
          return () => {
            s = (s * 1664525 + 1013904223) % 4294967296;
            return s / 4294967296;
          };
        })()
      : Math.random;

    const r = (min, max) => random() * (max - min) + min;

    const baseNow = Date.now();
    const burstCount = Math.floor(r(3, 7)); // 3..6 inclusive

    return Array.from({ length: burstCount }).map((_, i) => {
      const id = `fly-${baseNow}-${idCounter.current++}`;

      const dur = r(1.85, 2.05);
      const delay = Math.max(0, Math.min(0.25, r(0.06 * i, 0.12 + 0.05 * i)));

      const baseX = r(22, 38);
      const jitter = r(-18, 18);
      const maybeFlip = r(0, 1) < 0.28 ? -1 : 1;
      const flyX = Math.round((baseX + jitter + spawnOffsetX) * maybeFlip);

      const flyY = '-62vh';

      const wobbleAmp = r(6, 12);
      const scaleStart = r(0.9, 0.96);
      const scalePeak = r(1.08, 1.14);
      const scaleEnd = r(0.96, 1.0);
      const rot = `${r(-6, 6).toFixed(1)}deg`;

      return {
        id,
        imageUrl,
        vars: {
          '--fly-dur': `${dur.toFixed(2)}s`,
          '--fly-delay': `${delay.toFixed(2)}s`,
          '--fly-x': `${flyX}px`,
          '--fly-y': flyY,
          '--wobble-amp': `${wobbleAmp.toFixed(1)}px`,
          '--scale-start': scaleStart.toFixed(2),
          '--scale-peak': scalePeak.toFixed(2),
          '--scale-end': scaleEnd.toFixed(2),
          '--rot': rot
        }
      };
    });
  }, []);

  /**
   * Spawn a burst of emoji images with randomized motion seeds.
   * Nodes are removed automatically on animationend for proper cleanup.
   */
  const spawnEmojiBurst = useCallback((imageUrl, spawnOffsetX = 0) => {
    if (!imageUrl) return;
    const newItems = makeBurstItems(imageUrl, spawnOffsetX);
    setFlying(prev => {
      const combined = [...prev, ...newItems];
      return combined.slice(-60);
    });
  }, [makeBurstItems]);

  /**
   * On emoji click we compute an offset so the burst appears to originate near the clicked emoji,
   * then spawn the burst with the emoji image.
   */
  const handleEmojiClick = (emoji, evt) => {
    if (!emoji) return;

    let offsetX = 0;
    if (barRef.current && evt?.currentTarget) {
      try {
        const barRect = barRef.current.getBoundingClientRect();
        const btnRect = evt.currentTarget.getBoundingClientRect();
        const btnCenter = btnRect.left + btnRect.width / 2;
        const barCenter = barRect.left + barRect.width / 2;
        offsetX = Math.max(-80, Math.min(80, btnCenter - barCenter));
      } catch {
        offsetX = 0;
      }
    }

    spawnEmojiBurst(emoji.imageUrl, offsetX * 0.6);
  };

  // Helper: Alt label for accessibility
  const getEmojiAriaLabel = (emoji) => {
    const name = emoji?.description || emoji?.name || 'emoji';
    return `Send ${name} reaction`;
  };

  // Render helper: single emoji button (Image-based)
  const EmojiButton = ({ emoji, isSpecial = false }) => {
    const key = emoji?.id || emoji?.name;

    return (
      <button
        key={key}
        className={`emoji${isSpecial ? ' special' : ''}`}
        aria-label={getEmojiAriaLabel(emoji)}
        onClick={(e) => handleEmojiClick(emoji, e)}
        type="button"
        title={emoji?.description || emoji?.name || 'Reaction'}
      >
        {/* Render as image always */}
        <img
          className="emoji-glyph"
          src={emoji.imageUrl}
          alt={emoji?.description || emoji?.name || 'emoji'}
          width={24}
          height={24}
          style={{ display: 'block', width: 24, height: 24, objectFit: 'contain' }}
          crossOrigin="anonymous"
        />
      </button>
    );
  };

  return (
    <div className="emoji-demo-wrapper">
      {/* Faux player surface just to showcase placement */}
      <div className="emoji-demo-surface" role="img" aria-label="Mock player surface to host emoji bar">
        <div className="emoji-demo-title">
          Emoji Bar Demo (images from Flask)
        </div>

        {/* Emoji Bar */}
        <div ref={barRef} className="emoji-bar visible" role="group" aria-label="Emoji reactions toolbar">
          {/* Loading / Error state inline for clarity */}
          {isLoadingEmojis && (
            <div className="text-xs text-white/80 px-2 py-1">Loading emojis…</div>
          )}
          {emojiError && !isLoadingEmojis && (
            <div className="text-xs text-red-300 px-2 py-1">Failed to load emojis</div>
          )}

          {/* Special emoji first */}
          {!isLoadingEmojis && !emojiError && specialEmoji && <EmojiButton emoji={specialEmoji} isSpecial />}

          {/* Standard set */}
          {!isLoadingEmojis && !emojiError && regularEmojis.map((e) => (
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

          {/* Transient flying emojis (render images) */}
          <div className="emoji-fly-layer" aria-hidden="true">
            {flying.map((f) => (
              <span
                key={f.id}
                className="flying-emoji"
                style={{
                  '--fly-dur': f.vars['--fly-dur'],
                  '--fly-delay': f.vars['--fly-delay'],
                  '--fly-x': f.vars['--fly-x'],
                  '--fly-y': f.vars['--fly-y'],
                  '--wobble-amp': f.vars['--wobble-amp'],
                  '--scale-start': f.vars['--scale-start'],
                  '--scale-peak': f.vars['--scale-peak'],
                  '--scale-end': f.vars['--scale-end'],
                  '--rot': f.vars['--rot']
                }}
                onAnimationEnd={() => {
                  setFlying(prev => prev.filter(x => x.id !== f.id));
                }}
              >
                <span className="flying-emoji-wobble" aria-hidden="true">
                  <img
                    src={f.imageUrl}
                    alt=""
                    width={24}
                    height={24}
                    style={{ display: 'inline-block', width: 24, height: 24, objectFit: 'contain' }}
                    crossOrigin="anonymous"
                  />
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * PUBLIC_INTERFACE
 * Export helper to facilitate unit testing of burst generation.
 */
export const __testables__ = {
  // Note: makeBurstItems uses a deterministic RNG when a seed is passed.
  createBurstForTest: (componentInstance, imageUrl = 'http://localhost:5050/static/sample.png', spawnOffsetX = 0, seed = 1234) => {
    return componentInstance?.makeBurstItems
      ? componentInstance.makeBurstItems(imageUrl, spawnOffsetX, seed)
      : [];
  }
};

export default PlayerWithEmojiBarOnly;
