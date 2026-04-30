'use client';

import { useEffect, useRef } from 'react';

/**
 * KeepAliveProvider  ✅💓
 *
 * Pings /api/keep-alive every 30 minutes to stop Supabase from spinning
 * down the database due to inactivity. Renders nothing — invisible shell.
 */
export default function KeepAliveProvider({ children }: { children: React.ReactNode }) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ping = async () => {
    try {
      const res = await fetch('/api/keep-alive');
      const data = await res.json();

      if (data.ok) {
        console.log(`✅💓 [KeepAliveProvider] Ping OK | ${data.durationMs}ms`);
      } else {
        console.warn(`⚠️💓 [KeepAliveProvider] Ping FAILED | ${data.error}`);
      }
    } catch (err) {
      console.error(`❌💀 [KeepAliveProvider] Network error:`, err);
    }
  };

  useEffect(() => {
    console.log('✅💓 [KeepAliveProvider] Mounted – sending initial ping');
    ping();

    // 30 minutes = 1 800 000 ms
    intervalRef.current = setInterval(ping, 1_800_000);

    return () => {
      if (intervalRef.current !== null) {
        console.log('🛑💓 [KeepAliveProvider] Unmounting – interval cleared');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
