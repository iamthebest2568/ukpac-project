/**
 * Dashboard Service
 * Business logic for processing and aggregating UK PACK analytics data
 */

const fs = require('fs');
const path = require('path');

class DashboardService {
  constructor() {
    this.mockDataPath = path.join(__dirname, '../data/mockData.json');
    this.loadMockData();
  }

  loadMockData() {
    try {
      const rawData = fs.readFileSync(this.mockDataPath, 'utf8');
      this.mockData = JSON.parse(rawData);
      console.log(`Loaded ${this.mockData.length} events from mock data`);
    } catch (error) {
      console.error('Error loading mock data:', error);
      this.mockData = [];
    }
  }

  // Helper method to filter events by type
  getEventsByType(eventType) {
    return this.mockData.filter(event => event.payload.event === eventType);
  }

  // Helper method to get unique sessions
  getUniqueSessions() {
    const sessions = new Set();
    this.mockData.forEach(event => sessions.add(event.sessionID));
    return Array.from(sessions);
  }

  // Helper method to group events by date
  groupEventsByDate(events) {
    const grouped = {};
    
    events.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = 0;
      }
      grouped[date]++;
    });

    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Get overall engagement summary
   */
  async getEngagementSummary() {
    const ask01Events = this.getEventsByType('ASK01_CHOICE');
    const totalParticipants = this.getUniqueSessions().length;

    // Initial stance breakdown
    const initialStance = {};
    ask01Events.forEach(event => {
      const choice = event.payload.choice;
      initialStance[choice] = (initialStance[choice] || 0) + 1;
    });

    // Activity by day
    const activityByDay = this.groupEventsByDate(ask01Events);

    // Completion rate analysis
    const rewardDecisionEvents = this.getEventsByType('REWARD_DECISION');
    const completionRate = ((rewardDecisionEvents.length / totalParticipants) * 100).toFixed(1);

    return {
      totalParticipants,
      initialStance,
      activityByDay,
      completionRate: parseFloat(completionRate),
      averageSessionDuration: await this.calculateAverageSessionDuration()
    };
  }

  /**
   * Calculate average session duration
   */
  async calculateAverageSessionDuration() {
    const sessionDurations = {};
    
    this.mockData.forEach(event => {
      const sessionID = event.sessionID;
      const timestamp = new Date(event.timestamp).getTime();
      
      if (!sessionDurations[sessionID]) {
        sessionDurations[sessionID] = { start: timestamp, end: timestamp };
      } else {
        if (timestamp < sessionDurations[sessionID].start) {
          sessionDurations[sessionID].start = timestamp;
        }
        if (timestamp > sessionDurations[sessionID].end) {
          sessionDurations[sessionID].end = timestamp;
        }
      }
    });

    const durations = Object.values(sessionDurations)
      .map(session => (session.end - session.start) / 1000 / 60); // Convert to minutes

    const averageDuration = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
    return Math.round(averageDuration * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Get reasoning breakdown from ASK02 choices
   */
  async getReasoningBreakdown() {
    const ask02Events = this.getEventsByType('ASK02_CHOICE');
    const reasoning = {};

    ask02Events.forEach(event => {
      const choice = event.payload.choice;
      reasoning[choice] = (reasoning[choice] || 0) + 1;
    });

    // Sort by count descending
    const sortedReasoning = Object.entries(reasoning)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalResponses: ask02Events.length,
      breakdown: reasoning,
      topReasons: sortedReasoning
    };
  }

  /**
   * Get Minigame 1 & 2 aggregated data
   */
  async getMinigame1And2Data() {
    const mn1Events = this.getEventsByType('MINIGAME_MN1_COMPLETE');
    const mn2Events = this.getEventsByType('MINIGAME_MN2_COMPLETE');

    // Aggregate policies from MN1
    const policyCount = {};
    mn1Events.forEach(event => {
      event.payload.selectedPolicies?.forEach(policy => {
        policyCount[policy] = (policyCount[policy] || 0) + 1;
      });
    });

    // Aggregate groups from MN2
    const groupCount = {};
    mn2Events.forEach(event => {
      event.payload.selectedGroups?.forEach(group => {
        groupCount[group] = (groupCount[group] || 0) + 1;
      });
    });

    // Sort and format
    const topPolicies = Object.entries(policyCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const topGroups = Object.entries(groupCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      mn1Participants: mn1Events.length,
      mn2Participants: mn2Events.length,
      topPolicies,
      topGroups,
      policyTotalSelections: Object.values(policyCount).reduce((sum, count) => sum + count, 0),
      groupTotalSelections: Object.values(groupCount).reduce((sum, count) => sum + count, 0)
    };
  }

  /**
   * Get Minigame 3 data with budget allocation analysis
   */
  async getMinigame3Data() {
    const mn3Events = this.getEventsByType('MINIGAME_MN3_COMPLETE');

    // Aggregate top 3 choices
    const choiceCount = {};
    const allAllocations = {};

    mn3Events.forEach(event => {
      // Count top 3 choices
      event.payload.top3Choices?.forEach(choice => {
        choiceCount[choice] = (choiceCount[choice] || 0) + 1;
      });

      // Collect budget allocations
      if (event.payload.budgetAllocation) {
        Object.entries(event.payload.budgetAllocation).forEach(([item, amount]) => {
          if (!allAllocations[item]) {
            allAllocations[item] = [];
          }
          allAllocations[item].push(amount);
        });
      }
    });

    // Calculate average allocations
    const averageAllocation = {};
    Object.entries(allAllocations).forEach(([item, amounts]) => {
      const average = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
      averageAllocation[item] = Math.round(average * 10) / 10;
    });

    // Sort choices by popularity
    const top3Choices = Object.entries(choiceCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      participants: mn3Events.length,
      top3Choices,
      averageAllocation,
      totalBudgetItems: Object.keys(averageAllocation).length
    };
  }

  /**
   * Get satisfaction data from MN3 path
   */
  async getSatisfactionData() {
    const satisfactionEvents = this.getEventsByType('SATISFACTION_CHOICE');
    
    const satisfaction = {
      satisfied: 0,
      unsatisfied: 0
    };

    satisfactionEvents.forEach(event => {
      if (event.payload.choice === 'พอใจ') {
        satisfaction.satisfied++;
      } else if (event.payload.choice === 'ไม่พอใจ') {
        satisfaction.unsatisfied++;
      }
    });

    const total = satisfaction.satisfied + satisfaction.unsatisfied;
    const satisfactionRate = total > 0 ? ((satisfaction.satisfied / total) * 100).toFixed(1) : 0;

    return {
      ...satisfaction,
      total,
      satisfactionRate: parseFloat(satisfactionRate)
    };
  }

  /**
   * Get fake news interaction data
   */
  async getFakeNewsData() {
    const fakeNewsEvents = this.getEventsByType('FAKENEWS_CHOICE');
    
    const choices = {
      search: 0,
      ignore: 0
    };

    const scenarios = {};

    fakeNewsEvents.forEach(event => {
      const choice = event.payload.choice;
      choices[choice] = (choices[choice] || 0) + 1;

      const scenario = event.payload.scenario;
      if (scenario) {
        scenarios[scenario] = (scenarios[scenario] || 0) + 1;
      }
    });

    const total = choices.search + choices.ignore;
    const searchRate = total > 0 ? ((choices.search / total) * 100).toFixed(1) : 0;

    return {
      ...choices,
      total,
      searchRate: parseFloat(searchRate),
      scenarioBreakdown: scenarios
    };
  }

  /**
   * Get reward funnel data
   */
  async getRewardFunnelData() {
    const totalSessions = this.getUniqueSessions().length;
    const rewardDecisionEvents = this.getEventsByType('REWARD_DECISION');
    const formSubmissionEvents = this.getEventsByType('REWARD_FORM_SUBMIT');

    const reachedDecision = rewardDecisionEvents.length;
    const clickedParticipate = rewardDecisionEvents.filter(
      event => event.payload.choice === 'participate'
    ).length;
    const submittedForm = formSubmissionEvents.length;

    // Calculate conversion rates
    const decisionRate = ((reachedDecision / totalSessions) * 100).toFixed(1);
    const participationRate = reachedDecision > 0 ? ((clickedParticipate / reachedDecision) * 100).toFixed(1) : 0;
    const formCompletionRate = clickedParticipate > 0 ? ((submittedForm / clickedParticipate) * 100).toFixed(1) : 0;

    return {
      totalSessions,
      reachedDecision,
      clickedParticipate,
      submittedForm,
      conversionRates: {
        decisionRate: parseFloat(decisionRate),
        participationRate: parseFloat(participationRate),
        formCompletionRate: parseFloat(formCompletionRate)
      }
    };
  }

  /**
   * Get custom reasons with pagination
   */
  async getCustomReasons(page = 1, limit = 20) {
    const customReasonEvents = this.getEventsByType('ASK02_2_SUBMIT');
    
    const totalItems = customReasonEvents.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedEvents = customReasonEvents
      .slice(startIndex, endIndex)
      .map(event => ({
        sessionID: event.sessionID,
        timestamp: event.timestamp,
        text: event.payload.customReason
      }));

    return {
      data: paginatedEvents,
      totalItems,
      totalPages,
      currentPage: page
    };
  }

  /**
   * Get suggestions with pagination
   */
  async getSuggestions(page = 1, limit = 20) {
    const suggestionEvents = this.getEventsByType('ASK05_SUBMIT');
    
    const totalItems = suggestionEvents.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedEvents = suggestionEvents
      .slice(startIndex, endIndex)
      .map(event => ({
        sessionID: event.sessionID,
        timestamp: event.timestamp,
        text: event.payload.suggestion
      }));

    return {
      data: paginatedEvents,
      totalItems,
      totalPages,
      currentPage: page
    };
  }

  /**
   * Get trends data for different timeframes
   */
  async getTrends(timeframe = '7d') {
    const days = timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 7;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentEvents = this.mockData.filter(
      event => new Date(event.timestamp) >= cutoffDate
    );

    const dailyStats = this.groupEventsByDate(recentEvents);
    
    // Calculate growth rate
    const firstDayCount = dailyStats[0]?.count || 0;
    const lastDayCount = dailyStats[dailyStats.length - 1]?.count || 0;
    const growthRate = firstDayCount > 0 ? (((lastDayCount - firstDayCount) / firstDayCount) * 100).toFixed(1) : 0;

    return {
      timeframe,
      dailyActivity: dailyStats,
      totalEvents: recentEvents.length,
      growthRate: parseFloat(growthRate)
    };
  }

  /**
   * Get activity heatmap data
   */
  async getActivityHeatmap() {
    const hourlyActivity = {};
    
    // Initialize all hours
    for (let hour = 0; hour < 24; hour++) {
      hourlyActivity[hour] = 0;
    }

    this.mockData.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hourlyActivity[hour]++;
    });

    const heatmapData = Object.entries(hourlyActivity).map(([hour, count]) => ({
      hour: parseInt(hour),
      count
    }));

    return {
      hourlyActivity: heatmapData,
      peakHour: Object.entries(hourlyActivity).reduce((a, b) => hourlyActivity[a[0]] > hourlyActivity[b[0]] ? a : b)[0]
    };
  }

  /**
   * Export raw data in different formats
   */
  async exportRawData(format = 'json', startDate, endDate) {
    let filteredData = this.mockData;

    // Apply date filters if provided
    if (startDate || endDate) {
      filteredData = this.mockData.filter(event => {
        const eventDate = new Date(event.timestamp);
        
        if (startDate && eventDate < new Date(startDate)) return false;
        if (endDate && eventDate > new Date(endDate)) return false;
        
        return true;
      });
    }

    if (format === 'csv') {
      // Convert to CSV format
      const headers = ['sessionID', 'timestamp', 'event', 'details'];
      const csvRows = [headers.join(',')];
      
      filteredData.forEach(event => {
        const details = JSON.stringify(event.payload).replace(/"/g, '""');
        const row = [
          event.sessionID,
          event.timestamp,
          event.payload.event,
          `"${details}"`
        ];
        csvRows.push(row.join(','));
      });
      
      return csvRows.join('\n');
    }

    return filteredData;
  }

  /**
   * Get overall statistics summary
   */
  async getOverallStats() {
    const totalEvents = this.mockData.length;
    const totalSessions = this.getUniqueSessions().length;
    const eventTypes = {};

    this.mockData.forEach(event => {
      const eventType = event.payload.event;
      eventTypes[eventType] = (eventTypes[eventType] || 0) + 1;
    });

    const avgEventsPerSession = (totalEvents / totalSessions).toFixed(1);

    return {
      totalEvents,
      totalSessions,
      averageEventsPerSession: parseFloat(avgEventsPerSession),
      eventTypeBreakdown: eventTypes,
      dataTimeRange: {
        earliest: this.mockData[0]?.timestamp,
        latest: this.mockData[this.mockData.length - 1]?.timestamp
      }
    };
  }
}

module.exports = new DashboardService();
