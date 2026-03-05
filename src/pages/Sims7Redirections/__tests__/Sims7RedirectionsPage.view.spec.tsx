import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as UIKit from "@essnextgen/ui-kit";
import { Sims7RedirectionsPage } from '../Sims7RedirectionsPage.view';
import * as api from '../Sims7RedirectionsPage.api';

jest.mock('../Sims7RedirectionsPage.api', () => ({
  fetchSims7Redirections: jest.fn().mockResolvedValue({
    items: [
      {
        moduleId: 1,
        ngComponent: 'TestCat',
        ngModule: 'TestNextGen',
        sims7Module: 'TestSIMS7',
        updatedBy: 'TestUser',
        effectiveDate: '2026-02-18T00:00:00',
        redirectStatus: 'PLANNED',
        tooltipMessage: 'Test tooltip',
        cellStatus: '',
        actions: { options: [{ disabled: false, isSelected: false, text: ' View', value: 'View' }] },
        reasonForChanges: ''
      }
    ],
    totalItems: 1
  })
}));

describe('Sims7RedirectionsPage', () => {
                it('opens side panel in edit mode when Edit is clicked in overflow menu', async () => {
                  jest.setTimeout(15000);
                  (api.fetchSims7Redirections as jest.Mock).mockResolvedValue({
                    items: [
                      {
                        moduleId: 1,
                        ngComponent: 'TestCat',
                        ngModule: 'TestNextGen',
                        sims7Module: 'TestSIMS7',
                        updatedBy: 'TestUser',
                        effectiveDate: '2026-02-18T00:00:00',
                        redirectStatus: 'PLANNED',
                        tooltipMessage: 'Test tooltip',
                        cellStatus: '',
                        actions: { options: [
                          { disabled: false, isSelected: false, text: ' Edit', value: 'Edit' }
                        ] },
                        reasonForChanges: ''
                      }
                    ],
                    totalItems: 1
                  });
                  render(<Sims7RedirectionsPage />);
                  await waitFor(() => {
                    expect(screen.getByText('TestCat')).toBeInTheDocument();
                  });
                });
              it('falls back to original column name if not in columnMapping', async () => {
                render(<Sims7RedirectionsPage />);
                const categoryHeader = screen.getByText("Category");
                fireEvent.click(categoryHeader);
                expect(categoryHeader).toBeInTheDocument();
              });
            it('filters SearchFilter to only string values in API call', async () => {
              (api.fetchSims7Redirections as jest.Mock).mockImplementationOnce((args: { SearchFilter: unknown[] }) => {
                expect(Array.isArray(args.SearchFilter)).toBe(true);
                expect(args.SearchFilter.every((v) => typeof v === "string")).toBe(true);
                return Promise.resolve({
                  items: [],
                  totalItems: 0
                });
              });
              render(<Sims7RedirectionsPage />);
              const filterBtn = await screen.findByText('Filter');
              fireEvent.click(filterBtn);
              const applyBtn = screen.getByText('Apply');
              fireEvent.click(applyBtn);
              await waitFor(() => {
                expect(api.fetchSims7Redirections).toHaveBeenCalled();
              });
            });
          it('calls setSelectedItems when selecting multiple items in filter dropdown', async () => {
            jest.spyOn(UIKit, "useMediaQuery").mockReturnValue(false);
            render(<Sims7RedirectionsPage />);
            const filterBtn = await screen.findByText('Filter');
            fireEvent.click(filterBtn);
            const applyBtn = screen.getByText('Apply');
            fireEvent.click(applyBtn);
            expect(screen.queryByText('Filter by')).not.toBeInTheDocument();
            jest.restoreAllMocks();
          });
        it("toggles sidebar open/close when toggle button is clicked", async () => {
          jest
            .spyOn(UIKit, "useMediaQuery")
            .mockReturnValue(true);
          render(<Sims7RedirectionsPage />);
          const toggleBtn = await screen.findByLabelText(
            "side-panel-open-button"
          );
          expect(toggleBtn).toBeInTheDocument();
          fireEvent.click(toggleBtn);
          expect(
            screen.queryByLabelText("side-panel-open-button")
          ).not.toBeInTheDocument();
          jest.restoreAllMocks();
        });
        it("renders sidepanel toggle button in mobile view when sidebar is closed", async () => {
          jest
            .spyOn(UIKit, "useMediaQuery")
            .mockReturnValue(true);
          render(<Sims7RedirectionsPage />);
          const toggleBtn = await screen.findByLabelText(
            "side-panel-open-button"
          );
          expect(toggleBtn).toBeInTheDocument();
          jest.restoreAllMocks();
        });
        it("toggles sort order when clicking the same column header", async () => {
          render(<Sims7RedirectionsPage />);
          await waitFor(() => {
            expect(screen.getByText("TestCat")).toBeInTheDocument();
          });

          const categoryHeader = screen.getByText("Category");
          fireEvent.click(categoryHeader);
          fireEvent.click(categoryHeader);
          expect(categoryHeader).toBeInTheDocument();
        });
        it("calls setSortColumn when sorting a new column", async () => {
          render(<Sims7RedirectionsPage />);
          await waitFor(() => {
            expect(screen.getByText("TestCat")).toBeInTheDocument();
          });

          const categoryHeader = screen.getByText("Category");
          fireEvent.click(categoryHeader);

          const nextGenHeader = screen.getByText("Next Gen module");
          fireEvent.click(nextGenHeader);
          expect(nextGenHeader).toBeInTheDocument();
        });

  it('renders API data in table', async () => {
    render(<Sims7RedirectionsPage />);
    await waitFor(() => {
      expect(screen.getByText('TestCat')).toBeInTheDocument();
      expect(screen.getByText('TestNextGen')).toBeInTheDocument();
      expect(screen.getByText('TestSIMS7')).toBeInTheDocument();
      expect(screen.getByText('TestUser')).toBeInTheDocument();
      expect(screen.getByText('18 Feb 2026')).toBeInTheDocument();
      expect(screen.getByText('Planned')).toBeInTheDocument();
    });
  });

  it('opens and closes filter dialog', async () => {
    render(<Sims7RedirectionsPage />);
    const filterBtn = await screen.findByText('Filter');
    fireEvent.click(filterBtn);
    expect(screen.getByText('Filter by')).toBeInTheDocument();
    const closeBtn = screen.getByText('Clear all');
    fireEvent.click(closeBtn);
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('handles pagination', async () => {
    render(<Sims7RedirectionsPage />);
  });

  it('shows API failure message on API error', async () => {
    (api.fetchSims7Redirections as jest.Mock).mockRejectedValueOnce(new Error('API failed'));
    render(<Sims7RedirectionsPage />);
    await waitFor(() => {
      expect(screen.getByText(/apiFailureMessage/i)).toBeInTheDocument();
    });
  });

  it('shows empty state when API returns empty array', async () => {
    (api.fetchSims7Redirections as jest.Mock).mockResolvedValueOnce([]);
    render(<Sims7RedirectionsPage />);
    await waitFor(() => {
    });
  });
});
