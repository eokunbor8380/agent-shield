import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth";
import { buildCsv, buildExcelHtml, buildReportRows, buildSimplePdf, getReportDefinition, type ReportFormat } from "@/lib/reporting";
import { readStore } from "@/lib/store";

const formats: ReportFormat[] = ["csv", "xls", "pdf"];

function fileName(title: string, format: ReportFormat) {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.${format}`;
}

export async function GET(request: Request) {
  const session = await requireSession();
  const { searchParams } = new URL(request.url);
  const reportId = searchParams.get("report") ?? "executive-risk-summary";
  const format = searchParams.get("format") as ReportFormat | null;
  const selectedFormat = format && formats.includes(format) ? format : "csv";
  const store = await readStore();
  const definition = getReportDefinition(reportId);
  const rows = buildReportRows(store, session.tenantId, reportId);

  if (selectedFormat === "pdf") {
    return new NextResponse(buildSimplePdf(definition.title, rows), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName(definition.title, selectedFormat)}"`,
      },
    });
  }

  if (selectedFormat === "xls") {
    return new NextResponse(buildExcelHtml(rows), {
      headers: {
        "Content-Type": "application/vnd.ms-excel; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName(definition.title, selectedFormat)}"`,
      },
    });
  }

  return new NextResponse(buildCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName(definition.title, selectedFormat)}"`,
    },
  });
}
