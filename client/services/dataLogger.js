/**
 * UK PACK - Central Data Logging Service
 * Collects real user interaction data for dashboard analytics
 */

// Generate unique session ID if not provided
function generateSessionID() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get or create session ID
function getSessionID() {
  let sessionID = sessionStorage.getItem('ukPackSessionID');
  if (!sessionID) {
    sessionID = generateSessionID();
    sessionStorage.setItem('ukPackSessionID', sessionID);
  }
  return sessionID;
}

/**
 * Main event logging function
 * @param {Object} eventData - The event data to log
 * @param {string} eventData.event - Event type (e.g., 'ASK01_CHOICE', 'MINIGAME_MN1_COMPLETE')
 * @param {Object} eventData.payload - Event-specific data
 */
export function logEvent(eventData) {
  try {
    // 1. Retrieve existing events from localStorage, or start a new array
    const existingEvents = JSON.parse(localStorage.getItem('ukPackEvents')) || [];
    
    // 2. Prepare the event with required metadata
    const enrichedEvent = {
      sessionID: getSessionID(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      ...eventData
    };
    
    // 3. Add the new event
    existingEvents.push(enrichedEvent);
    
    // 4. Save the updated array back to localStorage
    localStorage.setItem('ukPackEvents', JSON.stringify(existingEvents));
    
    // 5. Also log to console for debugging (can be removed in production)
    console.log('📊 Event Logged:', enrichedEvent);
    
    // 6. Trigger custom event for real-time dashboard updates
    window.dispatchEvent(new CustomEvent('ukPackEventLogged', {
      detail: enrichedEvent
    }));
    
  } catch (error) {
    console.error('Failed to log event:', error);
    
    // Fallback: try to clear corrupted data and retry once
    try {
      localStorage.removeItem('ukPackEvents');
      localStorage.setItem('ukPackEvents', JSON.stringify([{
        sessionID: getSessionID(),
        timestamp: new Date().toISOString(),
        ...eventData
      }]));
    } catch (retryError) {
      console.error('Failed to log event even after cleanup:', retryError);
    }
  }
}

/**
 * Get all logged events
 * @returns {Array} Array of all logged events
 */
export function getLoggedEvents() {
  try {
    return JSON.parse(localStorage.getItem('ukPackEvents')) || [];
  } catch (error) {
    console.error('Failed to retrieve logged events:', error);
    return [];
  }
}

/**
 * Get events for current session
 * @returns {Array} Array of events for current session
 */
export function getCurrentSessionEvents() {
  const sessionID = getSessionID();
  const allEvents = getLoggedEvents();
  return allEvents.filter(event => event.sessionID === sessionID);
}

/**
 * Clear all logged events (for testing/reset)
 */
export function clearEventLogs() {
  localStorage.removeItem('ukPackEvents');
  sessionStorage.removeItem('ukPackSessionID');
  console.log('🗑️ Event logs cleared');
}

/**
 * Get summary statistics of logged data
 * @returns {Object} Summary statistics
 */
export function getEventSummary() {
  const events = getLoggedEvents();
  const sessions = new Set(events.map(e => e.sessionID));
  const eventTypes = {};
  
  events.forEach(event => {
    const eventType = event.event || 'UNKNOWN';
    eventTypes[eventType] = (eventTypes[eventType] || 0) + 1;
  });
  
  return {
    totalEvents: events.length,
    totalSessions: sessions.size,
    currentSession: getSessionID(),
    eventTypes,
    dateRange: {
      first: events[0]?.timestamp,
      last: events[events.length - 1]?.timestamp
    }
  };
}

/**
 * Export events as CSV for analysis
 * @returns {string} CSV formatted data
 */
export function exportEventsAsCSV() {
  const events = getLoggedEvents();
  if (events.length === 0) return '';
  
  const headers = ['sessionID', 'timestamp', 'event', 'url', 'data'];
  const csvRows = [headers.join(',')];
  
  events.forEach(event => {
    const row = [
      event.sessionID,
      event.timestamp,
      event.event || 'UNKNOWN',
      event.url || '',
      JSON.stringify(event.payload || {}).replace(/"/g, '""')
    ];
    csvRows.push(row.map(field => `"${field}"`).join(','));
  });
  
  return csvRows.join('\n');
}

// Initialize logging service
console.log('📊 UK PACK Data Logger initialized');
console.log('🔧 Session ID:', getSessionID());

// Listen for page visibility changes to log session events
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    logEvent({
      event: 'SESSION_PAUSE',
      payload: { reason: 'page_hidden' }
    });
  } else {
    logEvent({
      event: 'SESSION_RESUME',
      payload: { reason: 'page_visible' }
    });
  }
});

// Log page load event
window.addEventListener('load', () => {
  logEvent({
    event: 'PAGE_LOAD',
    payload: { 
      page: window.location.pathname,
      referrer: document.referrer
    }
  });
});
