/**
 * Mock Data Generator for UK PACK Analytics
 * Generates realistic test data for dashboard analytics
 */

const fs = require('fs');
const path = require('path');

// Configuration
const TOTAL_SESSIONS = 5420;
const START_DATE = new Date('2025-01-15');
const END_DATE = new Date('2025-01-25');

// Data pools
const initialStances = ['เห็นด้วย', 'กลางๆ', 'ไม่เห็นด้วย'];
const stanceWeights = [0.28, 0.46, 0.26]; // Realistic distribution

const reasonChoices = [
  'นโยบายไม่ครอบคลุม',
  'เก็บไปก็ไม่มีอะไรเกิดขึ้น',
  'ไม่เชื่อถือรัฐบาล',
  'อื่นๆ'
];

const policyOptions = [
  'ลดค่าโดยสารรถไฟฟ้า',
  'ปรับปรุงคุณภาพรถเมล์',
  'เพิ่มที่จอดรถ',
  'ขยายเส้นทางรถไฟฟ้า',
  'ปรับปรุงทางเท้า',
  '���พิ่มจุดขึ้น-ลงรถเมล์',
  'ปรับปรุงระบบไฟจราจร',
  'เพิ่มเส้นทางจักรยาน'
];

const beneficiaryGroups = [
  'ผู้สูงอายุ',
  'นักเรียน นักศึกษา',
  'ผู้มีรายได้น้อย',
  'คนพิการ',
  'แม่บ้าน',
  'พนักงานออฟฟิศ',
  'ผู้ประกอบการ',
  'เกษตรกร'
];

const customReasons = [
  'นโยบายควรมีการรับฟังความคิดเห็นจากประชาชนมากกว่านี้',
  'การดำเนินการช้าเกินไป ไม่เห็นผลลัพธ์ที่ชัดเจน',
  'ขาดความโปร่งใสในการใช้งบประมาณ',
  'ไม่ครอบคลุมทุกพื้นที่ โดยเฉพาะชานเมือง',
  'ควรให้ความสำคัญกับการขนส่งสาธารณะมากกว่านี้',
  'ราคาค่าบริการยังสูงเกินไปสำหรับคนรายได้น้อย',
  'ระบบยังไม่พร้อมรองรับคนพิการ',
  'ควรมีการศึกษาผลกระทบต่อสิ่งแวดล้อม'
];

const suggestions = [
  'ควรมีการจัดประชาคมหาเสียงเพิ่มเติม',
  'เพิ่มช่องทางการสื่อสารกับประชาชน',
  'จัดทำแอปพลิเคชันเพื่อติดตามความคืบหน้า',
  'ให้มีการรายงานผลการดำเนินงานเป็นประจำ',
  'เพิ่มการประชาสัมพันธ์ในพื้นที่ห่างไกล',
  'จัดให้มีช่วงทดลองใช้ฟรีก่อนเก็บค่าบริการ',
  'ปรับปรุงระบบการให้บริการให้รวดเร็วขึ้น',
  'เพิ่มจุดบริการในพื้นที่ชานเมือง'
];

// Helper functions
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function weightedRandom(items, weights) {
  const random = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < items.length; i++) {
    cumulative += weights[i];
    if (random <= cumulative) {
      return items[i];
    }
  }
  return items[items.length - 1];
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateBudgetAllocation() {
  const allocation = {};
  const policies = [...policyOptions].sort(() => 0.5 - Math.random()).slice(0, 3);
  
  let remaining = 100;
  policies.forEach((policy, index) => {
    if (index === policies.length - 1) {
      allocation[policy] = remaining;
    } else {
      const amount = Math.floor(Math.random() * (remaining - (policies.length - index - 1) * 5)) + 5;
      allocation[policy] = amount;
      remaining -= amount;
    }
  });
  
  return allocation;
}

// Generate mock data
function generateMockData() {
  const events = [];
  let eventId = 1;

  for (let sessionNum = 1; sessionNum <= TOTAL_SESSIONS; sessionNum++) {
    const sessionID = `session_${sessionNum.toString().padStart(6, '0')}`;
    const sessionStartTime = randomDate(START_DATE, END_DATE);
    let currentTime = new Date(sessionStartTime);

    // ASK01_CHOICE (Initial stance)
    const initialStance = weightedRandom(initialStances, stanceWeights);
    events.push({
      sessionID,
      timestamp: currentTime.toISOString(),
      payload: {
        event: 'ASK01_CHOICE',
        choice: initialStance
      }
    });

    currentTime = new Date(currentTime.getTime() + Math.random() * 120000); // 0-2 minutes

    // Different paths based on initial stance
    if (initialStance === 'เห็นด้วย') {
      // Agree path: Source selection → End sequence
      events.push({
        sessionID,
        timestamp: currentTime.toISOString(),
        payload: {
          event: 'SOURCE_SELECTION',
          source: randomChoice(['เว็บไซต์ราชการ', 'สื่อสังคมออนไลน์', 'หนังสือพิมพ์', 'โทรทัศน์'])
        }
      });

    } else {
      // Neutral/Disagree path: ASK02
      currentTime = new Date(currentTime.getTime() + Math.random() * 60000);
      const reasonChoice = randomChoice(reasonChoices);
      
      events.push({
        sessionID,
        timestamp: currentTime.toISOString(),
        payload: {
          event: 'ASK02_CHOICE',
          choice: reasonChoice
        }
      });

      currentTime = new Date(currentTime.getTime() + Math.random() * 180000); // 0-3 minutes

      // Handle different reason paths
      if (reasonChoice === 'นโยบายไม่ครอบคลุม') {
        // MN1 + MN2 path
        const selectedPolicies = [...policyOptions]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        
        events.push({
          sessionID,
          timestamp: currentTime.toISOString(),
          payload: {
            event: 'MINIGAME_MN1_COMPLETE',
            selectedPolicies
          }
        });

        currentTime = new Date(currentTime.getTime() + Math.random() * 120000);

        const selectedGroups = [...beneficiaryGroups]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        events.push({
          sessionID,
          timestamp: currentTime.toISOString(),
          payload: {
            event: 'MINIGAME_MN2_COMPLETE',
            selectedGroups
          }
        });

      } else if (reasonChoice === 'เก็บไปก็ไม่มีอะไรเกิดขึ้น') {
        // MN3 path
        const top3Choices = [...policyOptions]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        
        events.push({
          sessionID,
          timestamp: currentTime.toISOString(),
          payload: {
            event: 'MINIGAME_MN3_COMPLETE',
            top3Choices,
            budgetAllocation: generateBudgetAllocation()
          }
        });

        currentTime = new Date(currentTime.getTime() + Math.random() * 90000);

        // Satisfaction choice for MN3 path
        events.push({
          sessionID,
          timestamp: currentTime.toISOString(),
          payload: {
            event: 'SATISFACTION_CHOICE',
            choice: Math.random() > 0.36 ? 'พอใจ' : 'ไม่พอใจ'
          }
        });

      } else if (reasonChoice === 'อื่นๆ') {
        // Custom reason path
        events.push({
          sessionID,
          timestamp: currentTime.toISOString(),
          payload: {
            event: 'ASK02_2_SUBMIT',
            customReason: randomChoice(customReasons)
          }
        });

        currentTime = new Date(currentTime.getTime() + Math.random() * 120000);

        // ASK05 suggestion
        events.push({
          sessionID,
          timestamp: currentTime.toISOString(),
          payload: {
            event: 'ASK05_SUBMIT',
            suggestion: randomChoice(suggestions)
          }
        });
      }
    }

    // Fake news test (most users encounter this)
    if (Math.random() > 0.1) { // 90% encounter fake news
      currentTime = new Date(currentTime.getTime() + Math.random() * 60000);
      
      events.push({
        sessionID,
        timestamp: currentTime.toISOString(),
        payload: {
          event: 'FAKENEWS_CHOICE',
          choice: Math.random() > 0.48 ? 'search' : 'ignore',
          scenario: randomChoice([
            'ข่าวเรื่องการเปลี่ยนแปลงค่าโดยสาร',
            'ข่าวเรื่องการยกเลิกโครงการรถไฟฟ้า',
            'ข่าวเรื่องการปรับโครงสร้างการขนส่ง'
          ])
        }
      });
    }

    // End sequence (reward decision)
    if (Math.random() > 0.05) { // 95% reach reward decision
      currentTime = new Date(currentTime.getTime() + Math.random() * 90000);
      
      const participateInReward = Math.random() > 0.43; // 57% participate
      
      events.push({
        sessionID,
        timestamp: currentTime.toISOString(),
        payload: {
          event: 'REWARD_DECISION',
          choice: participateInReward ? 'participate' : 'decline'
        }
      });

      // If participated, add form submission
      if (participateInReward && Math.random() > 0.19) { // 81% complete form
        currentTime = new Date(currentTime.getTime() + Math.random() * 180000);
        
        events.push({
          sessionID,
          timestamp: currentTime.toISOString(),
          payload: {
            event: 'REWARD_FORM_SUBMIT',
            data: {
              name: `ผู้ใช้${sessionNum}`,
              phone: `08${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`
            }
          }
        });
      }
    }
  }

  return events;
}

// Generate and save mock data
console.log('Generating mock data...');
const mockData = generateMockData();

// Save to file
const outputPath = path.join(__dirname, 'mockData.json');
fs.writeFileSync(outputPath, JSON.stringify(mockData, null, 2));

console.log(`Generated ${mockData.length} events for ${TOTAL_SESSIONS} sessions`);
console.log(`Mock data saved to: ${outputPath}`);

// Generate summary statistics
const summary = {
  totalEvents: mockData.length,
  totalSessions: TOTAL_SESSIONS,
  eventTypes: {},
  timeRange: {
    start: START_DATE.toISOString(),
    end: END_DATE.toISOString()
  }
};

mockData.forEach(event => {
  const eventType = event.payload.event;
  summary.eventTypes[eventType] = (summary.eventTypes[eventType] || 0) + 1;
});

console.log('\nEvent Summary:');
console.table(summary.eventTypes);

module.exports = { generateMockData };
