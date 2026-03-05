import { useEffect, useRef } from "react";

export function useReportPolling(hasActive: boolean, onPoll: () => void) {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (hasActive) {
      onPoll();
      intervalRef.current = window.setInterval(onPoll, 3000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [hasActive, onPoll]);
}
