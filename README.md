# Async PDF Report Generator

ระบบ generate รายงานสรุปยอดขายในรูปแบบ PDF โดยทำงานแบบ Asynchronous เพื่อให้ผู้ใช้ไม่ต้องรอหน้าจอค้างระหว่างประมวลผล

## Tech Stack

**Backend**
- Java 17 + Spring Boot 3.2
- Spring Data JPA + H2 Database
- OpenPDF (สร้างไฟล์ PDF)
- Custom Thread Pool (จำกัด concurrent jobs 3-5)

**Frontend**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Axios

## Prerequisites

- Java 17+
- Maven
- Node.js 18+

## Getting Started

### Backend

```bash
cd backend
mvn spring-boot:run (ต้องมี Java 17+ กับ Maven ลงไว้ในเครื่องก่อน)
```

Server จะรันที่ `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reports` | สร้าง report ใหม่ (ตอบ 202) |
| GET | `/api/reports/{id}` | ดูสถานะ report |
| GET | `/api/reports` | ดึงรายการ report ทั้งหมด |
| GET | `/api/reports/{id}/download` | ดาวน์โหลด PDF |

## Report Status Flow

```
PENDING → PROCESSING → COMPLETED → FAILED
```

## Project Structure

```
backend/
├── src/main/java/com/srisawad/reportgenerator/
│   ├── config/          # AsyncConfig, WebConfig
│   ├── controller/      # ReportController
│   ├── dto/             # ReportResponse
│   ├── entity/          # Report
│   ├── enums/           # ReportStatus
│   ├── repository/      # ReportRepository
│   └── service/         # ReportService, PdfGeneratorService

frontend/
├── src/
│   ├── components/      # Dashboard, ReportCard
│   ├── constants/       # reportStatus
│   ├── hooks/           # useReports, useReportPolling
│   └── services/        # reportApi
```
