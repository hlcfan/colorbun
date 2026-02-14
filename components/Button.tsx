import React from 'react';
import { audio } from '@/lib/audio';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  active?: boolean;
  color?: string; // Tailwind text color class like 'text-blue-500'
  fullWidth?: boolean;
}

export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  active = false,
  color,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  
  // Base styles: Chunky border, rounded, font
  const baseStyles = "relative font-bold font-sans flex items-center justify-center transition-all duration-75 border-[3px] border-[var(--btn-border)] active:translate-y-[4px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:shadow-[0_4px_0_var(--btn-border)] select-none";
  
  // Size styles
  const sizeStyles = {
    sm: "h-10 px-4 text-sm rounded-xl shadow-[0_3px_0_var(--btn-border)]",
    md: "h-12 px-6 text-base rounded-2xl shadow-[0_4px_0_var(--btn-border)]",
    lg: "h-16 px-8 text-lg rounded-2xl shadow-[0_5px_0_var(--btn-border)]",
    xl: "h-20 w-20 text-xl rounded-3xl shadow-[0_6px_0_var(--btn-border)]",
    icon: "h-14 w-14 rounded-2xl shadow-[0_4px_0_var(--btn-border)]",
  };

  // Variant styles
  const variantStyles = {
    primary: "bg-white hover:bg-yellow-50 text-gray-800",
    secondary: "bg-blue-100 hover:bg-blue-200 text-blue-800",
    ghost: "border-transparent shadow-none bg-transparent hover:bg-gray-100 active:translate-y-0",
    icon: "bg-white hover:bg-gray-50 text-gray-700",
  };
  
  // Active state (pressed down)
  const activeStyles = active 
    ? "translate-y-[4px] shadow-none bg-blue-50 border-blue-800 text-blue-600" 
    : "";

  const finalClassName = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${activeStyles}
    ${fullWidth ? 'w-full' : ''}
    ${color || ''}
    ${className}
  `;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      audio.play('tap');
      props.onClick?.(e);
    }
  };

  return (
    <button 
      className={finalClassName.trim().replace(/\s+/g, ' ')} 
      disabled={disabled} 
      {...props}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
