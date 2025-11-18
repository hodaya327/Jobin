import React from 'react';

export default function Logo() {
  return (
    <div className="logo">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="url(#gradient)"/>
        <path d="M8 13L16 18L24 13M8 18L16 23L24 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 10H22" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#667eea"/>
            <stop offset="1" stopColor="#764ba2"/>
          </linearGradient>
        </defs>
      </svg>
      <span className="logo-text">CV Optimizer</span>
    </div>
  );
}