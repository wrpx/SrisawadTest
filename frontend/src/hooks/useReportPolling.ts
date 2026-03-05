import { useEffect, useRef, useState } from "react";
import { getReport, ReportResponse } from "../services/reportApi";

export function useReportPolling(reportId: string | null) {
  const [report, setReport] = useState<ReportResponse | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!reportId) return;

    const poll = async () => {
      try {
        const res = await getReport(reportId);
        setReport(res.data);

        if (res.data.status === "COMPLETED" || res.data.status === "FAILED") {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      } catch {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    poll();
    intervalRef.current = window.setInterval(poll, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [reportId]);

  return report;
}
