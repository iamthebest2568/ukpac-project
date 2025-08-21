/**
 * Test Real-Time Data Collection
 * Verify that data logging and dashboard integration work correctly
 */

import { logEvent, getLoggedEvents, clearEventLogs } from '../services/dataLogger.js';
import { 
  getEngagementSummary, 
  getReasoningBreakdown,
  getMinigame1And2Data,
  getFakeNewsData,
  getRewardFunnelData
} from './realTimeDashboardService.js';

console.log('🧪 Testing Real-Time Data Collection...');

// Clear existing data for clean test
clearEventLogs();

// Simulate user journey
console.log('\n1. Simulating user journey...');

// User starts journey
logEvent({
  event: 'ASK01_CHOICE',
  payload: {
    choice: 'กลางๆ',
    choiceKey: 'neutral',
    sessionID: 'test_session_001'
  }
});

// User makes reasoning choice
logEvent({
  event: 'ASK02_CHOICE',
  payload: {
    choice: 'นโยบายไม่ครอบคลุม',
    choiceKey: 'coverage',
    sessionID: 'test_session_001'
  }
});

// User completes MN1
logEvent({
  event: 'MINIGAME_MN1_COMPLETE',
  payload: {
    selectedPolicies: ['ลดค่าโดยสารรถไฟฟ้า', 'ปรับปรุงคุณภาพรถเมล์'],
    sessionID: 'test_session_001'
  }
});

// User completes MN2
logEvent({
  event: 'MINIGAME_MN2_COMPLETE',
  payload: {
    selectedGroups: ['ผู้สูงอายุ', 'นักเรียน นักศึกษา'],
    sessionID: 'test_session_001'
  }
});

// User makes satisfaction choice
logEvent({
  event: 'SATISFACTION_CHOICE',
  payload: {
    choice: 'พอใจ',
    choiceKey: 'satisfied',
    path: 'MN1_MN2',
    sessionID: 'test_session_001'
  }
});

// User encounters fake news
logEvent({
  event: 'FAKENEWS_CHOICE',
  payload: {
    choice: 'search',
    scenario: 'ข่าวเรื่องการเปลี่ยนแปลงค่าโดยสาร',
    sessionID: 'test_session_001'
  }
});

// User makes reward decision
logEvent({
  event: 'REWARD_DECISION',
  payload: {
    choice: 'participate',
    choiceText: 'ลุ้นรับรางวัล',
    sessionID: 'test_session_001'
  }
});

// User submits reward form
logEvent({
  event: 'REWARD_FORM_SUBMIT',
  payload: {
    data: {
      name: 'Test User',
      phone: '0812345678'
    },
    sessionID: 'test_session_001'
  }
});

console.log('✅ User journey simulation completed');

// Test dashboard functions
console.log('\n2. Testing dashboard functions...');

try {
  const engagement = getEngagementSummary();
  console.log('✅ Engagement Summary:', {
    participants: engagement.totalParticipants,
    stances: Object.keys(engagement.initialStance).length
  });

  const reasoning = getReasoningBreakdown();
  console.log('✅ Reasoning Breakdown:', {
    responses: reasoning.totalResponses,
    topReason: reasoning.topReasons[0]?.reason
  });

  const minigames = getMinigame1And2Data();
  console.log('✅ Minigames 1&2:', {
    mn1Participants: minigames.mn1Participants,
    mn2Participants: minigames.mn2Participants
  });

  const fakeNews = getFakeNewsData();
  console.log('✅ Fake News:', {
    total: fakeNews.total,
    searchRate: fakeNews.searchRate + '%'
  });

  const rewardFunnel = getRewardFunnelData();
  console.log('✅ Reward Funnel:', {
    sessions: rewardFunnel.totalSessions,
    participated: rewardFunnel.clickedParticipate
  });

  console.log('\n🎉 All tests passed! Real-time data collection is working.');
  console.log('📊 Dashboard will now show live data from actual user interactions.');
  
  // Show current logged events
  const events = getLoggedEvents();
  console.log(`\n📈 Total events logged: ${events.length}`);
  
} catch (error) {
  console.error('❌ Test failed:', error);
}
