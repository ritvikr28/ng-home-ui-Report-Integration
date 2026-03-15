import { handleSorting, handleViewClick, handleEditClick, handleOpenDialog, handleCloseDialog, handleClearAll, handleApplyDialog, handlePaginationChange } from './Sims7RedirectionsPage.helpers';

describe('Sims7RedirectionsPage.helpers', () => {
  it('handleSorting toggles sort order and column', () => {
    let sortColumn = 'name';
    let sortOrder: 'asc' | 'desc' = 'asc';
    const columnMapping = { name: 'backendName' };
  const setSortColumn = jest.fn(col => { sortColumn = col; });
  const setSortOrder = jest.fn((order: 'asc' | 'desc') => { sortOrder = order; });
    handleSorting({ columnMapping, sortColumn, sortOrder, setSortColumn, setSortOrder }, {} as any, 'name');
    expect(setSortOrder).toHaveBeenCalledWith('desc');
    expect(setSortColumn).toHaveBeenCalledWith('backendName');
  });

  it('handleViewClick sets row, mode, and opens panel', () => {
    const setSelectedRow = jest.fn();
    const setSidePanelMode = jest.fn();
    const setIsSidePanelOpen = jest.fn();
    const rowData = { id: 1 } as any;
    handleViewClick({ setSelectedRow, setSidePanelMode, setIsSidePanelOpen }, rowData);
    expect(setSelectedRow).toHaveBeenCalledWith(rowData);
    expect(setSidePanelMode).toHaveBeenCalledWith('view');
    expect(setIsSidePanelOpen).toHaveBeenCalledWith(true);
  });

  it('handleEditClick sets row, mode, and opens panel', () => {
    const setSelectedRow = jest.fn();
    const setSidePanelMode = jest.fn();
    const setIsSidePanelOpen = jest.fn();
    const rowData = { id: 2 } as any;
    handleEditClick({ setSelectedRow, setSidePanelMode, setIsSidePanelOpen }, rowData);
    expect(setSelectedRow).toHaveBeenCalledWith(rowData);
    expect(setSidePanelMode).toHaveBeenCalledWith('edit');
    expect(setIsSidePanelOpen).toHaveBeenCalledWith(true);
  });

  it('handleOpenDialog sets items and opens dialog', () => {
    const setSelectedItems = jest.fn();
    const setIsDialogOpen = jest.fn();
    const searchTagList = [{ id: 1 }] as any;
    handleOpenDialog({ setSelectedItems, searchTagList, setIsDialogOpen });
    expect(setSelectedItems).toHaveBeenCalledWith(searchTagList);
    expect(setIsDialogOpen).toHaveBeenCalledWith(true);
  });

  it('handleCloseDialog closes dialog', () => {
    const setIsDialogOpen = jest.fn();
    handleCloseDialog({ setIsDialogOpen });
    expect(setIsDialogOpen).toHaveBeenCalledWith(false);
  });

  it('handleClearAll opens dialog and clears items', () => {
    const setIsDialogOpen = jest.fn();
    const setSelectedItems = jest.fn();
    handleClearAll({ setIsDialogOpen, setSelectedItems });
    expect(setIsDialogOpen).toHaveBeenCalledWith(true);
    expect(setSelectedItems).toHaveBeenCalledWith([]);
  });

  it('handleApplyDialog sets tag list and closes dialog', () => {
    const setSearchTagList = jest.fn();
    const setIsDialogOpen = jest.fn();
    const selectedItems = [{ id: 1, text: 'foo' }, { id: 2 }];
    handleApplyDialog({ setSearchTagList, selectedItems, setIsDialogOpen });
    expect(setSearchTagList).toHaveBeenCalledWith([
      { id: 1, text: 'foo' },
      { id: 2, text: '' }
    ]);
    expect(setIsDialogOpen).toHaveBeenCalledWith(false);
  });

  it('handlePaginationChange sets current page', () => {
    const setCurrentPage = jest.fn();
    handlePaginationChange({ setCurrentPage }, {} as any, 5);
    expect(setCurrentPage).toHaveBeenCalledWith(5);
  });
});
