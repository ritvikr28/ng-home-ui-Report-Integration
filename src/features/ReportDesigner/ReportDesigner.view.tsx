import React, { useCallback, useMemo, useEffect, useState } from 'react';
import ko from 'knockout';
import 'devextreme/dist/css/dx.light.css';
import DxReportDesigner, {
  Callbacks,
  RequestOptions
} from 'devexpress-reporting-react/dx-report-designer';
import { fetchSetup } from '@devexpress/analytics-core/analytics-utils';
import { useLocation } from 'react-router-dom';
import { authService } from '@essnextgen/auth-ui';
import { envConfig } from '../../shared/utils';
import './ReportDesigner.scss';

// Make knockout available globally for DevExpress
(window as any).ko = ko;

// Height constants for the designer component
const NAVBAR_HEIGHT = 56; // Main navbar height in pixels (standard Bootstrap)

/**
 * ReportDesigner component wraps the DevExpress Report Designer.
 * 
 * All data connections are configured to use APIs rather than direct file access.
 * The backend API provides JSON data sources via /api/v1/data endpoints.
 */
const ReportDesigner: React.FC = () => {
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Parse query parameters for report configuration
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const reportUrl: string = queryParams.get('reportUrl') ?? 'TestReport';
  
  // Get the reporting API base URL from environment config
  const hostUrl: string = envConfig.REPORTING_API_URL || envConfig.BASE_URL || '';
  
  // DevExpress endpoint paths
  const getDesignerModelAction = 'DXXRD/GetDesignerModel';
  const getLocalizationAction = 'DXXRD/GetLocalization';

  /**
   * Calculate designer height to fit the viewport minus navigation
   */
  const designerHeight = `calc(100vh - ${NAVBAR_HEIGHT}px)`;

  /**
   * Initialize fetch settings with auth token before component renders
   */
  useEffect(() => {
    try {
      const token = authService.getAuthTokens();
      if (token) {
        fetchSetup.fetchSettings = {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };
      }
      
      // Log configuration for debugging
      console.log('[ReportDesigner] Initializing with config:', {
        hostUrl,
        reportUrl,
        hasToken: !!token,
        getDesignerModelAction,
        getLocalizationAction
      });
      
      setIsReady(true);
    } catch (err) {
      console.error('[ReportDesigner] Initialization error:', err);
      setError(`Initialization failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [hostUrl, reportUrl]);

  /**
   * BeforeRender callback - fires before the DevExpress designer makes any HTTP requests.
   * This is the correct place to ensure the Authorization header is set for all API calls.
   */
  const onBeforeRender = useCallback((sender: any) => {
    console.log('[ReportDesigner] BeforeRender callback triggered');
    const token = authService.getAuthTokens();
    if (token) {
      fetchSetup.fetchSettings = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
    }
  }, []);

  /**
   * CustomizeLocalization callback - can be used to override localization strings.
   */
  const onCustomizeLocalization = useCallback((sender: any, args: any) => {
    console.log('[ReportDesigner] CustomizeLocalization callback triggered');
  }, []);

  /**
   * Error callback - handles errors from the designer
   */
  const onError = useCallback((sender: any, args: any) => {
    console.error('[ReportDesigner] Error:', args);
    setError(`Designer error: ${JSON.stringify(args)}`);
  }, []);

  if (error) {
    return (
      <div className="report-designer-container" style={{ padding: '20px' }}>
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '20px', 
          borderRadius: '4px',
          border: '1px solid #ef9a9a'
        }}>
          <h3>Report Designer Error</h3>
          <p>{error}</p>
          <p>Please check the console for more details.</p>
          <button 
            onClick={() => { setError(null); setIsReady(false); }}
            style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="report-designer-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: designerHeight
      }}>
        <div>Loading Report Designer...</div>
      </div>
    );
  }

  return (
    <div className="report-designer-container">
      <DxReportDesigner
        reportUrl={reportUrl}
        height={designerHeight}
      >
        <RequestOptions
          host={hostUrl}
          getLocalizationAction={getLocalizationAction}
          getDesignerModelAction={getDesignerModelAction}
        />
        <Callbacks
          BeforeRender={onBeforeRender}
          CustomizeLocalization={onCustomizeLocalization}
        />
      </DxReportDesigner>
    </div>
  );
};

export default ReportDesigner;
