import React from 'react';
import { motion } from 'framer-motion';

export function ArogyaScore({ score, size = 120, strokeWidth = 8 }: { score: number, size?: number, strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  let colorClass = 'text-green-500';
  let gradientId = 'score-gradient-green';
  
  if (score <= 40) {
    colorClass = 'text-red-500';
    gradientId = 'score-gradient-red';
  } else if (score <= 70) {
    colorClass = 'text-amber-500';
    gradientId = 'score-gradient-yellow';
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="score-gradient-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="score-gradient-yellow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="score-gradient-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>
        
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/50"
        />
        
        {/* Progress Track */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          className="drop-shadow-sm"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-display font-bold ${colorClass}`}>
          {score}
        </span>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest mt-1">Score</span>
      </div>
    </div>
  );
}
