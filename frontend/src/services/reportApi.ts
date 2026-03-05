import axios from "axios";

export interface ReportResponse {
  id: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  downloadUrl: string | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export const createReport = () => api.post<ReportResponse>("/reports");

export const getReport = (id: string) =>
  api.get<ReportResponse>(`/reports/${id}`);

export const getAllReports = () => api.get<ReportResponse[]>("/reports");

export const getDownloadUrl = (id: string) =>
  `http://localhost:8080/api/reports/${id}/download`;
