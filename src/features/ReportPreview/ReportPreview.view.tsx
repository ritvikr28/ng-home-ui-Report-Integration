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
import { reportingService } from '../../shared/services/reportingService';
import type { DataSourceSchema } from '../../shared/services/reportingService';
import './ReportPreview.scss';

// Make knockout available globally for DevExpress
(window as any).ko = ko;

// Height constants
const NAVBAR_HEIGHT = 56;
const TOOLBAR_HEIGHT = 60;

/**
 * Maps each data source name to the corresponding DevExpress report parameter.
 * These parameters are declared in TestReport.cs and control which columns are
 * fetched by the {?PupilColumns}/{?StaffColumns}/{?AssessmentColumns} URI placeholders
 * in api-connections.json.
 */
const DATA_SOURCE_PARAM_MAP: Record<string, string> = {
  Pupil: 'PupilColumns',
  Staff: 'StaffColumns',
  Assessment: 'AssessmentColumns',
};

/**
 * State shape for the data-loading / data-selection step
 */
interface DataState {
  loading: boolean;
  loaded: boolean;
  sources: DataSourceSchema[];
  sourceData: Record<string, Record<string, unknown>[]>;
  loadError: string | null;
}

/**
 * ReportPreview Screen (Screen 3)
 *
 * Workflow:
 *  1. Poll for config → configure auth → isReady = true
 *  2. Load schemas + actual data rows from every data source
 *  3. Show data-selection screen: tabs per source, column checkboxes, data preview table
 *  4. On "Render Report", build column-parameter strings, store in ref
 *  5. Open DevExpress viewer; CustomizeParameterEditors pre-fills the parameters
 *     so the backend fetches only the selected columns when rendering
 */
const ReportPreview: React.FC = () => {
  const location = useLocation<ReportState>();
  const history = useHistory();
  const [showViewer, setShowViewer] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Combined state for initialization - tracks both config availability and auth setup
  // Using a single state object prevents race conditions between separate state updates
  const [initState, setInitState] = useState<{
    hostUrl: string;
    isReady: boolean;
    authConfigured: boolean;
  }>({
    hostUrl: '',
    isReady: false,
    authConfigured: false,
  });

  // Data-selection step state
  const [dataState, setDataState] = useState<DataState>({
    loading: false,
    loaded: false,
    sources: [],
    sourceData: {},
    loadError: null,
  });
  const [activeTab, setActiveTab] = useState<string>('');
  // columnSelection[sourceName][columnName] = true/false
  const [columnSelection, setColumnSelection] = useState<Record<string, Record<string, boolean>>>({});
  // Holds built parameter strings; written just before showViewer=true so the
  // CustomizeParameterEditors callback can read them without stale closure issues
  const selectedParamsRef = useRef<Record<string, string>>({});

  // Get report info from location state or query params
  const queryParams = new URLSearchParams(location.search);
  const reportName = location.state?.reportName || queryParams.get('reportUrl') || 'TestReport';

  // DevExpress endpoint paths
  const getViewerModelAction = '/DXXRDV/GetViewerModel';
  const getLocalizationAction = '/DXXRDV/GetLocalization';

  /**
   * Calculate viewer height
   */
  const viewerHeight = `calc(100vh - ${NAVBAR_HEIGHT + TOOLBAR_HEIGHT}px)`;

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
            'Content-Type': 'application/json',
          },
        };

        console.log('[ReportPreview] Initialized with config:', {
          hostUrl: url,
          reportName,
          hasToken: !!token,
        });

        // Set all state atomically in a single update
        setInitState({
          hostUrl: url,
          isReady: true,
          authConfigured: true,
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
   * Once initialization is complete, load the schemas and actual data rows from
   * every available data source so the user can inspect and select columns.
   */
  useEffect(() => {
    if (!initState.isReady) return;

    let isMounted = true;
    setDataState({ loading: true, loaded: false, sources: [], sourceData: {}, loadError: null });

    const loadData = async () => {
      try {
        const sourcesResponse = await reportingService.getDataSources();
        const sources = sourcesResponse.dataSources;

        // Fetch actual data rows for every source in parallel
        const sourceData: Record<string, Record<string, unknown>[]> = {};
        await Promise.all(
          sources.map(async (src) => {
            try {
              const rows = await reportingService.getData(src.name);
              sourceData[src.name] = rows as Record<string, unknown>[];
            } catch {
              sourceData[src.name] = [];
            }
          })
        );

        if (!isMounted) return;

        // Default: all columns selected for every source
        const initSelection: Record<string, Record<string, boolean>> = {};
        sources.forEach((src) => {
          initSelection[src.name] = {};
          src.columns.forEach((col) => {
            initSelection[src.name][col.name] = true;
          });
        });

        setDataState({ loading: false, loaded: true, sources, sourceData, loadError: null });
        setColumnSelection(initSelection);
        if (sources.length > 0) setActiveTab(sources[0].name);
      } catch (err) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : String(err);
        console.error('[ReportPreview] Failed to load data sources:', msg);
        setDataState((prev) => ({ ...prev, loading: false, loaded: false, loadError: msg }));
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [initState.isReady]);

  /** Toggle a single column checkbox */
  const toggleColumn = useCallback((sourceName: string, columnName: string, checked: boolean) => {
    setColumnSelection((prev) => ({
      ...prev,
      [sourceName]: { ...prev[sourceName], [columnName]: checked },
    }));
  }, []);

  /** Select / deselect all columns for a source */
  const setAllColumns = useCallback((sourceName: string, selected: boolean) => {
    setColumnSelection((prev) => {
      const updated: Record<string, boolean> = {};
      Object.keys(prev[sourceName] || {}).forEach((col) => {
        updated[col] = selected;
      });
      return { ...prev, [sourceName]: updated };
    });
  }, []);

  /** True when at least one column is selected across all sources */
  const hasAnyColumnSelected = Object.values(columnSelection).some((cols) =>
    Object.values(cols).some(Boolean)
  );

  /**
   * Build DevExpress parameter strings from the current column selection,
   * store them in the ref so CustomizeParameterEditors can read them, then
   * open the viewer.
   */
  const handleRenderReport = useCallback(() => {
    const params: Record<string, string> = {};
    Object.entries(columnSelection).forEach(([sourceName, cols]) => {
      const paramName = DATA_SOURCE_PARAM_MAP[sourceName];
      if (!paramName) return;
      const selected = Object.entries(cols)
        .filter(([, isSelected]) => isSelected)
        .map(([colName]) => colName);
      if (selected.length > 0) {
        params[paramName] = selected.join(',');
      }
    });
    selectedParamsRef.current = params;
    console.log('[ReportPreview] Rendering with parameters:', params);
    setShowViewer(true);
  }, [columnSelection]);

  /**
   * Handle back button - return to report selection
   */
  const handleBack = useCallback(() => {
    history.push('/reports');
  }, [history]);

  /**
   * BeforeRender callback for the viewer
   */
  const onBeforeRender = useCallback(() => {
    console.log('[ReportPreview] BeforeRender callback triggered');
    const token = authService.getAuthTokens();
    fetchSetup.fetchSettings = {
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
      },
    };
  }, []);

  /**
   * CustomizeParameterEditors — DevExpress internal callback.
   * Fires when the viewer builds its parameter editor panel. We use it to
   * pre-fill each parameter value with the column selections made by the user
   * on the data-selection screen, so the backend receives the correct column
   * list when it fetches data for the report.
   */
  const onCustomizeParameterEditors = useCallback((_sender: any, args: any) => {
    const params = selectedParamsRef.current;
    if (!args?.ParameterEditors) return;
    args.ParameterEditors.forEach((editor: any) => {
      const paramName: string = editor?.Parameter?.Name;
      if (paramName && params[paramName] !== undefined) {
        editor.Parameter.Value = params[paramName];
        console.log(`[ReportPreview] Pre-filled parameter "${paramName}" = "${params[paramName]}"`);
      }
    });
  }, []);

  /**
   * OnServerError callback
   */
  const onServerError = useCallback((_sender: any, args: any) => {
    console.error('[ReportPreview] Server Error:', args);
    const errorMessage = args?.errorMessage || args?.message || 'Unknown server error';
    setError(`Preview error: ${errorMessage}`);
  }, []);

  // ── Error state ──────────────────────────────────────────────────────────
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

  // ── Config not yet ready ─────────────────────────────────────────────────
  if (!initState.isReady) {
    return (
      <div className="report-preview-container">
        <div className="report-preview-loading">
          <span className="loading-spinner" />
          Loading configuration…
        </div>
      </div>
    );
  }

  // ── Data still loading ────────────────────────────────────────────────────
  if (dataState.loading) {
    return (
      <div className="report-preview-container">
        <div className="report-preview-toolbar">
          <button className="back-button" onClick={handleBack}>
            ← Back to Reports
          </button>
          <h2 className="toolbar-title">{reportName}</h2>
        </div>
        <div className="report-preview-loading">
          <span className="loading-spinner" />
          Loading data sources…
        </div>
      </div>
    );
  }

  // ── DevExpress viewer ─────────────────────────────────────────────────────
  if (showViewer) {
    return (
      <div className="report-preview-container">
        <div className="report-preview-toolbar">
          <button className="back-button" onClick={handleBack}>
            ← Back to Reports
          </button>
          <h2 className="toolbar-title">{reportName}</h2>
          <button className="back-button" onClick={() => setShowViewer(false)}>
            ← Change Selection
          </button>
        </div>
        <div className="report-viewer-wrapper">
          <DxReportViewer
            key={`${initState.hostUrl}-${reportName}`}
            reportUrl={reportName}
            height={viewerHeight}
          >
            <RequestOptions
              host={initState.hostUrl}
              getLocalizationAction={getLocalizationAction}
              getViewerModelAction={getViewerModelAction}
            />
            <Callbacks
              BeforeRender={onBeforeRender}
              CustomizeParameterEditors={onCustomizeParameterEditors}
              OnServerError={onServerError}
            />
          </DxReportViewer>
        </div>
      </div>
    );
  }

  // ── Data-selection screen ─────────────────────────────────────────────────
  const activeSource = dataState.sources.find((s) => s.name === activeTab);
  const activeRows = dataState.sourceData[activeTab] || [];
  const activeColSel = columnSelection[activeTab] || {};
  const visibleColumns = (activeSource?.columns || []).filter((c) => activeColSel[c.name]);
  const allSelected = (activeSource?.columns || []).every((c) => activeColSel[c.name]);
  const noneSelected = (activeSource?.columns || []).every((c) => !activeColSel[c.name]);

  return (
    <div className="report-preview-container">
      {/* ── Toolbar ── */}
      <div className="report-preview-toolbar">
        <button className="back-button" onClick={handleBack}>
          ← Back to Reports
        </button>
        <h2 className="toolbar-title">{reportName}</h2>
      </div>

      {/* ── Data-selection body ── */}
      <div className="data-selection-body">

        {/* Data-load error (non-fatal — user can still render) */}
        {dataState.loadError && (
          <div className="data-load-warning">
            ⚠️ Could not load data preview: {dataState.loadError}
          </div>
        )}

        <div className="data-selection-content">
          {/* Left panel: column selector */}
          <div className="column-selector-panel">
            <div className="panel-heading">Configure Columns</div>
            <p className="panel-subheading">
              Select the columns to include from each data source. These are passed as
              parameters to the report before rendering.
            </p>

            {/* Source tabs */}
            <div className="source-tabs">
              {dataState.sources.map((src) => {
                const selCount = Object.values(columnSelection[src.name] || {}).filter(Boolean).length;
                const totalCount = src.columns.length;
                return (
                  <button
                    key={src.name}
                    className={`source-tab${activeTab === src.name ? ' active' : ''}`}
                    onClick={() => setActiveTab(src.name)}
                  >
                    <span className="tab-name">{src.name}</span>
                    <span className="tab-badge">{selCount}/{totalCount}</span>
                  </button>
                );
              })}
            </div>

            {/* Column checkboxes for active source */}
            {activeSource && (
              <div className="column-list">
                <div className="column-list-actions">
                  <button
                    className="link-btn"
                    disabled={allSelected}
                    onClick={() => setAllColumns(activeTab, true)}
                  >
                    Select all
                  </button>
                  <span className="separator">·</span>
                  <button
                    className="link-btn"
                    disabled={noneSelected}
                    onClick={() => setAllColumns(activeTab, false)}
                  >
                    Deselect all
                  </button>
                </div>
                {activeSource.columns.map((col) => (
                  <label key={col.name} className="column-item">
                    <input
                      type="checkbox"
                      checked={activeColSel[col.name] ?? true}
                      onChange={(e) => toggleColumn(activeTab, col.name, e.target.checked)}
                    />
                    <span className="col-name">{col.name}</span>
                    <span className="col-type">{col.type}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Render button */}
            <div className="render-action">
              <button
                className="render-button"
                disabled={!hasAnyColumnSelected}
                onClick={handleRenderReport}
              >
                Render Report →
              </button>
              {!hasAnyColumnSelected && (
                <p className="render-hint">Select at least one column to render.</p>
              )}
            </div>
          </div>

          {/* Right panel: data preview table */}
          <div className="data-preview-panel">
            <div className="panel-heading">
              Data Preview
              {activeSource && (
                <span className="row-count-badge">
                  {activeRows.length} record{activeRows.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {activeRows.length === 0 ? (
              <div className="no-data-message">
                {dataState.loadError
                  ? 'Data could not be loaded.'
                  : 'No records found for this data source.'}
              </div>
            ) : (
              <div className="data-table-scroll">
                <table className="data-preview-table">
                  <thead>
                    <tr>
                      {visibleColumns.map((col) => (
                        <th key={col.name}>{col.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeRows.map((row, idx) => {
                      // Use the first "Id"-like field as a stable key if available
                      const idField = Object.keys(row).find((k) => /id$/i.test(k));
                      const rowKey = idField ? String(row[idField]) : String(idx);
                      return (
                        <tr key={rowKey}>
                          {visibleColumns.map((col) => (
                            <td key={col.name}>
                              {row[col.name] !== null && row[col.name] !== undefined
                                ? String(row[col.name])
                                : '—'}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
