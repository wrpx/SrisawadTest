import { useReports } from "../hooks/useReports";
import ReportCard from "./ReportCard";

export default function Dashboard() {
  const { reports, loading, handleGenerate } = useReports();

  return (
    <div className="dashboard">
      <h1>Sales Report Generator</h1>

      <button
        className="generate-btn"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Requesting..." : "Generate New Report"}
      </button>

      <div className="report-list">
        {reports.length === 0 && <p className="empty">No reports yet.</p>}
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
