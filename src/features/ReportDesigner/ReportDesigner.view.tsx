import React, { useCallback, useMemo, useEffect, useState, useRef } from 'react';
import ko from 'knockout';
import 'devextreme/dist/css/dx.light.css';
import DxReportDesigner, {
  Callbacks,
  RequestOptions
} from 'devexpress-reporting-react/dx-report-designer';
import { fetchSetup } from '@devexpress/analytics-core/analytics-utils';
import { useLocation, useHistory } from 'react-router-dom';
import { authService } from '@essnextgen/auth-ui';
import { envConfig } from '../../shared/utils';
import { ReportState } from '../../types/Report';
import './ReportDesigner.scss';

// Make knockout available globally for DevExpress
(window as any).ko = ko;

// Height constants for the designer component
const NAVBAR_HEIGHT = 56; // Main navbar height in pixels (standard Bootstrap)
const CUSTOM_TOOLBAR_HEIGHT = 60; // Custom toolbar height

/**
 * Actions to disable in the DevExpress toolbar
 * These will be hidden to restrict the designer to design-only mode
 */
const ACTIONS_TO_DISABLE = [
  'dxxrd-preview',           // Preview button
  'dxxrd-save',              // Save button
  'dxxrd-saveas',            // Save As button
  'dxxrd-newreport',         // New Report
  'dxxrd-newreport-via-wizard', // New Report via Wizard
  'dxxrd-open',              // Open button
  'dxxrd-exit',              // Exit button
  'dxxrd-menu',              // Main menu (hamburger/overflow)
];

/**
 * Save Modal Component for Save/SaveAs functionality
 */
interface SaveModalProps {
  isOpen: boolean;
  isPredefined: boolean;
  currentReportName: string;
  onSave: (saveAs: boolean, newName?: string) => void;
  onCancel: () => void;
  isSaving: boolean;
}

const SaveModal: React.FC<SaveModalProps> = ({
  isOpen,
  isPredefined,
  currentReportName,
  onSave,
  onCancel,
  isSaving
}) => {
  const [saveMode, setSaveMode] = useState<'save' | 'saveAs'>(isPredefined ? 'saveAs' : 'save');
  const [newReportName, setNewReportName] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSaveMode(isPredefined ? 'saveAs' : 'save');
      setNewReportName('');
      setError('');
    }
  }, [isOpen, isPredefined]);

  const handleSave = () => {
    if (saveMode === 'saveAs') {
      if (!newReportName.trim()) {
        setError('Please enter a report name');
        return;
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(newReportName.trim())) {
        setError('Report name can only contain letters, numbers, underscores and hyphens (no spaces)');
        return;
      }
      onSave(true, newReportName.trim());
    } else {
      onSave(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="save-modal-overlay">
      <div className="save-modal">
        <h2 className="save-modal-title">Save Report</h2>
        
        {isPredefined ? (
          <div className="save-modal-notice">
            <span className="notice-icon">ℹ️</span>
            <p>
              This is a predefined template report. 
              It can only be saved as a new report.
            </p>
          </div>
        ) : (
          <div className="save-mode-selector">
            <label className="radio-label">
              <input
                type="radio"
                name="saveMode"
                value="save"
                checked={saveMode === 'save'}
                onChange={() => setSaveMode('save')}
                disabled={isSaving}
              />
              <span>Save (overwrite &quot;{currentReportName}&quot;)</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="saveMode"
                value="saveAs"
                checked={saveMode === 'saveAs'}
                onChange={() => setSaveMode('saveAs')}
                disabled={isSaving}
              />
              <span>Save As (create new report)</span>
            </label>
          </div>
        )}

        {(saveMode === 'saveAs' || isPredefined) && (
          <div className="save-as-input">
            <label htmlFor="new-report-name">New Report Name:</label>
            <input
              id="new-report-name"
              type="text"
              value={newReportName}
              onChange={(e) => {
                setNewReportName(e.target.value);
                setError('');
              }}
              placeholder="Enter new report name"
              disabled={isSaving}
              autoFocus
            />
            {error && <span className="input-error">{error}</span>}
          </div>
        )}

        <div className="save-modal-buttons">
          <button
            className="cancel-button"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            className="save-button"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * ReportDesigner component wraps the DevExpress Report Designer.
 * 
 * In restricted mode:
 * - DevExpress toolbar actions (Preview, Save, Open, etc.) are disabled
 * - Custom Back and Save buttons are provided
 * - Save behavior differs based on whether report is predefined:
 *   - Predefined reports: Save As only (create new report)
 *   - User reports: Save (overwrite) or Save As options
 */
const ReportDesigner: React.FC = () => {
  const location = useLocation<ReportState>();
  const history = useHistory();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Reference to the designer instance for accessing report data
  const designerRef = useRef<any>(null);
  
  // Parse query parameters for report configuration
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const reportUrl: string = queryParams.get('reportUrl') ?? 'TestReport';
  
  // Get report metadata from location state (passed from ReportSelection screen)
  const isPredefined: boolean = location.state?.isPredefined ?? false;
  
  // Get the reporting API base URL from environment config
  const rawHostUrl: string = envConfig.REPORTING_API_URL || envConfig.BASE_URL || '';
  const hostUrl: string = rawHostUrl.endsWith('/') ? rawHostUrl.slice(0, -1) : rawHostUrl;
  
  // DevExpress endpoint paths
  const getDesignerModelAction = '/DXXRD/GetDesignerModel';
  const getLocalizationAction = '/DXXRD/GetLocalization';

  /**
   * Calculate designer height to fit the viewport minus navigation and custom toolbar
   */
  const designerHeight = `calc(100vh - ${NAVBAR_HEIGHT + CUSTOM_TOOLBAR_HEIGHT}px)`;

  /**
   * Initialize fetch settings with auth token before component renders
   */
  useEffect(() => {
    try {
      const token = authService.getAuthTokens();
      
      // Configure fetchSetup for DevExpress API calls
      fetchSetup.fetchSettings = {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Content-Type': 'application/json'
        }
      };
      
      // Log configuration for debugging
      console.log('[ReportDesigner] Initializing with config:', {
        hostUrl,
        reportUrl,
        isPredefined,
        hasToken: !!token
      });
      
      setIsReady(true);
    } catch (err) {
      console.error('[ReportDesigner] Initialization error:', err);
      setError(`Initialization failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [hostUrl, reportUrl, isPredefined]);

  /**
   * Handle Back button - return to report selection
   */
  const handleBack = useCallback(() => {
    history.push('/reports');
  }, [history]);

  /**
   * Handle Save button - open save modal
   */
  const handleSaveClick = useCallback(() => {
    setShowSaveModal(true);
  }, []);

  /**
   * Handle actual save operation from modal
   * Uses DevExpress native save action which calls /DXXRD/SaveReport endpoint
   */
  const handleSave = useCallback(async (saveAs: boolean, newName?: string) => {
    try {
      setIsSaving(true);
      
      console.log('[ReportDesigner] Saving report:', {
        reportUrl,
        saveAs,
        newName
      });

      // Get the DevExpress designer instance
      const designer = designerRef.current;
      
      if (!designer) {
        setIsSaving(false);
        setError('Designer not initialized. Please wait and try again.');
        return;
      }

      // For SaveAs, we need to update the report URL before saving
      if (saveAs && newName) {
        // Try to use the SaveAs functionality if available
        if (designer.SaveAs) {
          await designer.SaveAs(newName);
        } else if (designer.saveReportAs) {
          await designer.saveReportAs(newName);
        } else if (designer.SaveReport) {
          // Update the report URL and then save
          designer.reportUrl = newName;
          await designer.SaveReport();
        } else if (designer.saveReport) {
          designer.reportUrl = newName;
          await designer.saveReport();
        } else {
          // Fallback: Try to find and execute the save action from the action list
          const saveAction = designer.GetAction?.('dxxrd-save') || designer.getAction?.('dxxrd-save');
          if (saveAction && saveAction.clickAction) {
            // Update URL first for SaveAs
            if (designer.model?.reportUrl) {
              designer.model.reportUrl(newName);
            }
            saveAction.clickAction();
          } else {
            throw new Error('Save functionality not available on designer instance');
          }
        }
      } else {
        // Regular save - use native DevExpress save
        if (designer.SaveReport) {
          await designer.SaveReport();
        } else if (designer.saveReport) {
          await designer.saveReport();
        } else {
          // Fallback: Try to find and execute the save action from the action list
          const saveAction = designer.GetAction?.('dxxrd-save') || designer.getAction?.('dxxrd-save');
          if (saveAction && saveAction.clickAction) {
            saveAction.clickAction();
          } else {
            throw new Error('Save functionality not available on designer instance');
          }
        }
      }

      console.log('[ReportDesigner] Save initiated successfully');

      // Close modal
      setShowSaveModal(false);
      setIsSaving(false);

      // Navigate to preview screen
      const savedReportName = saveAs && newName ? newName : reportUrl;
      history.push({
        pathname: '/reportpreview',
        search: `?reportUrl=${encodeURIComponent(savedReportName)}`,
        state: {
          reportName: savedReportName,
          isPredefined: false // Saved reports are never predefined
        }
      });
    } catch (err) {
      console.error('[ReportDesigner] Save error:', err);
      setIsSaving(false);
      setError(`Failed to save report: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [reportUrl, history]);

  /**
   * BeforeRender callback - fires before the DevExpress designer makes any HTTP requests.
   */
  const onBeforeRender = useCallback((sender: any) => {
    console.log('[ReportDesigner] BeforeRender callback triggered');
    
    const token = authService.getAuthTokens();
    fetchSetup.fetchSettings = {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'Content-Type': 'application/json'
      }
    };
  }, []);

  /**
   * Init callback - fires when the designer model is fully initialized
   * Store reference to designer for accessing report data later
   */
  const onInit = useCallback((sender: any) => {
    console.log('[ReportDesigner] Init callback triggered - Designer model is ready');
    designerRef.current = sender;
  }, []);

  /**
   * CustomizeLocalization callback - can be used to override localization strings.
   */
  const onCustomizeLocalization = useCallback(() => {
    console.log('[ReportDesigner] CustomizeLocalization callback triggered');
  }, []);

  /**
   * ComponentDidMount callback - fires when the designer component is fully mounted
   */
  const onComponentDidMount = useCallback((sender: any) => {
    console.log('[ReportDesigner] ComponentDidMount - Designer loaded successfully');
    designerRef.current = sender;
  }, []);

  /**
   * OnServerError callback - handles server-side errors
   */
  const onServerError = useCallback((sender: any, args: any) => {
    console.error('[ReportDesigner] Server Error:', args);
    const errorMessage = args?.errorMessage || args?.message || 'Unknown server error';
    console.error('[ReportDesigner] Error details:', {
      errorMessage,
      args: JSON.stringify(args)
    });
  }, []);

  /**
   * CustomizeMenuActions callback - CRITICAL for disabling toolbar buttons
   * This hides Preview, Save, SaveAs, New, Open, Exit, and menu buttons
   */
  const onCustomizeMenuActions = useCallback((sender: any, args: any) => {
    console.log('[ReportDesigner] CustomizeMenuActions callback triggered');
    
    // args.Actions contains the array of menu actions
    if (args && args.Actions) {
      const actions = args.Actions;
      
      // Pre-compute normalized action IDs to disable for performance
      const normalizedDisableIds = ACTIONS_TO_DISABLE.map(id => 
        id.toLowerCase().replace('dxxrd-', '')
      );
      
      // Log all available actions for debugging
      console.log('[ReportDesigner] Available actions:', actions.map((a: any) => ({
        id: a.id,
        text: a.text,
        visible: a.visible
      })));
      
      // Disable/hide specified actions
      actions.forEach((action: any) => {
        const actionIdLower = action.id?.toLowerCase() || '';
        if (normalizedDisableIds.some(disableId => actionIdLower.includes(disableId))) {
          console.log('[ReportDesigner] Disabling action:', action.id);
          action.visible = false;
          action.disabled = true;
        }
      });
    }
  }, []);

  if (error) {
    return (
      <div className="report-designer-container">
        <div className="custom-toolbar">
          <button className="back-button" onClick={handleBack}>
            ← Back
          </button>
          <h2 className="toolbar-title">{reportUrl}</h2>
        </div>
        <div className="error-container">
          <div className="error-content">
            <h3>Report Designer Error</h3>
            <p>{error}</p>
            <p>Please check the console for more details.</p>
            <button 
              onClick={() => { setError(null); setIsReady(false); }}
              className="retry-button"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="report-designer-container">
        <div className="custom-toolbar">
          <button className="back-button" onClick={handleBack}>
            ← Back
          </button>
          <h2 className="toolbar-title">Loading...</h2>
        </div>
        <div className="loading-container">
          <div>Loading Report Designer...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="report-designer-container">
      {/* Custom Toolbar with Back and Save buttons */}
      <div className="custom-toolbar">
        <button className="back-button" onClick={handleBack}>
          ← Back
        </button>
        <h2 className="toolbar-title">
          {reportUrl}
          {isPredefined && <span className="predefined-badge">Template</span>}
        </h2>
        <button className="save-button" onClick={handleSaveClick}>
          Save
        </button>
      </div>

      {/* DevExpress Report Designer */}
      <div className="designer-wrapper">
        <DxReportDesigner
          reportUrl={reportUrl}
          height={designerHeight}
          developmentMode={true}
        >
          <RequestOptions
            host={hostUrl}
            getLocalizationAction={getLocalizationAction}
            getDesignerModelAction={getDesignerModelAction}
          />
          <Callbacks
            BeforeRender={onBeforeRender}
            Init={onInit}
            CustomizeLocalization={onCustomizeLocalization}
            CustomizeMenuActions={onCustomizeMenuActions}
            ComponentDidMount={onComponentDidMount}
            OnServerError={onServerError}
          />
        </DxReportDesigner>
      </div>

      {/* Save Modal */}
      <SaveModal
        isOpen={showSaveModal}
        isPredefined={isPredefined}
        currentReportName={reportUrl}
        onSave={handleSave}
        onCancel={() => setShowSaveModal(false)}
        isSaving={isSaving}
      />
    </div>
  );
};

export default ReportDesigner;
