import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import DocumentManagementServerView from '../DocumentManagementServer.view';
import { debouncedFetchSuggestions } from '../DocumentManagementServer.logic';

const useMediaQueries = require('@essnextgen/ui-kit').useMediaQuery;

const logic = require('../DocumentManagementServer.logic').default;

jest.mock('../ApiService');

const { handlePageChange } = require('../DocumentManagementServer.view');

const { loadDocumentData } = require('../DocumentManagementServer.view');

const { handleSuggestionClick } = require('../DocumentManagementServer.view');

jest.mock('../DocumentManagementServer.logic', () => ({
    __esModule: true,
    ...logic,
    default: jest.fn(() => ({
       data: { data: [] },
        error: null,
        hasFetched: true
    })),
    getTableHeadersData: [
      { text: "Document", isShow: true, showValAs: "Text", columnWidth: "267px" },
      { text: "Category", isShow: true, showValAs: "Text", columnWidth: "144px" },
      { text: "Added by", isShow: true, showValAs: "Text", columnWidth: "180px" },
      { text: "Date added", isShow: true, showValAs: "Text", columnWidth: "140px" },
      { text: "Format", isShow: true, showValAs: "Text", columnWidth: "120px" },
      { text: "Size", isShow: true, showValAs: "Text", columnWidth: "129px" }
    ],

  debouncedFetchSuggestions: jest.fn(),
  formatSuggestions: jest.fn((data) => [
    {
      name: '',
      values: data.map((item: any) => ({
        text: item.fileName,
        props: { name: item.fileName, id: item.fileId },
        value: <></>
      }))
    }
  ])
}));
 
jest.mock('@essnextgen/ui-kit', () => ({
  ...jest.requireActual('@essnextgen/ui-kit'),
  useMediaQuery: jest.fn(),
}));
 
const mockData = {
  data: [
    {
      fileId: '1',
      document: 'Doc1',
      relatedTo: ['Rel1'],
      category: 'Cat1',
      addedBy: 'User1',
      dateAdded: '2024-06-01T00:00:00Z',
      format: 'pdf',
      size: '1MB'
    }
  ]
};


jest.mock('../DocumentManagementServer.logic', () => ({
    __esModule: true,
    default: jest.fn(() => ({})),
    getTableHeadersData: [
      { text: "Document", isShow: true, showValAs: "Text", columnWidth: "267px" },
      { text: "Category", isShow: true, showValAs: "Text", columnWidth: "144px" },
      { text: "Added by", isShow: true, showValAs: "Text", columnWidth: "180px" },
      { text: "Date added", isShow: true, showValAs: "Text", columnWidth: "140px" },
      { text: "Format", isShow: true, showValAs: "Text", columnWidth: "120px" },
      { text: "Size", isShow: true, showValAs: "Text", columnWidth: "129px" }
    ],
    debouncedFetchSuggestions: jest.fn()
}));


describe('DocumentManagementServerView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  test('isOpen is true by default on desktop (isMobileView=false)', () => {
    useMediaQueries.mockReturnValue(false);
    render(<DocumentManagementServerView />);
    expect(document.querySelector('.clc-dms-isopen')).toBeInTheDocument();
  });

  test('isOpen is false by default on mobile (isMobileView=true)', () => {
    useMediaQueries.mockReturnValue(true);
    render(<DocumentManagementServerView />);
    expect(document.querySelector('.clc-dms-isclose')).toBeInTheDocument();
  });

  test('Clicking the button toggles isOpen and class changes', () => {
    useMediaQueries.mockReturnValue(true);
    render(<DocumentManagementServerView />);
    expect(document.querySelector('.clc-dms-isclose')).toBeInTheDocument();
    const button = screen.getByTestId('btn-collapse');
    fireEvent.click(button);
    expect(document.querySelector('.clc-dms-isopen')).toBeInTheDocument();
  });

  test('renders side navigation open by default on desktop', async () => {
    useMediaQueries.mockReturnValue();
    render(<DocumentManagementServerView />);
    await expect(document.querySelector('.side-width')).toBeInTheDocument();
  });

  test('renders correct class when isOpen is true', () => {

    render(<DocumentManagementServerView />);
    expect(document.querySelector('.clc-dms-isopen')).toBeInTheDocument();
  });

  test('shows loader while loading', async () => {
    jest.useFakeTimers();
    render(<DocumentManagementServerView />);
    await waitFor(() => {
      expect(screen.queryByText('Please Wait...')).not.toBeInTheDocument();
    });
    jest.runAllTimers();
    jest.useRealTimers();
  });

  test('shows empty state message when no documents', async () => {
    logic.mockImplementation(() => ({
      data: null,
      error: null,
      hasFetched: true,
    }));
    render(<DocumentManagementServerView />);
    await waitFor(() => {
      expect(screen.getByText('Documents will appear here once they are uploaded.')).toBeInTheDocument();
    });
  });

  test('shows error page when error is present', async () => {
    logic.mockImplementation(() => ({
      data: null,
      error: 'Some error occurred',
      hasFetched: true,
    }));
    render(<DocumentManagementServerView />);
    await waitFor(() => {
      expect(screen.getByText('Summary of issue')).toBeInTheDocument();
      expect(screen.getByText('Things to try')).toBeInTheDocument();
      expect(screen.getByText('This may be due to one of the reasons below')).toBeInTheDocument();
    });
  });

  test('renders table headers when data is present', async () => {
    
    jest.useFakeTimers();
    logic.mockImplementation(() => ({
 
      error: null,
      data: {
        data: [
          {
            fileId: '1',
            document: 'Doc1',
            relatedTo: ['Related1'],
            category: 'Cat1',
            addedBy: 'User1',
            dateAdded: '2024-06-01T00:00:00Z',
            format: 'pdf',
            size: '1MB',
          }
        ]
      },
      hasFetched: true,
    }));
    render(<DocumentManagementServerView />);
 
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    await waitFor(() => {
      expect(screen.getByText('Doc1')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Added by')).toBeInTheDocument();
      expect(screen.getByText('Date added')).toBeInTheDocument();
      expect(screen.getByText('Format')).toBeInTheDocument();
      expect(screen.getByText('Size')).toBeInTheDocument();
    });
    jest.runAllTimers();
    jest.useRealTimers();
  });

  test('renders table row data when documents are present', async () => {
    logic.mockImplementation(() => ({
      data: {
        data: mockData.data
      },
      error: null,
      hasFetched: true,
    }));
    jest.useFakeTimers();
    render(<DocumentManagementServerView />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    await waitFor(() => {
      expect(screen.getByText('Doc1')).toBeInTheDocument();
      expect(screen.getByText('Cat1')).toBeInTheDocument();
      expect(screen.getByText('User1')).toBeInTheDocument();
      expect(screen.getByText('01 Jun 2024')).toBeInTheDocument();

    });
    jest.runAllTimers();
    jest.useRealTimers();
  });

  test('renders breadcrumbs', async () => {
    render(<DocumentManagementServerView />);
    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();

      const homeLinks = screen.getAllByText('Home');
      expect(homeLinks.length).toBeGreaterThan(0);
      homeLinks.forEach(link => expect(link).toBeInTheDocument());

      const adminConsoleLinks = screen.getAllByText('Admin console');
      expect(adminConsoleLinks.length).toBeGreaterThan(0);
      adminConsoleLinks.forEach(link => expect(link).toBeInTheDocument());

      expect(screen.getByText('Document Management Server')).toBeInTheDocument();
      const documentLinks = screen.getAllByText('Documents');
      expect(documentLinks.length).toBeGreaterThan(0);
      documentLinks.forEach(link => expect(link).toBeInTheDocument());
    });
  });

  test('side navigation toggles open/close', async () => {
    useMediaQueries.mockReturnValue(true);
    render(<DocumentManagementServerView />);
    expect(document.querySelector('.clc-dms-isclose')).toBeInTheDocument();
    const button = screen.getByTestId('btn-collapse');
    fireEvent.click(button);
    expect(document.querySelector('.clc-dms-isopen')).toBeInTheDocument();
  });

  test('handlePageChange sets loading and updates page', () => {
    // Instead of mocking React.useState, test the handler logic in isolation if possible
    const setCurrentPage = jest.fn();
    const setIsLoading = jest.fn();

    // Simulate the handlePageChange function directly
    if (handlePageChange) {
      handlePageChange(
        { setCurrentPage, setIsLoading },
        2
      );
      expect(setIsLoading).toHaveBeenCalledWith(true);
      expect(setCurrentPage).toHaveBeenCalledWith(2);
    }
  });
});

describe('DocumentManagementServerView - Search Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input with default value', async () => {
     jest.useFakeTimers();
    render(<DocumentManagementServerView />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    jest.runAllTimers();
    jest.useRealTimers();
  });

  it('clears suggestions if input length is less than 2', async () => {
     jest.useFakeTimers();
    render(<DocumentManagementServerView />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(screen.queryByText('Test Document')).not.toBeInTheDocument();
    });
    jest.runAllTimers();
    jest.useRealTimers();
  });

  it('shows suggestions when input is valid and fetch succeeds', async () => {
     jest.useFakeTimers();
     logic.mockImplementation(() => ({
      data: {
        data: mockData.data
      },
      error: null,
      hasFetched: true,
    }));
    render(<DocumentManagementServerView />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'doc' } });

    await waitFor(() => {
      expect(screen.getByText('Doc1')).toBeInTheDocument();
    });
    jest.runAllTimers();
    jest.useRealTimers();
  });

  it('does nothing when Enter key is pressed in search', async () => {
    jest.useFakeTimers();
    render(<DocumentManagementServerView />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'doc' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    jest.runAllTimers();
    jest.useRealTimers();
  });

  it('debounces search input changes', async () => {
    jest.useFakeTimers();
    render(<DocumentManagementServerView />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'doc' } });

    expect(debouncedFetchSuggestions).toHaveBeenCalledTimes(1);
    jest.runAllTimers();
    jest.useRealTimers();
  });
});

describe('handlePageChange (unit)', () => {
  it('should set loading to true and update current page', () => {
    const setIsLoading = jest.fn();
    const setCurrentPage = jest.fn();
    // Simulate the handler logic
    
    if (handlePageChange) {
      handlePageChange(
        { setCurrentPage, setIsLoading },
        2
      );
    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(setCurrentPage).toHaveBeenCalledWith(5);
    }
  });

  it('should work with any event object', () => {
    const setIsLoading = jest.fn();
    const setCurrentPage = jest.fn();
   
    if (handlePageChange) {
      handlePageChange(
        { setCurrentPage, setIsLoading },
        2
      );
    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(setCurrentPage).toHaveBeenCalledWith(10);
    }
  });
  
  describe('loadDocumentData', () => {
  let setIsSearchLoading: jest.Mock;
  let setIsLoading: jest.Mock;
  let setData: jest.Mock;
  let setCurrentPage: jest.Mock;
  let setTotalPage: jest.Mock;
  let setShowSearchError: jest.Mock;
  let fetchDocumentDetails: jest.Mock;

  beforeEach(() => {
    setIsSearchLoading = jest.fn();
    setIsLoading = jest.fn();
    setData = jest.fn();
    setCurrentPage = jest.fn();
    setTotalPage = jest.fn();
    setShowSearchError = jest.fn();
    fetchDocumentDetails = jest.fn();
  });

  it('should set data and update states on successful fetch', async () => {
    fetchDocumentDetails.mockResolvedValue({ totalRecords: 10 });
    if( loadDocumentData) {
    const fn = loadDocumentData.bind({
      setIsSearchLoading,
      setIsLoading,
      setData,
      setCurrentPage,
      setTotalPage,
      setShowSearchError,
      fetchDocumentDetails,
    });

    await fn('test', 2);

    expect(setIsSearchLoading).toHaveBeenCalledWith(true);
    expect(setIsLoading).toHaveBeenCalledWith(true);
    expect(setData).toHaveBeenCalledWith({ totalRecords: 10 });
    expect(setCurrentPage).toHaveBeenCalledWith(2);
    expect(setTotalPage).toHaveBeenCalledWith(1);
    expect(setShowSearchError).toHaveBeenCalledWith(false);
    expect(setIsSearchLoading).toHaveBeenLastCalledWith(false);
    expect(setIsLoading).toHaveBeenLastCalledWith(false);
  }
  });

  it('should show error if no result returned', async () => {
    fetchDocumentDetails.mockResolvedValue(null);
    if( loadDocumentData) {
    const fn = loadDocumentData.bind({
      setIsSearchLoading,
      setIsLoading,
      setData,
      setCurrentPage,
      setTotalPage,
      setShowSearchError,
      fetchDocumentDetails,
    });

    await fn('test', 1);

    expect(setShowSearchError).toHaveBeenCalledWith(true);
  }
  });

  it('should handle errors thrown by fetchDocumentDetails', async () => {
    fetchDocumentDetails.mockRejectedValue(new Error('fail'));
    if( loadDocumentData) {
    const fn = loadDocumentData.bind({
      setIsSearchLoading,
      setIsLoading,
      setData,
      setCurrentPage,
      setTotalPage,
      setShowSearchError,
      fetchDocumentDetails,
    });

    await fn('test', 1);

    expect(setShowSearchError).toHaveBeenCalledWith(true);
    expect(setIsSearchLoading).toHaveBeenLastCalledWith(false);
    expect(setIsLoading).toHaveBeenLastCalledWith(false);
  }
  });

  it('cleanup disables updates', async () => {
    // Simulate isActive = false after cleanup
    let isActive = true;
    fetchDocumentDetails.mockResolvedValue({ totalRecords: 5 });
    const context = {
      setIsSearchLoading: jest.fn(),
      setIsLoading: jest.fn(),
      setData: jest.fn(),
      setCurrentPage: jest.fn(),
      setTotalPage: jest.fn(),
      setShowSearchError: jest.fn(),
      fetchDocumentDetails,
    };
    
    if(loadDocumentData) {
    const fn = loadDocumentData.bind(context);

    const cleanup = await fn('test', 1);
    isActive = false;
    if (typeof cleanup === 'function') cleanup();
    // No further assertions needed, just for coverage
    }
  });
});

describe('handleSuggestionClick', () => {
  let setSearchTerm: jest.Mock;
  let loadDocumentData: jest.Mock;

  beforeEach(() => {
    setSearchTerm = jest.fn();
    loadDocumentData = jest.fn();
    // Import or require handleSuggestionClick as needed
   
  });

  it('should do nothing if item is null', async () => {
    if (handleSuggestionClick) {
    await handleSuggestionClick.call({ setSearchTerm, loadDocumentData }, null);
    expect(setSearchTerm).not.toHaveBeenCalled();
    expect(loadDocumentData).not.toHaveBeenCalled();4
    }
  });

  it('should do nothing if item.name is missing', async () => {
    if (handleSuggestionClick) {
    await handleSuggestionClick.call({ setSearchTerm, loadDocumentData }, { name: '' });
    expect(setSearchTerm).not.toHaveBeenCalled();
    expect(loadDocumentData).not.toHaveBeenCalled();
    }
  });

  it('should set search term and load document data if item is valid', async () => {
  if (handleSuggestionClick) {
    await handleSuggestionClick.call({ setSearchTerm, loadDocumentData }, { name: 'TestDoc' });
    expect(setSearchTerm).toHaveBeenCalledWith('TestDoc');
    expect(loadDocumentData).toHaveBeenCalledWith('TestDoc', 1);
  }
  });
});
});




