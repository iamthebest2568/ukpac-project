/**
 * UK PACK - Utility Functions
 * Shared helper functions for common operations
 */

import { CONFIG, VALIDATION } from './constants';

/**
 * Validates if a selection meets minimum requirements
 */
export const validateMinSelection = (
  selected: unknown[],
  minimum: number = 1
): boolean => {
  return Array.isArray(selected) && selected.length >= minimum;
};

/**
 * Validates if a selection doesn't exceed maximum limit
 */
export const validateMaxSelection = (
  selected: unknown[],
  maximum: number
): boolean => {
  return Array.isArray(selected) && selected.length <= maximum;
};

/**
 * Validates if budget allocation is within limits
 */
export const validateBudgetAllocation = (
  allocation: Record<string, number>,
  totalBudget: number = CONFIG.TOTAL_BUDGET
): {
  isValid: boolean;
  total: number;
  remaining: number;
  isOverBudget: boolean;
  isUnderBudget: boolean;
} => {
  const total = Object.values(allocation).reduce((sum, value) => sum + (value || 0), 0);
  const remaining = totalBudget - total;
  const isOverBudget = total > totalBudget;
  const isUnderBudget = total < totalBudget;
  const isValid = total === totalBudget;

  return {
    isValid,
    total,
    remaining,
    isOverBudget,
    isUnderBudget
  };
};

/**
 * Validates text input length
 */
export const validateTextInput = (
  text: string,
  minLength: number = VALIDATION.MIN_TEXT_LENGTH,
  maxLength: number = VALIDATION.MAX_TEXT_LENGTH
): {
  isValid: boolean;
  isTooShort: boolean;
  isTooLong: boolean;
  length: number;
} => {
  const trimmedText = text.trim();
  const length = trimmedText.length;
  const isTooShort = length < minLength;
  const isTooLong = length > maxLength;
  const isValid = !isTooShort && !isTooLong;

  return {
    isValid,
    isTooShort,
    isTooLong,
    length
  };
};

/**
 * Safely parses integer with fallback
 */
export const parseIntegerSafely = (
  value: string | number,
  fallback: number = 0,
  min?: number,
  max?: number
): number => {
  let parsed: number;
  
  if (typeof value === 'number') {
    parsed = value;
  } else {
    parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      parsed = fallback;
    }
  }

  if (min !== undefined && parsed < min) {
    parsed = min;
  }
  if (max !== undefined && parsed > max) {
    parsed = max;
  }

  return parsed;
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Generates a unique session ID
 */
export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Logs user interaction with session context
 */
export const logUserInteraction = (
  action: string,
  data: any,
  sessionId: string | null = null
): void => {
  console.log('UK PACK User Interaction:', {
    action,
    data,
    sessionId,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  });
};

/**
 * Safely accesses nested object properties
 */
export const safeGet = <T = any>(
  obj: any,
  path: string,
  defaultValue: T | null = null
): T | null => {
  try {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
  } catch {
    return defaultValue;
  }
};

/**
 * Creates accessible progress step data
 */
export const createProgressSteps = (
  currentStep: number,
  totalSteps: number = CONFIG.TOTAL_PROGRESS_STEPS
): Array<{
  index: number;
  status: 'completed' | 'active' | 'inactive';
  ariaLabel: string;
}> => {
  return Array.from({ length: totalSteps }, (_, index) => {
    const stepNumber = index + 1;
    let status: 'completed' | 'active' | 'inactive';
    
    if (stepNumber < currentStep) {
      status = 'completed';
    } else if (stepNumber === currentStep) {
      status = 'active';
    } else {
      status = 'inactive';
    }

    const ariaLabel = status === 'completed' 
      ? `ขั้นตอนที่ ${stepNumber} เสร็จสิ้น`
      : status === 'active'
      ? `ขั้นตอนที่ ${stepNumber} กำลังดำเนินการ`
      : `ขั้นตอนที่ ${stepNumber}`;

    return {
      index: stepNumber,
      status,
      ariaLabel
    };
  });
};

/**
 * Handles keyboard navigation for interactive elements
 */
export const handleKeyboardNavigation = (
  event: KeyboardEvent,
  callback: () => void
): void => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    callback();
  }
};

/**
 * Formats budget allocation for display
 */
export const formatBudgetDisplay = (
  value: number,
  total: number = CONFIG.TOTAL_BUDGET,
  showPercentage: boolean = true
): {
  value: number;
  percentage: number;
  formattedValue: string;
  formattedPercentage: string;
} => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  
  return {
    value,
    percentage,
    formattedValue: value.toString(),
    formattedPercentage: showPercentage ? `${percentage.toFixed(1)}%` : ''
  };
};

/**
 * Creates accessible announcement for screen readers
 */
export const announceToScreenReader = (message: string): void => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  document.body.appendChild(announcement);
  announcement.textContent = message;
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};
