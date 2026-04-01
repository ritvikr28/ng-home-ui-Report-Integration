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
  const [error, setError] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Reference to the designer instance for accessing report data
  const designerRef = useRef<any>(null);
  
  // State to track if designer is fully initialized
  const [designerInitialized, setDesignerInitialized] = useState(false);
  
  // Parse query parameters for report configuration
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  
  // Extract reportUrl from query params with robust fallback handling
  // Note: queryParams.get() returns null if key doesn't exist, or empty string if value is empty
  const rawReportUrl = queryParams.get('reportUrl');
  const reportUrl: string = rawReportUrl && rawReportUrl.trim() !== '' 
    ? rawReportUrl 
    : 'TestReport';
  
  // Track if we have a valid reportUrl (not the default fallback)
  const hasValidReportUrl = rawReportUrl !== null && rawReportUrl.trim() !== '';
  
  // Get report metadata from location state (passed from ReportSelection screen)
  const isPredefined: boolean = location.state?.isPredefined ?? false;
  
  // Debug log on mount
  console.log('[ReportDesigner] Component render:', {
    timestamp: new Date().toISOString(),
    locationSearch: location.search,
    rawReportUrl,
    reportUrl,
    hasValidReportUrl,
    isPredefined,
    locationState: location.state,
    windowConfigAvailable: !!(window as any).REPORTING_API_URL,
    windowConfig: (window as any).REPORTING_API_URL
  });
  
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
  
  // DevExpress endpoint paths
  const getDesignerModelAction = '/DXXRD/GetDesignerModel';
  const getLocalizationAction = '/DXXRD/GetLocalization';

  /**
   * Calculate designer height to fit the viewport minus navigation and custom toolbar
   */
  const designerHeight = `calc(100vh - ${NAVBAR_HEIGHT + CUSTOM_TOOLBAR_HEIGHT}px)`;

  /**
   * Helper function to get the host URL from window directly
   * IMPORTANT: Must read from window directly every time, not from envConfig
   * because config.js loads with defer attribute and envConfig captures values
   * at module import time (before config.js has executed)
   */
  const getHostUrl = (): string => {
    // Read directly from window - config.js sets these variables
    const rawUrl = (window as any).REPORTING_API_URL || (window as any).REACT_API_URL || '';
    
    // Remove trailing slash for consistency
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
    const maxPolls = 50; // Max 5 seconds (50 * 100ms)
    let isMounted = true;
    
    const initializeDesigner = (url: string) => {
      if (!isMounted) return;
      
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
          hostUrl: url,
          reportUrl,
          isPredefined,
          hasToken: !!token
        });
        
        // Set all state atomically in a single update
        setInitState({
          hostUrl: url,
          isReady: true,
          authConfigured: true
        });
        
        console.log('[ReportDesigner] Initialization complete, isReady = true');
      } catch (err) {
        console.error('[ReportDesigner] Initialization error:', err);
        if (isMounted) {
          setError(`Initialization failed: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    };
    
    const checkConfig = () => {
      const url = getHostUrl();
      if (url) {
        console.log('[ReportDesigner] Host URL resolved:', url);
        if (pollInterval) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
        // Initialize designer with the resolved URL
        initializeDesigner(url);
      } else if (pollCount >= maxPolls) {
        console.error('[ReportDesigner] Config not available after timeout');
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
      console.log('[ReportDesigner] Config available immediately:', immediateUrl);
      initializeDesigner(immediateUrl);
    } else {
      // If not available, start polling
      console.log('[ReportDesigner] Config not yet available, starting polling...');
      pollInterval = setInterval(checkConfig, 100);
    }
    
    return () => {
      isMounted = false;
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [reportUrl, isPredefined]); // Re-run when report changes

  /**
   * Reset designer state when reportUrl changes
   * This ensures fresh initialization for each report
   */
  useEffect(() => {
    console.log('[ReportDesigner] Report URL changed, resetting designer state:', reportUrl);
    setDesignerInitialized(false);
    designerRef.current = null;
  }, [reportUrl]);

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
   * 
   * DevExpress API structure:
   * - sender (JSReportDesigner) has SaveReport() method
   * - sender.GetDesignerModel() returns the model with reportUrl, model, surface, etc.
   * - To save: update model.reportUrl (knockout observable), then call sender.SaveReport()
   */
  const handleSave = useCallback(async (saveAs: boolean, newName?: string) => {
    try {
      setIsSaving(true);
      
      console.log('[ReportDesigner] Saving report:', {
        reportUrl,
        saveAs,
        newName,
        designerInitialized
      });

      // Get the DevExpress designer instance from ref
      const refValue = designerRef.current;
      
      console.log('[ReportDesigner] Designer ref:', refValue ? 'exists' : 'null');
      console.log('[ReportDesigner] Designer initialized state:', designerInitialized);
      
      if (!refValue || !designerInitialized) {
        setIsSaving(false);
        setError('Designer not initialized. Please wait for the designer to fully load and try again.');
        return;
      }

      // The callback wrapper stores {sender, args, component} - we need the sender (JSReportDesigner)
      const sender = refValue.sender || refValue;
      
      console.log('[ReportDesigner] Sender type:', typeof sender);
      console.log('[ReportDesigner] Sender keys:', sender ? Object.keys(sender).slice(0, 30) : 'null');
      console.log('[ReportDesigner] sender.SaveReport:', typeof sender.SaveReport);
      console.log('[ReportDesigner] sender.SaveNewReport:', typeof sender.SaveNewReport);
      console.log('[ReportDesigner] sender.GetDesignerModel:', typeof sender.GetDesignerModel);

      // Method 1: DevExpress JSReportDesigner API - the correct way
      // For SaveAs: use SaveNewReport(url) to save with a different URL
      // For Save: use SaveReport() to save with the original URL
      if (saveAs && newName) {
        // SaveAs - need to use SaveNewReport(newName) to save under a different URL
        if (typeof sender.SaveNewReport === 'function') {
          console.log('[ReportDesigner] SaveAs mode - using SaveNewReport with new name:', newName);
          await sender.SaveNewReport(newName);
          console.log('[ReportDesigner] SaveNewReport completed successfully');
        } else {
          console.error('[ReportDesigner] SaveNewReport method not found on sender');
          console.error('[ReportDesigner] Available methods:', Object.keys(sender).filter(k => typeof sender[k] === 'function').slice(0, 30));
          throw new Error('SaveNewReport method not found. SaveAs functionality requires DevExpress JSReportDesigner.SaveNewReport() method.');
        }
      } else if (typeof sender.SaveReport === 'function') {
        // Regular Save - use SaveReport() to save with original URL
        console.log('[ReportDesigner] Save mode - using SaveReport()');
        await sender.SaveReport();
        console.log('[ReportDesigner] SaveReport completed successfully');
      } else {
        console.error('[ReportDesigner] Neither SaveReport nor SaveNewReport found on sender');
        console.error('[ReportDesigner] Available methods:', Object.keys(sender).filter(k => typeof sender[k] === 'function').slice(0, 30));
        throw new Error('SaveReport method not found on designer instance.');
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
  }, [reportUrl, history, designerInitialized]);

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
   * In DevExpress, the sender is a ReportDesignerInitializeArgs containing the model
   */
  const onInit = useCallback((sender: any) => {
    console.log('[ReportDesigner] Init callback triggered - Designer model is ready');
    console.log('[ReportDesigner] sender type:', typeof sender);
    console.log('[ReportDesigner] sender keys:', sender ? Object.keys(sender) : 'null');
    
    // The sender contains the designer model with GetCurrentReport, SaveReport, etc.
    // Store the sender which should contain the model
    designerRef.current = sender;
    setDesignerInitialized(true);
    
    // Log available methods for debugging
    if (sender) {
      console.log('[ReportDesigner] sender.model:', sender.model);
      console.log('[ReportDesigner] sender.reportDesigner:', sender.reportDesigner);
      console.log('[ReportDesigner] sender.GetCurrentReport:', typeof sender.GetCurrentReport);
      console.log('[ReportDesigner] sender.GetDesignerModel:', typeof sender.GetDesignerModel);
      
      // Try to get the actual designer model
      if (sender.GetDesignerModel && typeof sender.GetDesignerModel === 'function') {
        const designerModel = sender.GetDesignerModel();
        console.log('[ReportDesigner] designerModel from GetDesignerModel():', designerModel);
        designerRef.current = designerModel || sender;
      }
    }
  }, []);

  /**
   * CustomizeLocalization callback - can be used to override localization strings.
   */
  const onCustomizeLocalization = useCallback(() => {
    console.log('[ReportDesigner] CustomizeLocalization callback triggered');
  }, []);

  /**
   * ComponentDidMount callback - fires when the designer component is fully mounted
   * Store the full sender object which contains the designer instance
   */
  const onComponentDidMount = useCallback((sender: any) => {
    console.log('[ReportDesigner] ComponentDidMount - Designer loaded successfully');
    console.log('[ReportDesigner] ComponentDidMount sender type:', typeof sender);
    console.log('[ReportDesigner] ComponentDidMount sender keys:', sender ? Object.keys(sender) : 'null');
    
    // Store the sender - it may contain the report designer
    if (sender) {
      // Only update if we don't already have a valid reference
      if (!designerRef.current) {
        designerRef.current = sender;
        setDesignerInitialized(true);
      }
      
      // Log the structure to understand what methods are available
      console.log('[ReportDesigner] ComponentDidMount sender.GetCurrentReport:', typeof sender.GetCurrentReport);
      console.log('[ReportDesigner] ComponentDidMount sender.SaveReport:', typeof sender.SaveReport);
      console.log('[ReportDesigner] ComponentDidMount sender.SaveNewReport:', typeof sender.SaveNewReport);
      console.log('[ReportDesigner] ComponentDidMount sender.model:', sender.model);
      console.log('[ReportDesigner] ComponentDidMount sender.commands:', sender.commands);
      console.log('[ReportDesigner] ComponentDidMount sender.designer:', sender.designer);
      
      // Check if there's a designer property with commands
      if (sender.designer && sender.designer.commands) {
        console.log('[ReportDesigner] Found sender.designer.commands:', Object.keys(sender.designer.commands));
        designerRef.current = sender;
      }
    }
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
   * Also stores reference to designer for save functionality
   */
  const onCustomizeMenuActions = useCallback((sender: any, args: any) => {
    console.log('[ReportDesigner] CustomizeMenuActions callback triggered');
    console.log('[ReportDesigner] CustomizeMenuActions sender type:', typeof sender);
    console.log('[ReportDesigner] CustomizeMenuActions sender keys:', sender ? Object.keys(sender).slice(0, 30) : 'null');
    console.log('[ReportDesigner] CustomizeMenuActions sender.SaveReport:', typeof sender?.SaveReport);
    console.log('[ReportDesigner] CustomizeMenuActions sender.SaveNewReport:', typeof sender?.SaveNewReport);
    console.log('[ReportDesigner] CustomizeMenuActions sender.GetDesignerModel:', typeof sender?.GetDesignerModel);
    console.log('[ReportDesigner] CustomizeMenuActions args keys:', args ? Object.keys(args).slice(0, 20) : 'null');
    
    // Store the sender (JSReportDesigner) as it contains SaveReport() and SaveNewReport() methods
    if (sender) {
      // Check if this sender has the SaveReport/SaveNewReport methods we need for custom save
      if (typeof sender.SaveReport === 'function' || typeof sender.SaveNewReport === 'function') {
        console.log('[ReportDesigner] Storing sender with SaveReport/SaveNewReport methods');
        designerRef.current = sender;
        setDesignerInitialized(true);
      } else if (typeof sender.GetDesignerModel === 'function') {
        console.log('[ReportDesigner] Storing sender with GetDesignerModel (fallback)');
        designerRef.current = sender;
        setDesignerInitialized(true);
        
        // Log the designer model structure for debugging
        try {
          const model = sender.GetDesignerModel();
          console.log('[ReportDesigner] GetDesignerModel() result keys:', model ? Object.keys(model).slice(0, 30) : 'null');
        } catch (e) {
          console.log('[ReportDesigner] Error calling GetDesignerModel():', e);
        }
      } else if (!designerRef.current) {
        // Last resort fallback: store the sender anyway
        console.log('[ReportDesigner] Storing sender (last resort fallback)');
        console.log('[ReportDesigner] sender methods:', Object.keys(sender).filter(k => typeof sender[k] === 'function').slice(0, 30));
        designerRef.current = sender;
        setDesignerInitialized(true);
      }
    }
    
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
              onClick={() => { 
                setError(null); 
                setInitState({ hostUrl: '', isReady: false, authConfigured: false }); 
              }}
              className="retry-button"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Don't render the designer until we have both config AND a valid reportUrl
  // This prevents the GetDesignerModel API from being called with null/empty reportUrl
  if (!initState.isReady || !hasValidReportUrl) {
    return (
      <div className="report-designer-container">
        <div className="custom-toolbar">
          <button className="back-button" onClick={handleBack}>
            ← Back
          </button>
          <h2 className="toolbar-title">Loading...</h2>
        </div>
        <div className="loading-container">
          <div>
            {!initState.hostUrl 
              ? 'Initializing configuration...' 
              : !hasValidReportUrl 
                ? 'Waiting for report URL...'
                : 'Loading Report Designer...'}
          </div>
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
          key={`${initState.hostUrl}-${reportUrl}`}  // Force remount when reportUrl or hostUrl changes
          reportUrl={reportUrl}
          height={designerHeight}
          developmentMode={true}
        >
          <RequestOptions
            host={initState.hostUrl}
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
