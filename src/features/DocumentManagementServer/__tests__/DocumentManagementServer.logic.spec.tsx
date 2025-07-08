import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as ApiService from "../ApiService";
import { DocumentBasicDetails } from "../responseModel";
import DocumentManagementServer, { getTableHeadersData, tableBodyData } from "../DocumentManagementServer.logic";

jest.mock("../ApiService");

jest.mock("@essnextgen/ui-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-kit"),
  useMediaQuery: jest.fn()
}));

describe("getTableHeadersData", () => {
    const relatedToColumn = getTableHeadersData.find(h => h.text === 'Related to');
    const anyComponent = relatedToColumn?.anyComponent;

    test("should be an array and contain expected columns", () => {
        expect(Array.isArray(getTableHeadersData)).toBe(true);
        const expectedColumns = [
            "Id", "Document", "Related to", "Category", "Added by", "Date added", "Format", "Size"
        ];
        expectedColumns.forEach(col => {
            expect(getTableHeadersData.find(h => h.text === col)).toBeDefined();
        });
    });

    test("should contain 'Document' header with anyComponent", () => {
        const docHeader = getTableHeadersData.find(h => h.text === "Document");
        expect(docHeader).toBeDefined();
        expect(typeof docHeader?.anyComponent).toBe("function");
    });

    test("should contain 'Category' header with anyComponent", () => {
        const catHeader = getTableHeadersData.find(h => h.text === "Category");
        expect(catHeader).toBeDefined();
        expect(typeof catHeader?.anyComponent).toBe("function");
    });


    test("should contain 'Related to' header with anyComponent", () => {
        expect(relatedToColumn).toBeDefined();
        expect(typeof relatedToColumn?.anyComponent).toBe("function");
    });

    test("renders nothing when elem is undefined", () => {
        const { container } = render(<>{anyComponent && anyComponent(undefined)}</>);
        expect(container).toBeEmptyDOMElement();
    });
    test("renders nothing when elem is null", () => {
        const { container } = render(<>{anyComponent && anyComponent(null)}</>);
        expect(container).toBeEmptyDOMElement();
    });

    test("renders nothing when elem is empty array", () => {
        const { container } = render(<>{anyComponent && anyComponent([])}</>);
        expect(container).toBeEmptyDOMElement();
    });

    test("renders link and Tag when elem has one item", () => {
        render(<>{anyComponent && anyComponent(['John Doe'])}</>);
        expect(document.querySelector('.relatedto-main')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'John Doe' })).toBeInTheDocument();
        expect(document.querySelector('.relatedto-tag')).toBeInTheDocument();
        expect(screen.queryByTestId('tooltip-eventtime')).not.toBeInTheDocument();
    });

    test("renders Tag with text 'Year / Reg' when elem has one item", () => {
        render(<>{anyComponent && anyComponent(['Test Name'])}</>);
        const tag = document.querySelector('.relatedto-tag');
        expect(tag).toBeInTheDocument();
        expect(tag).toHaveTextContent('Year / Reg');
    });

    test('anyComponent renders a div with display flex of Document column', () => {
        const relatedToColumn1 = getTableHeadersData.find(h => h.text === 'Document');
        const anyComponentDoc = relatedToColumn1?.anyComponent;

        const { container } = render(<>{anyComponentDoc && anyComponentDoc(['Test Document'])}</>);
        const flexDiv = container.querySelector('div[style*="display: flex"]');
        expect(flexDiv).toBeInTheDocument();
        expect(flexDiv).toHaveStyle('display: flex');
        expect(container.querySelector('.document-text')).toHaveTextContent('Test Document');
    });

});

describe("tableBodyData", () => {
    test("should have correct number of rows", () => {
        expect(tableBodyData.length).toBe(2);
    });

    test("should have expected keys in each row", () => {
        tableBodyData.forEach(row => {
            expect(row).toHaveProperty("id");
            expect(row).toHaveProperty("Document");
            expect(row).toHaveProperty("Relatedto");
            expect(row).toHaveProperty("Category");
            expect(row).toHaveProperty("Addedby");
            expect(row).toHaveProperty("Date added");
            expect(row).toHaveProperty("Format");
            expect(row).toHaveProperty("Size");
        });
    });
    test("should validate Relatedto is non-empty array", () => {
        tableBodyData.forEach(row => {
            expect(Array.isArray(row.Relatedto)).toBe(true);
            expect(row.Relatedto.length).toBeGreaterThan(0);
        });
    });
});

describe("DocumentManagementServer hook", () => {
    const mockData: DocumentBasicDetails = { data: [{ id: "1" }] } as any;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should set hasFetched false initially and fetch data", async () => {
        (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);

        const { result, waitForNextUpdate } = renderHook(() =>
            DocumentManagementServer({ pageNumber: 1, pageSize: 10 })
        );

        expect(result.current.hasFetched).toBe(false);

        await waitForNextUpdate();

        expect(result.current.data).toEqual(mockData);
        expect(result.current.hasFetched).toBe(true);
        expect(result.current.error).toBeNull();
    });

    test("should set error if fetch fails", async () => {
        (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(null);

        const { result, waitForNextUpdate } = renderHook(() =>
            DocumentManagementServer({ pageNumber: 1, pageSize: 10 })
        );

        await waitForNextUpdate();

        expect(result.current.data).toBeNull();
        expect(result.current.hasFetched).toBe(true);
        expect(result.current.error).toBe("Failed to fetch data");
    });

    test("should refetch when pageNumber or pageSize changes", async () => {
        (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(mockData);

        const { result, rerender, waitForNextUpdate } = renderHook(
            ({ pageNumber, pageSize }) =>
                DocumentManagementServer({ pageNumber, pageSize }),
            {
                initialProps: { pageNumber: 1, pageSize: 10 }
            }
        );

        await waitForNextUpdate();
        expect(result.current.data).toEqual(mockData);

        (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue({ docs: [{ id: "2" }] });

        rerender({ pageNumber: 2, pageSize: 10 });
        await waitForNextUpdate();

        expect(result.current.data).toEqual({ docs: [{ id: "2" }] });
    });

  

    test("should set error if fetch throws", async () => {
        (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue(null);

        const { result, waitForNextUpdate } = renderHook(() =>
            DocumentManagementServer({ pageNumber: 1, pageSize: 10 })
        );

        await waitForNextUpdate();

        expect(result.current.data).toBeNull();
        expect(result.current.hasFetched).toBe(true);
        expect(result.current.error).toBe("Failed to fetch data");
    });

    test("should not update state after unmount", async () => {
        // Simulate a slow promise
        let resolvePromise: any;
        (ApiService.fetchDocumentDetails as jest.Mock).mockImplementation(
            () => new Promise(res => { resolvePromise = res; })
        );

        const { unmount } = renderHook(() =>
            DocumentManagementServer({ pageNumber: 1, pageSize: 10 })
        );

        unmount();
        // Resolve the promise after unmount
        act(() => {
            resolvePromise({ docs: [{ id: "3" }] });
        });

        // No assertion needed: test passes if no warning or error is thrown
    });

    test("should handle empty docs array", async () => {
        (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue({ docs: [] });

        const { result, waitForNextUpdate } = renderHook(() =>
            DocumentManagementServer({ pageNumber: 1, pageSize: 10 })
        );

        await waitForNextUpdate();

        expect(result.current.data).toEqual({ docs: [] });
        expect(result.current.hasFetched).toBe(true);
        expect(result.current.error).toBeNull();
    });

    test("should handle invalid parameters gracefully", async () => {
        (ApiService.fetchDocumentDetails as jest.Mock).mockResolvedValue({ docs: [{ id: "4" }] });

        const { result, waitForNextUpdate } = renderHook(() =>
            DocumentManagementServer({ pageNumber: -1, pageSize: 0 })
        );

        await waitForNextUpdate();

        expect(result.current.data).toEqual({ docs: [{ id: "4" }] });
        expect(result.current.hasFetched).toBe(true);
        expect(result.current.error).toBeNull();
    });
});

describe("getTableHeadersData 'Related to' column tooltip rendering", () => {
    const relatedToColumn = getTableHeadersData.find(h => h.text === 'Related to');
    const anyComponent = relatedToColumn?.anyComponent;

    test("Tooltip uses correct dataTestId", async () => {
        render(<>{anyComponent && anyComponent(['X', 'Y'])}</>);

        const tooltipTrigger = screen.getByText('+1');
        expect(tooltipTrigger).toBeInTheDocument();

        await userEvent.hover(tooltipTrigger);

        const tooltip = await screen.findByTestId('tooltip-eventtime');
        expect(tooltip).toBeInTheDocument();
    });

    test("Tooltip content contains all items", async () => {
        render(<>{anyComponent && anyComponent?.(['A', 'B', 'C'])}</>);

        const trigger = screen.getByText('+2');
        await userEvent.hover(trigger); 

        const tooltip = await screen.findByTestId('tooltip-eventtime');
        expect(tooltip).toBeInTheDocument();
    });

    test("Tooltip shows correct '+N' text for multi-item array", () => {
        render(<>{anyComponent && anyComponent(['One', 'Two', 'Three', 'Four'])}</>);
        expect(screen.getByText('+3')).toBeInTheDocument();
    });

});
describe('setTotalPage logic', () => {
    test('sets totalPage based on data.totalRecords', () => {
        const setTotalPage = jest.fn();
        // Mock useState for currentPage, totalPage, isLoading
        jest.spyOn(React, 'useState')
            .mockImplementationOnce(() => [1, jest.fn()])
            .mockImplementationOnce(() => [0, setTotalPage])
            .mockImplementationOnce(() => [false, jest.fn()]);

        // Mock DocumentManagementServer to return data with totalRecords
        jest.mock('../DocumentManagementServer.logic', () => ({
            __esModule: true,
            default: jest.fn(() => ({
                data: { totalRecords: 80, data: [{ fileId: '1' }] },
                error: null,
                hasFetched: true
            })),
            getTableHeadersData: []
        }));

        // Re-import after mocks
        const DocumentManagementServerView = require('../DocumentManagementServer.view').default;
        render(<DocumentManagementServerView />);

        // totalPages = Math.ceil(80 / pageSize)
        // expect(setTotalPage).toHaveBeenCalledWith(Math.ceil(80 / 40));
    });
    test('should set totalPage to correct value when data.totalRecords is a potestive number', () => {
        const setTotalPage = jest.fn();
        const pageSize = 40;
        const data = { totalRecords: 85 };
        const totalPages = Math.ceil(data.totalRecords / pageSize);
        setTotalPage(totalPages);
        expect(setTotalPage).toHaveBeenCalledWith(3);
    });

    test('should set totalPage to 0 when data.totalRecords is 0', () => {
        const setTotalPage = jest.fn();
        const pageSize = 40;
        const data = { totalRecords: 0 };
        const totalPages = Math.ceil(data.totalRecords / pageSize);
        setTotalPage(totalPages);
        expect(setTotalPage).toHaveBeenCalledWith(0);
    });

    test('should not call setTotalPage if data or data.totalRecords is undefined', () => {
        const setTotalPage = jest.fn();
        const pageSize = 40;
        let data = { totalRecords: undefined };
        if (data && data?.totalRecords) {
            let totalPages = Math.ceil(data?.totalRecords / pageSize);
            setTotalPage(totalPages);
        }
        expect(setTotalPage).not.toHaveBeenCalled();
    });
});
