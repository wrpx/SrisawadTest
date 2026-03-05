import { useReports } from "../hooks/useReports";
import ReportCard from "./ReportCard";

export default function Dashboard() {
  const { reports, loading, handleGenerate } = useReports();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Sales Report Generator
      </h1>

      <button
        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "Requesting..." : "Generate New Report"}
      </button>

      <div className="mt-8 flex flex-col gap-4">
        {reports.length === 0 && (
          <p className="text-gray-400 text-sm">No reports yet.</p>
        )}
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
