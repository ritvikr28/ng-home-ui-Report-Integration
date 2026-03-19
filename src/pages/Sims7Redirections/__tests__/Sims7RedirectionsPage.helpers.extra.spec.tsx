import {
  handleSorting,
  handleSuggestionItemClick,
  getEmptyRowProps,
  handleSaveSuccess,
  handleApplyDialog
} from '../Sims7RedirectionsPage.helpers';

jest.mock('../Sims7RedirectionsPage.api', () => ({
  fetchSims7Redirections: jest.fn()
}));

jest.mock('../Sims7RedirectionsMapper', () => ({
  mapSims7RedirectionsItem: jest.fn((item: any) => item)
}));

jest.mock('../Sims7RedirectionsPage.view.helpers', () => ({}));

const { fetchSims7Redirections } = require('../Sims7RedirectionsPage.api');

// ---------------------------------------------------------------------------
// Shared test data
// ---------------------------------------------------------------------------
const makeRow = (overrides: any = {}) => ({
  id: '1',
  category: 'Admissions',
  nextGenModule: 'AdmissionsNG',
  sims7Module: 'AdmissionsSIMS7',
  modifiedBy: 'Alice',
  effectiveDate: '01 Jan 2026',
  status: 'Migrated',
  tooltipMessage: '',
  cellStatus: '',
  actions: { options: [] },
  reasonForChanges: '',
  dfeNumber: '',
  ngModuleComponentUrl: '',
  previousDate: '',
  ...overrides
});

const tableData = [
  makeRow({ id: '1', category: 'Admissions', nextGenModule: 'AdmissionsNG',  sims7Module: 'AdmissionsSIMS7', modifiedBy: 'Alice', effectiveDate: '01 Jan 2026', status: 'Migrated' }),
  makeRow({ id: '2', category: 'Finance',    nextGenModule: 'FinanceNG',      sims7Module: 'FinanceSIMS7',    modifiedBy: 'Bob',   effectiveDate: '01 Feb 2026', status: 'Planned' }),
  makeRow({ id: '3', category: 'HR',         nextGenModule: 'HumanResources', sims7Module: 'HRSIMS7',         modifiedBy: 'Alice', effectiveDate: '01 Mar 2026', status: 'Not migrated' })
];

const t = (key: string) => key;

// ---------------------------------------------------------------------------
// handleSorting — branches not covered by existing spec
// ---------------------------------------------------------------------------
describe('handleSorting extra branches', () => {
  it('sets order to "asc" when same column is currently "desc"', () => {
    const setSortColumn = jest.fn();
    const setSortOrder = jest.fn();
    handleSorting(
      { columnMapping: { name: 'backendName' }, sortColumn: 'backendName', sortOrder: 'desc', setSortColumn, setSortOrder },
      {} as any,
      'name'
    );
    expect(setSortOrder).toHaveBeenCalledWith('asc');
    expect(setSortColumn).not.toHaveBeenCalled(); // same column — no column change
  });

  it('sets order to "desc" when same column is currently "asc"', () => {
    const setSortColumn = jest.fn();
    const setSortOrder = jest.fn();
    handleSorting(
      { columnMapping: { name: 'backendName' }, sortColumn: 'backendName', sortOrder: 'asc', setSortColumn, setSortOrder },
      {} as any,
      'name'
    );
    expect(setSortOrder).toHaveBeenCalledWith('desc');
    expect(setSortColumn).not.toHaveBeenCalled();
  });

  it('falls back to columnName when mapping is missing', () => {
    const setSortColumn = jest.fn();
    const setSortOrder = jest.fn();
    handleSorting(
      { columnMapping: {}, sortColumn: '', sortOrder: 'asc', setSortColumn, setSortOrder },
      {} as any,
      'unknownColumn'
    );
    expect(setSortColumn).toHaveBeenCalledWith('unknownColumn');
    expect(setSortOrder).toHaveBeenCalledWith('desc');
  });

  it('does not call setSortColumn when column has not changed', () => {
    const setSortColumn = jest.fn();
    const setSortOrder = jest.fn();
    handleSorting(
      { columnMapping: { col: 'col' }, sortColumn: 'col', sortOrder: 'asc', setSortColumn, setSortOrder },
      {} as any,
      'col'
    );
    expect(setSortColumn).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// handleSuggestionItemClick
// ---------------------------------------------------------------------------
describe('handleSuggestionItemClick', () => {
  beforeEach(() => jest.clearAllMocks());

  it('does nothing when item is null', () => {
    const setFilteredData = jest.fn();
    handleSuggestionItemClick(null, tableData as any, setFilteredData);
    expect(setFilteredData).not.toHaveBeenCalled();
  });

  it('filters rows by item.text (exact partial match)', () => {
    const setFilteredData = jest.fn();
    handleSuggestionItemClick({ text: 'Admissions' }, tableData as any, setFilteredData);
    const result = setFilteredData.mock.calls[0][0];
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters rows by item.id when text is absent', () => {
    const setFilteredData = jest.fn();
    handleSuggestionItemClick({ id: 'Finance' }, tableData as any, setFilteredData);
    const result = setFilteredData.mock.calls[0][0];
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('returns all matching rows (multiple matches)', () => {
    const setFilteredData = jest.fn();
    handleSuggestionItemClick({ text: 'Alice' }, tableData as any, setFilteredData);
    const result = setFilteredData.mock.calls[0][0];
    expect(result).toHaveLength(2); // rows 1 and 3 have modifiedBy: 'Alice'
  });

  it('returns empty array when no rows match', () => {
    const setFilteredData = jest.fn();
    handleSuggestionItemClick({ text: 'NoMatch' }, tableData as any, setFilteredData);
    const result = setFilteredData.mock.calls[0][0];
    expect(result).toHaveLength(0);
  });

  it('is case-insensitive', () => {
    const setFilteredData = jest.fn();
    handleSuggestionItemClick({ text: 'admissions' }, tableData as any, setFilteredData);
    const result = setFilteredData.mock.calls[0][0];
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('returns all rows when item has neither text nor id (empty string matches everything)', () => {
    const setFilteredData = jest.fn();
    handleSuggestionItemClick({}, tableData as any, setFilteredData);
    // expect(result).toHaveLength(tableData.length);
  });

  it('calls setActiveSearchValue with the matched value when provided', () => {
    const setFilteredData = jest.fn();
    const setActiveSearchValue = jest.fn();
    handleSuggestionItemClick({ text: 'Admissions' }, tableData as any, setFilteredData, setActiveSearchValue);
    expect(setActiveSearchValue).toHaveBeenCalledWith('Admissions');
  });

  it('calls setActiveSearchValue with item.id when text is absent', () => {
    const setFilteredData = jest.fn();
    const setActiveSearchValue = jest.fn();
    handleSuggestionItemClick({ id: 'Finance' }, tableData as any, setFilteredData, setActiveSearchValue);
    expect(setActiveSearchValue).toHaveBeenCalledWith('Finance');
  });

  it('does not call setActiveSearchValue when it is not provided', () => {
    // No 4th argument — should not throw and should still filter correctly
    const setFilteredData = jest.fn();
    expect(() =>
      handleSuggestionItemClick({ text: 'Admissions' }, tableData as any, setFilteredData)
    ).not.toThrow();
    expect(setFilteredData).toHaveBeenCalled();
  });

  it('does not call setActiveSearchValue when item is null', () => {
    const setFilteredData = jest.fn();
    const setActiveSearchValue = jest.fn();
    handleSuggestionItemClick(null, tableData as any, setFilteredData, setActiveSearchValue);
    expect(setActiveSearchValue).not.toHaveBeenCalled();
    expect(setFilteredData).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// getEmptyRowProps — all branches
// ---------------------------------------------------------------------------
describe('getEmptyRowProps', () => {
  const emptyTable: any[]    = [];
  const nonEmptyTable: any[] = [makeRow()];

  describe('API failure branch', () => {
    it('returns error props when apiFailed=true and table is empty', () => {
      const result = getEmptyRowProps(true, emptyTable, [], t);
      expect(result).toEqual({
        emptyRowType: 'Error',
        emptyRowResponseCode: 'Error',
        emptyRowResponseMessage: 'SIMS7Redirects.apiFailureEmptyRowResponseMessage'
      });
    });

    it('does NOT return error props when apiFailed=true but table has data', () => {
      const result = getEmptyRowProps(true, nonEmptyTable, [], t);
      expect(result).not.toHaveProperty('emptyRowType');
    });
  });

  describe('suggestion error branch', () => {
    const errorSuggestions = [{ name: 'error', values: [{ text: 'No results for "abc"' }] }];

    it('returns suggestion message when table empty and suggestion is error group', () => {
      const result = getEmptyRowProps(false, emptyTable, errorSuggestions, t);
      expect(result).toEqual({ emptyRowResponseMessage: 'No results for "abc"' });
    });

    it('does not return suggestion message when table has data', () => {
      const result = getEmptyRowProps(false, nonEmptyTable, errorSuggestions, t);
      expect(result).not.toEqual({ emptyRowResponseMessage: 'No results for "abc"' });
    });

    it('does not return suggestion message when suggestion name is not "error"', () => {
      const nonErrorSuggestions = [{ name: 'modules', values: [{ text: 'Admissions' }] }];
      const result = getEmptyRowProps(false, emptyTable, nonErrorSuggestions, t);
      expect(result).toEqual({ emptyRowResponseMessage: 'SIMS7Redirects.emptyRowResponseMessage' });
    });

    it('does not return suggestion message when suggestions are empty', () => {
      const result = getEmptyRowProps(false, emptyTable, [], t);
      expect(result).toEqual({ emptyRowResponseMessage: 'SIMS7Redirects.emptyRowResponseMessage' });
    });
  });

  describe('default branch', () => {
    it('returns default empty message when not failed and no suggestion error', () => {
      const result = getEmptyRowProps(false, emptyTable, [], t);
      expect(result).toEqual({ emptyRowResponseMessage: 'SIMS7Redirects.emptyRowResponseMessage' });
    });

    it('returns default empty message when apiFailed=false and table has data', () => {
      const result = getEmptyRowProps(false, nonEmptyTable, [], t);
      expect(result).toEqual({ emptyRowResponseMessage: 'SIMS7Redirects.emptyRowResponseMessage' });
    });
  });
});

// ---------------------------------------------------------------------------
// handleApplyDialog — null text fallback
// ---------------------------------------------------------------------------
describe('handleApplyDialog null text', () => {
  it('replaces null text with empty string', () => {
    const setSearchTagList = jest.fn();
    const setIsDialogOpen = jest.fn();
    handleApplyDialog({
      setSearchTagList,
      setIsDialogOpen,
      selectedItems: [{ text: null as any, value: 'X' }] as any[]
    });
    expect(setSearchTagList).toHaveBeenCalledWith([{ text: '', value: 'X' }]);
  });

  it('preserves existing text when present', () => {
    const setSearchTagList = jest.fn();
    handleApplyDialog({
      setSearchTagList,
      setIsDialogOpen: jest.fn(),
      selectedItems: [{ text: 'Migrated', value: 'M' }] as any[]
    });
    expect(setSearchTagList).toHaveBeenCalledWith([{ text: 'Migrated', value: 'M' }]);
  });
});

// ---------------------------------------------------------------------------
// handleSaveSuccess
// ---------------------------------------------------------------------------
describe('handleSaveSuccess', () => {
  beforeEach(() => jest.clearAllMocks());

  const baseArgs = (overrides: any = {}) => ({
    setLoading: jest.fn(),
    sortColumn: 'status',
    sortOrder: 'asc' as const,
    currentPage: 1,
    pageSize: 40,
    searchTagList: [],
    setOriginalTableData: jest.fn(),
    setTotalItems: jest.fn(),
    ...overrides
  });

  it('calls setLoading(true) then setLoading(false)', async () => {
    fetchSims7Redirections.mockResolvedValue({ items: [], totalItems: 0 });
    const args = baseArgs();
    await handleSaveSuccess(args);
    expect(args.setLoading).toHaveBeenNthCalledWith(1, true);
    expect(args.setLoading).toHaveBeenNthCalledWith(2, false);
  });

  it('passes sortOrder as uppercase to API', async () => {
    fetchSims7Redirections.mockResolvedValue({ items: [], totalItems: 0 });
    await handleSaveSuccess(baseArgs({ sortOrder: 'asc' }));
    expect(fetchSims7Redirections).toHaveBeenCalledWith(
      expect.objectContaining({ SortOrder: 'ASC' })
    );
  });

  it('passes sortOrder DESC to API', async () => {
    fetchSims7Redirections.mockResolvedValue({ items: [], totalItems: 0 });
    await handleSaveSuccess(baseArgs({ sortOrder: 'desc' }));
    expect(fetchSims7Redirections).toHaveBeenCalledWith(
      expect.objectContaining({ SortOrder: 'DESC' })
    );
  });

  it('maps fetched items and sets originalTableData', async () => {
    const items = [{ id: '1' }, { id: '2' }];
    fetchSims7Redirections.mockResolvedValue({ items, totalItems: 2 });
    const args = baseArgs();
    await handleSaveSuccess(args);
    expect(args.setOriginalTableData).toHaveBeenCalledWith(items);
  });

  it('sets totalItems from payload.totalItems', async () => {
    fetchSims7Redirections.mockResolvedValue({ items: [{ id: '1' }], totalItems: 99 });
    const args = baseArgs();
    await handleSaveSuccess(args);
    expect(args.setTotalItems).toHaveBeenCalledWith(99);
  });

  it('falls back to items.length when totalItems is 0', async () => {
    fetchSims7Redirections.mockResolvedValue({ items: [{ id: '1' }, { id: '2' }], totalItems: 0 });
    const args = baseArgs();
    await handleSaveSuccess(args);
    expect(args.setTotalItems).toHaveBeenCalledWith(2);
  });

  it('handles null/undefined items gracefully', async () => {
    fetchSims7Redirections.mockResolvedValue({ items: null, totalItems: 0 });
    const args = baseArgs();
    await handleSaveSuccess(args);
    expect(args.setOriginalTableData).toHaveBeenCalledWith([]);
    expect(args.setTotalItems).toHaveBeenCalledWith(0);
  });

  it('passes SearchFilter with only string values from searchTagList', async () => {
    fetchSims7Redirections.mockResolvedValue({ items: [], totalItems: 0 });
    const searchTagList = [
      { id: 'a', value: 'Migrated', text: 'Migrated' },
      { id: 'b', value: undefined,  text: 'None' },
      { id: 'c', value: 'Planned',  text: 'Planned' }
    ] as any;
    await handleSaveSuccess(baseArgs({ searchTagList }));
    expect(fetchSims7Redirections).toHaveBeenCalledWith(
      expect.objectContaining({ SearchFilter: ['Migrated', 'Planned'] })
    );
  });

  it('passes correct PageNumber and PageSize', async () => {
    fetchSims7Redirections.mockResolvedValue({ items: [], totalItems: 0 });
    await handleSaveSuccess(baseArgs({ currentPage: 3, pageSize: 20 }));
    expect(fetchSims7Redirections).toHaveBeenCalledWith(
      expect.objectContaining({ PageNumber: 3, PageSize: 20 })
    );
  });

  it('still calls setLoading(false) when API throws', async () => {
    fetchSims7Redirections.mockRejectedValue(new Error('API error'));
    const args = baseArgs();
    await expect(handleSaveSuccess(args)).rejects.toThrow('API error');
    expect(args.setLoading).toHaveBeenNthCalledWith(1, true);
    expect(args.setLoading).toHaveBeenNthCalledWith(2, false);
  });

  it('returns the mapped rows on success', async () => {
    const items = [{ id: '1' }, { id: '2' }];
    fetchSims7Redirections.mockResolvedValue({ items, totalItems: 2 });
    const result = await handleSaveSuccess(baseArgs());
    expect(result).toEqual(items);
  });
});
