import { getSearchOnClickClose } from "../notificationTableHandlers.view";

jest.mock("@essnextgen/ui-kit", () => ({}));

const mockSetFilters = jest.fn();
const mockEvent = {} as any;

const baseFilters = {
    status: ["Active", "Read"],
    priority: ["High", "Low"],
    startDate: "2024-01-01",
    endDate: "2024-12-31"
};

const searchTagList = [
    { text: "Active", categoryName: "Status", closeObj: { name: "Active", id: 1 } },
    { text: "High", categoryName: "Priority", closeObj: { name: "High", id: 2 } },
    { text: "Date Range", categoryName: "Date", closeObj: { name: "dateRange", id: 3 } }
];

beforeEach(() => {
    jest.clearAllMocks();
});

describe("getSearchOnClickClose", () => {
    it("returns early and does not call setFilters when closeObj is falsy", () => {
        const fn = getSearchOnClickClose(baseFilters, mockSetFilters, searchTagList);
        fn(mockEvent, "text", null as any);
        expect(mockSetFilters).not.toHaveBeenCalled();
    });

    it("returns early and does not call setFilters when filters is undefined", () => {
        const fn = getSearchOnClickClose(undefined, mockSetFilters, searchTagList);
        fn(mockEvent, "text", { name: "Active" } as any);
        expect(mockSetFilters).not.toHaveBeenCalled();
    });

    it("resolves category from closeObj.categoryName directly (truthy path)", () => {
        const closeObj = { name: "Active", categoryName: "Status" } as any;
        const fn = getSearchOnClickClose(baseFilters, mockSetFilters, []);
        fn(mockEvent, "text", closeObj);
        expect(mockSetFilters).toHaveBeenCalledWith({
            ...baseFilters,
            status: ["Read"]
        });
    });

    it("resolves category from searchTagList fallback when closeObj.categoryName is falsy", () => {
        const closeObj = { name: "Active" } as any;
        const fn = getSearchOnClickClose(baseFilters, mockSetFilters, searchTagList);
        fn(mockEvent, "text", closeObj);
        expect(mockSetFilters).toHaveBeenCalledWith({
            ...baseFilters,
            status: ["Read"]
        });
    });

    it("calls setFilters with unchanged updated when category is unknown (no match in map)", () => {
        const closeObj = { name: "NoMatch" } as any;
        const fn = getSearchOnClickClose(baseFilters, mockSetFilters, []);
        fn(mockEvent, "text", closeObj);
        expect(mockSetFilters).toHaveBeenCalledWith({ ...baseFilters });
    });

    it("Status: filters out the matching status item from filters.status", () => {
        const closeObj = { name: "read", categoryName: "Status" } as any;
        const fn = getSearchOnClickClose(baseFilters, mockSetFilters, searchTagList);
        fn(mockEvent, "text", closeObj);
        expect(mockSetFilters).toHaveBeenCalledWith({
            ...baseFilters,
            status: ["Active"]
        });
    });

    it("Status: uses empty array when filters.status is undefined", () => {
        const filtersNoStatus = { priority: ["High"], startDate: "2024-01-01", endDate: "2024-12-31" };
        const closeObj = { name: "Active", categoryName: "Status" } as any;
        const fn = getSearchOnClickClose(filtersNoStatus as any, mockSetFilters, searchTagList);
        fn(mockEvent, "text", closeObj);
        expect(mockSetFilters).toHaveBeenCalledWith({
            ...filtersNoStatus,
            status: []
        });
    });

    it("Priority: filters out the matching priority item from filters.priority", () => {
        const closeObj = { name: "High", categoryName: "Priority" } as any;
        const fn = getSearchOnClickClose(baseFilters, mockSetFilters, searchTagList);
        fn(mockEvent, "text", closeObj);
        expect(mockSetFilters).toHaveBeenCalledWith({
            ...baseFilters,
            priority: ["Low"]
        });
    });

    it("Priority: uses empty array when filters.priority is undefined", () => {
        const filtersNoPriority = { status: ["Active"], startDate: "2024-01-01", endDate: "2024-12-31" };
        const closeObj = { name: "High", categoryName: "Priority" } as any;
        const fn = getSearchOnClickClose(filtersNoPriority as any, mockSetFilters, searchTagList);
        fn(mockEvent, "text", closeObj);
        expect(mockSetFilters).toHaveBeenCalledWith({
            ...filtersNoPriority,
            priority: []
        });
    });

    it("Date: deletes startDate and endDate from updated filters", () => {
        const closeObj = { name: "dateRange", categoryName: "Date" } as any;
        const fn = getSearchOnClickClose(baseFilters, mockSetFilters, searchTagList);
        fn(mockEvent, "text", closeObj);
        const result = mockSetFilters.mock.calls[0][0];
        expect(result).not.toHaveProperty("startDate");
        expect(result).not.toHaveProperty("endDate");
        expect(result.status).toEqual(baseFilters.status);
        expect(result.priority).toEqual(baseFilters.priority);
    });
});
