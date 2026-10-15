import React, { useState } from 'react';

interface AmiBrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  customLogoUrl?: string;
  showTagline?: boolean;
}

export const AmiBrandLogo: React.FC<AmiBrandLogoProps> = ({
  className = '',
  size = 'md',
  customLogoUrl,
  showTagline = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const dimensions = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-20',
  }[size];

  // If user provided a custom uploaded image logo and it loads cleanly
  if (customLogoUrl && !imageError) {
    return (
      <div className={`inline-flex items-center gap-2 select-none ${dimensions} ${className}`}>
        <img
          src={customLogoUrl}
          alt="Ami Tumi Amra Logo"
          onError={() => setImageError(true)}
          className="h-full w-auto object-contain shrink-0 filter drop-shadow-[0_0_12px_rgba(34,211,238,0.25)]"
        />
        {showTagline && (
          <div className="flex flex-col">
            <span className="text-sm font-extrabold text-white tracking-tight leading-none">
              Ami Tumi Amra
            </span>
            <span className="text-[9px] font-semibold text-cyan-400 tracking-wider uppercase mt-0.5">
              Cloud Retail POS
            </span>
          </div>
        )}
      </div>
    );
  }

  // Precision Watermark-Free SVG Replica of the AMI Dotted Arc & Horizontal-Split Typography
  return (
    <div className={`inline-flex items-center gap-2 select-none ${dimensions} ${className}`}>
      <svg
        viewBox="0 0 280 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto aspect-[3.1/1] object-contain shrink-0 filter drop-shadow-[0_0_16px_rgba(34,211,238,0.2)]"
      >
        <defs>
          {/* Top Half Cyan Electric Gradient */}
          <linearGradient id="amiTopCyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#00B4D8" />
          </linearGradient>

          {/* Bottom Half Slate Gray Gradient */}
          <linearGradient id="amiBottomSlateGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>

          {/* Glowing Arc Dot Gradient */}
          <radialGradient id="dotGlowCyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </radialGradient>
        </defs>

        {/* Outer Cyan Dotted Arc Sweeping Swoosh */}
        <circle cx="20" cy="62" r="2.5" fill="#38BDF8" opacity="0.8" />
        <circle cx="24" cy="53" r="3.2" fill="#38BDF8" opacity="0.85" />
        <circle cx="30" cy="43" r="4.0" fill="#38BDF8" opacity="0.9" />
        <circle cx="39" cy="33" r="4.8" fill="#38BDF8" />
        <circle cx="50" cy="26" r="5.5" fill="url(#dotGlowCyan)" />
        <circle cx="63" cy="22" r="6.2" fill="url(#dotGlowCyan)" />
        <circle cx="78" cy="21" r="6.8" fill="url(#dotGlowCyan)" />
        <circle cx="94" cy="23" r="6.0" fill="url(#dotGlowCyan)" />
        <circle cx="109" cy="28" r="5.0" fill="#38BDF8" opacity="0.9" />
        <circle cx="123" cy="35" r="4.0" fill="#38BDF8" opacity="0.8" />

        {/* Inner Slate Gray Dotted Arc Swoosh */}
        <circle cx="38" cy="66" r="2.2" fill="#64748B" opacity="0.7" />
        <circle cx="42" cy="58" r="2.8" fill="#64748B" opacity="0.8" />
        <circle cx="48" cy="50" r="3.4" fill="#94A3B8" opacity="0.85" />
        <circle cx="56" cy="43" r="4.0" fill="#94A3B8" />
        <circle cx="66" cy="38" r="4.6" fill="#CBD5E1" />
        <circle cx="78" cy="36" r="5.2" fill="#CBD5E1" />
        <circle cx="91" cy="37" r="4.6" fill="#94A3B8" />
        <circle cx="103" cy="41" r="3.8" fill="#64748B" />
        <circle cx="114" cy="47" r="3.0" fill="#64748B" opacity="0.7" />
        <circle cx="123" cy="54" r="2.2" fill="#64748B" opacity="0.5" />

        {/* Geometric "A" Letterform */}
        {/* Top Half Cyan */}
        <path
          d="M 135 62 L 155 20 L 175 62 L 164 62 L 159 51 L 151 51 L 146 62 Z"
          fill="url(#amiTopCyanGrad)"
        />
        {/* Bottom Half Slate Cut */}
        <path
          d="M 135 62 L 145 41 L 165 41 L 175 62 L 164 62 L 159 51 L 151 51 L 146 62 Z"
          fill="url(#amiBottomSlateGrad)"
        />
        {/* Inner Triangle Cutout */}
        <polygon points="155,30 149,43 161,43" fill="#050811" />

        {/* Geometric "M" Letterform */}
        {/* Top Half Cyan */}
        <path
          d="M 183 62 L 183 20 L 193 20 L 203 40 L 213 20 L 223 20 L 223 62 L 213 62 L 213 36 L 206 50 L 200 50 L 193 36 L 193 62 Z"
          fill="url(#amiTopCyanGrad)"
        />
        {/* Bottom Half Slate Cut */}
        <path
          d="M 183 62 L 183 41 L 193 41 L 200 50 L 206 50 L 213 41 L 223 41 L 223 62 L 213 62 L 213 48 L 206 55 L 200 55 L 193 48 L 193 62 Z"
          fill="url(#amiBottomSlateGrad)"
        />

        {/* Geometric "I" Letterform */}
        {/* Top Half Cyan */}
        <path d="M 233 20 L 243 20 L 243 62 L 233 62 Z" fill="url(#amiTopCyanGrad)" />
        {/* Bottom Half Slate Cut */}
        <path d="M 233 41 L 243 41 L 243 62 L 233 62 Z" fill="url(#amiBottomSlateGrad)" />

        {/* Triangle Accent Above 'I' */}
        <polygon points="238,10 231,17 245,17" fill="url(#amiBottomSlateGrad)" />
      </svg>

      {showTagline && (
        <div className="flex flex-col">
          <span className="text-sm font-extrabold text-white tracking-tight leading-none">
            Ami Tumi Amra
          </span>
          <span className="text-[9px] font-semibold text-cyan-400 tracking-wider uppercase mt-0.5">
            Cloud Retail POS
          </span>
        </div>
      )}
    </div>
  );
};
