import { handleOverflowAction, getNextSortOrder } from '../Sims7RedirectionsPage.handlers';
import { Sims7RedirectionsTableRow } from '../Sims7RedirectionsPage.data';

describe('handleOverflowAction', () => {
  const rowData: Sims7RedirectionsTableRow = {
    id: '1',
    category: 'TestCat',
    nextGenModule: 'TestNextGen',
    sims7Module: 'TestSIMS7',
    modifiedBy: 'TestUser',
    effectiveDate: '2026-02-18T00:00:00',
    status: 'PLANNED',
    tooltipMessage: '',
    cellStatus: '',
    actions: { options: [] },
    reasonForChanges: '',
    dfeNumber: '',
    ngModuleComponentUrl: ''
  };

  it('calls handleViewClick when action is "View"', () => {
    const handleViewClick: (row: Sims7RedirectionsTableRow) => void = jest.fn();
    const handleEditClick: (row: Sims7RedirectionsTableRow) => void = jest.fn();
    handleOverflowAction('View', rowData, handleViewClick, handleEditClick);
    expect(handleViewClick).toHaveBeenCalledWith(rowData);
    expect(handleEditClick).not.toHaveBeenCalled();
  });

  it('calls handleEditClick when action is "Edit"', () => {
    const handleViewClick: (row: Sims7RedirectionsTableRow) => void = jest.fn();
    const handleEditClick: (row: Sims7RedirectionsTableRow) => void = jest.fn();
    handleOverflowAction('Edit', rowData, handleViewClick, handleEditClick);
    expect(handleEditClick).toHaveBeenCalledWith(rowData);
    expect(handleViewClick).not.toHaveBeenCalled();
  });

  it('does nothing for other actions', () => {
    const handleViewClick: (row: Sims7RedirectionsTableRow) => void = jest.fn();
    const handleEditClick: (row: Sims7RedirectionsTableRow) => void = jest.fn();
    handleOverflowAction('Other', rowData, handleViewClick, handleEditClick);
    expect(handleViewClick).not.toHaveBeenCalled();
    expect(handleEditClick).not.toHaveBeenCalled();
  });
});

describe('getNextSortOrder', () => {
  it('returns "asc" if currentOrder is "desc"', () => {
    expect(getNextSortOrder('desc')).toBe('asc');
  });

  it('returns "desc" if currentOrder is "asc"', () => {
    expect(getNextSortOrder('asc')).toBe('desc');
  });
});
