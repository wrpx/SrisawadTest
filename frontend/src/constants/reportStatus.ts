export const REPORT_STATUS = {
  PENDING: { label: "Pending", color: "text-yellow-600 bg-yellow-50" },
  PROCESSING: { label: "Processing...", color: "text-blue-600 bg-blue-50" },
  COMPLETED: { label: "Completed", color: "text-green-600 bg-green-50" },
  FAILED: { label: "Failed", color: "text-red-600 bg-red-50" },
} as const;
