/**
 * UK PACK - Mock Database
 * Comprehensive simulated event data for serverless dashboard
 */

// Generate realistic mock data for UK PACK analytics
function generateMockData() {
  const events = [];
  const totalSessions = 5420;
  
  // Data pools for realistic variation
  const initialStances = ['เห็นด้วย', 'กลางๆ', 'ไม่เห็นด้วย'];
  const stanceWeights = [0.28, 0.46, 0.26];
  
  const reasonChoices = [
    'นโยบายไม่ครอบคลุม',
    'เก็บไปก็ไม่มีอะไรเกิดขึ้น', 
    'ไม่เชื่อถือรัฐบ���ล',
    'อื่นๆ'
  ];
  
  const policyOptions = [
    'ลดค่าโดยสารรถไฟฟ้า',
    'ปรับปรุงคุณภาพรถเมล์',
    'เพิ่มที่จอดรถ',
    'ขยายเส้นทางรถไฟฟ้า',
    'ปรับปรุงทางเท้า',
    'เพิ่มจุดขึ้น-ลงรถเมล์',
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
    'ขาดความโปร่งใสในการ���ช้งบประมาณ',
    'ไม่ครอบคลุมทุกพื้นที่ โดยเฉพาะชานเมือง',
    'ควรให้ความสำคัญกับการขนส่งสาธารณะมากกว่านี้',
    'ราคาค่าบริการยังสูงเกินไปสำหรับคนรายได้น้อย',
    'ระบบยังไม่พร้อมรองรับคนพิการ',
    'ควรมีการศึกษาผลกระทบต่อสิ่งแวดล้อม',
    'ต้องการระบบขนส่งที่เชื่อมต่อระหว่างเมืองและชานเมือง',
    'ควรมีทางเลือกสำหรับผู้ที่ไม่สามารถใช้ขนส่งสาธารณะได้'
  ];
  
  const suggestions = [
    'ควรมีการจัดประชาคมหาเสียงเพิ่มเติม',
    'เพิ่มช่องทางการสื่อสารกับประชาชน',
    'จัดทำแอปพลิเคชันเพื่อติดตามความคืบหน้า',
    'ใ���้มีการรายงานผลการดำเนินงานเป็นประจำ',
    'เพิ่มการประชาสัมพันธ์ในพื้นที่ห่างไกล',
    'จัดให้มีช่วงทดลองใช้ฟรีก่อนเก็บค่าบริการ',
    'ปรับปรุงระบบการให้บริการให้รวดเร็วขึ้น',
    'เพิ่มจุดบริการในพื้นที่ชานเมือง',
    'สร้างระบบป้อนข้อมูลกลับแบบเรียลไทม์',
    'จัดอบรมให้ความรู้เรื่องการใช้ขนส่งสาธารณะ'
  ];
  
  // Helper functions
  function randomDate(days = 10) {
    const start = new Date();
    start.setDate(start.getDate() - days);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
  
  function weightedRandom(items, weights) {
    const random = Math.random();
    let cumulative = 0;
    for (let i = 0; i < items.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) return items[i];
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
  
  // Generate events for each session
  for (let sessionNum = 1; sessionNum <= totalSessions; sessionNum++) {
    const sessionID = `session_${sessionNum.toString().padStart(6, '0')}`;
    const sessionStartTime = randomDate();
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
    
    currentTime = new Date(currentTime.getTime() + Math.random() * 120000);
    
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
      
      currentTime = new Date(currentTime.getTime() + Math.random() * 180000);
      
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
    if (Math.random() > 0.1) {
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
    if (Math.random() > 0.05) {
      currentTime = new Date(currentTime.getTime() + Math.random() * 90000);
      
      const participateInReward = Math.random() > 0.43;
      
      events.push({
        sessionID,
        timestamp: currentTime.toISOString(),
        payload: {
          event: 'REWARD_DECISION',
          choice: participateInReward ? 'participate' : 'decline'
        }
      });
      
      // If participated, add form submission
      if (participateInReward && Math.random() > 0.19) {
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

// Generate and export the mock database
export const MOCK_DATABASE = generateMockData();

// Export metadata for dashboard
export const DATABASE_METADATA = {
  totalSessions: 5420,
  totalEvents: MOCK_DATABASE.length,
  generatedAt: new Date().toISOString(),
  dataRange: {
    start: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString()
  }
};

console.log(`Mock Database initialized: ${MOCK_DATABASE.length} events for ${DATABASE_METADATA.totalSessions} sessions`);
