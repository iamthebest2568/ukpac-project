/**
 * UK PACK - Accessibility Hook
 * Custom hook for managing accessibility features and preferences
 */

import { useEffect, useState, useCallback } from 'react';
import { announceToScreenReader } from '../lib/helpers';

interface AccessibilityPreferences {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  keyboardNavigation: boolean;
}

interface UseAccessibilityReturn {
  preferences: AccessibilityPreferences;
  announce: (message: string) => void;
  setPreference: <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => void;
  isKeyboardUser: boolean;
}

export const useAccessibility = (): UseAccessibilityReturn => {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    reduceMotion: false,
    highContrast: false,
    largeText: false,
    keyboardNavigation: false
  });

  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  // Detect system preferences
  useEffect(() => {
    const detectSystemPreferences = () => {
      const mediaQueries = {
        reduceMotion: window.matchMedia('(prefers-reduced-motion: reduce)'),
        highContrast: window.matchMedia('(prefers-contrast: high)')
      };

      setPreferences(prev => ({
        ...prev,
        reduceMotion: mediaQueries.reduceMotion.matches,
        highContrast: mediaQueries.highContrast.matches
      }));

      // Listen for changes
      const handleMotionChange = (e: MediaQueryListEvent) => {
        setPreferences(prev => ({ ...prev, reduceMotion: e.matches }));
      };

      const handleContrastChange = (e: MediaQueryListEvent) => {
        setPreferences(prev => ({ ...prev, highContrast: e.matches }));
      };

      mediaQueries.reduceMotion.addEventListener('change', handleMotionChange);
      mediaQueries.highContrast.addEventListener('change', handleContrastChange);

      return () => {
        mediaQueries.reduceMotion.removeEventListener('change', handleMotionChange);
        mediaQueries.highContrast.removeEventListener('change', handleContrastChange);
      };
    };

    return detectSystemPreferences();
  }, []);

  // Detect keyboard usage
  useEffect(() => {
    let keyboardTimeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab key indicates keyboard navigation
      if (e.key === 'Tab') {
        setIsKeyboardUser(true);
        setPreferences(prev => ({ ...prev, keyboardNavigation: true }));
        
        // Clear timeout if it exists
        if (keyboardTimeout) {
          clearTimeout(keyboardTimeout);
        }
      }
    };

    const handleMouseDown = () => {
      // Reset keyboard user status after mouse interaction
      keyboardTimeout = setTimeout(() => {
        setIsKeyboardUser(false);
        setPreferences(prev => ({ ...prev, keyboardNavigation: false }));
      }, 500);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
      if (keyboardTimeout) {
        clearTimeout(keyboardTimeout);
      }
    };
  }, []);

  // Apply preferences to document
  useEffect(() => {
    const { body } = document;
    
    // Apply accessibility classes
    body.classList.toggle('reduce-motion', preferences.reduceMotion);
    body.classList.toggle('high-contrast', preferences.highContrast);
    body.classList.toggle('large-text', preferences.largeText);
    body.classList.toggle('keyboard-navigation', preferences.keyboardNavigation);
    
    // Set CSS custom properties
    body.style.setProperty(
      '--animation-duration', 
      preferences.reduceMotion ? '0.01ms' : '250ms'
    );
    
    body.style.setProperty(
      '--transition-duration', 
      preferences.reduceMotion ? '0.01ms' : '250ms'
    );

    return () => {
      // Cleanup classes
      body.classList.remove('reduce-motion', 'high-contrast', 'large-text', 'keyboard-navigation');
    };
  }, [preferences]);

  // Announce function for screen readers
  const announce = useCallback((message: string) => {
    announceToScreenReader(message);
  }, []);

  // Update specific preference
  const setPreference = useCallback(<K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  return {
    preferences,
    announce,
    setPreference,
    isKeyboardUser
  };
};

/**
 * Hook for managing focus trap
 */
export const useFocusTrap = (isActive: boolean) => {
  useEffect(() => {
    if (!isActive) return;

    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Let parent handle escape
        const escapeEvent = new CustomEvent('focustrap:escape');
        document.dispatchEvent(escapeEvent);
      }
    };

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    // Focus the first element when trap becomes active
    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isActive]);
};

/**
 * Hook for managing ARIA live regions
 */
export const useAriaLive = () => {
  const [liveRegion, setLiveRegion] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create ARIA live region
    const region = document.createElement('div');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
    setLiveRegion(region);

    return () => {
      if (region.parentNode) {
        region.parentNode.removeChild(region);
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (liveRegion) {
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.textContent = message;
      
      // Clear after a delay
      setTimeout(() => {
        if (liveRegion) {
          liveRegion.textContent = '';
        }
      }, 1000);
    }
  }, [liveRegion]);

  return { announce };
};
