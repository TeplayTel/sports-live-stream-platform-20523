// PUBLIC_INTERFACE
/**
 * Mock data service - provides static data for UI components.
 * This file now only includes non-match related mock data for legacy support.
 */

class MockDataService {

  // Mock sports data with counts (may be used for filter dropdowns etc.)
  static getSports() {
    return [
      { name: 'All', count: 47 },
      { name: 'Football', count: 18 },
      { name: 'Basketball', count: 12 },
      { name: 'Tennis', count: 8 },
      { name: 'Baseball', count: 5 },
      { name: 'Hockey', count: 3 },
      { name: 'Cricket', count: 1 }
    ];
  }

  // Remove all match-related mock data, methods, and logic.
  // Only retain non-match utilities if required in your UI.
  
  // PUBLIC_INTERFACE
  /**
   * Simulate API delay for realistic UX
   * @param {number} delay - Delay in milliseconds
   * @returns {Promise} Promise that resolves after delay
   */
  static simulateNetworkDelay(delay = 300) {
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}

export default MockDataService;
