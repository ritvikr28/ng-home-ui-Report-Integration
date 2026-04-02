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
 * Maps each data source name to the DevExpress report parameter that carries the
 * comma-separated list of selected row IDs.
 * e.g. Pupil → PupilIds → "1,3,7" (only those pupil records are rendered)
 */
const DATA_SOURCE_ID_PARAM_MAP: Record<string, string> = {
  Pupil: 'PupilIds',
  Staff: 'StaffIds',
  Assessment: 'AssessmentIds',
};

/**
 * Finds the primary-key field name for a data source.
 * Prefers the first column whose name ends with "Id" / "ID"; falls back to
 * the first column.  Returns undefined if the column list is empty.
 */
const findIdField = (columns: { name: string; type: string }[]): string | undefined =>
  columns.find((c) => /id$/i.test(c.name))?.name ?? columns[0]?.name;

/**
 * State shape for the data-loading / row-selection step
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
 *  2. Load all data rows from every data source
 *  3. Show row-selection screen: tabs per source, search filter, checkable data table
 *  4. On "Render Report", collect selected row IDs per source → store in ref
 *  5. Open DevExpress viewer; CustomizeParameterEditors pre-fills PupilIds/StaffIds/AssessmentIds
 *     so the backend filters data to only the records the user selected
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
  // rowSelection[sourceName][rowIndex] = true (selected) | false (deselected)
  // All rows start as selected (true); user unchecks the ones they don't want.
  const [rowSelection, setRowSelection] = useState<Record<string, Record<number, boolean>>>({});
  // searchQuery[sourceName] = current filter text for that tab
  const [searchQuery, setSearchQuery] = useState<Record<string, string>>({});
  // Holds built ID-parameter strings; written just before showViewer=true so the
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
   * Once initialization is complete, load the schemas and all data rows from every
   * available data source so the user can inspect and choose which records to render.
   */
  useEffect(() => {
    if (!initState.isReady) return;

    let isMounted = true;
    setDataState({ loading: true, loaded: false, sources: [], sourceData: {}, loadError: null });

    const loadData = async () => {
      try {
        const sourcesResponse = await reportingService.getDataSources();
        const sources = sourcesResponse.dataSources;

        // Fetch all data rows for every source in parallel
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

        // Default: all rows selected for every source
        const initRowSel: Record<string, Record<number, boolean>> = {};
        sources.forEach((src) => {
          initRowSel[src.name] = {};
          (sourceData[src.name] || []).forEach((_, idx) => {
            initRowSel[src.name][idx] = true;
          });
        });

        setDataState({ loading: false, loaded: true, sources, sourceData, loadError: null });
        setRowSelection(initRowSel);
        setSearchQuery({});
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

  /**
   * Returns the rows for `sourceName` filtered by the current searchQuery for
   * that source, together with each row's original index (used for checkbox state).
   */
  const getFilteredRows = useCallback(
    (sourceName: string): { row: Record<string, unknown>; originalIdx: number }[] => {
      const rows = dataState.sourceData[sourceName] || [];
      const q = (searchQuery[sourceName] || '').toLowerCase().trim();
      return rows
        .map((row, idx) => ({ row, originalIdx: idx }))
        .filter(({ row }) => {
          if (!q) return true;
          return Object.values(row).some((v) => String(v ?? '').toLowerCase().includes(q));
        });
    },
    [dataState.sourceData, searchQuery]
  );

  /** Toggle a single row checkbox */
  const toggleRow = useCallback((sourceName: string, rowIdx: number, checked: boolean) => {
    setRowSelection((prev) => ({
      ...prev,
      [sourceName]: { ...prev[sourceName], [rowIdx]: checked },
    }));
  }, []);

  /**
   * Select or deselect all currently visible (filtered) rows for a source.
   * When no search filter is active this equals "select/deselect all".
   */
  const setAllVisibleRows = useCallback(
    (sourceName: string, selected: boolean) => {
      const visible = getFilteredRows(sourceName);
      setRowSelection((prev) => {
        const updated = { ...(prev[sourceName] || {}) };
        visible.forEach(({ originalIdx }) => {
          updated[originalIdx] = selected;
        });
        return { ...prev, [sourceName]: updated };
      });
    },
    [getFilteredRows]
  );

  /** True when at least one row is selected across all sources */
  const hasAnyRowSelected = Object.values(rowSelection).some((sel) =>
    Object.values(sel).some(Boolean)
  );

  /**
   * Build DevExpress ID-parameter strings from the current row selection,
   * store them in the ref so CustomizeParameterEditors can read them, then
   * open the viewer.
   *
   * For each source, finds the primary-key field (first column whose name ends in
   * "Id" / "ID") and emits a comma-separated list of those values for every
   * selected row.  If ALL rows in a source are selected we skip emitting the
   * parameter entirely so the backend returns the full unfiltered dataset.
   */
  const handleRenderReport = useCallback(() => {
    const params: Record<string, string> = {};
    dataState.sources.forEach((src) => {
      const paramName = DATA_SOURCE_ID_PARAM_MAP[src.name];
      if (!paramName) return;
      const rows = dataState.sourceData[src.name] || [];
      const sel = rowSelection[src.name] || {};

      const selectedRows = rows.filter((_, idx) => sel[idx] === true);

      // Only add the parameter when the user has deselected at least one row;
      // if everything is selected there is no need to filter
      if (selectedRows.length > 0 && selectedRows.length < rows.length) {
        const idField = findIdField(src.columns);
        if (!idField) return; // No usable key field — skip this source
        const ids = selectedRows
          .map((row) => String(row[idField] ?? ''))
          .filter((id) => id !== ''); // Exclude rows where the ID resolved to empty
        if (ids.length > 0) {
          params[paramName] = ids.join(',');
        }
      }
    });
    selectedParamsRef.current = params;
    console.log('[ReportPreview] Rendering with row-filter parameters:', params);
    setShowViewer(true);
  }, [rowSelection, dataState]);

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
   * pre-fill each parameter with the row-ID strings built by handleRenderReport,
   * so the backend filters data to only the records the user selected.
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
  const allRows = dataState.sourceData[activeTab] || [];
  const filteredRows = getFilteredRows(activeTab);
  const activeSel = rowSelection[activeTab] || {};

  // Counts for the active tab
  const totalSelected = allRows.filter((_, idx) => activeSel[idx] === true).length;
  const allVisibleSelected = filteredRows.length > 0 && filteredRows.every(({ originalIdx }) => activeSel[originalIdx] === true);
  const noneVisibleSelected = filteredRows.every(({ originalIdx }) => !activeSel[originalIdx]);

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

        {/* Source tabs */}
        <div className="source-tabs-bar">
          {dataState.sources.map((src) => {
            const total = (dataState.sourceData[src.name] || []).length;
            const sel = rowSelection[src.name] || {};
            const selCount = Object.values(sel).filter(Boolean).length;
            return (
              <button
                key={src.name}
                className={`source-tab${activeTab === src.name ? ' active' : ''}`}
                onClick={() => setActiveTab(src.name)}
              >
                <span className="tab-name">{src.name}</span>
                <span className="tab-badge">{selCount}/{total}</span>
              </button>
            );
          })}
        </div>

        {/* Table area */}
        <div className="row-selection-area">
          {/* Controls bar */}
          <div className="row-controls-bar">
            {/* Search */}
            <input
              className="row-search-input"
              type="text"
              placeholder={`Search ${activeTab || 'records'}…`}
              value={searchQuery[activeTab] || ''}
              onChange={(e) =>
                setSearchQuery((prev) => ({ ...prev, [activeTab]: e.target.value }))
              }
            />

            {/* Selection actions */}
            <div className="row-selection-actions">
              <span className="selection-count">
                {totalSelected} of {allRows.length} selected
              </span>
              <button
                className="link-btn"
                disabled={allVisibleSelected}
                onClick={() => setAllVisibleRows(activeTab, true)}
              >
                {searchQuery[activeTab] ? 'Select visible' : 'Select all'}
              </button>
              <span className="separator">·</span>
              <button
                className="link-btn"
                disabled={noneVisibleSelected}
                onClick={() => setAllVisibleRows(activeTab, false)}
              >
                {searchQuery[activeTab] ? 'Deselect visible' : 'Deselect all'}
              </button>
              {filteredRows.length !== allRows.length && (
                <>
                  <span className="separator">·</span>
                  <span className="filter-count">{filteredRows.length} visible</span>
                </>
              )}
            </div>
          </div>

          {/* Data table */}
          {filteredRows.length === 0 ? (
            <div className="no-data-message">
              {allRows.length === 0
                ? dataState.loadError
                  ? 'Data could not be loaded.'
                  : 'No records found for this data source.'
                : 'No records match your search.'}
            </div>
          ) : (
            <div className="data-table-scroll">
              <table className="data-preview-table">
                <thead>
                  <tr>
                    <th className="checkbox-col">
                      <input
                        type="checkbox"
                        title="Toggle visible rows"
                        checked={allVisibleSelected}
                        onChange={(e) => setAllVisibleRows(activeTab, e.target.checked)}
                      />
                    </th>
                    {(activeSource?.columns || []).map((col) => (
                      <th key={col.name}>{col.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map(({ row, originalIdx }) => {
                    const isChecked = activeSel[originalIdx] === true;
                    // Use the shared helper for a stable, consistent React key
                    const idField = findIdField(activeSource?.columns || []);
                    const rowKey = idField ? String(row[idField] ?? originalIdx) : String(originalIdx);
                    return (
                      <tr
                        key={rowKey}
                        className={isChecked ? 'row-selected' : ''}
                        onClick={() => toggleRow(activeTab, originalIdx, !isChecked)}
                      >
                        <td className="checkbox-col" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => toggleRow(activeTab, originalIdx, e.target.checked)}
                          />
                        </td>
                        {(activeSource?.columns || []).map((col) => (
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

        {/* Sticky render footer */}
        <div className="render-footer">
          <span className="render-footer-summary">
            {Object.entries(rowSelection)
              .map(([src, sel]) => {
                const total = (dataState.sourceData[src] || []).length;
                const count = Object.values(sel).filter(Boolean).length;
                return `${src}: ${count}/${total}`;
              })
              .join('  ·  ')}
          </span>
          <button
            className="render-button"
            disabled={!hasAnyRowSelected}
            onClick={handleRenderReport}
          >
            Render Report →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
