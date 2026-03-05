package com.srisawad.reportgenerator.service;

import com.srisawad.reportgenerator.entity.Report;
import com.srisawad.reportgenerator.enums.ReportStatus;
import com.srisawad.reportgenerator.repository.ReportRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReportService {

    private static final Logger log = LoggerFactory.getLogger(ReportService.class);

    private final ReportRepository reportRepository;
    private final PdfGeneratorService pdfGeneratorService;

    public ReportService(ReportRepository reportRepository, PdfGeneratorService pdfGeneratorService) {
        this.reportRepository = reportRepository;
        this.pdfGeneratorService = pdfGeneratorService;
    }

    public Report createReport() {
        Report report = new Report();
        report.setStatus(ReportStatus.PENDING);
        return reportRepository.save(report);
    }

    @Async("reportExecutor")
    public void processReport(String reportId) {
        Optional<Report> optional = reportRepository.findById(reportId);
        if (optional.isEmpty()) {
            log.error("Report not found: {}", reportId);
            return;
        }

        Report report = optional.get();
        report.setStatus(ReportStatus.PROCESSING);
        reportRepository.save(report);

        try {
            String filePath = pdfGeneratorService.generate(reportId);
            report.setFilePath(filePath);
            report.setStatus(ReportStatus.COMPLETED);
        } catch (Exception e) {
            log.error("Failed to generate PDF for report: {}", reportId, e);
            report.setStatus(ReportStatus.FAILED);
            report.setErrorMessage(e.getMessage());
        }

        reportRepository.save(report);
    }

    public Optional<Report> getReport(String id) {
        return reportRepository.findById(id);
    }

    public List<Report> getAllReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc();
    }
}
