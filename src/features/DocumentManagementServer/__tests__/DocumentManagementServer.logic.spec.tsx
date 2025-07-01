import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import DocumentManagementServer from "../DocumentManagementServer.logic";
import * as ApiService from "../ApiService";
import { DocumentBasicDetails } from "../responseModel";
import { getTableHeadersData, tableBodyData } from "../DocumentManagementServer.logic";
import { fireEvent, render, screen } from "@testing-library/react";

// Mock fetchDocumentDetails
jest.mock("../ApiService");

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

    test("should contain 'Related to' header with anyComponent", () => {
        expect(relatedToColumn).toBeDefined();
        expect(typeof relatedToColumn?.anyComponent).toBe("function");
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
        const relatedToColumn = getTableHeadersData.find(h => h.text === 'Related to');
        const anyComponent = relatedToColumn?.anyComponent;
        render(<>{anyComponent && anyComponent(['Test Name'])}</>);
        const tag = document.querySelector('.relatedto-tag');
        expect(tag).toBeInTheDocument();
        expect(tag).toHaveTextContent('Year / Reg');
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
    const mockData: DocumentBasicDetails = { docs: [{ id: "1" }] } as any;

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
});
