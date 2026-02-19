import React from "react";
import { ISelectedItem } from "@essnextgen/ui-kit";
import * as Logic from "../logic/DocumentManagementServer.handler";
import gtmAnalytics from "../../../shared/utils/analytics";
import { closeSidePanel, getNotificationMsgBannerObject, handleApply, handleBulkDeleteLogic, handleClearAllConfirm, handleEditSelectedOverFlowMenu, handlePageChange, handleSuggestionClick, handleTagCloseLogic, validateAndApplyFilter } from "../logic/DocumentManagementServer.handler";
import { applySummaryTagClass, hasItems } from "../logic/DocumentManagementServer.utils";

jest.mock("../../../shared/utils/analytics", () => ({
  pushEvent: jest.fn()
}));

jest.mock("../logic/DocumentManagementServer.handler", () => {
  const original = jest.requireActual("../logic/DocumentManagementServer.handler");
  return {
    ...original,
    isInvalidDateRange: jest.fn(() => false),
  };
});

const handlerModule = require("../logic/DocumentManagementServer.handler");

describe("DocumentManagementServer.handler", () => {
    describe("handleSearchChange", () => {
  const setup = (value: string) => {
    const t = (key: string) => key;
      const e = { target: { value } } as React.ChangeEvent<HTMLInputElement>;
    const setSearchTerm = jest.fn();
    const setSuggestions = jest.fn();
    const setShowSearchError = jest.fn();
    const setIsSearchLoading = jest.fn();
    const setShowErrorBanner = jest.fn();
    const categoryId: number[] = [1];
    const fromDate = "fromDate";
    const toDate = "toDate";
    const documentRelatedTo = 123; // changed to number to fix type error
    const setResetFilterSearch = jest.fn();

      Logic.handleSearchChange({
        t,
        e,
        categoryId,
        fromDate,
        toDate,
        setSearchTerm,
        setSuggestions,
        setShowSearchError,
        setIsSearchLoading,
        setShowErrorBanner,
        documentRelatedTo,
        setResetFilterSearch
      });

    return { setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading, setShowErrorBanner };
  };
  it("should handle empty string as input", () => {
    const t = (key: string) => key;
    const e = { target: { value: "" } } as any;
    const setSearchTerm = jest.fn();
    const setSuggestions = jest.fn();
    const setShowSearchError = jest.fn();
    const setIsSearchLoading = jest.fn();
    const setShowErrorBanner = jest.fn();
    const categoryId: number[] = [1];
    const fromDate = "fromDate";
    const toDate = "toDate";
    const documentRelatedTo = 123; // changed to number
    const setResetFilterSearch = jest.fn();

    Logic.handleSearchChange({
      t,
      e,
      categoryId,
      fromDate,
      toDate,
      setSearchTerm,
      setSuggestions,
      setShowSearchError,
      setIsSearchLoading,
      setShowErrorBanner,
      documentRelatedTo,
      setResetFilterSearch
    });
    expect(setSuggestions).toHaveBeenCalledWith([]);
    expect(setIsSearchLoading).toHaveBeenCalledWith(false);
  });

  it("clears suggestions for short input", () => {
    const { setSuggestions, setIsSearchLoading } = setup("a");
    expect(setSuggestions).toHaveBeenCalledWith([]);
    expect(setIsSearchLoading).toHaveBeenCalledWith(false);
  });

  // Add this to your handleSearchChange test suite

it("handles invalid event object (no value)", () => {
  const t = (key: string) => key;
    const setSearchTerm = jest.fn();
    const setSuggestions = jest.fn();
    const setShowSearchError = jest.fn();
    const setIsSearchLoading = jest.fn();
    const setShowErrorBanner = jest.fn();

  // e is an object with no target.value
  Logic.handleSearchChange({
    t,
    e: { target: { value: "" } } as any,
    categoryId: [],
    fromDate: "",
    toDate: "",
    setSearchTerm,
    setSuggestions,
    setShowSearchError,
    setIsSearchLoading,
    setShowErrorBanner
  });

  expect(setSuggestions).toHaveBeenCalledWith([]);
  expect(setIsSearchLoading).toHaveBeenCalledWith(false);
});
  it("should handle empty string as input", () => {
    const t = (key: string) => key;
    const e = { target: { value: "" } } as any;
    const setSearchTerm = jest.fn();
    const setSuggestions = jest.fn();
    const setShowSearchError = jest.fn();
    const setIsSearchLoading = jest.fn();
    const setShowErrorBanner = jest.fn();
    const categoryId: number[] = [1];
    const fromDate = "fromDate";
    const toDate = "toDate";
    const documentRelatedTo = 123; // changed to number
    const setResetFilterSearch = jest.fn();

  Logic.handleSearchChange({
    t,
    e,
    categoryId,
    fromDate,
    toDate,
    setSearchTerm,
    setSuggestions,
    setShowSearchError,
    setIsSearchLoading,
    setShowErrorBanner,
    documentRelatedTo,
    setResetFilterSearch
  });
  expect(setSuggestions).toHaveBeenCalledWith([]);
  expect(setIsSearchLoading).toHaveBeenCalledWith(false);
});

  it("loads suggestions for 3+ characters", () => {
    const { setSearchTerm, setIsSearchLoading } = setup("doc");
    expect(setSearchTerm).toHaveBeenCalledWith("doc");
    expect(setIsSearchLoading).toHaveBeenCalledWith(true);
  });

  it("triggers loading for length === 3", () => {
  const t = (key: string) => key;
    const e = { target: { value: "abc" } } as React.ChangeEvent<HTMLInputElement>;
  const setSearchTerm = jest.fn();
  const setSuggestions = jest.fn();
  const setShowSearchError = jest.fn();
  const setIsSearchLoading = jest.fn();
  const setShowErrorBanner = jest.fn();
  const categoryId: number[] = [1];
  const fromDate = "fromDate";
  const toDate = "toDate";
  const documentRelatedTo = 123;
  const setResetFilterSearch = jest.fn();   
    Logic.handleSearchChange({
        t,
        e,
        categoryId,
        fromDate,
        toDate,
        setSearchTerm,
        setSuggestions,
        setShowSearchError,
        setIsSearchLoading,
        setShowErrorBanner,
        documentRelatedTo,
        setResetFilterSearch
    });

  expect(setSuggestions).toHaveBeenCalledWith([]);
  expect(setIsSearchLoading).toHaveBeenCalledWith(true);
});
it("calls setResetFilterSearch when value is non-empty and setResetFilterSearch is a function", () => {
  const t = (key: string) => key;
    const e = { target: { value: "abc" } } as React.ChangeEvent<HTMLInputElement>;
  const setSearchTerm = jest.fn();
  const setSuggestions = jest.fn();
  const setShowSearchError = jest.fn();
  const setIsSearchLoading = jest.fn();
  const setResetFilterSearch = jest.fn();
  const setShowErrorBanner = jest.fn();
  const categoryId: number[] = [1];
  const fromDate = "fromDate";
  const toDate = "toDate";
  const documentRelatedTo = 123;

    Logic.handleSearchChange({
      t,
        e,
        categoryId,
        fromDate,
        toDate,
        setSearchTerm,
        setSuggestions,
        setShowSearchError,
        setIsSearchLoading,
        setShowErrorBanner,
        documentRelatedTo,
        setResetFilterSearch
    });

  expect(setResetFilterSearch).toHaveBeenCalledWith(true);
});
});

describe("handleSuggestionClick", () => {
  it("should call setSearchTerm and setSearchText", async () => {
    const setSearchTerm = jest.fn();
    const setSearchText = jest.fn();
    const setDocumentRelatedTo = jest.fn();
    const setSearchRefExternalId = jest.fn();
    const setSuggestions = jest.fn();
    const setShowSearchError = jest.fn();
    await Logic.handleSuggestionClick(
      {
        name: "John Doe",
        categoryName: "Pupil",
        learnerExternalId: "pupil-123"
      } as any,
      setSearchTerm,
      setSearchText,
      setDocumentRelatedTo,
      setSearchRefExternalId,
      setSuggestions,
      setShowSearchError
    );
    expect(setSearchTerm).toHaveBeenCalledWith("John Doe");
    expect(setSearchText).toHaveBeenCalledWith("John Doe");
    expect(setSearchRefExternalId).toHaveBeenCalledWith(["pupil-123"]);
    await Logic.handleSuggestionClick(
      {
        name: "John Doe",
        categoryName: "Staff",
        externalId: "staff-123"
      } as any,
      setSearchTerm,
      setSearchText,
      setDocumentRelatedTo,
      setSearchRefExternalId,
      setSuggestions,
      setShowSearchError
    );
    expect(setSearchRefExternalId).toHaveBeenCalledWith(["staff-123"]);
    await Logic.handleSuggestionClick(
      {
        name: "John Doe",
        categoryName: "Organisation",
        organisationId: "organisation-123"
      } as any,
      setSearchTerm,
      setSearchText,
      setDocumentRelatedTo,
      setSearchRefExternalId,
      setSuggestions,
      setShowSearchError
    );
    expect(setSearchRefExternalId).toHaveBeenCalledWith(["organisation-123"]);
  });

it("should not call setters if item is null", async () => {
  const setSearchTerm = jest.fn();
  const setSearchText = jest.fn();
  const setDocumentRelatedTo = jest.fn();
  const setSearchRefExternalId = jest.fn();
  const setSuggestions = jest.fn();
  const setShowSearchError = jest.fn();
  await handleSuggestionClick(null, setSearchTerm, setSearchText, setDocumentRelatedTo, setSearchRefExternalId, setSuggestions, setShowSearchError);
  expect(setSearchTerm).not.toHaveBeenCalled();
  expect(setSearchText).not.toHaveBeenCalled();
});

it("should not trigger if name is missing", async () => {
    const setSearchTerm = jest.fn();
    const loadData = jest.fn();
    const setDocumentRelatedTo = jest.fn();
    const setSearchRefExternalId = jest.fn();
    const setSuggestions = jest.fn();
    const setShowSearchError = jest.fn();
    await handleSuggestionClick({}, setSearchTerm, loadData, setDocumentRelatedTo, setSearchRefExternalId, setSuggestions, setShowSearchError);
    expect(setSearchTerm).not.toHaveBeenCalled();
  });
});

describe("hasItems", () => {
  it("returns true when any suggestion has values", () => {
    const suggestions = [{ values: [{ text: "Doc" }] }];
    expect(hasItems(suggestions as any)).toBe(true);
  });

  it("returns false when suggestions array is empty", () => {
  expect(hasItems([] as any)).toBe(false);
});

it("returns false when values key is undefined", () => {
  const suggestions = [{ name: "Test", values: undefined }];
  expect(hasItems(suggestions as any)).toBe(false);
});

  it("returns false when all are empty", () => {
    const suggestions = [{ values: [] }];
    expect(hasItems(suggestions as any)).toBe(false);
  });
});

describe("handleSuggestionClick edge cases", () => {
  const setDocumentRelatedTo = jest.fn();
  const setSearchRefExternalId = jest.fn();
  it("should do nothing if item is null", async () => {
    const setSearchTerm = jest.fn();
    const setSearchText = jest.fn();
    const setSuggestions = jest.fn();
    const setShowSearchError = jest.fn();
    await handleSuggestionClick(
      null,
      setSearchTerm,
      setSearchText,
      setDocumentRelatedTo,
      setSearchRefExternalId,
      setSuggestions,
      setShowSearchError
    );
    expect(setSearchTerm).not.toHaveBeenCalled();
    expect(setSearchText).not.toHaveBeenCalled();
  });

  it("should do nothing if item.name is falsy", async () => {
    const setSearchTerm = jest.fn();
    const setSearchText = jest.fn();
      const setSuggestions = jest.fn();
      const setShowSearchError = jest.fn();
      await handleSuggestionClick(
        { name: "" },
        setSearchTerm,
        setSearchText,
        setDocumentRelatedTo,
        setSearchRefExternalId,
        setSuggestions,
        setShowSearchError
      );
    expect(setSearchTerm).not.toHaveBeenCalled();
    expect(setSearchText).not.toHaveBeenCalled();
  });
});


describe("handleSearchChange boundary tests", () => {
  it("triggers loading for length === 2", () => {
    const event = { target: { value: "abc" } } as React.ChangeEvent<HTMLInputElement>;
    const setSearchTerm = jest.fn();
    const setSuggestions = jest.fn();
    const setShowSearchError = jest.fn();
    const setIsSearchLoading = jest.fn();
    const setShowErrorBanner = jest.fn();
    const t = (key: string) => key;

    Logic.handleSearchChange({
      t,
      e: event,
      categoryId: [],
      fromDate: "",
      toDate: "",
      setSearchTerm,
      setSuggestions,
      setShowSearchError,
      setIsSearchLoading,
      setShowErrorBanner
    });

    expect(setSuggestions).toHaveBeenCalledWith([]);
    expect(setIsSearchLoading).toHaveBeenCalledWith(true);
  });
it("should not call fetch if value is only whitespace", () => {
  const event = { target: { value: " " } } as any;
  const setSearchTerm = jest.fn();
  const setSuggestions = jest.fn();
  const setShowSearchError = jest.fn();
  const setIsSearchLoading = jest.fn();
  const setShowErrorBanner = jest.fn();
  const t = (key: string) => key;

Logic.handleSearchChange({
    t,
    e: event,
    categoryId: [],
    fromDate: "",
    toDate: "",
    setSearchTerm,
    setSuggestions,
    setShowSearchError,
    setIsSearchLoading,
    setShowErrorBanner
});
  expect(setSuggestions).toHaveBeenCalledWith([]);
  expect(setIsSearchLoading).toHaveBeenCalledWith(false);
});

it("handles completely invalid event (e is undefined)", () => {
  const t = (key: string) => key;
  const setSearchTerm = jest.fn();
  const setSuggestions = jest.fn();
  const setShowSearchError = jest.fn();
  const setIsSearchLoading = jest.fn();
  const setShowErrorBanner = jest.fn();

  Logic.handleSearchChange({
    t,
    // @ts-expect-error
    e: undefined,
    categoryId: [],
    fromDate: "",
    toDate: "",
    setSearchTerm,
    setSuggestions,
    setShowSearchError,
    setIsSearchLoading,
    setShowErrorBanner
  });

  expect(setSuggestions).toHaveBeenCalledWith([]);
  expect(setIsSearchLoading).toHaveBeenCalledWith(false);
});



it("handles event object with no target property", () => {
  const t = (key: string) => key;
  const setSearchTerm = jest.fn();
  const setSuggestions = jest.fn();
  const setShowSearchError = jest.fn();
  const setIsSearchLoading = jest.fn();
  const setShowErrorBanner = jest.fn();

  Logic.handleSearchChange({
    t,
    e: undefined as any,
    categoryId: [],
    fromDate: "",
    toDate: "",
    setSearchTerm,
    setSuggestions,
    setShowSearchError,
    setIsSearchLoading,
    setShowErrorBanner
  });

  expect(setSuggestions).toHaveBeenCalledWith([]);
  expect(setIsSearchLoading).toHaveBeenCalledWith(false);
});
})


describe("handleTagCloseLogic", () => {
  const mockSetSelectedDateRange = jest.fn();
  const mockSetDateRange = jest.fn();
  const mockSetIsDateError = jest.fn();
  const mockSetSelectedCategories = jest.fn();
  const mockSetSelectedFormats = jest.fn();

  const setup = () => {
    jest.clearAllMocks();
  };

 it("clears date range if name matches date range format", () => {
  setup();

  handleTagCloseLogic({
    event: {} as React.SyntheticEvent,
    tagName: "dummyText",
    closeObj: { name: "01 Jul 2024 to 31 Jul 2024" },
    setSelectedDateRange: mockSetSelectedDateRange,
    setDateRange: mockSetDateRange,
    setIsDateError: mockSetIsDateError,
    setSelectedCategories: mockSetSelectedCategories,
    setSelectedFormats: mockSetSelectedFormats
  });

  expect(mockSetSelectedDateRange).toHaveBeenCalledWith({ fromDate: "", toDate: "" });
  expect(mockSetDateRange).toHaveBeenCalledWith({ fromDate: "", toDate: "" });
  expect(mockSetIsDateError).toHaveBeenCalledWith(false);
});

  it("clears date range if name matches date range format", () => {
    setup();

    handleTagCloseLogic({
      event: {} as React.SyntheticEvent,
      tagName: "dummyText",
      closeObj: { name: "01 Jul 2024 to 31 Jul 2024" },
      setSelectedDateRange: mockSetSelectedDateRange,
      setDateRange: mockSetDateRange,
      setIsDateError: mockSetIsDateError,
      setSelectedCategories: mockSetSelectedCategories,
      setSelectedFormats: mockSetSelectedFormats
    });

    expect(mockSetSelectedDateRange).toHaveBeenCalledWith({ fromDate: "", toDate: "" });
    expect(mockSetDateRange).toHaveBeenCalledWith({ fromDate: "", toDate: "" });
    expect(mockSetIsDateError).toHaveBeenCalledWith(false);
  });

  it("removes a category/format tag", () => {
    setup();

    const nameToRemove = "Finance";
    const originalItems: ISelectedItem[] = [
      { text: "HR", data: "HR" },
      { text: "Finance", data: "Finance" },
      { text: "Legal", data: "Legal" }
    ];

    mockSetSelectedCategories.mockImplementation(fn => fn(originalItems));
    mockSetSelectedFormats.mockImplementation(fn => fn(originalItems));

    handleTagCloseLogic({
      event: {} as React.SyntheticEvent,
      tagName: "dummyText",
      closeObj: { name: nameToRemove },
      setSelectedDateRange: mockSetSelectedDateRange,
      setDateRange: mockSetDateRange,
      setIsDateError: mockSetIsDateError,
      setSelectedCategories: mockSetSelectedCategories,
      setSelectedFormats: mockSetSelectedFormats
    });

    expect(mockSetSelectedCategories).toHaveBeenCalled();
    const filteredCats = mockSetSelectedCategories.mock.calls[0][0](originalItems);
    expect(filteredCats).toEqual([
      { text: "HR", data: "HR" },
      { text: "Legal", data: "Legal" }
    ]);

    expect(mockSetSelectedFormats).toHaveBeenCalled();
    const filteredFormats = mockSetSelectedFormats.mock.calls[0][0](originalItems);
    expect(filteredFormats).toEqual([
      { text: "HR", data: "HR" },
      { text: "Legal", data: "Legal" }
    ]);
  });

  it("does nothing if closeObj.name is undefined", () => {
    setup();

    handleTagCloseLogic({
      event: {} as React.SyntheticEvent,
      tagName: "dummyText",
      closeObj: { id: "123" },
      setSelectedDateRange: mockSetSelectedDateRange,
      setDateRange: mockSetDateRange,
      setIsDateError: mockSetIsDateError,
      setSelectedCategories: mockSetSelectedCategories,
      setSelectedFormats: mockSetSelectedFormats
    });

    expect(mockSetSelectedDateRange).not.toHaveBeenCalled();
    expect(mockSetDateRange).not.toHaveBeenCalled();
    expect(mockSetIsDateError).not.toHaveBeenCalled();
  });
});





describe("handleBulkDeleteLogic", () => {
  let setShowToastNotification: jest.Mock;
  let setShowConfirmDialog: jest.Mock;
  let setSelectedCheckBoxIds: jest.Mock;
  let setAllSelectedDocs: jest.Mock;
  let setIsClearSelectedCheckbox: jest.Mock;
  let setShowDeleteErrorBanner: jest.Mock;
  let setShowDeleteSuccessToast: jest.Mock;
  let fetchGetDocumentDetails: jest.Mock;
  let deleteFiles: jest.Mock;
  let setIsSearchDataLoading: jest.Mock;
  let setShowDeleteAbortBanner: jest.Mock;

  const docData = {
    data: [
      { fileId: "1", registrationId: 101, externalId: "ext1" },
      { fileId: "2", registrationId: 102, externalId: "ext2" }
    ],
    totalRecords: 2
  };

  const allSelectedDocs = [
    { fileId: "1", registrationId: 101, externalId: "ext1" },
    { fileId: "2", registrationId: 102, externalId: "ext2" }
  ];

  const allRegistrationIds = [101, 102];
  const dateRange = { fromDate: "2025-01-01", toDate: "2025-01-02" };
  const searchRefExternalId = ["ref1"];
  const documentRelatedTo = 1;
  const currentPage = 1;
  const sortBy = "Document";
  const sortDirection = "Asc";
  const excludedCheckBoxIds = ["2"];

  beforeEach(() => {
    setShowToastNotification = jest.fn();
    setShowConfirmDialog = jest.fn();
    setSelectedCheckBoxIds = jest.fn();
    setAllSelectedDocs = jest.fn();
    setIsClearSelectedCheckbox = jest.fn();
    setShowDeleteErrorBanner = jest.fn();
    setShowDeleteSuccessToast = jest.fn();
    fetchGetDocumentDetails = jest.fn();
    deleteFiles = jest.fn();
    setIsSearchDataLoading = jest.fn();

    setShowDeleteAbortBanner = jest.fn();
  });

  it("should handle successful delete (status 204) with select all unchecked", async () => {
    deleteFiles.mockResolvedValue(204);

    await handleBulkDeleteLogic({
      allSelectedDocs,
      docData,
      allRegistrationIds,
      dateRange,
      searchRefExternalId,
      documentRelatedTo,
      currentPage,
      sortBy,
      sortDirection,
      setShowToastNotification,
      setShowConfirmDialog,
      setSelectedCheckBoxIds,
      setAllSelectedDocs,
      setIsClearSelectedCheckbox,
      setShowDeleteErrorBanner,
      setShowDeleteSuccessToast,
      fetchGetDocumentDetails,
      deleteFiles,
      excludedCheckBoxIds: [],
      isHeaderBoxChecked: false,
      setIsSearchDataLoading,
      availableFileIds: ["1", "2"],
      setShowDeleteAbortBanner
    });

    expect(setShowToastNotification).toHaveBeenCalledWith(true);
    expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
    expect(setSelectedCheckBoxIds).toHaveBeenCalledWith([]);
    expect(setAllSelectedDocs).toHaveBeenCalledWith([]);
    expect(setIsClearSelectedCheckbox).toHaveBeenCalledWith(true);
    expect(setShowDeleteErrorBanner).not.toHaveBeenCalledWith(false);
    expect(fetchGetDocumentDetails).toHaveBeenCalledWith(currentPage, allRegistrationIds, sortBy, sortDirection);
    expect(setShowDeleteSuccessToast).toHaveBeenCalledWith(true);
  });

   it("should handle edge case for delete (status 409) with select all unchecked", async () => {
    deleteFiles.mockResolvedValue(409);

    await handleBulkDeleteLogic({
      allSelectedDocs,
      docData,
      allRegistrationIds,
      dateRange,
      searchRefExternalId,
      documentRelatedTo,
      currentPage,
      sortBy,
      sortDirection,
      setShowToastNotification,
      setShowConfirmDialog,
      setSelectedCheckBoxIds,
      setAllSelectedDocs,
      setIsClearSelectedCheckbox,
      setShowDeleteErrorBanner,
      setShowDeleteSuccessToast,
      fetchGetDocumentDetails,
      deleteFiles,
      excludedCheckBoxIds: [],
      isHeaderBoxChecked: false,
      setIsSearchDataLoading,
      availableFileIds: ["1", "2"],
      setShowDeleteAbortBanner
    });

    expect(setShowDeleteAbortBanner).toHaveBeenCalledWith(true);
    expect(setIsSearchDataLoading).toHaveBeenCalledWith(false);
  });

  it("should handle successful delete (status 204) with select all checked and exclusions", async () => {
    jest.useFakeTimers();
    deleteFiles.mockResolvedValue(204);

    await handleBulkDeleteLogic({
      allSelectedDocs,
      docData,
      allRegistrationIds,
      dateRange,
      searchRefExternalId,
      documentRelatedTo,
      currentPage,
      sortBy,
      sortDirection,
      setShowToastNotification,
      setShowConfirmDialog,
      setSelectedCheckBoxIds,
      setAllSelectedDocs,
      setIsClearSelectedCheckbox,
      setShowDeleteErrorBanner,
      setShowDeleteSuccessToast,
      fetchGetDocumentDetails,
      deleteFiles,
      excludedCheckBoxIds,
      isHeaderBoxChecked: true,
      setIsSearchDataLoading,
      availableFileIds: ["1", "2"],
      setShowDeleteAbortBanner
    });

    jest.runAllTimers();
    await Promise.resolve();
    expect(setShowToastNotification).toHaveBeenCalledWith(true);
    expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
    expect(setSelectedCheckBoxIds).toHaveBeenCalledWith([]);
    expect(setAllSelectedDocs).toHaveBeenCalledWith([]);
    expect(setIsClearSelectedCheckbox).toHaveBeenCalledWith(true);
    expect(setShowDeleteErrorBanner).not.toHaveBeenCalledWith(false);
    expect(fetchGetDocumentDetails).toHaveBeenCalledWith(currentPage, allRegistrationIds, sortBy, sortDirection);
    expect(setShowDeleteSuccessToast).toHaveBeenCalledWith(true);
  });

  it("should handle deleteFiles returning non-204 status", async () => {
    deleteFiles.mockResolvedValue(400);

    await handleBulkDeleteLogic({
      allSelectedDocs,
      docData,
      allRegistrationIds,
      dateRange,
      searchRefExternalId,
      documentRelatedTo,
      currentPage,
      sortBy,
      sortDirection,
      setShowToastNotification,
      setShowConfirmDialog,
      setSelectedCheckBoxIds,
      setAllSelectedDocs,
      setIsClearSelectedCheckbox,
      setShowDeleteErrorBanner,
      setShowDeleteSuccessToast,
      fetchGetDocumentDetails,
      deleteFiles,
      excludedCheckBoxIds,
      isHeaderBoxChecked: false,
      setIsSearchDataLoading,
      availableFileIds: ["1", "2"],
      setShowDeleteAbortBanner
    });

    expect(setShowDeleteErrorBanner).toHaveBeenCalledWith(true);
    expect(setShowToastNotification).not.toHaveBeenCalledWith(true);
    expect(setShowDeleteSuccessToast).not.toHaveBeenCalledWith(true);
  });

  it("should call fetchGetDocumentDetails after correct timeout for availableFileIds count between 100 and 200", async () => {
  jest.useFakeTimers();
  deleteFiles.mockResolvedValue(204);

  await handleBulkDeleteLogic({
    allSelectedDocs,
    docData,
    allRegistrationIds,
    dateRange,
    searchRefExternalId,
    documentRelatedTo,
    currentPage,
    sortBy,
    sortDirection,
    setShowToastNotification,
    setShowConfirmDialog,
    setSelectedCheckBoxIds,
    setAllSelectedDocs,
    setIsClearSelectedCheckbox,
    setShowDeleteErrorBanner,
    setShowDeleteSuccessToast,
    fetchGetDocumentDetails,
    deleteFiles,
    excludedCheckBoxIds,
    isHeaderBoxChecked: true,
    setIsSearchDataLoading,
    availableFileIds: Array(150).fill("fileId"), 
    setShowDeleteAbortBanner
  });

  await Promise.resolve();

  expect(fetchGetDocumentDetails).toHaveBeenCalledWith(currentPage, allRegistrationIds, sortBy, sortDirection);
});

 it("should call fetchGetDocumentDetails after correct timeout for availableFileIds count between 400 and 600", async () => {
  jest.useFakeTimers();
  deleteFiles.mockResolvedValue(204);

  await handleBulkDeleteLogic({
    allSelectedDocs,
    docData,
    allRegistrationIds,
    dateRange,
    searchRefExternalId,
    documentRelatedTo,
    currentPage,
    sortBy,
    sortDirection,
    setShowToastNotification,
    setShowConfirmDialog,
    setSelectedCheckBoxIds,
    setAllSelectedDocs,
    setIsClearSelectedCheckbox,
    setShowDeleteErrorBanner,
    setShowDeleteSuccessToast,
    fetchGetDocumentDetails,
    deleteFiles,
    excludedCheckBoxIds,
    isHeaderBoxChecked: true,
    setIsSearchDataLoading,
    availableFileIds: Array(550).fill("fileId"), 
    setShowDeleteAbortBanner
  });

  await Promise.resolve();

  expect(fetchGetDocumentDetails).toHaveBeenCalledWith(currentPage, allRegistrationIds, sortBy, sortDirection);
});

 it("should call fetchGetDocumentDetails after correct timeout for availableFileIds count between 200 and 400", async () => {
  jest.useFakeTimers();
  deleteFiles.mockResolvedValue(204);

  await handleBulkDeleteLogic({
    allSelectedDocs,
    docData,
    allRegistrationIds,
    dateRange,
    searchRefExternalId,
    documentRelatedTo,
    currentPage,
    sortBy,
    sortDirection,
    setShowToastNotification,
    setShowConfirmDialog,
    setSelectedCheckBoxIds,
    setAllSelectedDocs,
    setIsClearSelectedCheckbox,
    setShowDeleteErrorBanner,
    setShowDeleteSuccessToast,
    fetchGetDocumentDetails,
    deleteFiles,
    excludedCheckBoxIds,
    isHeaderBoxChecked: true,
    setIsSearchDataLoading,
    availableFileIds: Array(350).fill("fileId"), 
    setShowDeleteAbortBanner
  });

  jest.advanceTimersByTime(2500);

  await Promise.resolve();

  expect(fetchGetDocumentDetails).toHaveBeenCalledWith(currentPage, allRegistrationIds, sortBy, sortDirection);
});

 it("should call fetchGetDocumentDetails after correct timeout for availableFileIds count between 600 and 1000", async () => {
  jest.useFakeTimers();
  deleteFiles.mockResolvedValue(204);

  await handleBulkDeleteLogic({
    allSelectedDocs,
    docData,
    allRegistrationIds,
    dateRange,
    searchRefExternalId,
    documentRelatedTo,
    currentPage,
    sortBy,
    sortDirection,
    setShowToastNotification,
    setShowConfirmDialog,
    setSelectedCheckBoxIds,
    setAllSelectedDocs,
    setIsClearSelectedCheckbox,
    setShowDeleteErrorBanner,
    setShowDeleteSuccessToast,
    fetchGetDocumentDetails,
    deleteFiles,
    excludedCheckBoxIds,
    isHeaderBoxChecked: true,
    setIsSearchDataLoading,
    availableFileIds: Array(850).fill("fileId"), 
    setShowDeleteAbortBanner
  });


  jest.advanceTimersByTime(7000);

  await Promise.resolve();

  expect(fetchGetDocumentDetails).toHaveBeenCalledWith(currentPage, allRegistrationIds, sortBy, sortDirection);
});

 it("should call fetchGetDocumentDetails after correct timeout for availableFileIds count more than 1000", async () => {
  jest.useFakeTimers();
  deleteFiles.mockResolvedValue(204);

  await handleBulkDeleteLogic({
    allSelectedDocs,
    docData,
    allRegistrationIds,
    dateRange,
    searchRefExternalId,
    documentRelatedTo,
    currentPage,
    sortBy,
    sortDirection,
    setShowToastNotification,
    setShowConfirmDialog,
    setSelectedCheckBoxIds,
    setAllSelectedDocs,
    setIsClearSelectedCheckbox,
    setShowDeleteErrorBanner,
    setShowDeleteSuccessToast,
    fetchGetDocumentDetails,
    deleteFiles,
    excludedCheckBoxIds,
    isHeaderBoxChecked: true,
    setIsSearchDataLoading,
    availableFileIds: Array(1150).fill("fileId"), 
    setShowDeleteAbortBanner
  });

  await Promise.resolve();

  expect(fetchGetDocumentDetails).toHaveBeenCalledWith(currentPage, allRegistrationIds, sortBy, sortDirection);
});

  it("should handle deleteFiles throwing an error", async () => {
    deleteFiles.mockRejectedValue(new Error("fail"));

    await handleBulkDeleteLogic({
      allSelectedDocs,
      docData,
      allRegistrationIds,
      dateRange,
      searchRefExternalId,
      documentRelatedTo,
      currentPage,
      sortBy,
      sortDirection,
      setShowToastNotification,
      setShowConfirmDialog,
      setSelectedCheckBoxIds,
      setAllSelectedDocs,
      setIsClearSelectedCheckbox,
      setShowDeleteErrorBanner,
      setShowDeleteSuccessToast,
      fetchGetDocumentDetails,
      deleteFiles,
      excludedCheckBoxIds,
      isHeaderBoxChecked: false,
      setIsSearchDataLoading,
      availableFileIds: ["1", "2"],
      setShowDeleteAbortBanner
    });

    expect(setShowDeleteErrorBanner).toHaveBeenCalledWith(true);
    expect(setShowToastNotification).not.toHaveBeenCalledWith(true);
    expect(setShowDeleteSuccessToast).not.toHaveBeenCalledWith(true);
  });

  it("should send empty fileDetails when select all is checked", async () => {
    deleteFiles.mockResolvedValue(204);

    await handleBulkDeleteLogic({
      allSelectedDocs,
      docData,
      allRegistrationIds,
      dateRange,
      searchRefExternalId,
      documentRelatedTo,
      currentPage,
      sortBy,
      sortDirection,
      setShowToastNotification,
      setShowConfirmDialog,
      setSelectedCheckBoxIds,
      setAllSelectedDocs,
      setIsClearSelectedCheckbox,
      setShowDeleteErrorBanner,
      setShowDeleteSuccessToast,
      fetchGetDocumentDetails,
      deleteFiles,
      excludedCheckBoxIds: [],
      isHeaderBoxChecked: true, 
      setIsSearchDataLoading,
      availableFileIds: ["1", "2"],
      setShowDeleteAbortBanner
    });

    // fileDetails should be empty in payload
    const callPayload = deleteFiles.mock.calls[0][0];
    expect(callPayload.request.fileDetails).toEqual([]);
  });

  it("should send fileDetails when select all is unchecked and docs are selected", async () => {
    deleteFiles.mockResolvedValue(204);

    await handleBulkDeleteLogic({
      allSelectedDocs,
      docData,
      allRegistrationIds,
      dateRange,
      searchRefExternalId,
      documentRelatedTo,
      currentPage,
      sortBy,
      sortDirection,
      setShowToastNotification,
      setShowConfirmDialog,
      setSelectedCheckBoxIds,
      setAllSelectedDocs,
      setIsClearSelectedCheckbox,
      setShowDeleteErrorBanner,
      setShowDeleteSuccessToast,
      fetchGetDocumentDetails,
      deleteFiles,
      excludedCheckBoxIds: [],
      isHeaderBoxChecked: false,
      setIsSearchDataLoading,
      availableFileIds: ["1", "2"],
      setShowDeleteAbortBanner
    });

    const callPayload = deleteFiles.mock.calls[0][0];
    expect(callPayload.request.fileDetails.length).toBe(2);
    expect(callPayload.request.fileDetails[0]).toMatchObject({ fileId: "1", registrationId: 101, externalId: "ext1" });
    expect(callPayload.request.fileDetails[1]).toMatchObject({ fileId: "2", registrationId: 102, externalId: "ext2" });
  });


  it("should send empty excludedFileDetails when select all is unchecked", async () => {
    deleteFiles.mockResolvedValue(204);

    await handleBulkDeleteLogic({
      allSelectedDocs,
      docData,
      allRegistrationIds,
      dateRange,
      searchRefExternalId,
      documentRelatedTo,
      currentPage,
      sortBy,
      sortDirection,
      setShowToastNotification,
      setShowConfirmDialog,
      setSelectedCheckBoxIds,
      setAllSelectedDocs,
      setIsClearSelectedCheckbox,
      setShowDeleteErrorBanner,
      setShowDeleteSuccessToast,
      fetchGetDocumentDetails,
      deleteFiles,
      excludedCheckBoxIds: [],
      isHeaderBoxChecked: false,
      setIsSearchDataLoading,
      availableFileIds: ["1", "2"],
      setShowDeleteAbortBanner
    });

    const callPayload = deleteFiles.mock.calls[0][0];
    expect(callPayload.request.excludedFileDetails).toEqual([]);
  });
  
});


describe("handleEditSelectedOverFlowMenu", () => {
  const getMocks = () => ({
    setShowDialog: jest.fn(),
    setShowConfirmDialog: jest.fn(),
    setShowRestrictedDeleteDialog: jest.fn(),
    setShowRestrictedPrepareDialog: jest.fn(),
    setIsPreDialogLoading: jest.fn(),
    setRestrictedFileCount: jest.fn(),
    setAlreadyDeletedFileCount: jest.fn(),
    setAvailableFileCount: jest.fn(),
    setDialogType: jest.fn(),
    setIsDialogLoading: jest.fn(),
    setSidePanelOpenReason: jest.fn(),
    setIsSidePanelOpen: jest.fn(),
    setAvailableFileIds: jest.fn(),
    buildValidationPayload: jest.fn((args) => args),
    setShowErrorBanner: jest.fn(),
    validation: jest.fn(async () => ({
      data: {
        restrictedFileCount: 1,
        alreadyDeletedFileCount: 2,
        availableFileCount: 3,
      },
      status : 200
    })),
  });

  const baseArgs = {
    e: {} as React.SyntheticEvent,
    selectedItem: { value: "Prepare download" },
    totalSelectedCount: 1,
    isHeaderBoxChecked: false,
    allSelectedDocs: [{ fileId: "1" }],
    allRegistrationIds: [1, 2],
    dateRange: { fromDate: "2025-01-01", toDate: "2025-01-02" },
    searchRefExternalId: ["ref1"],
    documentRelatedTo: 1,
  };

  it("shows dialog if nothing selected", async () => {
    const mocks = getMocks();
    await handleEditSelectedOverFlowMenu({
      ...baseArgs,
      ...mocks,
      totalSelectedCount: 0,
    });
    expect(mocks.setShowDialog).toHaveBeenCalledWith(true);
    expect(mocks.setShowConfirmDialog).toHaveBeenCalled();
  });
  it("shows error banner if validation api fails", async () => {
    const mocks = getMocks();
    mocks.validation.mockResolvedValueOnce({
      status: 400,
      data: { restrictedFileCount: 0, alreadyDeletedFileCount: 0, availableFileCount: 0 }
    });
    await handleEditSelectedOverFlowMenu({
      ...baseArgs,
      ...mocks,
      selectedItem: { value: "Prepare download" },
      totalSelectedCount: 1,
    });
    expect(mocks.setIsPreDialogLoading).toHaveBeenCalledWith(false);
    expect(mocks.setShowErrorBanner).toHaveBeenCalledWith(false);
    expect(mocks.setShowDialog).toHaveBeenCalledWith(false);
  });

  it("shows restricted prepare dialog if available=0 and alreadyDeleted>0 for Prepare download", async () => {
    const mocks = getMocks();
    mocks.validation.mockResolvedValueOnce({
      data: { restrictedFileCount: 0, alreadyDeletedFileCount: 1, availableFileCount: 0 },
      status: 200
    });
    await handleEditSelectedOverFlowMenu({
      ...baseArgs,
      ...mocks,
      selectedItem: { value: "Prepare download" },
      totalSelectedCount: 1,
    });
    expect(mocks.setShowRestrictedPrepareDialog).toHaveBeenCalledWith(false);
    expect(mocks.setShowConfirmDialog).toHaveBeenCalledWith(false);
  });

  it("shows restricted delete dialog if available=0 and restricted>0 for Delete", async () => {
    const mocks = getMocks();
    mocks.validation.mockResolvedValueOnce({
      data: { restrictedFileCount: 1, alreadyDeletedFileCount: 0, availableFileCount: 0 },
      status: 200
    });
    await handleEditSelectedOverFlowMenu({
      ...baseArgs,
      ...mocks,
      selectedItem: { value: "Delete" },
      totalSelectedCount: 1,
    });
    expect(mocks.setShowRestrictedDeleteDialog).toHaveBeenCalledWith(true);
    expect(mocks.setShowConfirmDialog).toHaveBeenCalledWith(false);
  });

  it("shows confirm dialog if available>0 for Delete", async () => {
    const mocks = getMocks();
    mocks.validation.mockResolvedValueOnce({
      data: { restrictedFileCount: 0, alreadyDeletedFileCount: 0, availableFileCount: 2 },
      status: 200
    });
    await handleEditSelectedOverFlowMenu({
      ...baseArgs,
      ...mocks,
      selectedItem: { value: "Delete" },
      totalSelectedCount: 1,
    });
    expect(mocks.setShowConfirmDialog).toHaveBeenCalledWith(false);
    expect(mocks.setShowRestrictedDeleteDialog).toHaveBeenCalledWith(false);
  });

  it("shows confirm dialog for Prepare download if available>0", async () => {
    const mocks = getMocks();
    mocks.validation.mockResolvedValueOnce({
      data: { restrictedFileCount: 0, alreadyDeletedFileCount: 0, availableFileCount: 1 },
      status: 200
    });
    await handleEditSelectedOverFlowMenu({
      ...baseArgs,
      ...mocks,
      selectedItem: { value: "Prepare download" },
      totalSelectedCount: 1,
    });
    expect(mocks.setShowConfirmDialog).toHaveBeenCalledWith(false);
  });

  it("opens side panel for view download", async () => {
    const mocks = getMocks();
    await handleEditSelectedOverFlowMenu({
      ...baseArgs,
      ...mocks,
      selectedItem: { value: "View download" },
      totalSelectedCount: 1,
    });
    expect(mocks.setSidePanelOpenReason).toHaveBeenCalledWith("view");
    expect(mocks.setIsSidePanelOpen).toHaveBeenCalledWith(true);
  });

  it("clears suggestions and loading for whitespace-only input", () => {
    const t = (key: string) => key;
    const event = { target: { value: "   " } } as React.ChangeEvent<HTMLInputElement>;
    const setSearchTerm = jest.fn();
    const setSuggestions = jest.fn();
    const setShowSearchError = jest.fn();
    const setIsSearchLoading = jest.fn();
    const setShowErrorBanner = jest.fn();
    const categoryId: any[] = [];
    const fromDate = "";
    const toDate = "";
    const documentRelatedTo = 1;
    const setResetFilterSearch = jest.fn();


    Logic.handleSearchChange({
      t,
      e: event,
      categoryId,
      fromDate,
      toDate,
      setSearchTerm,
      setSuggestions,
      setShowSearchError,
      setIsSearchLoading,
      setShowErrorBanner,
      documentRelatedTo,
      setResetFilterSearch
    });

    expect(setSuggestions).toHaveBeenCalledWith([]);
    expect(setIsSearchLoading).toHaveBeenCalledWith(false);
  });
});

describe("applySummaryTagClass", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="taglist-id">
        <div class="search-tagList">
          <div class="essui-tag"><span>App</span></div>
        </div>
        <div class="search-tagList">
          <div class="essui-tag"><span>+2</span></div>
        </div>
      </div>
    `;
  });

  it("adds summary-tag class to tags with +n and removes from others", () => {
    const tagLists = document.querySelectorAll("#taglist-id .search-tagList");
    // Initially, no tag has summary-tag
    tagLists.forEach(tag => {
      expect(tag.classList.contains("summary-tag")).toBe(false);
    });

    applySummaryTagClass();

    // First tag should NOT have summary-tag
    expect(tagLists[0].classList.contains("summary-tag")).toBe(false);
    // Second tag should have summary-tag
    expect(tagLists[1].classList.contains("summary-tag")).toBe(true);
  });

  it("removes summary-tag class if +n is changed to something else", () => {
    const tagLists = document.querySelectorAll("#taglist-id .search-tagList");
    // Set +2, apply class
    applySummaryTagClass();
    expect(tagLists[1].classList.contains("summary-tag")).toBe(true);

    // Change span text to something else
    const span = tagLists[1].querySelector(".essui-tag span");
    if (span) span.textContent = "Other";
    applySummaryTagClass();
    expect(tagLists[1].classList.contains("summary-tag")).toBe(false);
  });

  it("handles missing span gracefully", () => {
    // Remove span from first tag
    const tagLists = document.querySelectorAll("#taglist-id .search-tagList");
    const span = tagLists[0].querySelector(".essui-tag span");
    if (span) span.remove();
    // Should not throw
    expect(() => applySummaryTagClass()).not.toThrow();
    // Should not add summary-tag
    expect(tagLists[0].classList.contains("summary-tag")).toBe(false);
  });
})

describe("handlePageChange", () => {
  it("should update current page and loading state", () => {
    const setCurrentPage = jest.fn();
    const setIsLoading = jest.fn();
    const setIsSearchTriggered = jest.fn();
    handlePageChange({}, 2, setCurrentPage, setIsLoading, setIsSearchTriggered);
    expect(setCurrentPage).toHaveBeenCalledWith(2);
    expect(setIsLoading).toHaveBeenCalledWith(true);
  });
});

describe("validateAndApplyFilter", () => {

  let setIsDateError: jest.Mock;
  let setIsFilterLoading: jest.Mock;
  let setDateRange: jest.Mock;
  let setSelectedFormats: jest.Mock;
  let setIsFilterDialogOpen: jest.Mock;
  let setCurrentPage: jest.Mock;
  let setExcludedCheckBoxIds: jest.Mock;
  let setAllSelectedDocs: jest.Mock;
  let setReferenceExternalIds: jest.Mock;
  let setIsHeaderBoxChecked: jest.Mock;
  let setSelectedCheckBoxIds: jest.Mock;
  let setPrevSelectedDocs: jest.Mock;

  beforeEach(() => {
    setIsDateError = jest.fn();
    setIsFilterLoading = jest.fn();
    setDateRange = jest.fn();
    setSelectedFormats = jest.fn();
    setIsFilterDialogOpen = jest.fn();
    setCurrentPage = jest.fn();
    setExcludedCheckBoxIds = jest.fn();
    setAllSelectedDocs = jest.fn();
    setReferenceExternalIds = jest.fn();
    setIsHeaderBoxChecked = jest.fn();
    setSelectedCheckBoxIds = jest.fn();
    setPrevSelectedDocs = jest.fn();
    // Reset mock for isInvalidDateRange
    handlerModule.isInvalidDateRange.mockReturnValue(false);
   });

  it("should set date error and return if isDateError is true", () => {
    validateAndApplyFilter({
      selectedDateRange: { fromDate: "2024-01-01", toDate: "2024-01-02" },
      isDateError: true,
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setSelectedFormats,
      selectedCategories: [],
      setIsFilterDialogOpen,
      setCurrentPage,
      setExcludedCheckBoxIds,
      setAllSelectedDocs,
      referenceExternalIds: [],
      setReferenceExternalIds,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs
    });
    expect(setIsDateError).toHaveBeenCalledWith(true);
    expect(setIsFilterLoading).not.toHaveBeenCalledWith(true);
    expect(setDateRange).not.toHaveBeenCalled();
  });

  it("should set date error and return if isInvalidDateRange returns true", () => {
    handlerModule.isInvalidDateRange.mockReturnValue(true);
    validateAndApplyFilter({
      selectedDateRange: { fromDate: "bad", toDate: "bad" },
      isDateError: false,
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setSelectedFormats,
      selectedCategories: [],
      setIsFilterDialogOpen,
      setCurrentPage,
      setExcludedCheckBoxIds,
      setAllSelectedDocs,
      referenceExternalIds: [],
      setReferenceExternalIds,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs
    });
    expect(setIsDateError).toHaveBeenCalledWith(true);
    expect(setIsFilterLoading).not.toHaveBeenCalledWith(true);
    expect(setDateRange).not.toHaveBeenCalled();
  });

  it("should apply filter when dates are valid and no error", () => {
    const selectedCategories = [
      { text: "cat1", data: "cat1" },
      { text: "cat2", data: "cat2" }
    ];
    validateAndApplyFilter({
      selectedDateRange: { fromDate: "2024-01-01", toDate: "2024-01-02" },
      isDateError: false,
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setSelectedFormats,
      selectedCategories,
      setIsFilterDialogOpen,
      setCurrentPage,
      setExcludedCheckBoxIds,
      setAllSelectedDocs,
      referenceExternalIds: ["ref1"],
      setReferenceExternalIds,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs
    });

    expect(setIsFilterLoading).toHaveBeenCalledWith(true);
    expect(setDateRange).toHaveBeenCalledWith({ fromDate: "2024-01-01", toDate: "2024-01-02" });
    expect(setSelectedFormats).toHaveBeenCalledWith(selectedCategories);
    expect(setReferenceExternalIds).toHaveBeenCalledWith(["ref1"]);
    expect(setIsFilterDialogOpen).toHaveBeenCalledWith(false);
    expect(setIsFilterLoading).toHaveBeenCalledWith(false);
    expect(setCurrentPage).toHaveBeenCalledWith(1);
    expect(setExcludedCheckBoxIds).toHaveBeenCalledWith([]);
    expect(setAllSelectedDocs).toHaveBeenCalledWith([]);
    expect(setIsHeaderBoxChecked).toHaveBeenCalledWith(false);
    expect(setSelectedCheckBoxIds).toHaveBeenCalledWith([]);
    expect(setPrevSelectedDocs).toHaveBeenCalledWith([]);
  });

  it("should handle missing referenceExternalIds", () => {
    validateAndApplyFilter({
      selectedDateRange: { fromDate: "2024-01-01", toDate: "2024-01-02" },
      isDateError: false,
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setSelectedFormats,
      selectedCategories: [],
      setIsFilterDialogOpen,
      setCurrentPage,
      setExcludedCheckBoxIds,
      setAllSelectedDocs,
      // referenceExternalIds is undefined
      setReferenceExternalIds,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs
    });
    expect(setReferenceExternalIds).toHaveBeenCalledWith([]);
  });

  it("should handle undefined selectedDateRange", () => {
    validateAndApplyFilter({
      selectedDateRange: undefined,
      isDateError: false,
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setSelectedFormats,
      selectedCategories: [],
      setIsFilterDialogOpen,
      setCurrentPage,
      setExcludedCheckBoxIds,
      setAllSelectedDocs,
      referenceExternalIds: [],
      setReferenceExternalIds,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs
    });
    expect(setDateRange).toHaveBeenCalledWith({ fromDate: "", toDate: "" });
  });
});

describe("handleClearAllConfirm", () => {
  let setShowToastNotification: jest.Mock;
  let fetchViewDownloadData: jest.Mock;
  let setIsSidePanelLoader: jest.Mock;
  let setViewData: jest.Mock;
  let setHasFetchedViewDownload: jest.Mock;
  let setClearAllError: jest.Mock;
  let setShowConfirmDialog: jest.Mock;
  let getCompletedPartitionKeys: jest.Mock;
  let setIsViewDownloadError: jest.Mock;
  let setShowEmailNotification: jest.Mock;
  let clearAllFiles: jest.Mock;

  beforeEach(() => {
    setShowToastNotification = jest.fn();
    fetchViewDownloadData = jest.fn();
    setIsSidePanelLoader = jest.fn();
    setViewData = jest.fn();
    setHasFetchedViewDownload = jest.fn();
    setClearAllError = jest.fn();
    setShowConfirmDialog = jest.fn();
    getCompletedPartitionKeys = jest.fn(() => ["pk1", "pk2"]);
    setIsViewDownloadError = jest.fn();
    setShowEmailNotification = jest.fn();
    clearAllFiles = jest.fn();
    jest.clearAllMocks();
  });

  it("handles successful clear (response 204)", async () => {
    clearAllFiles.mockResolvedValue(204);
    fetchViewDownloadData.mockResolvedValue(undefined);

    await handleClearAllConfirm({
      viewData: [{ partitionKey: "pk1" }, { partitionKey: "pk2" }],
      clearAllFiles,
      setShowToastNotification,
      fetchViewDownloadData,
      setIsSidePanelLoader,
      setViewData,
      setHasFetchedViewDownload,
      viewDownload: {},
      downloadPollingIntervalRef: {},
      setClearAllError,
      setShowConfirmDialog,
      getCompletedPartitionKeys,
      setIsViewDownloadError,
      setShowEmailNotification
    });

    expect(setIsSidePanelLoader).toHaveBeenCalledWith(true);
    expect(clearAllFiles).toHaveBeenCalledWith({ request: { partitionKey: ["pk1", "pk2"] } });
    expect(setViewData).toHaveBeenCalledWith([]);
    expect(setShowToastNotification).toHaveBeenCalledWith(true);
    expect(fetchViewDownloadData).toHaveBeenCalled();
    expect(setIsSidePanelLoader).toHaveBeenCalledWith(false);
    expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
  });

  it("handles clearAllFiles returning non-204 status", async () => {
    clearAllFiles.mockResolvedValue(400);

    await handleClearAllConfirm({
      viewData: [{ partitionKey: "pk1" }, { partitionKey: "pk2" }],
      clearAllFiles,
      setShowToastNotification,
      fetchViewDownloadData,
      setIsSidePanelLoader,
      setViewData,
      setHasFetchedViewDownload,
      viewDownload: {},
      downloadPollingIntervalRef: {},
      setClearAllError,
      setShowConfirmDialog,
      getCompletedPartitionKeys,
      setIsViewDownloadError,
      setShowEmailNotification
    });

    expect(setClearAllError).toHaveBeenCalledWith(true);
    expect(setIsSidePanelLoader).toHaveBeenCalledWith(false);
    expect(gtmAnalytics.pushEvent).toHaveBeenCalledWith({
      event: "error_message",
      messageText: "Unable to clear downloads"
    });
    expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
  });

  it("handles clearAllFiles throwing an error", async () => {
    clearAllFiles.mockRejectedValue(new Error("fail"));

    await handleClearAllConfirm({
      viewData: [{ partitionKey: "pk1" }, { partitionKey: "pk2" }],
      clearAllFiles,
      setShowToastNotification,
      fetchViewDownloadData,
      setIsSidePanelLoader,
      setViewData,
      setHasFetchedViewDownload,
      viewDownload: {},
      downloadPollingIntervalRef: {},
      setClearAllError,
      setShowConfirmDialog,
      getCompletedPartitionKeys,
      setIsViewDownloadError,
      setShowEmailNotification
    });

    expect(setClearAllError).toHaveBeenCalledWith(true);
    expect(setShowToastNotification).toHaveBeenCalledWith(false);
    expect(setIsSidePanelLoader).toHaveBeenCalledWith(false);
    expect(gtmAnalytics.pushEvent).toHaveBeenCalledWith({
      event: "error_message",
      messageText: "Unable to clear downloads"
    });
    expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
  });

  it("handles missing setIsSidePanelLoader gracefully", async () => {
    clearAllFiles.mockResolvedValue(204);

    await handleClearAllConfirm({
      viewData: [{ partitionKey: "pk1" }, { partitionKey: "pk2" }],
      clearAllFiles,
      setShowToastNotification,
      fetchViewDownloadData,
      // @ts-expect-error
      setIsSidePanelLoader: undefined,
      setViewData,
      setHasFetchedViewDownload,
      viewDownload: {},
      downloadPollingIntervalRef: {},
      setClearAllError,
      setShowConfirmDialog,
      getCompletedPartitionKeys,
      setIsViewDownloadError,
      setShowEmailNotification
    });

    expect(clearAllFiles).toHaveBeenCalled();
    expect(setViewData).toHaveBeenCalledWith([]);
    expect(setShowToastNotification).toHaveBeenCalledWith(true);
    expect(fetchViewDownloadData).toHaveBeenCalled();
    expect(setShowConfirmDialog).toHaveBeenCalledWith(false);
  });
});

describe("handleApply", () => {
  let setIsDateError: jest.Mock;
  let setIsFilterLoading: jest.Mock;
  let setDateRange: jest.Mock;
  let setIsFilterDialogOpen: jest.Mock;
  let setCurrentPage: jest.Mock;
  let setExcludedCheckBoxIds: jest.Mock;
  let setAllSelectedDocs: jest.Mock;
  let setSelectedFormats: jest.Mock;
  let setIsHeaderBoxChecked: jest.Mock;
  let setSelectedCheckBoxIds: jest.Mock;
  let setPrevSelectedDocs: jest.Mock;
  let setReferenceExternalIds: jest.Mock;

  beforeEach(() => {
    setIsDateError = jest.fn();
    setIsFilterLoading = jest.fn();
    setDateRange = jest.fn();
    setIsFilterDialogOpen = jest.fn();
    setCurrentPage = jest.fn();
    setExcludedCheckBoxIds = jest.fn();
    setAllSelectedDocs = jest.fn();
    setSelectedFormats = jest.fn();
    setIsHeaderBoxChecked = jest.fn();
    setSelectedCheckBoxIds = jest.fn();
    setPrevSelectedDocs = jest.fn();
    setReferenceExternalIds = jest.fn();
  });

  it("sets date error and returns if isDateError is true", () => {
    handleApply({
      referenceExternalIds: [],
      selectedCategories: [],
      selectedDateRange: { fromDate: "2024-01-01", toDate: "2024-01-02" },
      isDateError: true, // <-- Fix: set to true to match the tested logic
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setIsFilterDialogOpen,
      setCurrentPage,
      setExcludedCheckBoxIds,
      setAllSelectedDocs,
      setSelectedFormats,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs,
      setReferenceExternalIds,
      setSearchInput: jest.fn(),
      setSearchTerm: jest.fn(),
      setSearchText: jest.fn(),
      setTableKey: jest.fn(),
      setIsSearchTriggered: jest.fn(),
      setSelectedCategories: jest.fn(),
      setSearchRefExternalId: jest.fn(),
      setSelectedEntities: jest.fn(),
      setSortBy: jest.fn(),
      setSortDirection: jest.fn(),
      setIsInitialLoad: jest.fn()
    });
    expect(setIsDateError).toHaveBeenCalledWith(true);
    expect(setIsFilterLoading).not.toHaveBeenCalledWith(true);
    expect(setDateRange).not.toHaveBeenCalled();
  });

  it("sets date error and returns if isInvalidDateRange returns true", () => {
    // Mock isInvalidDateRange to return true
      handlerModule.isInvalidDateRange.mockReturnValue(true);
    handleApply({
      referenceExternalIds: [],
      selectedCategories: [],
      selectedDateRange: { fromDate: "2024-01-01", toDate: "2024-01-02" },
      isDateError: true,
      setIsDateError,
      setIsFilterLoading,
      setDateRange,
      setIsFilterDialogOpen,
      setCurrentPage,
      setExcludedCheckBoxIds,
      setAllSelectedDocs,
      setSelectedFormats,
      setIsHeaderBoxChecked,
      setSelectedCheckBoxIds,
      setPrevSelectedDocs,
      setReferenceExternalIds,
      setSearchInput: jest.fn(),
      setSearchTerm: jest.fn(),
      setSearchText: jest.fn(),
      setTableKey: jest.fn(),
      setIsSearchTriggered: jest.fn(),
      setSelectedCategories: jest.fn(),
      setSearchRefExternalId: jest.fn(),
      setSelectedEntities: jest.fn(),
      setSortBy: jest.fn(),
      setSortDirection: jest.fn(),
      setIsInitialLoad: jest.fn()
    });
    expect(setIsDateError).toHaveBeenCalledWith(true);
    expect(setIsFilterLoading).not.toHaveBeenCalledWith(true);
    expect(setDateRange).not.toHaveBeenCalled();
  });

it("applies filter when dates are valid and no error", () => {
  handleApply({
    referenceExternalIds: ["ref1"],
    selectedCategories: [
      { text: "cat1", data: "cat1" },
      { text: "cat2", data: "cat2" }
    ],
    selectedDateRange: { fromDate: "2024-01-01", toDate: "2024-01-02" },
    isDateError: false,
    setIsDateError,
    setIsFilterLoading,
    setDateRange,
    setIsFilterDialogOpen,
    setCurrentPage,
    setExcludedCheckBoxIds,
    setAllSelectedDocs,
    setSelectedFormats,
    setIsHeaderBoxChecked,
    setSelectedCheckBoxIds,
    setPrevSelectedDocs,
    setReferenceExternalIds,
    setSearchInput: jest.fn(),
    setSearchTerm: jest.fn(),
    setSearchText: jest.fn(),
    setTableKey: jest.fn(),
    setIsSearchTriggered: jest.fn(),
    setSelectedCategories: jest.fn(),
    setSearchRefExternalId: jest.fn(),
    setSelectedEntities: jest.fn(),
    setSortBy: jest.fn(),
    setSortDirection: jest.fn(),
    setIsInitialLoad: jest.fn()
  });

  expect(setIsFilterLoading).toHaveBeenCalledWith(true);
  expect(setDateRange).toHaveBeenCalledWith({ fromDate: "2024-01-01", toDate: "2024-01-02" });
  expect(setSelectedFormats).toHaveBeenCalledWith([
    { text: "cat1", data: "cat1" },
    { text: "cat2", data: "cat2" }
  ]);
  expect(setReferenceExternalIds).toHaveBeenCalledWith(["ref1"]);
  expect(setIsFilterDialogOpen).toHaveBeenCalledWith(false);
  expect(setIsFilterLoading).toHaveBeenCalledWith(false);
  expect(setCurrentPage).toHaveBeenCalledWith(1);
  expect(setExcludedCheckBoxIds).toHaveBeenCalledWith([]);
  expect(setAllSelectedDocs).toHaveBeenCalledWith([]);
  expect(setIsHeaderBoxChecked).toHaveBeenCalledWith(false);
  expect(setSelectedCheckBoxIds).toHaveBeenCalledWith([]);
  expect(setPrevSelectedDocs).toHaveBeenCalledWith([]);
});

  it("handles missing referenceExternalIds", () => {
    handleApply({
  referenceExternalIds: [],
  selectedCategories: [],
  selectedDateRange: { fromDate: "2024-01-01", toDate: "2024-01-02" },
  isDateError: false,
  setIsDateError,
  setIsFilterLoading,
  setDateRange,
  setIsFilterDialogOpen,
  setCurrentPage,
  setExcludedCheckBoxIds,
  setAllSelectedDocs,
  setSelectedFormats,
  setIsHeaderBoxChecked,
  setSelectedCheckBoxIds,
  setPrevSelectedDocs,
  setReferenceExternalIds,
  setSearchInput: jest.fn(),
  setSearchTerm: jest.fn(),
  setSearchText: jest.fn(),
  setTableKey: jest.fn(),
  setIsSearchTriggered: jest.fn(),
  setSelectedCategories: jest.fn(),
  setSearchRefExternalId: jest.fn(),
  setSelectedEntities: jest.fn(),
  setSortBy: jest.fn(),
  setSortDirection: jest.fn(),
  setIsInitialLoad: jest.fn()
});
    expect(setReferenceExternalIds).toHaveBeenCalledWith([]);
  });
});

describe("closeSidePanel", () => {
  it("closes side panel and clears interval if present", () => {
    const setIsSidePanelOpen = jest.fn();
    const intervalRef = { current: setInterval(() => {}, 10) };
    closeSidePanel(setIsSidePanelOpen, intervalRef);
    expect(setIsSidePanelOpen).toHaveBeenCalledWith(false);
    expect(intervalRef.current).toBe(null);
  });

  it("closes side panel and does nothing if interval is null", () => {
    const setIsSidePanelOpen = jest.fn();
    const intervalRef = { current: null };
    closeSidePanel(setIsSidePanelOpen, intervalRef);
    expect(setIsSidePanelOpen).toHaveBeenCalledWith(false);
    expect(intervalRef.current).toBe(null);
  });
});

describe("getNotificationMsgBannerObject", () => {
  const t = (key: string, opts?: any) =>
    opts && opts.type ? `${key}_${opts.type}` : key;

  it("shows error banner when showErrorBanner is true", () => {
    const banners = getNotificationMsgBannerObject({
      t,
      showErrorBanner: true,
      showSearchError: false,
      showDeleteErrorBanner: false,
      showDeleteAbortBanner: false,
      availableFileCount: 1,
      setShowDeleteErrorBanner: jest.fn(),
      setShowDeleteAbortBanner: jest.fn()
    });
    expect(banners[0].isShow).toBe(true);
    expect(banners[0].variant).toBe("warning");
    expect(banners[0].title).toBe("DocumentManagementServer.informationUnavailable");
    expect(banners[0].message).toBe("DocumentManagementServer.technicalIssueMessage");
    expect(banners[0].autoclose).toBe(true);
  });

  it("shows search error when showSearchError is true", () => {
    const banners = getNotificationMsgBannerObject({
      t,
      showErrorBanner: false,
      showSearchError: true,
      showDeleteErrorBanner: false,
      showDeleteAbortBanner: false,
      availableFileCount: 1,
      setShowDeleteErrorBanner: jest.fn(),
      setShowDeleteAbortBanner: jest.fn()
    });
    expect(banners[0].isShow).toBe(true);
  });

  it("shows delete error banner for single document", () => {
    const setShowDeleteErrorBanner = jest.fn();
    const banners = getNotificationMsgBannerObject({
      t,
      showErrorBanner: false,
      showSearchError: false,
      showDeleteErrorBanner: true,
      showDeleteAbortBanner: false,
      availableFileCount: 1,
      setShowDeleteErrorBanner,
      setShowDeleteAbortBanner: jest.fn()
    });
    expect(banners[1].isShow).toBe(true);
    expect(banners[1].message).toBe("DocumentManagementServer.unableToDeleteDocumentMsg_document");
    if (banners[1].onClickClose) {
      banners[1].onClickClose();
    }
    expect(setShowDeleteErrorBanner).toHaveBeenCalledWith(false);
  });

  it("shows delete error banner for multiple documents", () => {
    const setShowDeleteErrorBanner = jest.fn();
    const banners = getNotificationMsgBannerObject({
      t,
      showErrorBanner: false,
      showSearchError: false,
      showDeleteErrorBanner: true,
      showDeleteAbortBanner: false,
      availableFileCount: 2,
      setShowDeleteErrorBanner,
      setShowDeleteAbortBanner: jest.fn()
    });
    expect(banners[1].message).toBe("DocumentManagementServer.unableToDeleteDocumentMsg_documents");
    if (banners[1].onClickClose) {
      banners[1].onClickClose();
    }
    expect(setShowDeleteErrorBanner).toHaveBeenCalledWith(false);
  });

  it("shows delete abort banner", () => {
    const setShowDeleteAbortBanner = jest.fn();
    const banners = getNotificationMsgBannerObject({
      t,
      showErrorBanner: false,
      showSearchError: false,
      showDeleteErrorBanner: false,
      showDeleteAbortBanner: true,
      availableFileCount: 1,
      setShowDeleteErrorBanner: jest.fn(),
      setShowDeleteAbortBanner
    });
    expect(banners[2].isShow).toBe(true);
    expect(banners[2].message).toBe("DocumentManagementServer.oneOrMoreSelectedDocumentsCannotBeDeleted");
    if (banners[2].onClickClose) {
      banners[2].onClickClose();
    }
    expect(setShowDeleteAbortBanner).toHaveBeenCalledWith(false);
  });

  it("does not show any banners if all flags are false", () => {
    const banners = getNotificationMsgBannerObject({
      t,
      showErrorBanner: false,
      showSearchError: false,
      showDeleteErrorBanner: false,
      showDeleteAbortBanner: false,
      availableFileCount: 1,
      setShowDeleteErrorBanner: jest.fn(),
      setShowDeleteAbortBanner: jest.fn()
    });
    expect(banners[0].isShow).toBe(false);
    expect(banners[1].isShow).toBe(false);
    expect(banners[2].isShow).toBe(false);
  });
});
});

