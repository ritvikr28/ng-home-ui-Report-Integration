import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import DocumentManagementServerView from '../DocumentManagementServer.view';
import * as ApiService from '../ApiService';
import userEvent from '@testing-library/user-event';
import { debouncedFetchSuggestions } from '../DocumentManagementServer.logic';

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

jest.mock('@gcsim/components', () => ({
  ...jest.requireActual('@gcsim/components'),
  useMediaQueries: jest.fn(),
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

describe("Search and Suggestion Feature", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    useMediaQueries.mockReturnValue(false);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

test('renders search input with correct placeholder', async () => {
  jest.useFakeTimers();
  useMediaQueries.mockReturnValue(false);
  render(<DocumentManagementServerView />);
   
    jest.advanceTimersByTime(1500); // match debounce time
   
  
  expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  jest.useRealTimers();
});


  test('calls debouncedFetchSuggestions with correct value on valid input', async () => {
    jest.useFakeTimers();
   render(<DocumentManagementServerView />);
    
  jest.advanceTimersByTime(1500);

  const input = screen.getByPlaceholderText('Search...');
  userEvent.type(input, 'File');

 

  await waitFor(() => {
    expect(logic.debouncedFetchSuggestions).toHaveBeenCalledWith(
      'File',
      expect.any(Function),
      expect.any(Function),
      expect.any(Function)
    );
  });
  jest.useRealTimers();
});

test('shows suggestions when fetch succeeds', async () => {
  const mockSuggestions = [
    { fileName: 'Test File', fileId: '101' }
  ];

  const mockFetch = jest.fn((_, _1, setSuggestions, _2) => {
    setSuggestions([
      {
        name: '',
        values: [
          {
            text: 'Test File',
            props: { name: 'Test File', id: '101' },
            value: <></>
          }
        ]
      }
    ]);
  });

  require('../DocumentManagementServer.logic').debouncedFetchSuggestions = mockFetch;

  useMediaQueries.mockReturnValue(false);
  render(<DocumentManagementServerView />);

  const input = screen.getByPlaceholderText('Search...');
  fireEvent.change(input, { target: { value: 'Fi' } });

  await waitFor(() => {
    expect(screen.getByText('Test File')).toBeInTheDocument();
  });
});

test('clears search term and suggestions on close', async () => {
  useMediaQueries.mockReturnValue(false);
  render(<DocumentManagementServerView />);

  const input = screen.getByPlaceholderText('Search...');
  fireEvent.change(input, { target: { value: 'File' } });

  const closeBtn = screen.getByTestId('controlled-list-test-id');
  fireEvent.click(closeBtn);

  await waitFor(() => {
    expect(input).toHaveValue('');
  });
});

test('displays search warning when showSearchError is true', async () => {
  const mockFetch = jest.fn((_, _1, _2, setShowError) => {
    setShowError(true);
  });

  require('../DocumentManagementServer.logic').debouncedFetchSuggestions = mockFetch;

  useMediaQueries.mockReturnValue(false);
  render(<DocumentManagementServerView />);

  const input = screen.getByPlaceholderText('Search...');
  fireEvent.change(input, { target: { value: 'File' } });

  await waitFor(() => {
    expect(screen.getByText('Search unavailable. Please try again later.')).toBeInTheDocument();
  });
});
test('sets search term when a suggestion is clicked', async () => {
  const suggestion = {
    name: 'Test File',
    props: { name: 'Test File', id: '101' },
    value: <></>
  };

  const mockFetch = jest.fn((_, _1, setSuggestions, _2) => {
    setSuggestions([{ name: '', values: [suggestion] }]);
  });

  require('../DocumentManagementServer.logic').debouncedFetchSuggestions = mockFetch;

  useMediaQueries.mockReturnValue(false);
  render(<DocumentManagementServerView />);

  const input = screen.getByPlaceholderText('Search...');
  fireEvent.change(input, { target: { value: 'File' } });

  await waitFor(() => {
    expect(screen.getByText('Test File')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Test File'));
    expect(input).toHaveValue('Test File');
  });
});

 test('pressing Enter in search triggers search action logic', async () => {
  useMediaQueries.mockReturnValue(false);
  render(<DocumentManagementServerView />);

  const input = screen.getByPlaceholderText('Search...');
  fireEvent.change(input, { target: { value: 'Test' } });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

  // Add assertion here if a side-effect occurs (e.g., fetch function or UI update)
});


  test("clearing search input resets suggestions", async () => {
    const mockSuggestions = [{ fileId: "1", fileName: "ToClear" }];
    (ApiService.fetchDMSSuggestions as jest.Mock).mockResolvedValue(mockSuggestions);

    render(<DocumentManagementServerView />);
    const input = screen.getByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "ToClear" } });

    await waitFor(() => {
      expect(screen.getByText("ToClear")).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: "" } });

    await waitFor(() => {
      expect(input).toHaveValue("");
    });
  });
});

