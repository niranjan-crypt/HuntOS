import React from 'react';

const Logo = ({ size = 28, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="hunt-logo-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1E1B4B" />
        <stop offset="1" stopColor="#0B0F19" />
      </linearGradient>
      <linearGradient id="hunt-accent-grad" x1="10" y1="10" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366F1" />
        <stop offset="0.6" stopColor="#4F46E5" />
        <stop offset="1" stopColor="#06B6D4" />
      </linearGradient>
      <filter id="hunt-glow-sm" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>

    {/* Smooth Dark Container */}
    <rect width="48" height="48" rx="12" fill="url(#hunt-logo-bg)" />
    <rect x="0.5" y="0.5" width="47" height="47" rx="11.5" stroke="#312E81" strokeWidth="1" />

    {/* Energetic 'H' with Center Radar Core */}
    <g filter="url(#hunt-glow-sm)">
      <rect x="13" y="11" width="5.5" height="26" rx="2.75" fill="url(#hunt-accent-grad)" />
      <rect x="29.5" y="11" width="5.5" height="26" rx="2.75" fill="url(#hunt-accent-grad)" />
      <path d="M 16 24 L 32 24" stroke="#06B6D4" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="2.2" fill="#FFFFFF" />
    </g>
  </svg>
);

export default Logo;
