// PUBLIC_INTERFACE
/**
 * Emoji service for backend API integration
 * Handles emoji reactions, fetching available emojis, and event summaries
 */

class EmojiService {
  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    this.token = null;
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
  }

  // Get authorization headers
  getHeaders(userId = null, username = null) {
    // Try to use window.mockUser if available, else parameters
    let mockUserId = userId, mockUsername = username;
    if ((!mockUserId || !mockUsername) && typeof window !== 'undefined' && window.mockUser) {
      const user = window.mockUser;
      if (!mockUserId && user && user.user_id) mockUserId = user.user_id;
      if (!mockUsername && user && user.username) mockUsername = user.username;
    }
    if (!mockUserId) mockUserId = 'mock-user-001';
    if (!mockUsername) mockUsername = 'mockfan';

    const headers = {
      'Content-Type': 'application/json',
      'X-Mock-User-Id': mockUserId,
      'X-Mock-Username': mockUsername,
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  // Handle API response
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // PUBLIC_INTERFACE
  /**
   * Get list of available emojis
   * @param {number} pageNo - Page number (default: 1)
   * @param {number} pageSize - Page size (default: 10)
   * @returns {Promise<Object>} Emoji list response
   */
  async getEmojis(pageNo = 1, pageSize = 10) {
    try {
      const url = `${this.apiUrl}/fan-engagement/emoji/v1/listEmojis?pageNo=${pageNo}&pageSize=${pageSize}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching emojis:', error);
      throw error;
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Submit an emoji reaction for a live event
   * @param {string} eventId - Event identifier
   * @param {string} emojiId - Emoji identifier
   * @param {string} userId - Mock user identifier (optional; if not supplied will use default)
   * @param {object} userData - Mock user data (optional)
   * @returns {Promise<Object>} Reaction response
   */
  async submitReaction(eventId, emojiId, userId = null, userData = null) {
    try {
      // Try to use window.mockUser or pass userId/userData if provided (so that context-integrated APIs work)
      let mockUserId = userId;
      let mockUser = userData;
      // Check if window.mockUser is available (from React context integration via a global, see App.js usage below)
      if (!mockUserId && typeof window !== 'undefined' && window.mockUser && window.mockUser.user_id) {
        mockUserId = window.mockUser.user_id;
        mockUser = window.mockUser;
      }
      if (!mockUserId) mockUserId = 'mock-user-001';

      const url = `${this.apiUrl}/fan-engagement/emoji/v1/userEmojiReaction`;
      const body = {
        event_id: eventId,
        emoji_id: emojiId,
        created_at: new Date().toISOString(),
        user_id: mockUserId, // Add mock userId property for all POSTs
        user_data: mockUser, // Optionally include userData for backend debug/development
      };

      // Remove undefined/nulls
      Object.keys(body).forEach(key => (body[key] == null) && delete body[key]);
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error submitting reaction:', error);
      throw error;
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Get emoji reaction summary for an event
   * @param {string} eventId - Event identifier
   * @returns {Promise<Object>} Reaction summary
   */
  async getEventReactions(eventId) {
    try {
      const url = `${this.apiUrl}/fan-engagement/emoji/v1/reactions/${eventId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching event reactions:', error);
      throw error;
    }
  }

  // Fallback emoji data for when API is unavailable
  getFallbackEmojis() {
    return {
      status: 'SUCCESS',
      emojis: [
        {
          emoji_id: 'EMJ001',
          emoji_type: 'heart',
          name: 'Love',
          image_url: '',
          is_active: true,
          sort_order: 1
        },
        {
          emoji_id: 'EMJ002',
          emoji_type: 'laugh',
          name: 'Laugh',
          image_url: '',
          is_active: true,
          sort_order: 2
        },
        {
          emoji_id: 'EMJ003',
          emoji_type: 'shocked',
          name: 'Wow',
          image_url: '',
          is_active: true,
          sort_order: 3
        },
        {
          emoji_id: 'EMJ004',
          emoji_type: 'clap',
          name: 'Clap',
          image_url: '',
          is_active: true,
          sort_order: 4
        },
        {
          emoji_id: 'EMJ005',
          emoji_type: 'fire',
          name: 'Fire',
          image_url: '',
          is_active: true,
          sort_order: 5
        },
        {
          emoji_id: 'EMJ006',
          emoji_type: 'goal',
          name: 'Soccer',
          image_url: '',
          is_active: true,
          sort_order: 6
        }
      ],
      total: 6,
      page: 1,
      page_size: 10
    };
  }
}

// Create and export singleton instance
const emojiService = new EmojiService();
export default emojiService;
