import { ReportResponse, getDownloadUrl } from "../services/reportApi";
import { REPORT_STATUS } from "../constants/reportStatus";

interface Props {
  report: ReportResponse;
}

export default function ReportCard({ report }: Props) {
  const { label, color } = REPORT_STATUS[report.status];
  const isLoading =
    report.status === "PENDING" || report.status === "PROCESSING";

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 font-mono">
          #{report.id.slice(0, 8)}
        </span>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${color}`}
        >
          {label}
        </span>
        {isLoading && (
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {report.status === "COMPLETED" && (
        <a
          href={getDownloadUrl(report.id)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          download
        >
          Download PDF
        </a>
      )}

      {report.status === "FAILED" && (
        <span className="text-sm text-red-500">{report.errorMessage}</span>
      )}
    </div>
  );
}
