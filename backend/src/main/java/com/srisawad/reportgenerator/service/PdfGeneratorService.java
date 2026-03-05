package com.srisawad.reportgenerator.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Service
public class PdfGeneratorService {

    @Value("${report.output-dir}")
    private String outputDir;

    public String generate(String reportId) throws IOException, DocumentException {
        Path dirPath = Paths.get(outputDir);
        Files.createDirectories(dirPath);

        String fileName = "sales_report_" + reportId + ".pdf";
        String filePath = dirPath.resolve(fileName).toString();

        // delay 10s to simulate heavy task
        try {
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("PDF generation was interrupted");
        }

        try (FileOutputStream fos = new FileOutputStream(filePath)) {
            Document document = new Document(PageSize.A4);
            PdfWriter.getInstance(document, fos);
            document.open();

            addTitle(document);
            addSalesTable(document);

            document.close();
        }

        return filePath;
    }

    private void addTitle(Document document) throws DocumentException {
        Font titleFont = new Font(Font.HELVETICA, 20, Font.BOLD);
        Paragraph title = new Paragraph("Sales Report", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        String dateStr = LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        Paragraph date = new Paragraph("Generated: " + dateStr, new Font(Font.HELVETICA, 11));
        date.setAlignment(Element.ALIGN_CENTER);
        date.setSpacingAfter(20);
        document.add(date);
    }

    private void addSalesTable(Document document) throws DocumentException {
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{3, 2, 2, 2});

        Font headerFont = new Font(Font.HELVETICA, 11, Font.BOLD);
        for (String header : new String[]{"Product", "Quantity", "Unit Price", "Total"}) {
            PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(8);
            table.addCell(cell);
        }

        String[] products = {"Laptop", "Mouse", "Keyboard", "Monitor", "Headset", "Webcam", "USB Hub", "SSD"};
        Random random = new Random();
        double grandTotal = 0;

        for (String product : products) {
            int qty = random.nextInt(50) + 1;
            double price = Math.round((random.nextDouble() * 5000 + 500) * 100.0) / 100.0;
            double total = Math.round(qty * price * 100.0) / 100.0;
            grandTotal += total;

            table.addCell(createCell(product));
            table.addCell(createCell(String.valueOf(qty)));
            table.addCell(createCell(String.format("%.2f", price)));
            table.addCell(createCell(String.format("%.2f", total)));
        }

        document.add(table);

        Paragraph totalLine = new Paragraph(
                "Grand Total: " + String.format("%.2f", grandTotal),
                new Font(Font.HELVETICA, 13, Font.BOLD)
        );
        totalLine.setAlignment(Element.ALIGN_RIGHT);
        totalLine.setSpacingBefore(15);
        document.add(totalLine);
    }

    private PdfPCell createCell(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setPadding(6);
        return cell;
    }
}
