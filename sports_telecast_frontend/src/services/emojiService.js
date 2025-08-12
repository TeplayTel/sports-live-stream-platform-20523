 // PUBLIC_INTERFACE
/**
 * Emoji service for backend API integration
 * Handles emoji reactions, fetching available emojis, and event summaries
 */

class EmojiService {
  constructor() {
    this.apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    /**
     * Default token for ADMIN upload operations.
     * Can be overridden via REACT_APP_EMOJI_UPLOAD_TOKEN environment variable
     * or at runtime via setToken(). By default set to 'admin' to match sample usage.
     */
    this.token = process.env.REACT_APP_EMOJI_UPLOAD_TOKEN || 'admin';
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
  }

  // Get authorization headers for JSON-based requests
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

  /**
   * Build headers for multipart upload (FormData).
   * Intentionally does not set Content-Type so browser sets proper multipart boundary.
   */
  getUploadHeaders(userId = null, username = null) {
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
   * Submit an emoji reaction for a live event.
   * Sends payload in required camelCase schema:
   * {
   *   "userId": string,
   *   "eventId": string,
   *   "emojiId": string,
   *   "createdAt": string (ISO-8601)
   * }
   * Headers include 'Content-Type: application/json' and 'Authorization: Bearer <token>' if a token has been set via setToken().
   *
   * @param {string} eventId - Event identifier
   * @param {string} emojiId - Emoji identifier (may be provided as snake_case from callers; this function normalizes)
   * @param {string|null} userId - Optional user id; if not provided, attempts to read from window.mockUser.user_id
   * @returns {Promise<Object>} Reaction response
   */
  async submitReaction(eventId, emojiId, userId = null) {
    try {
      // Resolve userId from explicit arg or global mock
      let resolvedUserId = userId;
      if (!resolvedUserId && typeof window !== 'undefined' && window.mockUser && (window.mockUser.user_id || window.mockUser.userId)) {
        resolvedUserId = window.mockUser.user_id || window.mockUser.userId;
      }
      if (!resolvedUserId) resolvedUserId = 'mock-user-001';

      // Normalize IDs that may arrive in snake_case from callers
      const normalizedEmojiId = emojiId;

      const url = `${this.apiUrl}/fan-engagement/emoji/v1/userEmojiReaction`;

      // Construct backend-required camelCase payload with only allowed fields
      const body = {
        userId: String(resolvedUserId),
        eventId: String(eventId),
        emojiId: String(normalizedEmojiId),
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(), // includes Content-Type and Authorization (if token set)
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

  // PUBLIC_INTERFACE
  /**
   * Upload a new emoji asset (admin operation).
   * Uses multipart/form-data and requires Authorization: Bearer <token>.
   * By default, this service uses token 'admin' (override with REACT_APP_EMOJI_UPLOAD_TOKEN or setToken()).
   *
   * @param {File|Blob} file - The emoji image file to upload
   * @param {Object} options - Optional fields for metadata
   * @param {string} [options.name] - Display name of the emoji
   * @param {string} [options.emojiType] - Emoji type key (e.g., 'heart', 'laugh', ...)
   * @param {boolean} [options.isActive] - Whether the emoji is active
   * @param {number} [options.sortOrder] - Sorting order
   * @returns {Promise<Object>} Upload response JSON
   */
  async uploadEmoji(file, options = {}) {
    try {
      const url = `${this.apiUrl}/fan-engagement/emoji/v1/upload`;
      const formData = new FormData();

      formData.append('file', file);
      if (options.name) formData.append('name', options.name);
      if (options.emojiType) formData.append('emojiType', options.emojiType);
      if (typeof options.isActive === 'boolean') formData.append('isActive', String(options.isActive));
      if (typeof options.sortOrder === 'number') formData.append('sortOrder', String(options.sortOrder));

      const response = await fetch(url, {
        method: 'POST',
        headers: this.getUploadHeaders(),
        body: formData,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error uploading emoji:', error);
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
