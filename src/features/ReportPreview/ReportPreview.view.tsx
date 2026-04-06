import React, { useState, useCallback, useEffect } from 'react';
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
import './ReportPreview.scss';

// Make knockout available globally for DevExpress
(window as any).ko = ko;

// Height constants
const NAVBAR_HEIGHT = 56;
const TOOLBAR_HEIGHT = 60;
const SEARCH_PANEL_HEIGHT = 54;

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
 * ReportPreview Screen (Screen 3)
 * 
 * Shows a Preview button and when clicked, renders the DevExpress Report Viewer
 * with actual data loaded. Includes a search panel for entering learner IDs to
 * inject live data into the report.
 */
const ReportPreview: React.FC = () => {
  const location = useLocation<ReportState>();
  const history = useHistory();
  const [showViewer, setShowViewer] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Search panel state for learner ID input
  const [learnerIdsInput, setLearnerIdsInput] = useState<string>('');
  const [activeToken, setActiveToken] = useState<string>('');
  const [searchError, setSearchError] = useState<string>('');
  
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
   * Calculate viewer height - accounts for search panel when viewer is shown
   */
  const viewerHeight = showViewer
    ? `calc(100vh - ${NAVBAR_HEIGHT + TOOLBAR_HEIGHT + SEARCH_PANEL_HEIGHT}px)`
    : `calc(100vh - ${NAVBAR_HEIGHT + TOOLBAR_HEIGHT}px)`;

  /**
   * Generate the report URL with optional learner ID token.
   * Format: "ReportName" or "ReportName__b64_encodedIds"
   */
  const getReportUrl = (): string => {
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
   * Handle generate button click - parse and encode learner IDs, then refresh viewer
   */
  const handleGenerateReport = useCallback(() => {
    const trimmed = learnerIdsInput.trim();
    
    if (!trimmed) {
      setSearchError('Enter at least one Learner ID');
      return;
    }
    
    // Parse comma-separated IDs, strip surrounding quotes (handles pasted JSON arrays)
    const ids = trimmed
      .split(',')
      .map(x => x.trim().replace(/^["'\s]+|["'\s]+$/g, ''))
      .filter(x => x.length > 0);
    
    if (ids.length === 0) {
      setSearchError('Enter at least one valid Learner ID');
      return;
    }
    
    // Clear any previous search error
    setSearchError('');
    
    // Encode IDs and update active token - this will trigger viewer re-render
    const token = encodeIds(ids);
    console.log('[ReportPreview] Generated token for IDs:', { count: ids.length, token });
    setActiveToken(token);
    
    // Ensure viewer is shown
    if (!showViewer) {
      setShowViewer(true);
    }
  }, [learnerIdsInput, showViewer]);

  /**
   * Handle Enter key press in search input
   */
  const handleSearchKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Stop propagation to prevent DevExpress from capturing keyboard events
    e.stopPropagation();
    if (e.key === 'Enter') {
      handleGenerateReport();
    }
  }, [handleGenerateReport]);

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

      {/* Search Panel for Learner IDs - always visible when viewer is shown */}
      {showViewer && (
        <div className="search-panel">
          <div className="search-row">
            <label className="search-label" htmlFor="learner-ids-input">
              Learner IDs
            </label>
            <input
              id="learner-ids-input"
              type="text"
              className="search-input"
              value={learnerIdsInput}
              onChange={(e) => setLearnerIdsInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onKeyUp={(e) => e.stopPropagation()}
              placeholder="e.g. guid1, guid2, guid3"
              autoFocus
            />
            <button className="generate-button" onClick={handleGenerateReport}>
              Generate
            </button>
          </div>
          {searchError && (
            <div className="search-error">{searchError}</div>
          )}
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
            key={`${initState.hostUrl}-${reportName}-${activeToken}`}
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
