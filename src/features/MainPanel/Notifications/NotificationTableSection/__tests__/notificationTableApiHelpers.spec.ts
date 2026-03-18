import React from 'react';
import {
    shouldFetchTableData,
    isShowdynamictableNoMsg,
    fetchSearchAutoSuggestData,
    fetchNotificationTableData
} from '../notificationTableApiHelpers';
import * as api from "../../../../../shared/services/notification/api"; // Ensure this path is correct or adjust it to the correct module location
import * as useNotificationModule from '../../useNotification';

describe('notificationTableApiHelpers', () => {
    describe('shouldFetchTableData', () => {
        it('returns true if side is not open', () => {
            expect(shouldFetchTableData({ sideIsOpen: false, hasSearch: false, searchCleared: false })).toBe(true);
        });
        it('returns true if hasSearch is true', () => {
            expect(shouldFetchTableData({ sideIsOpen: true, hasSearch: true, searchCleared: false })).toBe(true);
        });
        it('returns true if searchCleared is true', () => {
            expect(shouldFetchTableData({ sideIsOpen: true, hasSearch: false, searchCleared: true })).toBe(true);
        });
        it('returns false if all are false and side is open', () => {
            expect(shouldFetchTableData({ sideIsOpen: true, hasSearch: false, searchCleared: false })).toBe(false);
        });
    });

    describe('isShowdynamictableNoMsg', () => {
        it('returns true for totalNotifications 0', () => {
            expect(isShowdynamictableNoMsg({ totalNotifications: 0, noResults: true, isSearching: true, tableDataError: false })).toBe(true);
        });
        it('returns true for noResults false', () => {
            expect(isShowdynamictableNoMsg({ totalNotifications: 5, noResults: false, isSearching: true, tableDataError: false })).toBe(true);
        });
        it('returns true for isSearching false', () => {
            expect(isShowdynamictableNoMsg({ totalNotifications: 5, noResults: true, isSearching: false, tableDataError: false })).toBe(true);
        });
        it('returns true for tableDataError true', () => {
            expect(isShowdynamictableNoMsg({ totalNotifications: 5, noResults: true, isSearching: true, tableDataError: true })).toBe(true);
        });
        it('returns false for all normal', () => {
            expect(isShowdynamictableNoMsg({ totalNotifications: 5, noResults: true, isSearching: true, tableDataError: false })).toBe(false);
        });
    });

    describe('fetchSearchAutoSuggestData', () => {
        it('sets suggestions when payload is valid', async () => {
            const mockPayload = [{ id: 1, title: 'Sample Title' }];
            jest.spyOn(api, 'getSearchAutoSuggestData').mockResolvedValue({
                errors: null,
                payload: mockPayload,
                status: 200
            });
            const setSuggestionLoader = jest.fn();
            const setSearchSuggestions = jest.fn();
            const mockValues = [
                {
                    text: 'a',
                    props: { externalId: '1', name: 'a' },
                    value: React.createElement('div')
                },
                {
                    text: 'b',
                    props: { externalId: '2', name: 'b' },
                    value: React.createElement('div')
                }
            ];
            jest.spyOn(useNotificationModule, 'getValues').mockReturnValue(mockValues);
            await fetchSearchAutoSuggestData({
                searchTerm: 'Test',
                setSuggestionLoader,
                setSearchSuggestions
            });
            expect(setSuggestionLoader).toHaveBeenCalledWith(true);
            expect(setSuggestionLoader).toHaveBeenCalledWith(false);
            expect(setSearchSuggestions).toHaveBeenCalledWith([
                { name: '', values: mockValues }
            ]);
        });
        it('sets empty suggestions when payload is empty', async () => {
            jest.spyOn(api, 'getSearchAutoSuggestData').mockResolvedValue({
                errors: null,
                payload: [],
                status: 200
            });
            const setSuggestionLoader = jest.fn();
            const setSearchSuggestions = jest.fn();
            await fetchSearchAutoSuggestData({
                searchTerm: 'Test',
                setSuggestionLoader,
                setSearchSuggestions
            });
            expect(setSearchSuggestions).toHaveBeenCalledWith([]);
        });
    });

    describe('fetchNotificationTableData', () => {
        it('sets table data and total when no error', async () => {
            jest.spyOn(api, 'getNotificationTableData').mockResolvedValue({
                payload: [
                    {
                        "id": "1",
                        "body": "This is a sample notification body",
                        "priority": "High",
                        "receivedDate": "2023-10-01",
                        "status": false,
                        "title": "Sample Notification"
                    }
                ],
                status: 200,
                error: false
            });
            const setIsTableBodyLoading = jest.fn();
            const setTableData = jest.fn();
            const setTotalTableData = jest.fn();
            const setTableDataError = jest.fn();
            const setNoResults = jest.fn();
            await fetchNotificationTableData({
                currentPage: 1,
                searchTerm: 'Test',
                sortBy: 'id',
                sortDirection: true,
                setIsTableBodyLoading,
                setTableData,
                setTotalTableData,
                setTableDataError,
                setNoResults
            });
            expect(setIsTableBodyLoading).toHaveBeenCalledWith(true);
            expect(setIsTableBodyLoading).toHaveBeenCalledWith(false);
            expect(setTableData).toHaveBeenCalledWith([{
                "id": "1",
                "body": "This is a sample notification body",
                "priority": "High",
                "receivedDate": "2023-10-01",
                "status": false,
                "title": "Sample Notification"
            }]);
            expect(setTableDataError).toHaveBeenCalledWith(false);
            expect(setNoResults).toHaveBeenCalledWith(false);
        });
        it('sets error and empty table when error', async () => {
            jest.spyOn(api, 'getNotificationTableData').mockResolvedValue({
                payload: [],
                status: 500,
                error: true
            });
            const setIsTableBodyLoading = jest.fn();
            const setTableData = jest.fn();
            const setTotalTableData = jest.fn();
            const setTableDataError = jest.fn();
            const setNoResults = jest.fn();
            await fetchNotificationTableData({
                currentPage: 1,
                searchTerm: 'Test',
                sortBy: 'id',
                sortDirection: true,
                setIsTableBodyLoading,
                setTableData,
                setTotalTableData,
                setTableDataError,
                setNoResults
            });
            expect(setNoResults).toHaveBeenCalledWith(true);
            expect(setTableDataError).toHaveBeenCalledWith(true);
            expect(setTableData).toHaveBeenCalledWith([]);
            expect(setIsTableBodyLoading).toHaveBeenCalledWith(false);
        });
    });
});
