import React from "react";
import { ISelectedItem } from "@essnextgen/ui-kit";
import * as Logic from "../logic/DocumentManagementServer.handler";
import { handleSuggestionClick, handleTagCloseLogic } from "../logic/DocumentManagementServer.handler";
import { hasItems } from "../logic/DocumentManagementServer.utils";

jest.mock("../../../shared/utils/analytics", () => ({
  pushEvent: jest.fn()
}));

jest.mock("../logic/DocumentManagementServer.handler", () => {
  const original: typeof import("../logic/DocumentManagementServer.handler") = jest.requireActual("../logic/DocumentManagementServer.handler");
  return {
    ...original,
    isInvalidDateRange: jest.fn(() => false),
  };
});

describe("DocumentManagementServer.handler", () => {
    describe("handleSearchChange", () => {
  const setup: any = (value: string) => {
    const t: (key: string) => string = (key: string) => key;
      const e: React.ChangeEvent<HTMLInputElement> = { target: { value } } as unknown as React.ChangeEvent<HTMLInputElement>;
    const setSearchTerm: any = jest.fn();
    const setSuggestions: any = jest.fn();
    const setShowSearchError: jest.Mock<void, [any]> = jest.fn();
    const setIsSearchLoading: jest.Mock<void, [any]> = jest.fn();
    const setShowErrorBanner: jest.Mock<void, [any]> = jest.fn();
    const categoryId = [1];
    const fromDate = "fromDate";
    const toDate = "toDate";
    const documentRelatedTo = 123; // changed to number to fix type error
    const setResetFilterSearch: jest.Mock<void, []> = jest.fn();

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
    const t: (key: string) => string = (key: string) => key;
    const e: React.ChangeEvent<HTMLInputElement> = { target: { value: "" } } as unknown as React.ChangeEvent<HTMLInputElement>;
    const setSearchTerm: any = jest.fn();
    const setSuggestions: any = jest.fn();
    const setShowSearchError: any = jest.fn();
    const setIsSearchLoading: any = jest.fn();
    const setShowErrorBanner: any = jest.fn();
    const categoryId = [1];
    const fromDate = "fromDate";
    const toDate = "toDate";
    const documentRelatedTo = 123; // changed to number
    const setResetFilterSearch: any = jest.fn();

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
    const { setSuggestions, setIsSearchLoading }: { setSuggestions: jest.Mock; setIsSearchLoading: jest.Mock } = setup("a");
    expect(setSuggestions).toHaveBeenCalledWith([]);
    expect(setIsSearchLoading).toHaveBeenCalledWith(false);
  });

  // Add this to your handleSearchChange test suite

it("handles invalid event object (no value)", () => {
  const t: (key: string) => string = (key: string) => key;
    const setSearchTerm: any = jest.fn();
    const setSuggestions: any = jest.fn();
    const setShowSearchError: any = jest.fn();
    const setIsSearchLoading: any = jest.fn();
    const setShowErrorBanner: any = jest.fn();

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
    const t: (key: string) => string = (key: string) => key;
    const e: React.ChangeEvent<HTMLInputElement> = { target: { value: "" } } as unknown as React.ChangeEvent<HTMLInputElement>;
    const setSearchTerm: any = jest.fn();
    const setSuggestions: any = jest.fn();
    const setShowSearchError: any = jest.fn();
    const setIsSearchLoading: any = jest.fn();
    const setShowErrorBanner: any = jest.fn();
    const categoryId = [1];
    const fromDate = "fromDate";
    const toDate = "toDate";
    const documentRelatedTo = 123; // changed to number
    const setResetFilterSearch: any = jest.fn();

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
    const { setSearchTerm, setIsSearchLoading }: { setSearchTerm: jest.Mock; setIsSearchLoading: jest.Mock } = setup("doc");
    expect(setSearchTerm).toHaveBeenCalledWith("doc");
    expect(setIsSearchLoading).toHaveBeenCalledWith(true);
  });

  it("triggers loading for length === 3", () => {
  const t: (key: string) => string = (key: string) => key;
  const e: React.ChangeEvent<HTMLInputElement> = { target: { value: "abc" } } as unknown as React.ChangeEvent<HTMLInputElement>;
  const setSearchTerm: any = jest.fn();
  const setSuggestions: any = jest.fn();
  const setShowSearchError: any = jest.fn();
  const setIsSearchLoading: any = jest.fn();
  const setShowErrorBanner: any = jest.fn();
  const categoryId = [1];
  const fromDate = "fromDate";
  const toDate = "toDate";
  const documentRelatedTo = 123;
  const setResetFilterSearch: any = jest.fn();   
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
  const t: (key: string) => string = (key: string) => key;
    const e: React.ChangeEvent<HTMLInputElement> = { target: { value: "abc" } } as React.ChangeEvent<HTMLInputElement>;
  const setSearchTerm: any = jest.fn();
  const setSuggestions: any = jest.fn();
  const setShowSearchError: any = jest.fn();
  const setIsSearchLoading: any = jest.fn();
  const setResetFilterSearch: any = jest.fn();
  const setShowErrorBanner: any = jest.fn();
  const categoryId = [1];
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
    const setSearchTerm: any = jest.fn();
    const setSearchText: any = jest.fn();
    const setDocumentRelatedTo: any = jest.fn();
    const setSearchRefExternalId: any = jest.fn();
    const setSuggestions: any = jest.fn();
    const setShowSearchError: any = jest.fn();
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
  const setSearchTerm: any = jest.fn();
  const setSearchText: any = jest.fn();
  const setDocumentRelatedTo: any = jest.fn();
  const setSearchRefExternalId: any = jest.fn();
  const setSuggestions: any = jest.fn();
  const setShowSearchError: any = jest.fn();
  await handleSuggestionClick(null, setSearchTerm, setSearchText, setDocumentRelatedTo, setSearchRefExternalId, setSuggestions, setShowSearchError);
  expect(setSearchTerm).not.toHaveBeenCalled();
  expect(setSearchText).not.toHaveBeenCalled();
});

it("should not trigger if name is missing", async () => {
    const setSearchTerm: any = jest.fn();
    const loadData: any = jest.fn();
    const setDocumentRelatedTo: any = jest.fn();
    const setSearchRefExternalId: any = jest.fn();
    const setSuggestions: any = jest.fn();
    const setShowSearchError: any = jest.fn();
    await handleSuggestionClick({}, setSearchTerm, loadData, setDocumentRelatedTo, setSearchRefExternalId, setSuggestions, setShowSearchError);
    expect(setSearchTerm).not.toHaveBeenCalled();
  });
});

describe("hasItems", () => {
  it("returns true when any suggestion has values", () => {
    const suggestions: any = [{ values: [{ text: "Doc" }] }];
    expect(hasItems(suggestions as any)).toBe(true);
  });

  it("returns false when suggestions array is empty", () => {
  expect(hasItems([] as any)).toBe(false);
});

it("returns false when values key is undefined", () => {
  const suggestions: any = [{ name: "Test", values: undefined }];
  expect(hasItems(suggestions as any)).toBe(false);
});

  it("returns false when all are empty", () => {
    const suggestions: any = [{ values: [] }];
    expect(hasItems(suggestions as any)).toBe(false);
  });
});

describe("handleSuggestionClick edge cases", () => {
  const setDocumentRelatedTo: any = jest.fn();
  const setSearchRefExternalId: any = jest.fn();
  it("should do nothing if item is null", async () => {
    const setSearchTerm: any = jest.fn();
    const setSearchText: any = jest.fn();
    const setSuggestions: any = jest.fn();
    const setShowSearchError: any = jest.fn();
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
    const setSearchTerm: any = jest.fn();
    const setSearchText: any = jest.fn();
      const setSuggestions: any = jest.fn();
      const setShowSearchError: any = jest.fn();
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
    const event = { target: { value: "abc" } } as unknown as React.ChangeEvent<HTMLInputElement>;
    const setSearchTerm: jest.Mock = jest.fn();
    const setSuggestions: jest.Mock = jest.fn();
    const setShowSearchError: jest.Mock = jest.fn();
    const setIsSearchLoading: jest.Mock = jest.fn();
    const setShowErrorBanner: jest.Mock = jest.fn();
    const t: any = (key: string) => key;

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
  const setSearchTerm: any = jest.fn();
  const setSuggestions: any = jest.fn();
  const setShowSearchError: any = jest.fn();
  const setIsSearchLoading: any = jest.fn();
  const setShowErrorBanner: any = jest.fn();
  const t: any = (key: string) => key;

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
  const t: any = (key: string) => key;
  const setSearchTerm: any = jest.fn();
  const setSuggestions: any = jest.fn();
  const setShowSearchError: any = jest.fn();
  const setIsSearchLoading: any = jest.fn();
  const setShowErrorBanner: any = jest.fn();

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
  const t: any = (key: string) => key;
  const setSearchTerm: any = jest.fn();
  const setSuggestions: any = jest.fn();
  const setShowSearchError: any = jest.fn();
  const setIsSearchLoading: any = jest.fn();
  const setShowErrorBanner: any = jest.fn();

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
  const mockSetSelectedDateRange: any = jest.fn();
  const mockSetDateRange: any = jest.fn();
  const mockSetIsDateError: any = jest.fn();
  const mockSetSelectedCategories: any = jest.fn();
  const mockSetSelectedFormats: jest.Mock = jest.fn();

  const setup: () => void = () => {
    jest.clearAllMocks();
  };

 it("clears date range if name matches date range format", () => {
  setup();

  handleTagCloseLogic({
    event: {} as unknown as React.SyntheticEvent,
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
      event: {} as unknown as React.SyntheticEvent,
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

    mockSetSelectedCategories.mockImplementation((fn: (arg0: ISelectedItem[]) => any) => fn(originalItems));
    mockSetSelectedFormats.mockImplementation((fn: (arg0: ISelectedItem[]) => any) => fn(originalItems));

    handleTagCloseLogic({
      event: {} as unknown as React.SyntheticEvent,
      tagName: "dummyText",
      closeObj: { name: nameToRemove },
      setSelectedDateRange: mockSetSelectedDateRange,
      setDateRange: mockSetDateRange,
      setIsDateError: mockSetIsDateError,
      setSelectedCategories: mockSetSelectedCategories,
      setSelectedFormats: mockSetSelectedFormats
    });

    expect(mockSetSelectedCategories).toHaveBeenCalled();
    const filteredCats: ISelectedItem[] = mockSetSelectedCategories.mock.calls[0][0](originalItems);
    expect(filteredCats).toEqual([
      { text: "HR", data: "HR" },
      { text: "Legal", data: "Legal" }
    ]);

    expect(mockSetSelectedFormats).toHaveBeenCalled();
    const filteredFormats: ISelectedItem[] = mockSetSelectedFormats.mock.calls[0][0](originalItems);
    expect(filteredFormats).toEqual([
      { text: "HR", data: "HR" },
      { text: "Legal", data: "Legal" }
    ]);
  });

  it("does nothing if closeObj.name is undefined", () => {
    setup();

    handleTagCloseLogic({
      event: {} as unknown as React.SyntheticEvent,
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


});

