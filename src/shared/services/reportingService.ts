/**
 * Reporting Service
 * 
 * This service handles all API calls for the DevExpress Report Designer.
 * All data sources and connections are fetched via APIs rather than direct file access.
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { authService } from '@essnextgen/auth-ui';
import { envConfig } from '../utils';

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

  /**
   * Initialize the reporting service with configuration
   */
  init(): void {
    const baseUrl = envConfig.REPORTING_API_URL || envConfig.BASE_URL;
    this.axiosInstance = createReportingAxiosInstance({
      baseUrl,
      getAuthToken: () => authService.getAuthTokens()
    });
  }

  /**
   * Ensure the service is initialized
   */
  private ensureInitialized(): AxiosInstance {
    if (!this.axiosInstance) {
      this.init();
    }
    return this.axiosInstance!;
  }

  /**
   * Gets all available data sources with their schemas (columns only, no data)
   */
  async getDataSources(): Promise<DataSourcesListResponse> {
    const instance = this.ensureInitialized();
    const response = await instance.get<DataSourcesListResponse>('/api/v1/data/sources');
    return response.data;
  }

  /**
   * Gets the schema (columns) for a specific data source without loading data
   */
  async getDataSourceSchema(dataSourceName: string): Promise<DataSourceSchema> {
    const instance = this.ensureInitialized();
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
    const instance = this.ensureInitialized();
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
    const instance = this.ensureInitialized();
    const response = await instance.post<MultiSourceDataResponse>('/api/v1/data/multi', request);
    return response.data;
  }

  /**
   * Gets the list of available JSON data connections for the Report Designer
   */
  async getJsonConnections(): Promise<JsonDataConnectionDescription[]> {
    const instance = this.ensureInitialized();
    const response = await instance.get<JsonDataConnectionDescription[]>(
      '/api/v1/reporting/connections'
    );
    return response.data;
  }

  /**
   * Saves a report to the server
   */
  async saveReport(reportUrl: string, reportData: string): Promise<void> {
    const instance = this.ensureInitialized();
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
    const instance = this.ensureInitialized();
    const response = await instance.post<SaveReportResponse>('/api/v1/reporting/save', request);
    return response.data;
  }

  /**
   * Gets a list of available reports
   */
  async getReportsList(): Promise<string[]> {
    const instance = this.ensureInitialized();
    const response = await instance.get<string[]>('/api/v1/reporting/list');
    return response.data;
  }

  /**
   * Gets a list of available reports with metadata (including isPredefined flag)
   */
  async getReportsWithMetadata(): Promise<ReportsListResponse> {
    const instance = this.ensureInitialized();
    try {
      const response = await instance.get<ReportsListResponse>('/api/v1/reporting/list-with-metadata');
      return response.data;
    } catch (error) {
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
    const instance = this.ensureInitialized();
    const response = await instance.get<string>(
      `/api/v1/reporting/layout?reportName=${encodeURIComponent(reportName)}`
    );
    return response.data;
  }
}

// Export singleton instance
export const reportingService = new ReportingService();

// Export the class for testing purposes
export { ReportingService };
