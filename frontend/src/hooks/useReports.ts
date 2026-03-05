import { useCallback, useEffect, useState } from "react";
import {
  createReport,
  getAllReports,
  ReportResponse,
} from "../services/reportApi";
import { useReportPolling } from "./useReportPolling";

export function useReports() {
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const hasActiveReports = reports.some(
    (r) => r.status === "PENDING" || r.status === "PROCESSING"
  );

  const fetchReports = useCallback(async () => {
    try {
      const res = await getAllReports();
      setReports(res.data);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useReportPolling(hasActiveReports, fetchReports);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await createReport();
      setReports((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Failed to create report", err);
    } finally {
      setLoading(false);
    }
  };

  return { reports, loading, handleGenerate };
}
