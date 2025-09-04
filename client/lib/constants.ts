/**
 * UK PACK - Shared Constants
 * Centralized configuration for consistent data across components
 */

// Policy priorities with consistent icons
export const POLICY_PRIORITIES = {
  ลดค่าโดยสารรถไฟฟ้า: "🚇",
  ปรับปรุงคุณภาพรถเมล์: "🚌",
  ตั๋วร่วม: "🎫",
  เพิ่มความถี่รถเมล์: "🚍",
  เพิ่มความถี่รถไฟฟ้า: "🚊",
  เพิ่มที่จอดรถ: "🅿️",
  "เพิ่ม Feeder ในซอย": "🚐",
} as const;

export const POLICY_PRIORITIES_LIST = Object.keys(POLICY_PRIORITIES);

// Beneficiary groups with consistent icons and labels
export const BENEFICIARY_GROUPS = {
  everyone: { label: "ทุกคน", icon: "👥", description: "ประชาชนทุกคน" },
  locals: {
    label: "คนในพื้นที่",
    icon: "🏘️",
    description: "ผู้ที่อาศัยในพื้นที่",
  },
  elderly: {
    label: "ผู้สูงอายุ",
    icon: "👴",
    description: "ผู้สูงอายุ 60 ปีขึ้นไป",
  },
  students: {
    label: "นักเรียนนักศึกษา",
    icon: "🎓",
    description: "นักเรียนและนักศึกษา",
  },
  disabled: { label: "คนพิการ", icon: "♿", description: "ผู้พิการทุกประเภท" },
  other: {
    label: "อื่นๆ",
    icon: "❓",
    description: "กลุ่มอื่นๆ ที่เฉพาะเจาะจง",
  },
} as const;

export const BENEFICIARY_GROUPS_LIST = Object.values(BENEFICIARY_GROUPS);

// Configuration constants
export const CONFIG = {
  MAX_PRIORITIES_SELECTION: 3,
  MAX_BENEFICIARIES_SELECTION: 3,
  TOTAL_BUDGET: 100,
  TOTAL_PROGRESS_STEPS: 5,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
} as const;

// Choice mappings for consistent labeling
export const CHOICE_LABELS = {
  INITIAL_OPINION: {
    agree: "เห็นด้วย",
    neutral: "กลางๆ",
    disagree: "ไม่เห็นด้วย",
  },
  REASONING: {
    coverage: "นโยบายไม่ครอบคลุม",
    ineffective: "เก็บไปก็ไม่มีอะไรเกิดขึ้น",
    other: "อื่นๆ",
  },
  SATISFACTION: {
    satisfied: "พอใจ",
    unsatisfied: "ไม่พอใจ",
  },
} as const;

// Navigation routes for type safety
export const ROUTES = {
  INDEX: "index",
  ASK01: "ask01",
  ASK02: "ask02",
  ASK02_2: "ask02_2",
  ASK04: "ask04",
  ASK04_BUDGET: "ask04_budget",
  ASK05: "ask05",
  PRIORITIES: "priorities",
  BENEFICIARIES: "beneficiaries",
  POLICY_SUMMARY: "policySummary",
  BUDGET: "budget",
  BUDGET_STEP1: "budget_step1_choice",
  BUDGET_STEP2: "budget_step2_allocation",
  BUDGET_STEP3: "budget_step3_result",
  FAKE_NEWS: "fakeNews",
  SOURCE_SELECTION: "sourceSelection",
  REWARD_DECISION: "rewardDecision",
  REWARD_FORM: "rewardForm",
  FINAL_THANK_YOU: "finalThankYou",
  END_SCREEN: "endScreen",
} as const;

// ARIA labels for accessibility
export const ARIA_LABELS = {
  PROGRESS_STEP_COMPLETED: (step: number) => `ขั้นตอนที่ ${step} เสร็จสิ้น`,
  PROGRESS_STEP_ACTIVE: (step: number) => `ขั้นตอนที่ ${step} กำลังดำเนินการ`,
  PROGRESS_STEP_INACTIVE: (step: number) => `ขั้นตอนที่ ${step}`,
  SELECTION_SELECTED: "เลือกแล้ว",
  NAVIGATION_NEXT: "ไปยังขั้นตอนถัดไป",
  NAVIGATION_BACK: "กลับไปขั้นตอนก่อนหน้า",
} as const;

// Status messages for user feedback
export const STATUS_MESSAGES = {
  SELECTION_REQUIRED: (min: number) =>
    `กรุณาเลือกอย่างน้อย ${min} ข้อเพื่อดำเนินการต่อ`,
  SELECTION_COMPLETE: (count: number, max: number) =>
    `เลือกให้ครบ ${max} ข้อ (เลือกแล้ว ${count}/${max})`,
  SELECTION_LIMIT_REACHED: (max: number) =>
    `คุณเลือกครบจำนวนแล้ว หากต้องการเลือกข้อใหม่ กรุณายกเลิกการเลือกข้อใดข้อหนึ่งก่อน`,
  BUDGET_OVER_LIMIT: (total: number) =>
    `งบประมาณเกินที่กำหนด! กรุณาปรับลดจำนวนให้อยู่ในงบประมาณ ${total} หน่วย`,
  BUDGET_REMAINING: (remaining: number) =>
    `คุณยังมีงบประมาณเหลือ ${remaining} หน่วย กรุณาจัดสรรให้ครบ`,
  BUDGET_COMPLETE: (total: number) =>
    `เยี่ยม! คุณจัดสรรงบประมาณครบ ${total} หน่วยแล้ว`,
  INPUT_REQUIRED: "กรุณากรอกข้อความเพื่อดำเนินการต่อ",
  ACCESSIBILITY_INFO:
    "แบบสำรวจนี้รองรับการใช้งานผ่านแป้นพิมพ์แ���ะโปรแกรมอ่านหน้าจอ",
} as const;

// Validation rules
export const VALIDATION = {
  MIN_TEXT_LENGTH: 1,
  MAX_TEXT_LENGTH: 1000,
  MIN_BUDGET_VALUE: 0,
  MAX_BUDGET_VALUE: CONFIG.TOTAL_BUDGET,
  REQUIRED_EXACT_BUDGET: CONFIG.TOTAL_BUDGET,
} as const;

// Color palette for consistent theming
export const COLORS = {
  PRIMARY_ACTION: "#FFD100",
  SECONDARY_ACTION: "#6c757d",
  SUCCESS: "#10B981",
  WARNING: "#F59E0B",
  ERROR: "#EF4444",
  DARK_THEME_BG: "#0D1B2A",
  WHITE_THEME_BG: "#FFFFFF",
} as const;
