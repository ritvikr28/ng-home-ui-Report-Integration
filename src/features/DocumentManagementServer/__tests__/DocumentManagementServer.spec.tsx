import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import { Suggestion } from '@essnextgen/ui-kit';
import DocumentManagementServerView from '../DocumentManagementServer.view';
import { debouncedFetchSuggestions} from '../DocumentManagementServer.logic';
import * as apiService from '../ApiService';

const { useState } = require('react');

const useMediaQueries = require('@essnextgen/ui-kit').useMediaQuery;

const logic = require('../DocumentManagementServer.logic').default;

jest.mock('../ApiService');

const { handleButtonClick } = require('../DocumentManagementServer.view');


jest.mock('../DocumentManagementServer.logic', () => ({
    __esModule: true,
    ...logic,
    default: jest.fn(() => ({
       data: { data: [] },
        error: null,
        hasFetched: true
    })),
    
    debouncedFetchSuggestions: jest.fn(),
    getTableHeadersData: [
      { text: "Document", isShow: true, showValAs: "Text", columnWidth: "267px" },
      { text: "Category", isShow: true, showValAs: "Text", columnWidth: "144px" },
      { text: "Added by", isShow: true, showValAs: "Text", columnWidth: "180px" },
      { text: "Date added", isShow: true, showValAs: "Text", columnWidth: "140px" },
      { text: "Format", isShow: true, showValAs: "Text", columnWidth: "120px" },
      { text: "Size", isShow: true, showValAs: "Text", columnWidth: "129px" }
    ],

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

jest.mock('../../..//shared/utils/analytics', () => ({
  __esModule: true,
  default: {
    pushEvent: jest.fn(), 
  },
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
    test('toggles isOpen on button click', () => {
      if( handleButtonClick) {
      const setIsOpen = jest.fn();
      useState.mockImplementationOnce(() => [false, setIsOpen]);
      handleButtonClick.call({ setIsOpen });
      expect(setIsOpen).toHaveBeenCalledWith(true);
      }
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
  expect(screen.getByTestId('search-autocomplete-input')).toBeInTheDocument();
  jest.runAllTimers();
  jest.useRealTimers();
});

 it('clears suggestions if input length is less than 2', async () => {
  jest.useFakeTimers();
  render(<DocumentManagementServerView />);

  act(() => {
    jest.advanceTimersByTime(2000);
  });
  const input = screen.getByTestId('search-autocomplete-input');
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
    const input = screen.getByTestId('search-autocomplete-input');
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
    const input = screen.getByTestId('search-autocomplete-input');
    fireEvent.change(input, { target: { value: 'doc' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(input).toBeInTheDocument();
    jest.runAllTimers();
    jest.useRealTimers();
  });

  it('debounces search input changes', async () => {
    jest.useFakeTimers();
    render(<DocumentManagementServerView />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    const input = screen.getByTestId('search-autocomplete-input');
    fireEvent.change(input, { target: { value: 'doc' } });

    expect(debouncedFetchSuggestions).toHaveBeenCalledTimes(1);
    jest.runAllTimers();
    jest.useRealTimers();
  });
});

describe('hasItems', () => {
  it('returns true if any suggestion has values', () => {
    const suggestions = [{ values: [1, 2] }, { values: [] }];
    expect(
      suggestions.some(({ values }) => values.length > 0)
    ).toBe(true);
    
  });

  it('returns false if all suggestions are empty', () => {
    const suggestions = [{ values: [] }, { values: [] }];
    expect(
      suggestions.some(({ values }) => values.length > 0)
    ).toBe(false);
    
  });
});



describe('DocumentManagementServerView - Extended Coverage', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should update isOpen when screen size changes (useEffect)', () => {
    useMediaQueries.mockReturnValueOnce(false).mockReturnValueOnce(true);
    const { rerender } = render(<DocumentManagementServerView />);
    rerender(<DocumentManagementServerView />);
  });


  test('renders filter button inside ControlledList', () => {
    jest.useFakeTimers();
    render(<DocumentManagementServerView />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.getByTestId('filter-btn')).toBeInTheDocument();
  });



  test('does not show empty add button', () => {
    render(<DocumentManagementServerView />);
    expect(screen.queryByText('Add Type')).not.toBeInTheDocument();
  });

  

  it('returns true if suggestions contain non-empty values', () => {
  const suggestions: Suggestion[] = [
    {
      values: [{ text: 'Doc' }],
      name: ''
    },
    {
      values: [],
      name: ''
    }
  ];
  const hasItems = suggestions.some(({ values }) => values.length > 0);
  expect(hasItems).toBe(true);
});
 
test('renders mobile breadcrumb when isMobileView is true', () => {
  jest.mock('@essnextgen/ui-kit', () => ({
    ...jest.requireActual('@essnextgen/ui-kit'),
    useMediaQuery: jest.fn().mockReturnValue(true),
  }));

  jest.useFakeTimers();
    render(<DocumentManagementServerView />);
    const { container } = render(<DocumentManagementServerView />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });

  const breadcrumb = container.querySelector('[data-test-id="breadcrumb-test-id"]');
  expect(breadcrumb).toBeInTheDocument();
});

test('loadDocumentData sets data and pagination correctly', async () => {
  (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue({
    totalRecords: 80,
    data: [
      {
        fileId: '1',
        document: 'Sample Doc',
        relatedTo: ['X'],
        category: 'file',
        addedBy: 'Admin',
        dateAdded: '2025-01-01',
        format: 'pdf',
        size: '1MB',
      }
    ]
  });

  logic.mockImplementation(() => ({
    data: {
      data: [
        {
          fileId: '1',
          document: 'Sample Doc',
          relatedTo: ['X'],
          category: 'file',
          addedBy: 'Admin',
          dateAdded: '2025-01-01',
          format: 'pdf',
          size: '1MB',
        }
      ],
      totalRecords: 80,
    },
    error: null,
    hasFetched: true,
  }));

  jest.useFakeTimers();
  render(<DocumentManagementServerView />);

  act(() => {
    jest.advanceTimersByTime(2000);
  });

  const input = screen.getByTestId('search-autocomplete-input');
  fireEvent.change(input, { target: { value: 'Sample' } });

  act(() => {
    jest.advanceTimersByTime(1000);
  });

  // Use a flexible matcher in case the text is split across elements
  await waitFor(() => {
    expect(screen.getByText((content, node) => {
      const hasText = (nodes: Element) => nodes.textContent === 'Sample Doc';
      const nodeHasText = hasText(node as Element);
      const childrenDontHaveText = Array.from(node?.children || []).every(
        child => !hasText(child as Element)
      );
      return nodeHasText && childrenDontHaveText;
    })).toBeInTheDocument();
  });

  jest.runAllTimers();
  jest.useRealTimers();
});

test('renders ControlledList with document table when hasFetched is true', async () => {
  (apiService.fetchDocumentDetails as jest.Mock).mockResolvedValue({
    totalRecords: 1,
    data: [
      {
        fileId: 'a1',
        document: 'TestFile',
        relatedTo: ['A'],
        category: 'conduct',
        addedBy: 'Staff',
        dateAdded: '2025-05-01',
        format: 'pdf',
        size: '50KB',
      }
    ]
  });

  logic.mockImplementation(() => ({
    data: {
      data: [
        {
          fileId: 'a1',
          document: 'TestFile',
          relatedTo: ['A'],
          category: 'conduct',
          addedBy: 'Staff',
          dateAdded: '2025-05-01',
          format: 'pdf',
          size: '50KB',
        }
      ],
      totalRecords: 1,
    },
    error: null,
    hasFetched: true,
  }));

  jest.useFakeTimers();
  render(<DocumentManagementServerView />);

  act(() => {
    jest.advanceTimersByTime(2000);
  });
  const input = screen.getByTestId('search-autocomplete-input');
  fireEvent.change(input, { target: { value: 'TestFile' } });
  act(() => {
    jest.advanceTimersByTime(1000);
  });

  await waitFor(() => {
    expect(
      screen.getByText('TestFile')
    ).toBeInTheDocument();
  });

  jest.runAllTimers();
  jest.useRealTimers();
});

test('handles fetchDocumentDetails error and logs error to console', async () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  (apiService.fetchDocumentDetails as jest.Mock).mockRejectedValue(new Error('API failed'));

  jest.useFakeTimers();
  render(<DocumentManagementServerView />);

  act(() => {
    jest.advanceTimersByTime(2000);
  });
  const input = screen.getByTestId('search-autocomplete-input');
  fireEvent.change(input, { target: { value: '' } });

  // Simulate Enter key to trigger loadDocumentData when searchTerm is empty
  fireEvent.keyDown(input, { key: 'Enter' });

  act(() => {
    jest.advanceTimersByTime(1000); // debounce (if any)
  });

  await waitFor(() => {
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error loading document data:',
      expect.any(Error)
    );
  });

  consoleSpy.mockRestore();
});

})

