/**
 * UK PACK - Status Message Component
 * Reusable status message with different variants and accessibility
 */

import { ReactNode } from 'react';

interface StatusMessageProps {
  /** Message variant type */
  variant: 'info' | 'warning' | 'error' | 'success';
  /** Message content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Whether the message should be announced to screen readers */
  announce?: boolean;
  /** Whether to show an icon */
  showIcon?: boolean;
  /** Custom icon override */
  customIcon?: string;
}

const StatusMessage = ({ 
  variant, 
  children, 
  className = '',
  announce = false,
  showIcon = true,
  customIcon
}: StatusMessageProps) => {
  const icons = {
    info: '💡',
    warning: '⚠️',
    error: '❌',
    success: '✅'
  };

  const icon = customIcon || (showIcon ? icons[variant] : null);

  return (
    <div 
      className={`status-message ${variant} ${className}`}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={announce ? 'polite' : 'off'}
      aria-atomic="true"
    >
      {icon && (
        <span 
          className="inline-block mr-2" 
          role="img" 
          aria-label={`${variant} icon`}
        >
          {icon}
        </span>
      )}
      {children}
    </div>
  );
};

export default StatusMessage;
