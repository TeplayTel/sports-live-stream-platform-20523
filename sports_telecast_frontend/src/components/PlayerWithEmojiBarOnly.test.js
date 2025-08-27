import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PlayerWithEmojiBarOnly from './PlayerWithEmojiBarOnly';

/**
 * Tests focus on DOM evidence of a "burst":
 * - Clicking an emoji button should add 3–6 elements with class 'flying-emoji'
 * - animationend should remove them (simulated by dispatching the event)
 */
describe('PlayerWithEmojiBarOnly - emoji burst', () => {
  test('click spawns a burst of 3–6 flying emojis and cleans up on animationend', () => {
    render(<PlayerWithEmojiBarOnly />);

    // Find a non-special emoji button by title (from component: description or name)
    const clapBtn = screen.getByRole('button', { name: /send clap reaction/i });
    expect(clapBtn).toBeInTheDocument();

    // Pre-condition: no flying emoji
    expect(document.querySelectorAll('.flying-emoji').length).toBe(0);

    // Click to spawn
    fireEvent.click(clapBtn);

    // After click, we should have between 3 and 6 flying emojis
    const flyingAfterClick = document.querySelectorAll('.flying-emoji');
    expect(flyingAfterClick.length).toBeGreaterThanOrEqual(3);
    expect(flyingAfterClick.length).toBeLessThanOrEqual(6);

    // Simulate animationend on each to ensure cleanup
    flyingAfterClick.forEach(node => {
      fireEvent.animationEnd(node);
    });

    // After cleanup, all should be removed
    expect(document.querySelectorAll('.flying-emoji').length).toBe(0);
  });
});
