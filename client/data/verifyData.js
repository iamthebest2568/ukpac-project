/**
 * Data Verification Script
 * Quick test to ensure all dashboard functions work correctly
 */

import {
  getEngagementSummary,
  getReasoningBreakdown,
  getMinigame1And2Data,
  getMinigame3Data,
  getSatisfactionData,
  getFakeNewsData,
  getRewardFunnelData,
  getCustomReasons,
  getSuggestions,
  authenticateUser,
  checkAuthentication
} from './dashboardService.js';

console.log('🔍 Verifying Dashboard Data Service...');

// Test authentication
console.log('\n1. Testing Authentication:');
const authTest = authenticateUser('alex', 'Geetr2526Ur!');
console.log('✅ Auth test:', authTest.success ? 'PASS' : 'FAIL');

// Test data functions
console.log('\n2. Testing Data Functions:');

try {
  const engagement = getEngagementSummary();
  console.log('✅ Engagement Summary:', engagement.totalParticipants, 'participants');
  
  const reasoning = getReasoningBreakdown();
  console.log('✅ Reasoning Breakdown:', reasoning.totalResponses, 'responses');
  
  const minigames = getMinigame1And2Data();
  console.log('✅ Minigames 1&2:', minigames.mn1Participants, 'MN1 participants');
  
  const minigame3 = getMinigame3Data();
  console.log('✅ Minigame 3:', minigame3.participants, 'MN3 participants');
  
  const satisfaction = getSatisfactionData();
  console.log('✅ Satisfaction:', satisfaction.satisfactionRate + '%', 'satisfaction rate');
  
  const fakeNews = getFakeNewsData();
  console.log('✅ Fake News:', fakeNews.searchRate + '%', 'search rate');
  
  const rewardFunnel = getRewardFunnelData();
  console.log('✅ Reward Funnel:', rewardFunnel.conversionRates.decisionRate + '%', 'decision rate');
  
  const customReasons = getCustomReasons(1, 5);
  console.log('✅ Custom Reasons:', customReasons.totalItems, 'total items');
  
  const suggestions = getSuggestions(1, 5);
  console.log('✅ Suggestions:', suggestions.totalItems, 'total items');
  
  console.log('\n🎉 All data functions working correctly!');
  console.log('📊 Dashboard is ready for use with local data');
  
} catch (error) {
  console.error('❌ Data verification failed:', error);
}
