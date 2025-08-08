// PUBLIC_INTERFACE
/**
 * Mock data service - provides static data for all UI components
 * This replaces backend API calls with static mock data while maintaining structure
 */

class MockDataService {
  
  // Mock matches data
  static getMatches() {
    return [
      {
        id: 'match_001',
        homeTeam: 'Arsenal',
        awayTeam: 'Chelsea',
        homeScore: 2,
        awayScore: 1,
        status: 'LIVE',
        time: '67:45',
        competition: 'Premier League',
        sport: 'Football',
        viewers: 24567,
        trending: true,
        featured: true,
        thumbnail: '/api/placeholder/400/225'
      },
      {
        id: 'match_002',
        homeTeam: 'Manchester City',
        awayTeam: 'Liverpool',
        homeScore: 1,
        awayScore: 1,
        status: 'LIVE',
        time: '88:20',
        competition: 'Premier League',
        sport: 'Football',
        viewers: 31245,
        trending: true,
        featured: false,
        thumbnail: '/api/placeholder/400/225'
      },
      {
        id: 'match_003',
        homeTeam: 'Lakers',
        awayTeam: 'Warriors',
        homeScore: 108,
        awayScore: 112,
        status: 'FINISHED',
        time: 'Final',
        competition: 'NBA',
        sport: 'Basketball',
        viewers: 18934,
        trending: false,
        featured: false,
        thumbnail: '/api/placeholder/400/225'
      },
      {
        id: 'match_004',
        homeTeam: 'Novak Djokovic',
        awayTeam: 'Rafael Nadal',
        homeScore: 2,
        awayScore: 1,
        status: 'LIVE',
        time: 'Set 4',
        competition: 'Roland Garros',
        sport: 'Tennis',
        viewers: 15678,
        trending: true,
        featured: true,
        thumbnail: '/api/placeholder/400/225'
      },
      {
        id: 'match_005',
        homeTeam: 'Yankees',
        awayTeam: 'Red Sox',
        homeScore: 7,
        awayScore: 4,
        status: 'LIVE',
        time: '8th Inning',
        competition: 'MLB',
        sport: 'Baseball',
        viewers: 12456,
        trending: false,
        featured: false,
        thumbnail: '/api/placeholder/400/225'
      },
      {
        id: 'match_006',
        homeTeam: 'Bruins',
        awayTeam: 'Rangers',
        homeScore: 3,
        awayScore: 2,
        status: 'FINISHED',
        time: 'Final OT',
        competition: 'NHL',
        sport: 'Hockey',
        viewers: 9834,
        trending: false,
        featured: false,
        thumbnail: '/api/placeholder/400/225'
      },
      {
        id: 'match_007',
        homeTeam: 'India',
        awayTeam: 'Australia',
        homeScore: 245,
        awayScore: 189,
        status: 'LIVE',
        time: 'Day 3',
        competition: 'Test Series',
        sport: 'Cricket',
        viewers: 22341,
        trending: true,
        featured: false,
        thumbnail: '/api/placeholder/400/225'
      },
      {
        id: 'match_008',
        homeTeam: 'Real Madrid',
        awayTeam: 'Barcelona',
        homeScore: 0,
        awayScore: 0,
        status: 'SCHEDULED',
        time: '20:00',
        competition: 'La Liga',
        sport: 'Football',
        viewers: 0,
        trending: true,
        featured: true,
        thumbnail: '/api/placeholder/400/225'
      },
      {
        id: 'match_009',
        homeTeam: 'Celtics',
        awayTeam: 'Heat',
        homeScore: 95,
        awayScore: 87,
        status: 'FINISHED',
        time: 'Final',
        competition: 'NBA',
        sport: 'Basketball',
        viewers: 16789,
        trending: false,
        featured: false,
        thumbnail: '/api/placeholder/400/225'
      },
      {
        id: 'match_010',
        homeTeam: 'Serena Williams',
        awayTeam: 'Venus Williams',
        homeScore: 1,
        awayScore: 2,
        status: 'FINISHED',
        time: 'Final',
        competition: 'Wimbledon',
        sport: 'Tennis',
        viewers: 14523,
        trending: false,
        featured: false,
        thumbnail: '/api/placeholder/400/225'
      }
    ];
  }

  // Mock sports data with counts
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

  // Mock current match data
  static getCurrentMatch() {
    return {
      matchId: 'live_match_001',
      homeTeam: 'Arsenal',
      awayTeam: 'Chelsea',
      homeScore: 2,
      awayScore: 1,
      status: 'LIVE',
      time: '67:45',
      competition: 'Premier League',
      streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    };
  }

  // Mock match statistics
  static getMatchStats() {
    return [
      { label: 'Possession', home: 58, away: 42, homeDisplay: '58%', awayDisplay: '42%' },
      { label: 'Shots', home: 14, away: 9, homeDisplay: '14', awayDisplay: '9' },
      { label: 'On Target', home: 7, away: 4, homeDisplay: '7', awayDisplay: '4' },
      { label: 'Corners', home: 8, away: 5, homeDisplay: '8', awayDisplay: '5' },
      { label: 'Fouls', home: 12, away: 8, homeDisplay: '12', awayDisplay: '8' },
      { label: 'Yellow Cards', home: 3, away: 1, homeDisplay: '3', awayDisplay: '1' }
    ];
  }

  // Mock upcoming matches
  static getUpcomingMatches() {
    return [
      {
        match_id: 'upcoming_001',
        home_team: { name: 'Manchester United' },
        away_team: { name: 'Tottenham' },
        start_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        competition: 'Premier League',
        sport_type: 'football'
      },
      {
        match_id: 'upcoming_002',
        home_team: { name: 'Bucks' },
        away_team: { name: 'Nets' },
        start_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        competition: 'NBA',
        sport_type: 'basketball'
      },
      {
        match_id: 'upcoming_003',
        home_team: { name: 'Roger Federer' },
        away_team: { name: 'Andy Murray' },
        start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        competition: 'ATP Masters',
        sport_type: 'tennis'
      },
      {
        match_id: 'upcoming_004',
        home_team: { name: 'Dodgers' },
        away_team: { name: 'Giants' },
        start_time: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
        competition: 'MLB',
        sport_type: 'baseball'
      },
      {
        match_id: 'upcoming_005',
        home_team: { name: 'England' },
        away_team: { name: 'South Africa' },
        start_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        competition: 'Test Series',
        sport_type: 'cricket'
      }
    ];
  }

  // PUBLIC_INTERFACE
  /**
   * Filter matches by sport and status
   * @param {string} sport - Sport to filter by ('All' for no filter)
   * @param {string} status - Status filter ('All', 'Live', 'Recorded')
   * @returns {Array} Filtered matches
   */
  static getFilteredMatches(sport = 'All', status = 'All') {
    let matches = this.getMatches();

    // Filter by sport
    if (sport !== 'All') {
      matches = matches.filter(match => match.sport === sport);
    }

    // Filter by status
    if (status === 'Live') {
      matches = matches.filter(match => match.status === 'LIVE');
    } else if (status === 'Recorded') {
      matches = matches.filter(match => match.status === 'FINISHED');
    }

    return matches;
  }

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
