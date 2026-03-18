import { fetchSuggestionsForSearch } from '../Sims7RedirectionsPage.view.helpers';

jest.mock('../Sims7RedirectionsPage.api', () => ({
  fetchAutoSuggestions: jest.fn(),
  fetchSims7Redirections: jest.fn()
}));

jest.mock('../Sims7RedirectionsMapper', () => ({
  mapSims7RedirectionsItem: jest.fn((item: any) => item)
}));

jest.mock('../Sims7RedirectionsPage.view', () => ({}));

const { fetchAutoSuggestions } = require('../Sims7RedirectionsPage.api');

function makeArgs(overrides: any = {}) {
  return {
    searchTerm: 'abc',
    setSuggestionItems: jest.fn(),
    setFilteredData: jest.fn(),
    setApiFailed: jest.fn(),
    setSearchIsLoading: jest.fn(),
    originalTableData: [{ id: '1', category: 'Test' }],
    ignoreRef: { current: false },
    ...overrides,
    // Ensure t is always a function, even if overrides.t is null/undefined
    t: typeof overrides.t === 'function' ? overrides.t : ((key: string) => key),
  };
}

describe('fetchSuggestionsForSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('searchTerm shorter than 3 chars', () => {
    it('clears suggestions and resets filteredData for empty string', async () => {
      const args = makeArgs({ searchTerm: '' });
      await fetchSuggestionsForSearch(args);
      expect(args.setSuggestionItems).toHaveBeenCalledWith([]);
      expect(args.setFilteredData).toHaveBeenCalledWith(args.originalTableData);
      expect(fetchAutoSuggestions).not.toHaveBeenCalled();
    });

    it('clears suggestions for 1-char term', async () => {
      const args = makeArgs({ searchTerm: 'a' });
      await fetchSuggestionsForSearch(args);
      expect(args.setSuggestionItems).toHaveBeenCalledWith([]);
      expect(args.setFilteredData).toHaveBeenCalledWith(args.originalTableData);
    });

    it('clears suggestions for 2-char term', async () => {
      const args = makeArgs({ searchTerm: 'ab' });
      await fetchSuggestionsForSearch(args);
      expect(args.setSuggestionItems).toHaveBeenCalledWith([]);
      expect(args.setFilteredData).toHaveBeenCalledWith(args.originalTableData);
    });

    it('does not call setSearchIsLoading for short term', async () => {
      const args = makeArgs({ searchTerm: 'ab' });
      await fetchSuggestionsForSearch(args);
      expect(args.setSearchIsLoading).not.toHaveBeenCalled();
    });

    it('does not call API when search term is only spaces', async () => {
      const args = makeArgs({ searchTerm: '   ' });
      await fetchSuggestionsForSearch(args);
      expect(fetchAutoSuggestions).not.toHaveBeenCalled();
      expect(args.setSuggestionItems).toHaveBeenCalledWith([]);
      expect(args.setFilteredData).toHaveBeenCalledWith(args.originalTableData);
    });

    it('does not call API when 3+ chars but all spaces', async () => {
      const args = makeArgs({ searchTerm: '     ' });
      await fetchSuggestionsForSearch(args);
      expect(fetchAutoSuggestions).not.toHaveBeenCalled();
    });

    it('does not call API when term has fewer than 3 non-space chars', async () => {
      const args = makeArgs({ searchTerm: 'ab ' });
      await fetchSuggestionsForSearch(args);
      expect(fetchAutoSuggestions).not.toHaveBeenCalled();
      expect(args.setSuggestionItems).toHaveBeenCalledWith([]);
    });
  });

  describe('searchTerm with 3+ chars — API success', () => {
    it('sets loading true then false', async () => {
      fetchAutoSuggestions.mockResolvedValue({ payload: { modules: ['TestCat'] } });
      const args = makeArgs();
      await fetchSuggestionsForSearch(args);
      expect(args.setSearchIsLoading).toHaveBeenNthCalledWith(1, true);
      expect(args.setSearchIsLoading).toHaveBeenNthCalledWith(2, false);
    });

    it('calls API with trimmed search term', async () => {
      fetchAutoSuggestions.mockResolvedValue({ payload: { modules: ['ModA'] } });
      const args = makeArgs({ searchTerm: ' abc ' });
      await fetchSuggestionsForSearch(args);
      expect(fetchAutoSuggestions).toHaveBeenCalledWith('abc');
    });

    it('sets suggestion groups from payload', async () => {
      fetchAutoSuggestions.mockResolvedValue({ payload: { modules: ['ModA', 'ModB'] } });
      const args = makeArgs();
      await fetchSuggestionsForSearch(args);
      expect(args.setSuggestionItems).toHaveBeenCalledWith([
        { name: 'modules', values: [{ text: 'ModA' }, { text: 'ModB' }] }
      ]);
    });

    it('handles multiple groups in payload', async () => {
      fetchAutoSuggestions.mockResolvedValue({
        payload: { category: ['Cat1'], module: ['Mod1'] }
      });
      const args = makeArgs();
      await fetchSuggestionsForSearch(args);
      const called = args.setSuggestionItems.mock.calls[0][0];
      expect(called).toHaveLength(2);
      expect(called[0].name).toBe('category');
      expect(called[1].name).toBe('module');
    });

    it('clears suggestions when all payload arrays are empty', async () => {
      fetchAutoSuggestions.mockResolvedValue({ payload: { modules: [] } });
      const args = makeArgs();
      await fetchSuggestionsForSearch(args);
      expect(args.setSuggestionItems).toHaveBeenCalledWith([]);
    });

    it('clears suggestions when payload is null/undefined', async () => {
      fetchAutoSuggestions.mockResolvedValue({ payload: null });
      const args = makeArgs();
      await fetchSuggestionsForSearch(args);
      expect(args.setSuggestionItems).toHaveBeenCalledWith([]);
    });

    it('does not set suggestions when ignoreRef is true', async () => {
      fetchAutoSuggestions.mockResolvedValue({ payload: { modules: ['Mod1'] } });
      const args = makeArgs({ ignoreRef: { current: true } });
      await fetchSuggestionsForSearch(args);
      expect(args.setSuggestionItems).not.toHaveBeenCalled();
    });

    it('does not set suggestions for null payload when ignoreRef is true', async () => {
      fetchAutoSuggestions.mockResolvedValue({ payload: null });
      const args = makeArgs({ ignoreRef: { current: true } });
      await fetchSuggestionsForSearch(args);
      expect(args.setSuggestionItems).not.toHaveBeenCalled();
    });

    it('always resets loading in finally even on success', async () => {
      fetchAutoSuggestions.mockResolvedValue({ payload: { modules: ['Mod1'] } });
      const args = makeArgs();
      await fetchSuggestionsForSearch(args);
      expect(args.setSearchIsLoading).toHaveBeenLastCalledWith(false);
    });
  });

  describe('API failure', () => {
    it('sets apiFailed to true on error', async () => {
      fetchAutoSuggestions.mockRejectedValue(new Error('Network error'));
      const args = makeArgs();
      await fetchSuggestionsForSearch(args);
      expect(args.setApiFailed).toHaveBeenCalledWith(true);
    });

    it('clears suggestions on error', async () => {
      fetchAutoSuggestions.mockRejectedValue(new Error('Network error'));
      const args = makeArgs();
      await fetchSuggestionsForSearch(args);
      expect(args.setSuggestionItems).toHaveBeenCalledWith([]);
    });

    it('still resets loading in finally on error', async () => {
      fetchAutoSuggestions.mockRejectedValue(new Error('Network error'));
      const args = makeArgs();
      await fetchSuggestionsForSearch(args);
      expect(args.setSearchIsLoading).toHaveBeenLastCalledWith(false);
    });

    it('does not call setFilteredData on API error', async () => {
      fetchAutoSuggestions.mockRejectedValue(new Error('Network error'));
      const args = makeArgs();
      await fetchSuggestionsForSearch(args);
      expect(args.setFilteredData).not.toHaveBeenCalled();
    });
  });
});
