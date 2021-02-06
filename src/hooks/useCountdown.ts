import React from 'react';

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const QUICK_INTERVAL = 1000;
const INTERVAL = 30 * QUICK_INTERVAL;

export function useCountdown(end?: number): string[] {
  const [countdown, setCountdown] = React.useState<string>('');

  React.useEffect(() => {
    if (!end) {
      return;
    }

    function updateInterval(end: number) {
      const now = new Date();
      const start = Math.floor(now.getTime() / 1000);
      const interval = end - start;

      const days = Math.floor(interval / DAY);
      const divisor_for_hours = interval % DAY;

      const hours = Math.floor(divisor_for_hours / HOUR);
      const divisor_for_minutes = divisor_for_hours % HOUR;
      const minutes = Math.floor(divisor_for_minutes / MINUTE);

      setCountdown(`${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`);
    }

    updateInterval(end);

    const throttledCountdown = setInterval(() => {
      updateInterval(end)
    }, INTERVAL);

    return () => {
      clearInterval(throttledCountdown);
    };
  }, [end]);

  return [countdown];
}

export function useCountdownQuick(end?: number): string[] {
  const [countdown, setCountdown] = React.useState<string>('');

  React.useEffect(() => {
    if (!end) {
      return;
    }

    function updateInterval(end: number) {
      const now = new Date();
      const start = Math.floor(now.getTime() / 1000);
      const interval = end - start;

      const hours = Math.floor(interval / HOUR);
      const divisor_for_minutes = interval % HOUR;
      const minutes = Math.floor(divisor_for_minutes / MINUTE);
  
      const divisor_for_seconds = divisor_for_minutes % MINUTE;
      const seconds = Math.ceil(divisor_for_seconds);

      setCountdown(`${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`);
    }

    updateInterval(end);

    const throttledCountdown = setInterval(() => {
      updateInterval(end)
    }, QUICK_INTERVAL);

    return () => {
      clearInterval(throttledCountdown);
    };
  }, [end]);

  return [countdown];
}