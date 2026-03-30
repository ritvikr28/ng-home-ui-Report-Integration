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
   * Gets a list of available reports
   */
  async getReportsList(): Promise<string[]> {
    const instance = this.ensureInitialized();
    const response = await instance.get<string[]>('/api/v1/reporting/list');
    return response.data;
  }
}

// Export singleton instance
export const reportingService = new ReportingService();

// Export the class for testing purposes
export { ReportingService };
