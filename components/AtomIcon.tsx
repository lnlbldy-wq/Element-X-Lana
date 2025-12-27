
import React from 'react';
import type { Atom } from '../types';

interface AtomIconProps {
  atom: Atom;
  isAnimating?: boolean;
}

export const AtomIcon: React.FC<AtomIconProps> = ({ atom, isAnimating = false }) => {
  const size = atom.radius * 2.2;
  const animationClass = isAnimating ? 'animate-pulse' : '';
  
  return (
    <div className="flex flex-col items-center gap-1.5 group">
      <div
        className={`rounded-full flex items-center justify-center shadow-2xl relative transition-all duration-300 group-hover:scale-110 ${atom.color} ${animationClass}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), inset 0 4px 8px rgba(255,255,255,0.3)'
        }}
      >
        {/* Glossy highlight for a glass-like realistic look */}
        <div 
          className="absolute top-0 left-0 w-full h-full rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 70%)'
          }}
        ></div>

        <span
          className={`relative font-black text-center select-none leading-none ${atom.textColor}`}
          style={{
            fontSize: `${atom.radius * 0.8}px`,
            textShadow: '0px 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {atom.symbol}
        </span>
      </div>
      {/* Element name label - now always visible as requested */}
      <span className="text-[10px] font-black text-slate-400 dark:text-cyan-400/70 uppercase tracking-tighter whitespace-nowrap bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
        {atom.name}
      </span>
    </div>
  );
};
