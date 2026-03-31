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
import { envConfig } from '../../shared/utils';
import { ReportState } from '../../types/Report';
import './ReportPreview.scss';

// Make knockout available globally for DevExpress
(window as any).ko = ko;

// Height constants
const NAVBAR_HEIGHT = 56;
const TOOLBAR_HEIGHT = 60;

/**
 * ReportPreview Screen (Screen 3)
 * 
 * Shows a Preview button and when clicked, renders the DevExpress Report Viewer
 * with actual data loaded.
 */
const ReportPreview: React.FC = () => {
  const location = useLocation<ReportState>();
  const history = useHistory();
  const [showViewer, setShowViewer] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get report info from location state or query params
  const queryParams = new URLSearchParams(location.search);
  const reportName = location.state?.reportName || queryParams.get('reportUrl') || 'TestReport';

  // Get the reporting API base URL
  const rawHostUrl: string = envConfig.REPORTING_API_URL || envConfig.BASE_URL || '';
  const hostUrl: string = rawHostUrl.endsWith('/') ? rawHostUrl.slice(0, -1) : rawHostUrl;

  // DevExpress endpoint paths
  const getViewerModelAction = '/DXXRDV/GetViewerModel';
  const getLocalizationAction = '/DXXRDV/GetLocalization';

  /**
   * Calculate viewer height
   */
  const viewerHeight = `calc(100vh - ${NAVBAR_HEIGHT + TOOLBAR_HEIGHT}px)`;

  /**
   * Initialize fetch settings with auth token
   */
  useEffect(() => {
    try {
      const token = authService.getAuthTokens();
      
      fetchSetup.fetchSettings = {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Content-Type': 'application/json'
        }
      };

      console.log('[ReportPreview] Initialized with config:', {
        hostUrl,
        reportName,
        hasToken: !!token
      });

      setIsReady(true);
    } catch (err) {
      console.error('[ReportPreview] Initialization error:', err);
      setError(`Initialization failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [hostUrl, reportName]);

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

  if (!isReady) {
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

      {!showViewer ? (
        <div className="report-preview-placeholder">
          <div className="placeholder-content">
            <div className="placeholder-icon">📊</div>
            <h2>Report Ready</h2>
            <p>Your report &quot;{reportName}&quot; has been saved successfully.</p>
            <p>Click the &quot;Preview Report&quot; button above to view it with data.</p>
            <button className="preview-button-large" onClick={handlePreview}>
              Preview Report
            </button>
          </div>
        </div>
      ) : (
        <div className="report-viewer-wrapper">
          <DxReportViewer
            reportUrl={reportName}
            height={viewerHeight}
          >
            <RequestOptions
              host={hostUrl}
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
