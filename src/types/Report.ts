/**
 * Report type definitions for the 3-screen workflow
 * 
 * Re-exports from reportingService to maintain single source of truth
 */

// Re-export report-related types from the reporting service
export type { 
  ReportInfo, 
  ReportsListResponse, 
  SaveReportRequest, 
  SaveReportResponse 
} from '../shared/services/reportingService';

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
