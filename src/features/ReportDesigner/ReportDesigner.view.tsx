import React, { useCallback, useMemo } from 'react';
import DxReportDesigner, {
  Callbacks,
  DesignerModelSettings,
  PreviewSettings,
  RequestOptions
} from 'devexpress-reporting-react/dx-report-designer';
import { SearchSettings } from 'devexpress-reporting-react/dx-report-viewer';
import { fetchSetup } from '@devexpress/analytics-core/analytics-utils';
import { useLocation } from 'react-router-dom';
import { authService } from '@essnextgen/auth-ui';
import { envConfig } from '../../shared/utils';
import './ReportDesigner.scss';

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
   * BeforeRender callback - fires before the DevExpress designer makes any HTTP requests.
   * This is the correct place to ensure the Authorization header is set for all API calls.
   */
  const onBeforeRender = useCallback(() => {
    const token = authService.getAuthTokens();
    if (token) {
      fetchSetup.fetchSettings = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
    }
  }, []);

  /**
   * CustomizeLocalization callback - can be used to override localization strings.
   */
  const onCustomizeLocalization = useCallback(() => {
    // Localization customization can be added here if needed
  }, []);

  return (
    <div className="report-designer-container">
      <DxReportDesigner
        reportUrl={reportUrl}
        height={designerHeight}
        developmentMode={process.env.NODE_ENV === 'development'}
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
        <DesignerModelSettings>
          <PreviewSettings>
            <SearchSettings searchEnabled />
          </PreviewSettings>
        </DesignerModelSettings>
      </DxReportDesigner>
    </div>
  );
};

export default ReportDesigner;
