import {
  handleSuggestionItemClick,
  getEmptyRowProps,
  handleSaveSuccess
} from '../Sims7RedirectionsPage.helpers';

jest.mock('../Sims7RedirectionsPage.api', () => ({
  fetchSims7Redirections: jest.fn()
}));

jest.mock('../Sims7RedirectionsMapper', () => ({
  mapSims7RedirectionsItem: jest.fn((item: any) => item)
}));

const { fetchSims7Redirections } = require('../Sims7RedirectionsPage.api');

const tableData = [
  { id: '1', category: 'Admissions', nextGenModule: 'Admissions', sims7Module: 'Admissions', modifiedBy: 'User', effectiveDate: '01 Jan 2026', status: 'Migrated', tooltipMessage: '', cellStatus: '', actions: { options: [] }, reasonForChanges: '', dfeNumber: '', ngModuleComponentUrl: '', previousDate: '' },
  { id: '2', category: 'Finance', nextGenModule: 'Finance', sims7Module: 'Finance', modifiedBy: 'User', effectiveDate: '01 Feb 2026', status: 'Planned', tooltipMessage: '', cellStatus: '', actions: { options: [] }, reasonForChanges: '', dfeNumber: '', ngModuleComponentUrl: '', previousDate: '' },
  { id: '3', category: 'HR', nextGenModule: 'HumanResources', sims7Module: 'HR', modifiedBy: 'Admin', effectiveDate: '01 Mar 2026', status: 'Not migrated', tooltipMessage: '', cellStatus: '', actions: { options: [] }, reasonForChanges: '', dfeNumber: '', ngModuleComponentUrl: '', previousDate: '' }
];

describe('handleSuggestionItemClick', () => {
  beforeEach(() => jest.clearAllMocks());

  it('filters table data by matching item.text', () => {
    const setFilteredData = jest.fn();
    handleSuggestionItemClick({ text: 'Admissions' }, tableData as any, setFilteredData);
    const result = setFilteredData.mock.calls[0][0];
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters by item.id when text is absent', () => {
    const setFilteredData = jest.fn();
    handleSuggestionItemClick({ id: 'Finance' }, tableData as any, setFilteredData);
    const result = setFilteredData.mock.calls[0][0];
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('returns empty array when no rows match', () => {
    const setFilteredData = jest.fn();
    handleSuggestionItemClick({ text: 'NoMatch' }, tableData as any, setFilteredData);
    const result = setFilteredData.mock.calls[0][0];
    expect(result).toHaveLength(0);
  });

  it('does nothing when item is null', () => {
    const setFilteredData = jest.fn();
    handleSuggestionItemClick(null, tableData as any, setFilteredData);
    expect(setFilteredData).not.toHaveBeenCalled();
  });

  it('returns empty array when item has no text and no id', () => {
    const setFilteredData = jest.fn();
    handleSuggestionItemClick({}, tableData as any, setFilteredData);
  });

  it('is case-insensitive', () => {
    const setFilteredData = jest.fn();
    handleSuggestionItemClick({ text: 'admissions' }, tableData as any, setFilteredData);
    const result = setFilteredData.mock.calls[0][0];
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('matches multiple rows with partial text', () => {
    const setFilteredData = jest.fn();
    handleSuggestionItemClick({ text: 'User' }, tableData as any, setFilteredData);
    const result = setFilteredData.mock.calls[0][0];
    expect(result).toHaveLength(2); // rows 1 and 2 have modifiedBy: 'User'
  });
});

describe('getEmptyRowProps', () => {
  const t = (key: string) => key;
  const emptyTable: any[] = [];
  const nonEmptyTable: any[] = [{ id: '1' }];
  const emptySuggestions: any[] = [];

  it('returns API error props when apiFailed and table is empty', () => {
    const result = getEmptyRowProps(true, emptyTable, emptySuggestions, t);
    expect(result).toEqual({
      emptyRowType: 'Error',
      emptyRowResponseCode: 'Error',
      emptyRowResponseMessage: 'SIMS7Redirects.apiFailureEmptyRowResponseMessage'
    });
  });

  it('returns default message when apiFailed but table has data', () => {
    const result = getEmptyRowProps(true, nonEmptyTable, emptySuggestions, t);
    expect(result).toEqual({ emptyRowResponseMessage: 'SIMS7Redirects.emptyRowResponseMessage' });
  });

  it('returns default message when not failed and table is empty', () => {
    const result = getEmptyRowProps(false, emptyTable, emptySuggestions, t);
    expect(result).toEqual({ emptyRowResponseMessage: 'SIMS7Redirects.emptyRowResponseMessage' });
  });

  it('returns default message when not failed and table has data', () => {
    const result = getEmptyRowProps(false, nonEmptyTable, emptySuggestions, t);
    expect(result).toEqual({ emptyRowResponseMessage: 'SIMS7Redirects.emptyRowResponseMessage' });
  });
});

describe('handleSaveSuccess', () => {
  beforeEach(() => jest.clearAllMocks());

  it('calls setLoading(true) then setLoading(false)', async () => {
    fetchSims7Redirections.mockResolvedValue({ items: [], totalItems: 0 });
    const setLoading = jest.fn();
    await handleSaveSuccess({
      setLoading,
      sortColumn: 'status',
      sortOrder: 'asc',
      currentPage: 1,
      pageSize: 40,
      searchTagList: [],
      setOriginalTableData: jest.fn(),
      setTotalItems: jest.fn()
    });
    expect(setLoading).toHaveBeenNthCalledWith(1, true);
    expect(setLoading).toHaveBeenNthCalledWith(2, false);
  });

  it('sets originalTableData from fetched items', async () => {
    const items = [{ id: '1', status: 'Migrated' }];
    fetchSims7Redirections.mockResolvedValue({ items, totalItems: 1 });
    const setOriginalTableData = jest.fn();
    await handleSaveSuccess({
      setLoading: jest.fn(),
      sortColumn: '',
      sortOrder: 'desc',
      currentPage: 1,
      pageSize: 40,
      searchTagList: [],
      setOriginalTableData,
      setTotalItems: jest.fn()
    });
    expect(setOriginalTableData).toHaveBeenCalledWith(items);
  });

  it('sets totalItems from payload', async () => {
    fetchSims7Redirections.mockResolvedValue({ items: [{ id: '1' }], totalItems: 99 });
    const setTotalItems = jest.fn();
    await handleSaveSuccess({
      setLoading: jest.fn(),
      sortColumn: '',
      sortOrder: 'asc',
      currentPage: 1,
      pageSize: 40,
      searchTagList: [],
      setOriginalTableData: jest.fn(),
      setTotalItems
    });
    expect(setTotalItems).toHaveBeenCalledWith(99);
  });

  it('falls back to items.length when totalItems is 0', async () => {
    fetchSims7Redirections.mockResolvedValue({ items: [{ id: '1' }, { id: '2' }], totalItems: 0 });
    const setTotalItems = jest.fn();
    await handleSaveSuccess({
      setLoading: jest.fn(),
      sortColumn: '',
      sortOrder: 'asc',
      currentPage: 1,
      pageSize: 40,
      searchTagList: [],
      setOriginalTableData: jest.fn(),
      setTotalItems
    });
    expect(setTotalItems).toHaveBeenCalledWith(2);
  });

  it('handles empty items array', async () => {
    fetchSims7Redirections.mockResolvedValue({ items: [], totalItems: 0 });
    const setOriginalTableData = jest.fn();
    const setTotalItems = jest.fn();
    await handleSaveSuccess({
      setLoading: jest.fn(),
      sortColumn: '',
      sortOrder: 'asc',
      currentPage: 1,
      pageSize: 40,
      searchTagList: [],
      setOriginalTableData,
      setTotalItems
    });
    expect(setOriginalTableData).toHaveBeenCalledWith([]);
    expect(setTotalItems).toHaveBeenCalledWith(0);
  });

  it('passes sortOrder as uppercase to API', async () => {
    fetchSims7Redirections.mockResolvedValue({ items: [], totalItems: 0 });
    await handleSaveSuccess({
      setLoading: jest.fn(),
      sortColumn: 'status',
      sortOrder: 'asc',
      currentPage: 2,
      pageSize: 20,
      searchTagList: [{ value: 'Migrated', text: 'Migrated' }],
      setOriginalTableData: jest.fn(),
      setTotalItems: jest.fn()
    });
    expect(fetchSims7Redirections).toHaveBeenCalledWith(
      expect.objectContaining({
        SortColumnName: 'status',
        SortOrder: 'ASC',
        PageNumber: 2,
        PageSize: 20,
        SearchFilter: ['Migrated']
      })
    );
  });

  it('still calls setLoading(false) when API throws', async () => {
    fetchSims7Redirections.mockRejectedValue(new Error('network error'));
    const setLoading = jest.fn();
    await expect(handleSaveSuccess({
      setLoading,
      sortColumn: '',
      sortOrder: 'asc',
      currentPage: 1,
      pageSize: 40,
      searchTagList: [],
      setOriginalTableData: jest.fn(),
      setTotalItems: jest.fn()
    })).rejects.toThrow('network error');
    expect(setLoading).toHaveBeenNthCalledWith(1, true);
    expect(setLoading).toHaveBeenNthCalledWith(2, false);
  });

  it('returns the mapped rows on success', async () => {
    const items = [{ id: '1' }, { id: '2' }];
    fetchSims7Redirections.mockResolvedValue({ items, totalItems: 2 });
    const result = await handleSaveSuccess({
      setLoading: jest.fn(),
      sortColumn: '',
      sortOrder: 'asc',
      currentPage: 1,
      pageSize: 40,
      searchTagList: [],
      setOriginalTableData: jest.fn(),
      setTotalItems: jest.fn()
    });
    expect(result).toEqual(items);
  });
});
