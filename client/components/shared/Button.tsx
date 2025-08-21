/**
 * UK PACK - Enhanced Button Component
 * Accessible button with consistent styling and behavior
 */

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { handleKeyboardNavigation } from '../../lib/helpers';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** Button variant */
  variant?: 'primary' | 'secondary';
  /** Button content */
  children: ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Icon to display before text */
  icon?: string;
  /** Icon to display after text */
  iconAfter?: string;
  /** Additional CSS classes */
  className?: string;
  /** Accessibility label */
  ariaLabel?: string;
  /** Description for screen readers */
  ariaDescribedBy?: string;
  /** Full width button */
  fullWidth?: boolean;
}

const Button = ({
  variant = 'primary',
  children,
  onClick,
  disabled = false,
  loading = false,
  icon,
  iconAfter,
  className = '',
  ariaLabel,
  ariaDescribedBy,
  fullWidth = true,
  ...props
}: ButtonProps) => {
  const baseClasses = `btn btn-${variant}`;
  const widthClasses = fullWidth ? 'w-full' : '';
  const combinedClasses = `${baseClasses} ${widthClasses} ${className}`.trim();

  const handleClick = () => {
    if (onClick && !disabled && !loading) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      handleKeyboardNavigation(event.nativeEvent, handleClick);
    }
    props.onKeyDown?.(event);
  };

  return (
    <button
      {...props}
      className={combinedClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
    >
      {loading && (
        <span 
          className="inline-block mr-2 animate-spin" 
          role="img" 
          aria-label="กำลังโหลด"
        >
          ⏳
        </span>
      )}
      
      {icon && !loading && (
        <span 
          className="inline-block mr-2" 
          role="img" 
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      
      <span>{children}</span>
      
      {iconAfter && !loading && (
        <span 
          className="inline-block ml-2" 
          role="img" 
          aria-hidden="true"
        >
          {iconAfter}
        </span>
      )}
    </button>
  );
};

export default Button;
