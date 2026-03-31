/**
 * Report type definitions for the 3-screen workflow
 */

/**
 * Report information including metadata about whether it's predefined
 */
export interface ReportInfo {
  /** Report identifier/name used by DevExpress */
  name: string;
  /** Display name shown to users */
  displayName?: string;
  /** Whether this is a predefined report from the backend (cannot be overwritten) */
  isPredefined: boolean;
  /** Optional description of the report */
  description?: string;
  /** When the report was last modified */
  lastModified?: string;
}

/**
 * Response from the reports list API
 */
export interface ReportsListResponse {
  reports: ReportInfo[];
}

/**
 * Save report request payload
 */
export interface SaveReportRequest {
  /** The original report name (for Save operation) */
  reportUrl: string;
  /** The new report name (for Save As operation) */
  newReportName?: string;
  /** The report layout data (XML) */
  reportData: string;
  /** Whether this is a Save As operation */
  saveAs: boolean;
}

/**
 * Save report response
 */
export interface SaveReportResponse {
  /** The saved report name */
  reportName: string;
  /** Success message */
  message: string;
}

/**
 * Report state passed between screens
 */
export interface ReportState {
  /** The report name being edited/previewed */
  reportName: string;
  /** Whether the report is predefined */
  isPredefined: boolean;
  /** The report data (if carrying over from designer to preview) */
  reportData?: string;
}
