import React from 'react';
import FilterDialogLogic from '../FilterDialog.logic';
import FilterDialogView from '../FilterDialog.view';

jest.mock('../FilterDialog.view', () => jest.fn(() => <div>Mocked FilterDialogView</div>));

describe('FilterDialogLogic', () => {
    const mockSetFilterBtnClicked = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render FilterDialogView', () => {
        const element = FilterDialogLogic({ setFilterBtnClicked: mockSetFilterBtnClicked });
        expect(element.type).toBe(FilterDialogView);
        expect(element.props).toEqual({ setFilterBtnClicked: mockSetFilterBtnClicked });
    });

    it('should not call setFilterBtnClicked on render', () => {
        FilterDialogLogic({ setFilterBtnClicked: mockSetFilterBtnClicked });
        expect(mockSetFilterBtnClicked).not.toHaveBeenCalled();
    });

    it('should be a function', () => {
        expect(typeof FilterDialogLogic).toBe('function');
    });

    it('should return a React element', () => {
        const element = FilterDialogLogic({ setFilterBtnClicked: mockSetFilterBtnClicked });
        expect(React.isValidElement(element)).toBe(true);
    });
});