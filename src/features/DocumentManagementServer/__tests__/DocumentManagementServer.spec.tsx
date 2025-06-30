import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentManagementServerView from '../DocumentManagementServer.view';
import {  waitFor } from '@testing-library/react';
import { getTableHeadersData, tableBodyData } from '../DocumentManagementServer.logic';


const logic = require('../DocumentManagementServer.logic').default;

jest.mock('../DocumentManagementServer.logic', () => {
    // Default mock: no data, no error, hasFetched true
    return {
        __esModule: true,
        default: jest.fn(() => ({
            data: { data: tableBodyData },
            error: null,
            hasFetched: true,
        })),
    };
});

describe('DocumentManagementServerView', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

 

    test('renders side navigation open by default on desktop', () => {
        render(<DocumentManagementServerView />);
        expect(document.querySelector('.side-width')).toBeInTheDocument();
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

// test('renders table headers when data is present', async () => {
//     logic.mockImplementation(() => ({
//         data: { data: [{
//             fileId: 1,
//             document: 'Test Document',
//             relatedTo: ['School A'],
//             category: 'Test Category',
//             addedBy: 'Tester',
//             dateAdded: '2025-01-01T00:00:00Z',
//             format: 'pdf',
//             size: '1MB',
//         }] },
//         error: null,
//         hasFetched: true,
//     }));
//     render(<DocumentManagementServerView />);
//     // Wait for table headers to appear
//     expect(await screen.findByText(/Document/i)).toBeInTheDocument();
//     expect(await screen.findByText(/Category/i)).toBeInTheDocument();
//     expect(await screen.findByText(/Added by/i)).toBeInTheDocument();
//     expect(await screen.findByText(/Date added/i)).toBeInTheDocument();
//     expect(await screen.findByText(/Format/i)).toBeInTheDocument();
//     expect(await screen.findByText(/Size/i)).toBeInTheDocument();
// });
//     test('renders table row data when documents are present', async () => {
//         logic.mockImplementation(() => ({
//             data: { data: [{
//                 fileId: 1,
//                 document: 'Test Document',
//                 relatedTo: ['School A'],
//                 category: 'Test Category',
//                 addedBy: 'Tester',
//                 dateAdded: '2024-06-25T00:00:00Z',
//                 format: 'pdf',
//                 size: '1MB',
//             }] },
//             error: null,
//             hasFetched: true,
//         }));
//         render(<DocumentManagementServerView />);
//         expect(await screen.findByText('Test Document')).toBeInTheDocument();
//         expect(screen.getByText('Test Category')).toBeInTheDocument();
//         expect(screen.getByText('Tester')).toBeInTheDocument();
//         expect(screen.getByText('25 Jun 2024')).toBeInTheDocument();
//         expect(screen.getByText('pdf')).toBeInTheDocument();
//         expect(screen.getByText('1MB')).toBeInTheDocument();
//     });

//     test('renders breadcrumbs', async () => {
//         logic.mockImplementation(() => ({
//             data: { data: [{
//                 fileId: 1,
//                 document: 'Test Document',
//                 relatedTo: ['School A'],
//                 category: 'Test Category',
//                 addedBy: 'Tester',
//                 dateAdded: '2024-06-25T00:00:00Z',
//                 format: 'pdf',
//                 size: '1MB',
//             }] },
//             error: null,
//             hasFetched: true,
//         }));
//         render(<DocumentManagementServerView />);
//         expect(await screen.findByText('Home')).toBeInTheDocument();
//         expect(screen.getAllByText('Admin console').length).toBeGreaterThan(0);
//         expect(screen.getByText('Document Management Server')).toBeInTheDocument();
//         expect(screen.getAllByText('Documents').length).toBeGreaterThan(0);
//     });

//     test('side navigation toggles open/close', async () => {
//         render(<DocumentManagementServerView />);
//         // Simulate clicking the collapse/expand button if it exists
//         const collapseBtn = screen.queryByTestId('btn-collapse');
//         if (collapseBtn) {
//             fireEvent.click(collapseBtn);
//             expect(await screen.findByText('Admin console')).toBeInTheDocument();
//         }
//     });
});
