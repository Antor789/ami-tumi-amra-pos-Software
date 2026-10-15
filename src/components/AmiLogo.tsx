import React from 'react';

interface AmiLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'color';
}

export const AmiLogo: React.FC<AmiLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'color',
}) => {
  const dimensions = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12',
    xl: 'h-16',
  }[size];

  // Colors based on variant
  const cyanPrimary = variant === 'dark' ? '#000000' : '#00C2FF';
  const cyanSecondary = variant === 'dark' ? '#333333' : '#38BDF8';
  const grayDot = variant === 'dark' ? '#666666' : '#94A3B8';

  return (
    <div className={`inline-flex items-center gap-2 select-none ${dimensions} ${className}`}>
      {/* SVG Vector Logo with Dotted Swoosh & Geometric AMI Typography */}
      <svg
        viewBox="0 0 240 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto aspect-[3/1] object-contain shrink-0"
      >
        <defs>
          <linearGradient id="amiGradientCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00C2FF" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="amiGradientGray" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
        </defs>

        {/* Outer Cyan Dotted Arc Swoosh */}
        <circle cx="15" cy="52" r="2.5" fill="#00C2FF" />
        <circle cx="18" cy="44" r="3" fill="#00C2FF" />
        <circle cx="23" cy="36" r="3.5" fill="#00C2FF" />
        <circle cx="30" cy="29" r="4" fill="#00C2FF" />
        <circle cx="39" cy="24" r="4.5" fill="#00C2FF" />
        <circle cx="49" cy="21" r="5" fill="#00C2FF" />
        <circle cx="60" cy="20" r="5.5" fill="#00C2FF" />
        <circle cx="72" cy="21" r="5" fill="#00C2FF" />

        {/* Inner Gray Dotted Arc Swoosh */}
        <circle cx="32" cy="55" r="2" fill={grayDot} />
        <circle cx="35" cy="48" r="2.5" fill={grayDot} />
        <circle cx="40" cy="42" r="3" fill={grayDot} />
        <circle cx="47" cy="37" r="3.5" fill={grayDot} />
        <circle cx="56" cy="34" r="4" fill={grayDot} />
        <circle cx="66" cy="33" r="4.5" fill={grayDot} />
        <circle cx="77" cy="34" r="4" fill={grayDot} />
        <circle cx="87" cy="37" r="3" fill={grayDot} />
        <circle cx="95" cy="42" r="2.5" fill={grayDot} />
        <circle cx="102" cy="48" r="2" fill={grayDot} />

        {/* AMI Geometric Letterforms */}
        {/* 'A' Letterform */}
        <path
          d="M 112 55 L 128 20 L 144 55 L 135 55 L 131 46 L 125 46 L 121 55 Z M 128 29 L 123 40 L 133 40 Z"
          fill="url(#amiGradientGray)"
        />
        <path
          d="M 128 20 L 134 32 L 128 35 L 122 32 Z"
          fill="url(#amiGradientCyan)"
        />

        {/* 'M' Letterform */}
        <path
          d="M 150 55 L 150 20 L 158 20 L 166 38 L 174 20 L 182 20 L 182 55 L 174 55 L 174 32 L 168 46 L 164 46 L 158 32 L 158 55 Z"
          fill="url(#amiGradientCyan)"
        />

        {/* 'I' Letterform */}
        <path
          d="M 190 20 L 198 20 L 198 55 L 190 55 Z"
          fill="url(#amiGradientCyan)"
        />

        {/* Triangle accent above 'I' */}
        <polygon points="194,11 188,17 200,17" fill="url(#amiGradientGray)" />
      </svg>
    </div>
  );
};
