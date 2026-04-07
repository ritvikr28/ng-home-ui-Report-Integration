/**
 * Reporting Service
 * 
 * This service handles all API calls for the DevExpress Report Designer.
 * All data sources and connections are fetched via APIs rather than direct file access.
 * 
 * IMPORTANT: This service reads config directly from window variables (not envConfig)
 * because config.js loads with the defer attribute. Reading from envConfig would
 * capture undefined values at module import time before config.js has executed.
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { authService } from '@essnextgen/auth-ui';

/**
 * Column metadata for a data source
 */
export interface ColumnMetadata {
  name: string;
  type: string;
}

/**
 * Data source schema with columns (no data)
 */
export interface DataSourceSchema {
  name: string;
  columns: ColumnMetadata[];
}

/**
 * List of available data sources with their schemas
 */
export interface DataSourcesListResponse {
  dataSources: DataSourceSchema[];
}

/**
 * Request for fetching data from a specific source
 */
export interface DataSourceRequest {
  dataSourceName: string;
  columns?: string[];
}

/**
 * Request for fetching data from multiple sources
 */
export interface MultiSourceDataRequest {
  sources: DataSourceRequest[];
}

/**
 * Result from fetching a single data source
 */
export interface DataSourceResult {
  dataSourceName: string;
  data: Record<string, unknown>[];
  error?: string;
}

/**
 * Response from fetching multiple data sources
 */
export interface MultiSourceDataResponse {
  results: DataSourceResult[];
}

/**
 * JSON Data Connection description for DevExpress
 */
export interface JsonDataConnectionDescription {
  name: string;
  connectionString: string;
}

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
 * Learner information for per-pupil report generation
 */
export interface LearnerForReport {
  learnerExternalId: string;
  learnerName: string;
}

/**
 * Request to generate per-pupil reports
 */
export interface GeneratePerPupilRequest {
  reportName: string;
  learners: LearnerForReport[];
  format?: 'pdf' | 'xlsx';
}

/**
 * Information about a generated report
 */
export interface GeneratedReportInfo {
  id: string;
  reportName: string;
  learnerExternalId: string;
  learnerName: string;
  format: string;
  generatedAt: string;
  fileSizeBytes: number;
}

/**
 * Error information for failed report generation
 */
export interface GenerationError {
  learnerExternalId: string;
  learnerName: string;
  error: string;
}

/**
 * Response from per-pupil report generation
 */
export interface GeneratePerPupilResponse {
  generatedReports: GeneratedReportInfo[];
  errors: GenerationError[];
  totalRequested: number;
  totalGenerated: number;
}

/**
 * Response from my-reports endpoint
 */
export interface MyReportsResponse {
  reports: GeneratedReportInfo[];
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
 * Reporting service configuration
 */
interface ReportingServiceConfig {
  baseUrl: string;
  getAuthToken: () => string | null;
}

/**
 * Creates an axios instance configured for the reporting API
 */
const createReportingAxiosInstance = (config: ReportingServiceConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: config.baseUrl,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Request interceptor to add auth header
  instance.interceptors.request.use(
    (axiosConfig: AxiosRequestConfig) => {
      const token = config.getAuthToken();
      if (token && axiosConfig.headers) {
        axiosConfig.headers.Authorization = `Bearer ${token}`;
      }
      // Add Organisation-Id header if available
      const orgId = sessionStorage.getItem('OrganizationId');
      if (orgId && axiosConfig.headers) {
        axiosConfig.headers['Organisation-Id'] = orgId;
      }
      return axiosConfig;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        sessionStorage.removeItem('auth');
        // Optionally trigger logout
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Reporting service class for API-based data operations
 */
class ReportingService {
  private axiosInstance: AxiosInstance | null = null;
  private lastBaseUrl: string = '';

  /**
   * Get the base URL for the reporting API
   * IMPORTANT: Always reads directly from window to handle deferred config.js loading
   * Do NOT use envConfig as it captures values at module import time (before config.js loads)
   */
  private getBaseUrl(): string {
    // ALWAYS read directly from window - config.js sets these variables
    // envConfig captures values at module import time which may be before config.js loads
    const baseUrl = (window as any).REPORTING_API_URL || (window as any).REACT_API_URL || '';
    return baseUrl;
  }

  /**
   * Wait for config to be available (polls for config.js to load)
   * @returns Promise that resolves with the base URL when config is available
   */
  private async waitForConfig(): Promise<string> {
    const maxAttempts = 50; // Max 5 seconds (50 * 100ms)
    let attempts = 0;
    
    return new Promise((resolve, reject) => {
      const checkConfig = () => {
        const url = this.getBaseUrl();
        if (url) {
          console.log('[ReportingService] Config available:', url);
          resolve(url);
        } else if (attempts >= maxAttempts) {
          console.error('[ReportingService] Config not available after timeout');
          reject(new Error('Configuration not available. Please refresh the page.'));
        } else {
          attempts++;
          setTimeout(checkConfig, 100);
        }
      };
      checkConfig();
    });
  }

  /**
   * Initialize the reporting service with configuration
   */
  init(): void {
    const baseUrl = this.getBaseUrl();
    console.log('[ReportingService] Initializing with baseUrl:', baseUrl);
    this.lastBaseUrl = baseUrl;
    this.axiosInstance = createReportingAxiosInstance({
      baseUrl,
      getAuthToken: () => authService.getAuthTokens()
    });
  }

  /**
   * Ensure the service is initialized with a valid config
   * Re-initializes if the base URL has changed (handles deferred config loading)
   */
  private async ensureInitialized(): Promise<AxiosInstance> {
    const currentBaseUrl = this.getBaseUrl();
    
    // If no URL available yet, wait for config
    if (!currentBaseUrl) {
      console.log('[ReportingService] Config not yet available, waiting...');
      await this.waitForConfig();
    }
    
    // Re-initialize if base URL changed (handles case where config was loaded after first init)
    const newBaseUrl = this.getBaseUrl();
    if (!this.axiosInstance || this.lastBaseUrl !== newBaseUrl) {
      console.log('[ReportingService] Re-initializing with new baseUrl:', newBaseUrl);
      this.init();
    }
    
    return this.axiosInstance!;
  }

  /**
   * Gets all available data sources with their schemas (columns only, no data)
   */
  async getDataSources(): Promise<DataSourcesListResponse> {
    const instance = await this.ensureInitialized();
    const response = await instance.get<DataSourcesListResponse>('/api/v1/data/sources');
    return response.data;
  }

  /**
   * Gets the schema (columns) for a specific data source without loading data
   */
  async getDataSourceSchema(dataSourceName: string): Promise<DataSourceSchema> {
    const instance = await this.ensureInitialized();
    const response = await instance.get<DataSourceSchema>(
      `/api/v1/data/schema?dataSourceName=${encodeURIComponent(dataSourceName)}`
    );
    return response.data;
  }

  /**
   * Gets data from a single data source with optional column selection
   */
  async getData(
    dataSourceName: string,
    columns?: string[]
  ): Promise<Record<string, unknown>[]> {
    const instance = await this.ensureInitialized();
    let url = `/api/v1/data?dataSourceName=${encodeURIComponent(dataSourceName)}`;

    if (columns && columns.length > 0) {
      const columnParams = columns.map((c) => `columns=${encodeURIComponent(c)}`).join('&');
      url += `&${columnParams}`;
    }

    const response = await instance.get<Record<string, unknown>[]>(url);
    return response.data;
  }

  /**
   * Gets data from multiple data sources with column selection for each
   */
  async getMultiSourceData(request: MultiSourceDataRequest): Promise<MultiSourceDataResponse> {
    const instance = await this.ensureInitialized();
    const response = await instance.post<MultiSourceDataResponse>('/api/v1/data/multi', request);
    return response.data;
  }

  /**
   * Gets the list of available JSON data connections for the Report Designer
   */
  async getJsonConnections(): Promise<JsonDataConnectionDescription[]> {
    const instance = await this.ensureInitialized();
    const response = await instance.get<JsonDataConnectionDescription[]>(
      '/api/v1/reporting/connections'
    );
    return response.data;
  }

  /**
   * Saves a report to the server
   */
  async saveReport(reportUrl: string, reportData: string): Promise<void> {
    const instance = await this.ensureInitialized();
    await instance.post('/api/v1/reporting/save', {
      reportUrl,
      reportData
    });
  }

  /**
   * Saves a report with Save/SaveAs logic
   * @param request - Save report request with optional new name for SaveAs
   */
  async saveReportWithOptions(request: SaveReportRequest): Promise<SaveReportResponse> {
    const instance = await this.ensureInitialized();
    const response = await instance.post<SaveReportResponse>('/api/v1/reporting/save', request);
    return response.data;
  }

  /**
   * Gets a list of available reports
   */
  async getReportsList(): Promise<string[]> {
    const instance = await this.ensureInitialized();
    const response = await instance.get<string[]>('/api/v1/reporting/list');
    return response.data;
  }

  /**
   * Gets a list of available reports with metadata (including isPredefined flag)
   */
  async getReportsWithMetadata(): Promise<ReportsListResponse> {
    console.log('[ReportingService] getReportsWithMetadata called:', {
      timestamp: new Date().toISOString(),
      windowConfigAvailable: !!(window as any).REPORTING_API_URL,
      lastBaseUrl: this.lastBaseUrl,
      hasAxiosInstance: !!this.axiosInstance
    });
    
    const instance = await this.ensureInitialized();
    
    console.log('[ReportingService] ensureInitialized complete, making API call');
    
    try {
      const response = await instance.get<ReportsListResponse>('/api/v1/reporting/list-with-metadata');
      console.log('[ReportingService] getReportsWithMetadata success:', {
        reportsCount: response.data?.reports?.length
      });
      return response.data;
    } catch (error) {
      console.log('[ReportingService] getReportsWithMetadata failed, falling back:', error);
      // Fallback to basic list if metadata endpoint not available
      const basicList = await this.getReportsList();
      return {
        reports: basicList.map(name => ({
          name,
          isPredefined: false // Default to false if we can't determine
        }))
      };
    }
  }

  /**
   * Gets the report layout data for a specific report
   */
  async getReportLayout(reportName: string): Promise<string> {
    const instance = await this.ensureInitialized();
    const response = await instance.get<string>(
      `/api/v1/reporting/layout?reportName=${encodeURIComponent(reportName)}`
    );
    return response.data;
  }

  /**
   * Generates per-pupil reports for the specified learners.
   * Each learner gets their own individual PDF/Excel file stored in Azure Blob Storage.
   */
  async generatePerPupilReports(request: GeneratePerPupilRequest): Promise<GeneratePerPupilResponse> {
    const instance = await this.ensureInitialized();
    const response = await instance.post<GeneratePerPupilResponse>(
      '/api/v1/reporting/generated/generate-per-pupil',
      request
    );
    return response.data;
  }

  /**
   * Gets the list of generated reports for the current user.
   */
  async getMyGeneratedReports(): Promise<MyReportsResponse> {
    const instance = await this.ensureInitialized();
    const response = await instance.get<MyReportsResponse>(
      '/api/v1/reporting/generated/my-reports'
    );
    return response.data;
  }

  /**
   * Downloads a specific generated report.
   * Returns a blob URL that can be used for download.
   */
  async downloadGeneratedReport(reportId: string): Promise<{ blob: Blob; filename: string }> {
    const instance = await this.ensureInitialized();
    const response = await instance.get(`/api/v1/reporting/generated/download`, {
      params: { reportId },
      responseType: 'blob'
    });
    
    // Extract filename from content-disposition header if available
    const contentDisposition = response.headers['content-disposition'];
    let filename = `report_${reportId}.pdf`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }
    
    return { blob: response.data, filename };
  }

  /**
   * Deletes a specific generated report.
   */
  async deleteGeneratedReport(reportId: string): Promise<void> {
    const instance = await this.ensureInitialized();
    await instance.delete('/api/v1/reporting/generated/delete', {
      params: { reportId }
    });
  }
}

// Export singleton instance
export const reportingService = new ReportingService();

// Export the class for testing purposes
export { ReportingService };
