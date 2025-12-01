import React from 'react';
import { render, screen } from '@testing-library/react';
import FilterDialogLogic from '../FilterDialog.logic';

// Mock the FilterDialogView to inspect props
jest.mock('../FilterDialog.view', () => (props: any) => (
    <div data-testid="mocked-view" {...props} />
));

describe('FilterDialogLogic', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render FilterDialogView with initial empty state', () => {
        render(<FilterDialogLogic />);
        const view = screen.getByTestId('mocked-view');
        expect(view).toBeInTheDocument();
        expect(view).toHaveAttribute('status', '');
        expect(view).toHaveAttribute('priority', '');
        expect(view).toHaveAttribute('startDate', '');
        expect(view).toHaveAttribute('endDate', '');
    });

    it('should be a function', () => {
        expect(typeof FilterDialogLogic).toBe('function');
    });
});