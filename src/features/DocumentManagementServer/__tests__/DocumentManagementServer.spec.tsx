import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentManagementServerView from '../DocumentManagementServer.view';


describe('DocumentManagementServerView', () => {

    test('does not render button when isOpen is true', () => {
        render(<DocumentManagementServerView />);
        const button = screen.queryByTestId('btn-collapse');
        expect(button).not.toBeInTheDocument();
    });
});
