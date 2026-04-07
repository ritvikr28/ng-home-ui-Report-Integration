import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import ko from 'knockout';
import 'devextreme/dist/css/dx.light.css';
import DxReportViewer, {
  Callbacks,
  RequestOptions
} from 'devexpress-reporting-react/dx-report-viewer';
import { fetchSetup } from '@devexpress/analytics-core/analytics-utils';
import { authService } from '@essnextgen/auth-ui';
import { ReportState } from '../../types/Report';
import { service, envConfig } from '../../shared/utils';
import { ISearchSuggestionsResultsApiResponse } from '../../shared/model/SearchSuggestions/SearchResultsApiResponse';
import { 
  reportingService, 
  GeneratedReportInfo, 
  GeneratePerPupilRequest 
} from '../../shared/services/reportingService';
import './ReportPreview.scss';

// Make knockout available globally for DevExpress
(window as any).ko = ko;

// Height constants
const NAVBAR_HEIGHT = 56;
const TOOLBAR_HEIGHT = 60;
const SEARCH_PANEL_HEIGHT = 80; // Increased to accommodate tags
const REPORTS_TABLE_HEIGHT = 250; // Height for generated reports table

/**
 * Interface for selected pupil to display as tag
 */
interface SelectedPupil {
  id: string;
  name: string;
}

/**
 * Encodes learner IDs as a base64url token for stateless URL encoding.
 * Uses pipe delimiter — safe for both integers and GUIDs.
 * Works across k8s pods without shared state.
 * 
 * @param ids - Array of learner ID strings (can be integers, GUIDs, etc.)
 * @returns Encoded token string with 'b64_' prefix
 */
const encodeIds = (ids: string[]): string => {
  const bytes = new TextEncoder().encode(ids.join('|'));
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  // Convert to base64url: replace + with -, / with _, remove padding =
  return 'b64_' + btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

/**
 * Fetches pupil suggestions from the API
 * @param query - Search query string
 * @param n - Number of results to fetch
 * @returns Promise with array of pupil suggestions
 */
const fetchPupilSuggestions = async (query: string, n: number = 8): Promise<ISearchSuggestionsResultsApiResponse[]> => {
  const learnerApiUrl = (window as any).LEARNER_API_URL || envConfig.LEARNER_API_URL;
  if (!learnerApiUrl) {
    console.warn('[ReportPreview] LEARNER_API_URL not configured');
    return [];
  }
  
  try {
    const response = await service.get(`/suggestions?q=${encodeURIComponent(query)}&n=${n}`, learnerApiUrl);
    return response.data.payload || [];
  } catch (error) {
    console.error('[ReportPreview] Failed to fetch pupil suggestions:', error);
    return [];
  }
};

// Debounce delay for search in milliseconds
const SEARCH_DEBOUNCE_MS = 300;

/**
 * ReportPreview Screen (Screen 3)
 * 
 * Shows a Preview button and when clicked, renders the DevExpress Report Viewer
 * with actual data loaded. Includes a pupil search panel for selecting pupils
 * and generating reports based on their IDs. Also displays generated reports
 * that can be viewed, downloaded, or deleted.
 */
const ReportPreview: React.FC = () => {
  const location = useLocation<ReportState>();
  const history = useHistory();
  const [showViewer, setShowViewer] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pupil search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<ISearchSuggestionsResultsApiResponse[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [selectedPupils, setSelectedPupils] = useState<SelectedPupil[]>([]);
  const [activeToken, setActiveToken] = useState<string>('');
  const [searchError, setSearchError] = useState<string>('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const latestQueryRef = useRef<string>(''); // Track latest query to prevent race conditions
  
  // Generated reports state
  const [generatedReports, setGeneratedReports] = useState<GeneratedReportInfo[]>([]);
  const [selectedReportIds, setSelectedReportIds] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isLoadingReports, setIsLoadingReports] = useState<boolean>(false);
  const [viewingReport, setViewingReport] = useState<GeneratedReportInfo | null>(null);
  
  // Combined state for initialization - tracks both config availability and auth setup
  // Using a single state object prevents race conditions between separate state updates
  const [initState, setInitState] = useState<{
    hostUrl: string;
    isReady: boolean;
    authConfigured: boolean;
  }>({
    hostUrl: '',
    isReady: false,
    authConfigured: false
  });

  // Get report info from location state or query params
  const queryParams = new URLSearchParams(location.search);
  const reportName = location.state?.reportName || queryParams.get('reportUrl') || 'TestReport';

  // DevExpress endpoint paths
  const getViewerModelAction = '/DXXRDV/GetViewerModel';
  const getLocalizationAction = '/DXXRDV/GetLocalization';

  /**
   * Calculate viewer height - accounts for search panel and reports table when viewer is shown
   */
  const viewerHeight = showViewer
    ? `calc(100vh - ${NAVBAR_HEIGHT + TOOLBAR_HEIGHT + SEARCH_PANEL_HEIGHT + (generatedReports.length > 0 ? REPORTS_TABLE_HEIGHT : 0)}px)`
    : `calc(100vh - ${NAVBAR_HEIGHT + TOOLBAR_HEIGHT}px)`;

  /**
   * Generate the report URL with optional learner ID token.
   * Format: "ReportName" or "ReportName__b64_encodedIds"
   */
  const getReportUrl = (): string => {
    if (viewingReport) {
      // When viewing a specific generated report, use single learner ID
      const token = encodeIds([viewingReport.learnerExternalId]);
      return `${reportName}__${token}`;
    }
    if (activeToken) {
      return `${reportName}__${activeToken}`;
    }
    return reportName;
  };

  /**
   * Helper function to get the host URL from window directly
   * IMPORTANT: Must read from window directly every time, not from envConfig
   * because config.js loads with defer attribute
   */
  const getHostUrl = (): string => {
    const rawUrl = (window as any).REPORTING_API_URL || (window as any).REACT_API_URL || '';
    if (!rawUrl) return '';
    return rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
  };

  /**
   * Single useEffect that handles ALL initialization in one atomic operation:
   * 1. Poll for config availability
   * 2. Configure auth headers
   * 3. Set isReady state
   * 
   * This prevents race conditions from separate useEffects with dependencies on each other
   */
  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;
    let pollCount = 0;
    const maxPolls = 50;
    let isMounted = true;
    
    const initializeViewer = (url: string) => {
      if (!isMounted) return;
      
      try {
        const token = authService.getAuthTokens();
        
        fetchSetup.fetchSettings = {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            'Content-Type': 'application/json'
          }
        };

        console.log('[ReportPreview] Initialized with config:', {
          hostUrl: url,
          reportName,
          hasToken: !!token
        });

        // Set all state atomically in a single update
        setInitState({
          hostUrl: url,
          isReady: true,
          authConfigured: true
        });
        
        console.log('[ReportPreview] Initialization complete, isReady = true');
      } catch (err) {
        console.error('[ReportPreview] Initialization error:', err);
        if (isMounted) {
          setError(`Initialization failed: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    };
    
    const checkConfig = () => {
      const url = getHostUrl();
      if (url) {
        console.log('[ReportPreview] Host URL resolved:', url);
        if (pollInterval) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
        initializeViewer(url);
      } else if (pollCount >= maxPolls) {
        console.error('[ReportPreview] Config not available after timeout');
        if (isMounted) {
          setError('Configuration not available. Please refresh the page.');
        }
        if (pollInterval) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
      }
      pollCount++;
    };
    
    // Check immediately
    const immediateUrl = getHostUrl();
    if (immediateUrl) {
      console.log('[ReportPreview] Config available immediately:', immediateUrl);
      initializeViewer(immediateUrl);
    } else {
      console.log('[ReportPreview] Config not yet available, starting polling...');
      pollInterval = setInterval(checkConfig, 100);
    }
    
    return () => {
      isMounted = false;
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [reportName]); // Re-run when report changes

  /**
   * Handle back button - return to report selection
   */
  const handleBack = useCallback(() => {
    history.push('/reports');
  }, [history]);

  /**
   * Handle preview button click - show the viewer
   */
  const handlePreview = useCallback(() => {
    setShowViewer(true);
  }, []);

  /**
   * Handle pupil search input change - debounced search with race condition protection
   */
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    latestQueryRef.current = query;
    
    // Clear any pending debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    if (query.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    setShowDropdown(true);
    
    // Debounce the API call
    debounceTimerRef.current = setTimeout(async () => {
      const results = await fetchPupilSuggestions(query, 8);
      
      // Only update suggestions if this query is still the latest one (race condition protection)
      if (latestQueryRef.current === query) {
        setSuggestions(results);
        setIsSearching(false);
      }
    }, SEARCH_DEBOUNCE_MS);
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  /**
   * Handle selecting a pupil from dropdown
   */
  const handleSelectPupil = useCallback((pupil: ISearchSuggestionsResultsApiResponse) => {
    // Check if already selected
    if (selectedPupils.some(p => p.id === pupil.learnerExternalId)) {
      return;
    }
    
    const displayName = `${pupil.preferredForename || pupil.legalForename} ${pupil.preferredSurname || pupil.legalSurname}`;
    
    setSelectedPupils(prev => [...prev, {
      id: pupil.learnerExternalId,
      name: displayName
    }]);
    
    // Clear search
    setSearchQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    setSearchError('');
    
    // Focus back on input for more selections
    searchInputRef.current?.focus();
  }, [selectedPupils]);

  /**
   * Handle removing a selected pupil tag
   */
  const handleRemovePupil = useCallback((pupilId: string) => {
    setSelectedPupils(prev => prev.filter(p => p.id !== pupilId));
  }, []);

  /**
   * Fetch user's generated reports
   */
  const fetchGeneratedReports = useCallback(async () => {
    setIsLoadingReports(true);
    try {
      const response = await reportingService.getMyGeneratedReports();
      // Filter to only show reports for the current report template
      const filteredReports = response.reports.filter(r => r.reportName === reportName);
      setGeneratedReports(filteredReports);
    } catch (err) {
      console.error('[ReportPreview] Failed to fetch generated reports:', err);
    } finally {
      setIsLoadingReports(false);
    }
  }, [reportName]);

  /**
   * Load generated reports on mount and when viewer is shown
   */
  useEffect(() => {
    if (showViewer && initState.isReady) {
      fetchGeneratedReports();
    }
  }, [showViewer, initState.isReady, fetchGeneratedReports]);

  /**
   * Handle generate button click - generate per-pupil reports and store them
   */
  const handleGenerateReport = useCallback(async () => {
    if (selectedPupils.length === 0) {
      setSearchError('Select at least one pupil');
      return;
    }
    
    // Clear any previous search error
    setSearchError('');
    setIsGenerating(true);
    
    try {
      const request: GeneratePerPupilRequest = {
        reportName,
        learners: selectedPupils.map(p => ({
          learnerExternalId: p.id,
          learnerName: p.name
        })),
        format: 'pdf'
      };
      
      console.log('[ReportPreview] Generating per-pupil reports:', request);
      const response = await reportingService.generatePerPupilReports(request);
      
      console.log('[ReportPreview] Generated reports response:', response);
      
      if (response.errors.length > 0) {
        const errorMsg = response.errors.map(e => `${e.learnerName}: ${e.error}`).join(', ');
        setSearchError(`Some reports failed: ${errorMsg}`);
      }
      
      // Refresh the generated reports list
      await fetchGeneratedReports();
      
      // Clear selected pupils after successful generation
      setSelectedPupils([]);
      
      // Ensure viewer is shown
      if (!showViewer) {
        setShowViewer(true);
      }
    } catch (err) {
      console.error('[ReportPreview] Failed to generate reports:', err);
      setSearchError('Failed to generate reports. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [selectedPupils, reportName, showViewer, fetchGeneratedReports]);

  /**
   * Handle clicking on a generated report to view it
   */
  const handleViewReport = useCallback((report: GeneratedReportInfo) => {
    console.log('[ReportPreview] Viewing report:', report);
    setViewingReport(report);
    setActiveToken(''); // Clear any previous token
  }, []);

  /**
   * Handle checkbox toggle for a report
   */
  const handleReportCheckboxChange = useCallback((reportId: string, checked: boolean) => {
    setSelectedReportIds(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(reportId);
      } else {
        newSet.delete(reportId);
      }
      return newSet;
    });
  }, []);

  /**
   * Handle select all checkbox
   */
  const handleSelectAllReports = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedReportIds(new Set(generatedReports.map(r => r.id)));
    } else {
      setSelectedReportIds(new Set());
    }
  }, [generatedReports]);

  /**
   * Handle downloading selected reports
   */
  const handleDownloadSelected = useCallback(async () => {
    if (selectedReportIds.size === 0) return;
    
    for (const reportId of selectedReportIds) {
      try {
        const { blob, filename } = await reportingService.downloadGeneratedReport(reportId);
        
        // Create download link and trigger download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error('[ReportPreview] Failed to download report:', reportId, err);
      }
    }
  }, [selectedReportIds]);

  /**
   * Handle deleting selected reports
   */
  const handleDeleteSelected = useCallback(async () => {
    if (selectedReportIds.size === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedReportIds.size} report(s)?`)) {
      return;
    }
    
    const deletePromises = Array.from(selectedReportIds).map(async reportId => {
      try {
        await reportingService.deleteGeneratedReport(reportId);
        return { reportId, success: true };
      } catch (err) {
        console.error('[ReportPreview] Failed to delete report:', reportId, err);
        return { reportId, success: false };
      }
    });
    
    await Promise.all(deletePromises);
    
    // Clear selection and refresh list
    setSelectedReportIds(new Set());
    await fetchGeneratedReports();
    
    // If viewing a deleted report, clear the view
    if (viewingReport && selectedReportIds.has(viewingReport.id)) {
      setViewingReport(null);
    }
  }, [selectedReportIds, fetchGeneratedReports, viewingReport]);

  /**
   * Handle click outside dropdown to close it
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Handle keyboard navigation in search
   */
  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      setShowDropdown(false);
    } else if (e.key === 'Enter' && selectedPupils.length > 0 && !isGenerating) {
      handleGenerateReport();
    }
  }, [selectedPupils.length, handleGenerateReport, isGenerating]);

  /**
   * BeforeRender callback for the viewer
   */
  const onBeforeRender = useCallback(() => {
    console.log('[ReportPreview] BeforeRender callback triggered');
    const token = authService.getAuthTokens();
    fetchSetup.fetchSettings = {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'Content-Type': 'application/json'
      }
    };
  }, []);

  /**
   * OnServerError callback
   */
  const onServerError = useCallback((sender: any, args: any) => {
    console.error('[ReportPreview] Server Error:', args);
    const errorMessage = args?.errorMessage || args?.message || 'Unknown server error';
    setError(`Preview error: ${errorMessage}`);
  }, []);

  /**
   * Format file size for display
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (error) {
    return (
      <div className="report-preview-container">
        <div className="report-preview-toolbar">
          <button className="back-button" onClick={handleBack}>
            ← Back to Reports
          </button>
          <h2 className="toolbar-title">{reportName}</h2>
        </div>
        <div className="report-preview-error">
          <div className="error-icon">⚠️</div>
          <h2>Error</h2>
          <p>{error}</p>
          <button className="retry-button" onClick={() => setError(null)}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!initState.isReady) {
    return (
      <div className="report-preview-container">
        <div className="report-preview-loading">
          Loading Preview...
        </div>
      </div>
    );
  }

  return (
    <div className="report-preview-container">
      <div className="report-preview-toolbar">
        <button className="back-button" onClick={handleBack}>
          ← Back to Reports
        </button>
        <h2 className="toolbar-title">{reportName}</h2>
        {!showViewer && (
          <button className="preview-button" onClick={handlePreview}>
            Preview Report
          </button>
        )}
      </div>

      {/* Pupil Search Panel - always visible when viewer is shown */}
      {showViewer && (
        <div className="search-panel">
          <div className="search-row">
            <label className="search-label" htmlFor="pupil-search-input">
              Pupil Search
            </label>
            <div className="pupil-search-container" ref={dropdownRef}>
              <div className="search-input-wrapper">
                {/* Selected Pupils Tags */}
                {selectedPupils.map(pupil => (
                  <span key={pupil.id} className="pupil-tag">
                    {pupil.name}
                    <button 
                      className="pupil-tag-remove" 
                      onClick={() => handleRemovePupil(pupil.id)}
                      type="button"
                      aria-label={`Remove ${pupil.name}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  id="pupil-search-input"
                  ref={searchInputRef}
                  type="text"
                  className="pupil-search-input"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  onKeyUp={(e) => e.stopPropagation()}
                  onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
                  placeholder={selectedPupils.length === 0 ? "Type pupil name to search..." : "Add more pupils..."}
                />
              </div>
              
              {/* Suggestions Dropdown */}
              {showDropdown && (
                <div className="pupil-suggestions-dropdown">
                  {isSearching ? (
                    <div className="suggestion-item suggestion-loading">Searching...</div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map(pupil => {
                      const isSelected = selectedPupils.some(p => p.id === pupil.learnerExternalId);
                      const displayName = `${pupil.preferredForename || pupil.legalForename} ${pupil.preferredSurname || pupil.legalSurname}`;
                      const legalName = pupil.legalForename !== pupil.preferredForename 
                        ? ` (${pupil.legalForename} ${pupil.legalSurname})`
                        : '';
                      
                      return (
                        <div
                          key={pupil.learnerExternalId}
                          className={`suggestion-item ${isSelected ? 'suggestion-selected' : ''}`}
                          onClick={() => !isSelected && handleSelectPupil(pupil)}
                        >
                          <div className="suggestion-avatar">
                            {pupil.imagePath ? (
                              <img src={pupil.imagePath} alt={`${displayName} avatar`} className="suggestion-avatar-img" />
                            ) : (
                              <span className="suggestion-avatar-placeholder" role="img" aria-label="Default avatar">👤</span>
                            )}
                          </div>
                          <div className="suggestion-details">
                            <span className="suggestion-name">{displayName}{legalName}</span>
                            <span className="suggestion-info">
                              {pupil.yearGroup && `Year ${pupil.yearGroup}`}
                              {pupil.yearGroup && pupil.classGroup && ' • '}
                              {pupil.classGroup}
                            </span>
                          </div>
                          {isSelected && <span className="suggestion-check">✓</span>}
                        </div>
                      );
                    })
                  ) : searchQuery.length >= 2 ? (
                    <div className="suggestion-item suggestion-empty">No pupils found</div>
                  ) : null}
                </div>
              )}
            </div>
            <button 
              className="generate-button" 
              onClick={handleGenerateReport}
              disabled={selectedPupils.length === 0 || isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </div>
          {searchError && (
            <div className="search-error">{searchError}</div>
          )}
        </div>
      )}

      {/* Generated Reports Table */}
      {showViewer && generatedReports.length > 0 && (
        <div className="generated-reports-section">
          <div className="generated-reports-header">
            <h3 className="generated-reports-title">
              Generated Reports ({generatedReports.length})
              {viewingReport && (
                <span className="viewing-label"> - Viewing: {viewingReport.learnerName}</span>
              )}
            </h3>
            <div className="generated-reports-actions">
              {selectedReportIds.size > 0 && (
                <>
                  <button 
                    className="action-button download-button"
                    onClick={handleDownloadSelected}
                  >
                    📥 Download ({selectedReportIds.size})
                  </button>
                  <button 
                    className="action-button delete-button"
                    onClick={handleDeleteSelected}
                  >
                    🗑️ Delete ({selectedReportIds.size})
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="generated-reports-table-wrapper">
            <table className="generated-reports-table">
              <thead>
                <tr>
                  <th className="checkbox-cell">
                    <input
                      type="checkbox"
                      checked={selectedReportIds.size === generatedReports.length && generatedReports.length > 0}
                      onChange={(e) => handleSelectAllReports(e.target.checked)}
                      aria-label="Select all reports"
                    />
                  </th>
                  <th>Pupil Name</th>
                  <th>Generated At</th>
                  <th>Format</th>
                  <th>Size</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {generatedReports.map(report => (
                  <tr 
                    key={report.id} 
                    className={viewingReport?.id === report.id ? 'row-viewing' : ''}
                  >
                    <td className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={selectedReportIds.has(report.id)}
                        onChange={(e) => handleReportCheckboxChange(report.id, e.target.checked)}
                        aria-label={`Select report for ${report.learnerName}`}
                      />
                    </td>
                    <td 
                      className="clickable-cell"
                      onClick={() => handleViewReport(report)}
                    >
                      {report.learnerName}
                    </td>
                    <td>{formatDate(report.generatedAt)}</td>
                    <td className="format-cell">{report.format.toUpperCase()}</td>
                    <td>{formatFileSize(report.fileSizeBytes)}</td>
                    <td className="actions-cell">
                      <button
                        className="row-action-button view-button"
                        onClick={() => handleViewReport(report)}
                        title="View report"
                      >
                        👁️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!showViewer ? (
        <div className="report-preview-placeholder">
          <div className="placeholder-content">
            <div className="placeholder-icon">📊</div>
            <h2>Report Ready</h2>
            <p>Your report "{reportName}" has been saved successfully.</p>
            <p>Click the "Preview Report" button above to view it with data.</p>
            <button className="preview-button-large" onClick={handlePreview}>
              Preview Report
            </button>
          </div>
        </div>
      ) : (
        <div className="report-viewer-wrapper">
          <DxReportViewer
            key={`${initState.hostUrl}-${reportName}-${activeToken}-${viewingReport?.id || ''}`}
            reportUrl={getReportUrl()}
            height={viewerHeight}
          >
            <RequestOptions
              host={initState.hostUrl}
              getLocalizationAction={getLocalizationAction}
              getViewerModelAction={getViewerModelAction}
            />
            <Callbacks
              BeforeRender={onBeforeRender}
              OnServerError={onServerError}
            />
          </DxReportViewer>
        </div>
      )}
    </div>
  );
};

export default ReportPreview;
