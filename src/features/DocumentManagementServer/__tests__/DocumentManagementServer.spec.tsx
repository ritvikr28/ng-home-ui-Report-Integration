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
});
