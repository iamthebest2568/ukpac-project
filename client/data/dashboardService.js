/**
 * UK PACK - Client-Side Dashboard Service
 * Local data processing functions replacing backend API calls
 */

import { MOCK_DATABASE, DATABASE_METADATA } from './mockDatabase.js';

// Helper functions for data processing
function getEventsByType(eventType) {
  return MOCK_DATABASE.filter(event => event.payload.event === eventType);
}

function getUniqueSessions() {
  const sessions = new Set();
  MOCK_DATABASE.forEach(event => sessions.add(event.sessionID));
  return Array.from(sessions);
}

function groupEventsByDate(events) {
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

function calculateAverageSessionDuration() {
  const sessionDurations = {};
  
  MOCK_DATABASE.forEach(event => {
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
    .map(session => (session.end - session.start) / 1000 / 60);

  const averageDuration = durations.reduce((sum, duration) => sum + duration, 0) / durations.length;
  return Math.round(averageDuration * 10) / 10;
}

// Main dashboard data functions
export function getEngagementSummary() {
  const ask01Events = getEventsByType('ASK01_CHOICE');
  const totalParticipants = getUniqueSessions().length;

  // Initial stance breakdown
  const initialStance = {};
  ask01Events.forEach(event => {
    const choice = event.payload.choice;
    initialStance[choice] = (initialStance[choice] || 0) + 1;
  });

  // Activity by day
  const activityByDay = groupEventsByDate(ask01Events);

  // Completion rate analysis
  const rewardDecisionEvents = getEventsByType('REWARD_DECISION');
  const completionRate = ((rewardDecisionEvents.length / totalParticipants) * 100).toFixed(1);

  return {
    totalParticipants,
    initialStance,
    activityByDay,
    completionRate: parseFloat(completionRate),
    averageSessionDuration: calculateAverageSessionDuration()
  };
}

export function getReasoningBreakdown() {
  const ask02Events = getEventsByType('ASK02_CHOICE');
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

export function getMinigame1And2Data() {
  const mn1Events = getEventsByType('MINIGAME_MN1_COMPLETE');
  const mn2Events = getEventsByType('MINIGAME_MN2_COMPLETE');

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

export function getMinigame3Data() {
  const mn3Events = getEventsByType('MINIGAME_MN3_COMPLETE');

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

export function getSatisfactionData() {
  const satisfactionEvents = getEventsByType('SATISFACTION_CHOICE');
  
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

export function getFakeNewsData() {
  const fakeNewsEvents = getEventsByType('FAKENEWS_CHOICE');
  
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

export function getRewardFunnelData() {
  const totalSessions = getUniqueSessions().length;
  const rewardDecisionEvents = getEventsByType('REWARD_DECISION');
  const formSubmissionEvents = getEventsByType('REWARD_FORM_SUBMIT');

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

export function getCustomReasons(page = 1, limit = 20) {
  const customReasonEvents = getEventsByType('ASK02_2_SUBMIT');
  
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

export function getSuggestions(page = 1, limit = 20) {
  const suggestionEvents = getEventsByType('ASK05_SUBMIT');
  
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

export function getTrends(timeframe = '7d') {
  const days = timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 7;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const recentEvents = MOCK_DATABASE.filter(
    event => new Date(event.timestamp) >= cutoffDate
  );

  const dailyStats = groupEventsByDate(recentEvents);
  
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

export function getActivityHeatmap() {
  const hourlyActivity = {};
  
  // Initialize all hours
  for (let hour = 0; hour < 24; hour++) {
    hourlyActivity[hour] = 0;
  }

  MOCK_DATABASE.forEach(event => {
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

export function exportRawData(format = 'json', startDate, endDate) {
  let filteredData = MOCK_DATABASE;

  // Apply date filters if provided
  if (startDate || endDate) {
    filteredData = MOCK_DATABASE.filter(event => {
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

export function getOverallStats() {
  const totalEvents = MOCK_DATABASE.length;
  const totalSessions = getUniqueSessions().length;
  const eventTypes = {};

  MOCK_DATABASE.forEach(event => {
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
      earliest: MOCK_DATABASE[0]?.timestamp,
      latest: MOCK_DATABASE[MOCK_DATABASE.length - 1]?.timestamp
    }
  };
}

// Client-side authentication functions
export function authenticateUser(username, password) {
  const validCredentials = {
    username: 'alex',
    password: 'Geetr2526Ur!'
  };

  if (username === validCredentials.username && password === validCredentials.password) {
    const authData = {
      user: { username, role: 'admin' },
      loginTime: Date.now(),
      isAuthenticated: true
    };
    
    // Store in sessionStorage
    sessionStorage.setItem('dashboardAuth', JSON.stringify(authData));
    sessionStorage.setItem('isLoggedIn', 'true');
    
    return { success: true, user: authData.user };
  }
  
  return { success: false, error: 'Invalid credentials' };
}

export function checkAuthentication() {
  const authData = sessionStorage.getItem('dashboardAuth');
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  
  if (authData && isLoggedIn === 'true') {
    try {
      const parsed = JSON.parse(authData);
      // Check if login is still valid (8 hours)
      const eightHours = 8 * 60 * 60 * 1000;
      if (Date.now() - parsed.loginTime < eightHours) {
        return { isAuthenticated: true, user: parsed.user };
      }
    } catch (error) {
      console.error('Auth data parsing error:', error);
    }
  }
  
  return { isAuthenticated: false };
}

export function logout() {
  sessionStorage.removeItem('dashboardAuth');
  sessionStorage.removeItem('isLoggedIn');
  return { success: true };
}

// Initialize service
console.log('Dashboard Service initialized with local data processing');
console.log(`Data loaded: ${MOCK_DATABASE.length} events, ${getUniqueSessions().length} sessions`);
