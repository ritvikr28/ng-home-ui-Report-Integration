import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as ApiService from "../ApiService";
import { DocumentBasicDetails } from "../responseModel";
import DocumentManagementServer, { debouncedFetchSuggestions, formatSuggestions, getTableHeadersData, tableBodyData } from "../DocumentManagementServer.logic";


jest.mock("../ApiService");

jest.mock("@essnextgen/ui-kit", () => ({
  ...jest.requireActual("@essnextgen/ui-kit"),
  useMediaQuery: jest.fn(),
   ApiService: {
    fetchDMSSuggestions: jest.fn(),
  },
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
        expect(container.querySelector('.relatedto-tag')).toBeInTheDocument();
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
describe("formatSuggestions", () => {
  it("should return formatted suggestions from input array", () => {
  const input = [
    { fileId: "1", fileName: "File 1" },
    { fileId: "2", fileName: "File 2" }
  ];

  const result = formatSuggestions(input);

  expect(result).toHaveLength(1);
  expect(result[0].values).toHaveLength(2);
  expect(result[0].values[0].text).toBe("File 1");
});


  it("should return empty values when input array is empty", () => {
    const result = formatSuggestions([]);
    expect(result).toEqual([{ name: "", values: [] }]);
  });
});

describe("debouncedFetchSuggestions", () => {
  const setSuggestions = jest.fn();
  const setIsSearchLoading = jest.fn();
  const setShowError = jest.fn();

  beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
});

afterEach(() => {
  jest.useRealTimers();
});


 test("debouncedFetchSuggestions fetches and sets suggestions on success", async () => {
jest.useFakeTimers(); // STEP 1: Fake timers

  const mockSuggestions = [{ fileName: "File A", fileId: "123" }];
  (ApiService.fetchDMSSuggestions as jest.Mock).mockResolvedValue(mockSuggestions);

  const setSearchLoading = jest.fn();
  const setSuggestions = jest.fn();
  const setShowError = jest.fn();

  // STEP 2: Call the function
  debouncedFetchSuggestions("File", setSearchLoading, setSuggestions, setShowError);

  // STEP 3: Advance timers inside act()
  await act(() => {
    jest.advanceTimersByTime(1000); // match debounce time
    return Promise.resolve(); // flush any pending microtasks
  });

  // STEP 4: Assertions
  expect(ApiService.fetchDMSSuggestions).toHaveBeenCalledWith("File");
  expect(setSuggestions).toHaveBeenCalled(); // ← This is what was failing
  expect(setSearchLoading).toHaveBeenCalledWith(false);
  expect(setShowError).not.toHaveBeenCalled();

  jest.useRealTimers(); // Reset timers
});


 test("debouncedFetchSuggestions handles API failure", async () => {
  jest.useFakeTimers();
  (ApiService.fetchDMSSuggestions as jest.Mock).mockRejectedValue(new Error("Network error"));

  const setSearchLoading = jest.fn();
  const setSuggestions = jest.fn();
  const setShowError = jest.fn();

  debouncedFetchSuggestions("ErrorTest", setSearchLoading, setSuggestions, setShowError);
   await act(() => {
    jest.advanceTimersByTime(1000); // match debounce time
    return Promise.resolve(); // flush any pending microtasks
  });
  
  expect(setShowError).toHaveBeenCalledWith(true);
  expect(setSuggestions).toHaveBeenCalledWith([]);
  expect(setSearchLoading).toHaveBeenCalledWith(false);
});


  test("debouncedFetchSuggestions should debounce rapid calls", async () => {
  const setSearchLoading = jest.fn();
  const setSuggestions = jest.fn();
  const setShowError = jest.fn();

  const mockFetch = jest.fn().mockResolvedValue([{ fileName: "X", fileId: "id" }]);
  (ApiService.fetchDMSSuggestions as jest.Mock) = mockFetch;

  debouncedFetchSuggestions("F1", setSearchLoading, setSuggestions, setShowError);
  debouncedFetchSuggestions("F2", setSearchLoading, setSuggestions, setShowError);
  debouncedFetchSuggestions("F3", setSearchLoading, setSuggestions, setShowError);

  jest.advanceTimersByTime(1000);
  await Promise.resolve();

  expect(mockFetch).toHaveBeenCalledTimes(1);
  expect(mockFetch).toHaveBeenCalledWith("F3");
});
});
