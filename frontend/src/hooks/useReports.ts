import { useCallback, useEffect, useState } from "react";
import {
  createReport,
  getAllReports,
  ReportResponse,
} from "../services/reportApi";
import { useReportPolling } from "./useReportPolling";

export function useReports() {
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const polledReport = useReportPolling(activeReportId);

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

  useEffect(() => {
    if (!polledReport) return;

    setReports((prev) =>
      prev.map((r) => (r.id === polledReport.id ? polledReport : r))
    );

    if (
      polledReport.status === "COMPLETED" ||
      polledReport.status === "FAILED"
    ) {
      setActiveReportId(null);
    }
  }, [polledReport]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await createReport();
      setReports((prev) => [res.data, ...prev]);
      setActiveReportId(res.data.id);
    } catch (err) {
      console.error("Failed to create report", err);
    } finally {
      setLoading(false);
    }
  };

  return { reports, loading, handleGenerate };
}
