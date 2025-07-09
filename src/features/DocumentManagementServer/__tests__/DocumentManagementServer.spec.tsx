import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import DocumentManagementServerView from '../DocumentManagementServer.view';
import * as LogicModule from '../DocumentManagementServer.logic';
import userEvent from '@testing-library/user-event';

const useMediaQueries = require('@essnextgen/ui-kit').useMediaQuery;

const logic = require('../DocumentManagementServer.logic').default;
jest.mock('../ApiService');

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

  debouncedFetchSuggestions: jest.fn((val, setLoading, setSuggestions, setError) => {
      setLoading(false);
      if (val === 'error') {
        setError(true);
        setSuggestions([]);
      } else {
        setSuggestions([
          {
            heading: '',
            values: [{ id: '1', name: 'Test Document', value: 'test-doc' }]
          }
        ]);
      }
    }),
    
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

// jest.mock('@gcsim/components', () => ({
//   ...jest.requireActual('@gcsim/components'),
//   useMediaQueries: jest.fn(),
// }));

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
    jest.useFakeTimers();
    render(<DocumentManagementServerView />);

    act(() => {
      jest.advanceTimersByTime(2000);
    });
    await waitFor(() => {
      expect(screen.getByText('Document')).toBeInTheDocument();
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
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('clears suggestions if input length is less than 2', async () => {
    jest.useFakeTimers();
    render(<DocumentManagementServerView />);
     act(() => {
      jest.advanceTimersByTime(2000);
    });
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 't' } });

    await waitFor(() => {
      expect(screen.queryByText('Test Document')).not.toBeInTheDocument();
    });
  });

  it('shows suggestions when input is valid and fetch succeeds', async () => {
    
    (LogicModule.debouncedFetchSuggestions as jest.Mock).mockImplementation((
      value,
      setIsSearchLoading,
      setSuggestions,
      setShowSearchError
    ) => {
      setIsSearchLoading(false);
      setSuggestions([
        {
         name : '',
          values: [
            {  text: 'Test', value: 'test-doc' },
          ],
        }
      ]);
      setShowSearchError(false);
    });

    jest.useFakeTimers();
    render(<DocumentManagementServerView />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'test' } });

    // Let debounce trigger
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    // Use findByText which waits for the element
  const suggestion = await screen.findByText('Test');

  expect(suggestion).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('shows warning text when fetchSuggestions fails', async () => {
    jest.useFakeTimers();
    (LogicModule.debouncedFetchSuggestions as jest.Mock).mockImplementation((
      value,
      setIsSearchLoading,
      setSuggestions,
      setShowSearchError
    ) => {
      setIsSearchLoading(false);
      setSuggestions([
      ]);
      setShowSearchError(true);
    });
    render(<DocumentManagementServerView />);
     act(() => {
      jest.advanceTimersByTime(2000);
    });
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'error' } });

    await waitFor(() => {
      expect(screen.getByText('Search unavailable. Please try again later.')).toBeInTheDocument();
    });
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

    // No specific assertion, just verify no crash or action
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(input).toHaveValue('doc');
  })


});
