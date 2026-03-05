package com.srisawad.reportgenerator.controller;

import com.srisawad.reportgenerator.dto.ReportResponse;
import com.srisawad.reportgenerator.entity.Report;
import com.srisawad.reportgenerator.entity.ReportStatus;
import com.srisawad.reportgenerator.service.ReportService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<ReportResponse> createReport() {
        Report report = reportService.createReport();
        reportService.processReport(report.getId());
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(toResponse(report));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportResponse> getReport(@PathVariable String id) {
        return reportService.getReport(id)
                .map(report -> ResponseEntity.ok(toResponse(report)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<ReportResponse>> getAllReports() {
        List<ReportResponse> reports = reportService.getAllReports()
                .stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadReport(@PathVariable String id) {
        Report report = reportService.getReport(id).orElse(null);
        if (report == null || report.getStatus() != ReportStatus.COMPLETED) {
            return ResponseEntity.notFound().build();
        }

        File file = new File(report.getFilePath());
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + file.getName() + "\"")
                .body(resource);
    }

    private ReportResponse toResponse(Report report) {
        String downloadUrl = null;
        if (report.getStatus() == ReportStatus.COMPLETED) {
            downloadUrl = "/api/reports/" + report.getId() + "/download";
        }
        return ReportResponse.builder()
                .id(report.getId())
                .status(report.getStatus())
                .downloadUrl(downloadUrl)
                .errorMessage(report.getErrorMessage())
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .build();
    }
}
