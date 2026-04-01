import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Loader, LoaderType } from '@essnextgen/ui-kit';
import { reportingService, ReportInfo } from '../../shared/services/reportingService';
import './ReportSelection.scss';

/**
 * ReportSelection Screen (Screen 1)
 * 
 * Displays a dropdown of available reports. When user selects a report,
 * navigates to the Report Designer in restricted mode.
 */
const ReportSelection: React.FC = () => {
  const history = useHistory();
  const [reports, setReports] = useState<ReportInfo[]>([]);
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Memoized selected report info to avoid redundant lookups
   */
  const selectedReportInfo = useMemo(() => {
    if (!selectedReport) return null;
    return reports.find(r => r.name === selectedReport) || null;
  }, [selectedReport, reports]);

  /**
   * Fetch available reports on component mount
   */
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await reportingService.getReportsWithMetadata();
        setReports(response.reports);
      } catch (err) {
        console.error('[ReportSelection] Error fetching reports:', err);
        setError('Failed to load reports. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  /**
   * Handle report selection change
   */
  const handleReportChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedReport(event.target.value);
  }, []);

  /**
   * Handle "Open Report" button click - navigate to designer
   */
  const handleOpenReport = useCallback(() => {
    if (!selectedReport || !selectedReportInfo) {
      console.log('[ReportSelection] handleOpenReport called but no report selected');
      return;
    }

    // Log navigation details for debugging
    console.log('[ReportSelection] Navigating to ReportDesigner:', {
      selectedReport,
      isPredefined: selectedReportInfo.isPredefined,
      timestamp: new Date().toISOString(),
      windowConfigAvailable: !!(window as any).REPORTING_API_URL
    });

    // Navigate to the report designer with report info
    history.push({
      pathname: '/reportdesigner',
      search: `?reportUrl=${encodeURIComponent(selectedReport)}`,
      state: {
        reportName: selectedReport,
        isPredefined: selectedReportInfo.isPredefined
      }
    });
  }, [selectedReport, selectedReportInfo, history]);

  /**
   * Retry loading reports
   */
  const handleRetry = useCallback(() => {
    setError(null);
    setIsLoading(true);
    reportingService.getReportsWithMetadata()
      .then(response => {
        setReports(response.reports);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('[ReportSelection] Error fetching reports:', err);
        setError('Failed to load reports. Please try again.');
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="report-selection-container">
        <div className="report-selection-loading">
          <Loader
            className="loader-wrapper"
            loaderText="Loading reports..."
            loaderType={LoaderType.Circular}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-selection-container">
        <div className="report-selection-error">
          <div className="error-icon">⚠️</div>
          <h2>Error Loading Reports</h2>
          <p>{error}</p>
          <button 
            className="retry-button"
            onClick={handleRetry}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-selection-container">
      <div className="report-selection-card">
        <h1 className="report-selection-title">Report Designer</h1>
        <p className="report-selection-description">
          Select a report template to customize in the designer.
        </p>
        
        <div className="report-selection-form">
          <label htmlFor="report-dropdown" className="report-selection-label">
            Select Report:
          </label>
          <select
            id="report-dropdown"
            className="report-selection-dropdown"
            value={selectedReport}
            onChange={handleReportChange}
          >
            <option value="">-- Choose a report --</option>
            {reports.map((report) => (
              <option key={report.name} value={report.name}>
                {report.displayName || report.name}
                {report.isPredefined ? ' (Template)' : ''}
              </option>
            ))}
          </select>

          {selectedReportInfo && (
            <div className="report-info">
              {selectedReportInfo.description && (
                <p className="report-description">
                  {selectedReportInfo.description}
                </p>
              )}
              {selectedReportInfo.isPredefined && (
                <p className="report-predefined-notice">
                  ℹ️ This is a template report. Changes will be saved as a new report.
                </p>
              )}
            </div>
          )}

          <button
            className="open-report-button"
            onClick={handleOpenReport}
            disabled={!selectedReport}
          >
            Open in Designer
          </button>
        </div>

        {reports.length === 0 && (
          <div className="no-reports-message">
            <p>No reports available. Please contact your administrator.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportSelection;
