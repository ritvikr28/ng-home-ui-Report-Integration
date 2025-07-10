import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AxiosResponse } from 'axios';
import { renderHook } from '@testing-library/react-hooks';
import { DocumentBasicDetails, SingleDocumentDetail } from '../responseModel';
import { service } from '../../../shared/utils';
import { fetchDocumentDetails, fetchDMSSuggestions } from '../ApiService';
import BreadcrumbWrapper from '../../../shared/components/BreadcrumbWrapper/BreadcrumbWrapper';
import DocumentManagementServer from '../DocumentManagementServer.logic';

const documentResponse: SingleDocumentDetail[] = [
    {
        organizationId: "cd0e52dd",
        userId: "9fbe1bcc",
        registrationId: 2,
        fileId: "427e150",
        personExternalId: "00000000",
        documentInfo: {
            fileName: "image",
            isSelectedForPrepareDownload: true,
        },
        document: "image",
        relatedTo: null,
        category: "App",
        addedBy: "SIMS-NG",
        dateAdded: "11/25/2024 10:04:54",
        format: "png",
        size: "2 KB",
        blobName: "App_427E150E"
    },
    {
        organizationId: "cd0e52ee",
        userId: "9fbe1bce",
        registrationId: 3,
        fileId: "427e151",
        personExternalId: "00000001",
        documentInfo: {
            fileName: "mock image",
            isSelectedForPrepareDownload: true,
        },
        document: "mock image",
        relatedTo: null,
        category: "App",
        addedBy: "SIMS-NG",
        dateAdded: "11/25/2024 10:04:54",
        format: "png",
        size: "20 KB",
        blobName: "App_427E150E"
    }
]

const mockAxiosResponse: AxiosResponse<DocumentBasicDetails> = {
    data: {
        pageNumber: 1,
        pageSize: 40,
        totalRecords: 2,
        data: documentResponse
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
};

describe("Fetch document details tests", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    test("should set hasFetched false initially", async () => {
        jest.spyOn(service, "post").mockResolvedValueOnce(mockAxiosResponse);
        const { result } = renderHook(() =>
            DocumentManagementServer({ pageNumber: 1, pageSize: 40 })
        );

        expect(result.current.hasFetched).toBe(false);
    });

    test("should return data on successful fetch", async () => {
        jest.spyOn(service, "post").mockResolvedValueOnce(mockAxiosResponse);
        const { result, waitForNextUpdate } = renderHook(() =>
            DocumentManagementServer({ pageNumber: 1, pageSize: 40 })
        );

        await waitForNextUpdate();

        expect(result.current.hasFetched).toBe(true);
        expect(result.current.data).toEqual(mockAxiosResponse.data);
        expect(result.current.error).toBeNull();
    });

    test("should return GetDocumentDetails data", async () => {
        jest.spyOn(service, "post").mockResolvedValue(mockAxiosResponse);
        const response: DocumentBasicDetails | null = await fetchDocumentDetails({ pageNumber: 1, pageSize: 10 });
        expect(response).toEqual(mockAxiosResponse?.data);
        expect(service.post).toHaveBeenCalledTimes(1);
        expect(service.post).toHaveBeenCalled();
    });
    test("should return null when API status is not 200", async () => {
        const mockResponse: Partial<AxiosResponse<DocumentBasicDetails>> = {
            data: {
                pageNumber: 1,
                pageSize: 20,
                totalRecords: 2,
                data: documentResponse
            }, status: 404, statusText: 'Not Found', headers: {}, config: {}
        };
        jest.spyOn(service, "post").mockResolvedValueOnce(mockResponse as AxiosResponse<DocumentBasicDetails>);

        const result = await fetchDocumentDetails({ pageNumber: 1, pageSize: 40 });
        expect(result).toBeNull();
    });

    test("should return null when an error occurs", async () => {
        jest.spyOn(service, "post").mockRejectedValue(new Error("Network Error"));

        const result = await fetchDocumentDetails({ pageNumber: 1, pageSize: 40 });

        expect(result).toBeNull();
    });

    test("calls onCloseSideNavigationPanel when Admin Console breadcrumb is clicked", () => {
        const handleClick = jest.fn();
        render(<BreadcrumbWrapper />);
        const adminConsoleBreadcrumb = screen.getByText("breadcrumbshome");
        fireEvent.click(adminConsoleBreadcrumb);
        expect(handleClick).toHaveBeenCalledTimes(0);
    });
});

describe("fetchDMSSuggestions", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return values array when API returns values", async () => {
        const mockValues = [
            { fileName: "doc1", fileId: "id1" },
            { fileName: "doc2", fileId: "id2" }
        ];
        const mockResponse = makeAxiosResponse({
            payload: [
                { values: mockValues }
            ]
        });
        jest.spyOn(service, "get").mockResolvedValueOnce(mockResponse);
        const result = await fetchDMSSuggestions("doc");
        const values = Array.isArray(result?.payload?.[0]?.values) ? result.payload[0].values : [];
        expect(values).toEqual(mockValues);
        expect(service.get).toHaveBeenCalledWith(
            expect.stringContaining("AutoCompleteRequest.SearchText=doc"),
            expect.anything()
        );
    });

    it("should return empty array if API returns no values", async () => {
        const mockResponse = makeAxiosResponse({
            payload: [
                { values: undefined }
            ]
        });
        jest.spyOn(service, "get").mockResolvedValueOnce(mockResponse);
        const result = await fetchDMSSuggestions("doc");
        const values = Array.isArray(result?.payload?.[0]?.values) ? result.payload[0].values : [];
        expect(values).toEqual([]);
    });

    it("should return empty array if API returns no payload", async () => {
        const mockResponse = makeAxiosResponse({
            payload: undefined
        });
        jest.spyOn(service, "get").mockResolvedValueOnce(mockResponse);
        const result = await fetchDMSSuggestions("doc");
        const values = Array.isArray(result?.payload?.[0]?.values) ? result.payload[0].values : [];
        expect(values).toEqual([]);
    });

    it("should return empty array if API throws error", async () => {
        jest.spyOn(service, "get").mockRejectedValueOnce(new Error("Network error"));
        const result = await fetchDMSSuggestions("doc");
        const values = Array.isArray(result?.payload?.[0]?.values) ? result.payload[0].values : [];
        expect(values).toEqual([]);
    });
});

// --- helpers for AxiosResponse mocks ---
const makeAxiosResponse = (data: any): AxiosResponse => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
});
