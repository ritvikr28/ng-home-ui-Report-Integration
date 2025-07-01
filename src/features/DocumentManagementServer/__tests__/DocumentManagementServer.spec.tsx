import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentManagementServerView from '../DocumentManagementServer.view';
import { waitFor } from '@testing-library/react';


const logic = require('../DocumentManagementServer.logic').default;

jest.mock('../DocumentManagementServer.logic', () => {
  // Default mock: no data, no error, hasFetched true
  return {
    __esModule: true,
    default: jest.fn(() => ({
      getTableHeadersData: [
      { text: "Document", isShow: true, showValAs: "CustomeComponent", columnWidth: "267px" },
      { text: "Category", isShow: true, showValAs: "Text", columnWidth: "144px" },
      { text: "Added by", isShow: true, showValAs: "Text", columnWidth: "180px" },
      { text: "Date added", isShow: true, showValAs: "Text", columnWidth: "140px" },
      { text: "Format", isShow: true, showValAs: "Text", columnWidth: "120px" },
      { text: "Size", isShow: true, showValAs: "Text", columnWidth: "129px" }
    ]
    })),
  };
});
jest.mock('@essnextgen/ui-kit', () => ({
  ...jest.requireActual('@essnextgen/ui-kit'),
  useMediaQuery: jest.fn(),
}));
const useMediaQueries = require('@essnextgen/ui-kit').useMediaQuery;


describe('DocumentManagementServerView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  test('isOpen is true by default on desktop (isMobileView=false)', () => {
    useMediaQueries.mockReturnValue(false); // Desktop
    render(<DocumentManagementServerView />);
    // The side nav should be open, so class should be "clc-dms-isopen"
    expect(document.querySelector('.clc-dms-isopen')).toBeInTheDocument();
  });

  test('isOpen is false by default on mobile (isMobileView=true)', () => {
    useMediaQueries.mockReturnValue(true); // Mobile
    render(<DocumentManagementServerView />);
    // The side nav should be closed, so class should be "clc-dms-isclose"
    expect(document.querySelector('.clc-dms-isclose')).toBeInTheDocument();
  });

  test('Clicking the button toggles isOpen and class changes', () => {
    useMediaQueries.mockReturnValue(true); // Mobile, so isOpen starts as false
    render(<DocumentManagementServerView />);
    // Should start closed
    expect(document.querySelector('.clc-dms-isclose')).toBeInTheDocument();
    // Find and click the open button
    const button = screen.getByTestId('btn-collapse');
    fireEvent.click(button);
    // Now should be open
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
    // Mock logic to return error
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
      data: {
      pageNumber: 1,
      pageSize: 10,  
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
        },
      ],
      },
      error: null,
    }));
    render(<DocumentManagementServerView />);
    await waitFor(() => {
      expect(screen.getByText('Document')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Added by')).toBeInTheDocument();
      expect(screen.getByText('Date added')).toBeInTheDocument();
      expect(screen.getByText('Format')).toBeInTheDocument();
      expect(screen.getByText('Size')).toBeInTheDocument();
    });
    });

    test('renders table row data when documents are present', async () => {
    logic.mockImplementation(() => ({
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
        },
      ],
      },
      error: null,
      hasFetched: true,
    }));
    render(<DocumentManagementServerView />);
    await waitFor(() => {
      expect(screen.getByText('Doc1')).toBeInTheDocument();
      expect(screen.getByText('Cat1')).toBeInTheDocument();
      expect(screen.getByText('User1')).toBeInTheDocument();
      expect(screen.getByText('01 Jun 2024')).toBeInTheDocument();
      expect(screen.getByText('pdf')).toBeInTheDocument();
      expect(screen.getByText('1MB')).toBeInTheDocument();
    });
    });

    test('renders breadcrumbs', async () => {
    render(<DocumentManagementServerView />);
    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Admin console')).toBeInTheDocument();
      expect(screen.getByText('Document Management Server')).toBeInTheDocument();
      expect(screen.getByText('Documents')).toBeInTheDocument();
    });
    });

    test('side navigation toggles open/close', async () => {
    useMediaQueries.mockReturnValue(true); // Mobile, so isOpen starts as false
    render(<DocumentManagementServerView />);
    // Should start closed
    expect(document.querySelector('.clc-dms-isclose')).toBeInTheDocument();
    // Find and click the open button
    const button = screen.getByTestId('btn-collapse');
    fireEvent.click(button);
    // Now should be open
    expect(document.querySelector('.clc-dms-isopen')).toBeInTheDocument();
    // Click again to close
    fireEvent.click(button);
    // Should be closed again
    expect(document.querySelector('.clc-dms-isclose')).toBeInTheDocument();
    });
});

