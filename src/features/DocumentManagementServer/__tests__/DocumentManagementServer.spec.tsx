import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentManagementServerView from '../DocumentManagementServer.view';


describe('DocumentManagementServerView', () => {

    test('does not render button when isOpen is true', () => {
        render(<DocumentManagementServerView />);
        const button = screen.queryByTestId('btn-collapse');
        expect(button).not.toBeInTheDocument();
    });

    test('renders filter button', () => {
        render(<DocumentManagementServerView />);
        expect(screen.getByTestId('filter-btn')).toBeInTheDocument();
        expect(screen.getByText('Filter')).toBeInTheDocument();
    });

    test('renders side navigation open by default on desktop', () => {
        render(<DocumentManagementServerView />);
        expect(document.querySelector('.side-width')).toBeInTheDocument();
    });

    test('renders correct class when isOpen is true', () => {
        render(<DocumentManagementServerView />);
        expect(document.querySelector('.clc-dms-isopen')).toBeInTheDocument();
    });
});
