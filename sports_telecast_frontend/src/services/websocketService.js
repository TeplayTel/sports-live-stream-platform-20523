// PUBLIC_INTERFACE
/**
 * WebSocket service for real-time communication
 * Handles WebSocket connections for live emoji reactions and match updates
 */

class WebSocketService {
  constructor() {
    this.wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:8000';
    this.connection = null;
    this.eventId = null;
    this.token = null;
    this.reconnectInterval = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.listeners = {
      reaction: [],
      connect: [],
      disconnect: [],
      error: []
    };
    this.isConnecting = false;
    this.shouldReconnect = true;
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
  }

  // PUBLIC_INTERFACE
  /**
   * Connect to WebSocket for a specific event
   * @param {string} eventId - Event identifier
   * @returns {Promise<void>}
   */
  async connect(eventId) {
    if (this.isConnecting || (this.connection && this.connection.readyState === WebSocket.OPEN)) {
      return;
    }

    this.eventId = eventId;
    this.isConnecting = true;
    this.shouldReconnect = true;

    try {
      // Construct WebSocket URL with token if available
      let wsUrl = `${this.wsUrl}/ws/${eventId}`;
      if (this.token) {
        wsUrl += `?token=${this.token}`;
      }

      console.log('🔌 Connecting to WebSocket:', wsUrl);
      
      this.connection = new WebSocket(wsUrl);
      
      this.connection.onopen = (event) => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        console.log('✅ WebSocket connected successfully');
        this.emit('connect', { eventId, event });
      };

      this.connection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', data);
          
          // Handle different message types
          switch (data.type) {
            case 'emoji_reaction':
            case 'reaction_update':
              this.emit('reaction', data);
              break;
            case 'connection_stats':
              console.log('📊 Connection stats:', data);
              break;
            default:
              console.log('📝 Unknown message type:', data.type);
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
        }
      };

      this.connection.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.isConnecting = false;
        this.emit('error', { error, eventId });
      };

      this.connection.onclose = (event) => {
        console.log('🔌 WebSocket connection closed:', event.code, event.reason);
        this.isConnecting = false;
        this.emit('disconnect', { event, eventId });
        
        // Attempt to reconnect if needed
        if (this.shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.scheduleReconnect();
        }
      };

    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error);
      this.isConnecting = false;
      this.emit('error', { error, eventId });
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Disconnect WebSocket connection
   */
  disconnect() {
    this.shouldReconnect = false;
    
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
      this.reconnectInterval = null;
    }

    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }

    console.log('🔌 WebSocket disconnected manually');
  }

  // Schedule reconnection attempt
  scheduleReconnect() {
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // Exponential backoff, max 30s
    
    console.log(`🔄 Scheduling WebSocket reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
    
    this.reconnectInterval = setTimeout(() => {
      if (this.eventId && this.shouldReconnect) {
        this.connect(this.eventId);
      }
    }, delay);
  }

  // PUBLIC_INTERFACE
  /**
   * Send message through WebSocket
   * @param {Object} message - Message to send
   */
  send(message) {
    if (this.connection && this.connection.readyState === WebSocket.OPEN) {
      try {
        this.connection.send(JSON.stringify(message));
        console.log('📤 WebSocket message sent:', message);
      } catch (error) {
        console.error('❌ Error sending WebSocket message:', error);
      }
    } else {
      console.warn('⚠️ WebSocket not connected, cannot send message:', message);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Add event listener
   * @param {string} event - Event name (reaction, connect, disconnect, error)
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function to remove
   */
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  // Emit event to listeners
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`❌ Error in ${event} listener:`, error);
        }
      });
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Get connection status
   * @returns {string} Connection status
   */
  getStatus() {
    if (!this.connection) return 'disconnected';
    
    switch (this.connection.readyState) {
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.OPEN: return 'connected';
      case WebSocket.CLOSING: return 'closing';
      case WebSocket.CLOSED: return 'disconnected';
      default: return 'unknown';
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Check if WebSocket is connected
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.connection && this.connection.readyState === WebSocket.OPEN;
  }
}

// Create and export singleton instance
const websocketService = new WebSocketService();
export default websocketService;
