import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'line' | 'outline';
  icon?: React.ReactNode;
}

export function Button({ variant = 'primary', icon, children, className, ...props }: ButtonProps) {
  const baseClasses = "flex items-center justify-center w-full p-4 rounded-xl font-bold text-base transition-all duration-200 gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gold text-[#111] hover:enabled:bg-gold-light",
    secondary: "bg-card-border text-foreground hover:enabled:bg-[#333]",
    line: "bg-line-green text-white hover:enabled:bg-line-green-hover",
    outline: "bg-transparent border border-gold text-gold hover:enabled:bg-gold/10"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className || ''}`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
