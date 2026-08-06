import React, { useState, useEffect } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number; // duration in ms
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1200,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = 0;
    const endValue = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Ease out quad calculation for smooth deceleration
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      const current = startValue + easeProgress * (endValue - startValue);

      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  const formattedNumber = decimals > 0 
    ? displayValue.toFixed(decimals) 
    : Math.floor(displayValue).toLocaleString();

  return (
    <span className={className}>
      {prefix}{formattedNumber}{suffix}
    </span>
  );
};

export default AnimatedCounter;
