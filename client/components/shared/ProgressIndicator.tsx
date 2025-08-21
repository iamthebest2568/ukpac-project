/**
 * UK PACK - Progress Indicator Component
 * Reusable progress indicator with accessibility support
 */

import { createProgressSteps } from '../../lib/helpers';
import { CONFIG } from '../../lib/constants';

interface ProgressIndicatorProps {
  /** Current step number (1-based) */
  currentStep: number;
  /** Total number of steps (defaults to CONFIG.TOTAL_PROGRESS_STEPS) */
  totalSteps?: number;
  /** Additional CSS classes */
  className?: string;
  /** Custom label for current progress */
  customLabel?: string;
  /** Theme variant */
  theme?: 'light' | 'dark';
}

const ProgressIndicator = ({ 
  currentStep, 
  totalSteps = CONFIG.TOTAL_PROGRESS_STEPS,
  className = '',
  customLabel,
  theme = 'light'
}: ProgressIndicatorProps) => {
  const steps = createProgressSteps(currentStep, totalSteps);
  
  const progressLabel = customLabel || `ขั้นตอนที่ ${currentStep} จาก ${totalSteps}`;
  const textColorClass = theme === 'dark' ? 'text-white' : 'text-black';

  return (
    <div className={`progress-container ${className}`}>
      <div 
        className="progress-dots"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`ความคืบหน้า: ${progressLabel}`}
      >
        {steps.map((step) => (
          <div
            key={step.index}
            className={`progress-dot ${step.status}`}
            aria-label={step.ariaLabel}
            title={step.ariaLabel}
          />
        ))}
      </div>
      <p className={`text-caption ${textColorClass}`}>
        {progressLabel}
      </p>
    </div>
  );
};

export default ProgressIndicator;
