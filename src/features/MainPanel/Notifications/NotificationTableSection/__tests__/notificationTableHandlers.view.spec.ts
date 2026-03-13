import { SyntheticEvent } from 'react';
import { getSearchOnClickClose } from '../notificationTableHandlers.view';

describe('getSearchOnClickClose', () => {
    const mockSetFilters = jest.fn();
    const baseFilters = {
        status: ['Open', 'Closed'],
        priority: ['High', 'Low'],
        startDate: '2024-01-01',
        endDate: '2024-01-31',
    };
    const searchTagList = [
        { text: 'Open', categoryName: 'Status', closeObj: { name: 'Open', id: 1 } },
        { text: 'High', categoryName: 'Priority', closeObj: { name: 'High', id: 2 } },
        { text: 'Date', categoryName: 'Date', closeObj: { name: 'Date', id: 3 } }
    ];

    beforeEach(() => {
        mockSetFilters.mockClear();
    });

    it('returns a function', () => {
        const handler = getSearchOnClickClose(baseFilters, mockSetFilters, searchTagList);
        expect(typeof handler).toBe('function');
    });

    it('does nothing if closeObj is falsy', () => {
        const handler = getSearchOnClickClose(baseFilters, mockSetFilters, searchTagList);
        handler({} as SyntheticEvent, '', undefined as any);
        expect(mockSetFilters).not.toHaveBeenCalled();
    });

    it('does nothing if filters is falsy', () => {
        const handler = getSearchOnClickClose(undefined, mockSetFilters, searchTagList);
        handler({} as SyntheticEvent, '', { name: 'Open' } as any);
        expect(mockSetFilters).not.toHaveBeenCalled();
    });

    it('removes status filter when category is Status (from closeObj)', () => {
        const handler = getSearchOnClickClose(baseFilters, mockSetFilters, searchTagList);
        handler({} as SyntheticEvent, '', { name: 'Open', id: 1, categoryName: 'Status' } as any);
        expect(mockSetFilters).toHaveBeenCalledWith({
            ...baseFilters,
            status: ['Closed'],
        });
    });

    it('removes status filter when category is Status (from searchTagList)', () => {
        const handler = getSearchOnClickClose(baseFilters, mockSetFilters, searchTagList);
        handler({} as SyntheticEvent, '', { name: 'Open', id: 1 } as any);
        expect(mockSetFilters).toHaveBeenCalledWith({
            ...baseFilters,
            status: ['Closed'],
        });
    });

    it('removes priority filter when category is Priority (from closeObj)', () => {
        const handler = getSearchOnClickClose(baseFilters, mockSetFilters, searchTagList);
        handler({} as SyntheticEvent, '', { name: 'High', id: 2, categoryName: 'Priority' } as any);
        expect(mockSetFilters).toHaveBeenCalledWith({
            ...baseFilters,
            priority: ['Low'],
        });
    });

    it('removes priority filter when category is Priority (from searchTagList)', () => {
        const handler = getSearchOnClickClose(baseFilters, mockSetFilters, searchTagList);
        handler({} as SyntheticEvent, '', { name: 'High', id: 2 } as any);
        expect(mockSetFilters).toHaveBeenCalledWith({
            ...baseFilters,
            priority: ['Low'],
        });
    });

    it('removes startDate and endDate when category is Date (from closeObj)', () => {
        const handler = getSearchOnClickClose(baseFilters, mockSetFilters, searchTagList);
        handler({} as SyntheticEvent, '', { name: 'Date', id: 3, categoryName: 'Date' } as any);
        expect(mockSetFilters).toHaveBeenCalledWith({
            status: ['Open', 'Closed'],
            priority: ['High', 'Low'],
        });
    });

    it('removes startDate and endDate when category is Date (from searchTagList)', () => {
        const handler = getSearchOnClickClose(baseFilters, mockSetFilters, searchTagList);
        handler({} as SyntheticEvent, '', { name: 'Date', id: 3 } as any);
        expect(mockSetFilters).toHaveBeenCalledWith({
            status: ['Open', 'Closed'],
            priority: ['High', 'Low'],
        });
    });

    it('does nothing if category is not found', () => {
        const handler = getSearchOnClickClose(baseFilters, mockSetFilters, searchTagList);
        handler({} as SyntheticEvent, '', { name: 'Other' } as any);
        expect(mockSetFilters).toHaveBeenCalled();
    });
});
