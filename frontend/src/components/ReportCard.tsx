import { ReportResponse, getDownloadUrl } from "../services/reportApi";
import { STATUS_LABEL } from "../constants/reportStatus";

interface Props {
  report: ReportResponse;
}

export default function ReportCard({ report }: Props) {

  const isLoading =
    report.status === "PENDING" || report.status === "PROCESSING";

  return (
    <div className="report-card">
      <div className="report-info">
        <span className="report-id">Report #{report.id.slice(0, 8)}</span>
        <span className={`report-status ${report.status.toLowerCase()}`}>
          {STATUS_LABEL[report.status]}
        </span>
      </div>

      {isLoading && <div className="spinner" />}

      {report.status === "COMPLETED" && (
        <a
          href={getDownloadUrl(report.id)}
          className="download-btn"
          download
        >
          Download PDF
        </a>
      )}

      {report.status === "FAILED" && (
        <span className="error-msg">{report.errorMessage}</span>
      )}
    </div>
  );
}
