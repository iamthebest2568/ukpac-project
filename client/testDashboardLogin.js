/**
 * Test script to debug dashboard login issues
 * Run this in browser console when on dashboard page
 */

// Test the authentication functions directly
import { authenticateUser, checkAuthentication } from './data/realTimeDashboardService.js';

console.log('🧪 Testing Dashboard Login Flow...');

// 1. Clear any existing auth data
sessionStorage.removeItem('dashboardAuth');
sessionStorage.removeItem('isLoggedIn');

// 2. Test authentication function
console.log('\n📝 Step 1: Testing authenticateUser function');
const loginResult = authenticateUser('alex', 'Geetr2526Ur!');
console.log('Login result:', loginResult);

// 3. Test check authentication function
console.log('\n🔍 Step 2: Testing checkAuthentication function');
const authCheck = checkAuthentication();
console.log('Auth check result:', authCheck);

// 4. Check sessionStorage
console.log('\n💾 Step 3: Checking sessionStorage');
console.log('dashboardAuth:', sessionStorage.getItem('dashboardAuth'));
console.log('isLoggedIn:', sessionStorage.getItem('isLoggedIn'));

// 5. Test data loading
console.log('\n📊 Step 4: Testing data loading functions');
try {
  const { getEngagementSummary } = await import('./data/realTimeDashboardService.js');
  const engagementData = getEngagementSummary();
  console.log('Engagement data loaded:', engagementData);
} catch (error) {
  console.error('Error loading engagement data:', error);
}

console.log('\n✅ Test complete! Check the results above.');
