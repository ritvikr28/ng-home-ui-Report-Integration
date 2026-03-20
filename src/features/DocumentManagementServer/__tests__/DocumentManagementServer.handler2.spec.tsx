import React from "react";
import * as Logic from "../logic/DocumentManagementServer.handler";
import { handleBulkDeleteLogic, handleEditSelectedOverFlowMenu } from "../logic/DocumentManagementServer.handler";
import { mapToBulkDeletePayload } from "../logic/DocumentManagementServer.logic";

jest.mock("../../../shared/utils/analytics", () => ({
  pushEvent: jest.fn()
}));

jest.mock("../logic/DocumentManagementServer.handler", () => {
  const original: typeof import("../logic/DocumentManagementServer.handler") = jest.requireActual("../logic/DocumentManagementServer.handler");
  return {
    ...original,
    isInvalidDateRange: jest.fn(() => false)
  };
});

const createChangeEvent = (value: string): React.ChangeEvent<HTMLInputElement> =>
  ({
    target: { value }
  } as unknown as React.ChangeEvent<HTMLInputElement>);

  const createSyntheticEvent: any = (): React.SyntheticEvent => {
  const obj: any = {};
  return obj as unknown as React.SyntheticEvent;
};

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

  const docData: any = {
    data: [
      { fileId: "1", registrationId: 101, externalId: "ext1" },
      { fileId: "2", registrationId: 102, externalId: "ext2" }
    ],
    totalRecords: 2
  };

  const allSelectedDocs: any = [
    { fileId: "1", registrationId: 101, externalId: "ext1" },
    { fileId: "2", registrationId: 102, externalId: "ext2" }
  ];

  const allRegistrationIds: any = [101, 102];
  const dateRange: any = { fromDate: "2025-01-01", toDate: "2025-01-02" };
  const searchRefExternalId: any = ["ref1"];
  const documentRelatedTo: any = 1;
  const currentPage: any = 1;
  const sortBy: any = "Document";
  const sortDirection: any = "Asc";
  const excludedCheckBoxIds: any = ["2"];

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
    const callPayload: any = deleteFiles.mock.calls[0][0];
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

    const callPayload: any = deleteFiles.mock.calls[0][0];
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

    const callPayload: any = deleteFiles.mock.calls[0][0];
    expect(callPayload.request.excludedFileDetails).toEqual([]);
  });
  
  
describe("mapToBulkDeletePayload", () => {
  it("returns correct payload with all arguments provided", () => {
    const result: any = mapToBulkDeletePayload({
      isSelectAll: true,
      categoryIds: [1, 2],
      fromDate: "2025-01-01",
      toDate: "2025-01-31",
      documentStatusIds: [],
      referenceExternalIds: ["ref1", "ref2"],
      documentRelatedTo: 3,
      fileDetails: [
        { fileId: "f1", registrationId: 10, externalId: "e1" }
      ],
      excludedFileDetails: [
        { fileId: "f2", externalId: "e2" }
      ]
    });

    expect(result).toEqual({
      request: {
        isSelectAll: true,
        bulkDeleteCriteria: {
          categoryIds: [1, 2],
          fromDate: "2025-01-01",
          toDate: "2025-01-31",
          documentStatusIds: [],
          referenceDetails: {
            referenceExternalIds: ["ref1", "ref2"],
            documentRelatedTo: 3
          }
        },
        fileDetails: [
          { fileId: "f1", registrationId: 10, externalId: "e1" }
        ],
        excludedFileDetails: [
          { fileId: "f2", externalId: "e2" }
        ]
      }
    });
  });

  it("returns correct payload with only required/default arguments", () => {
    const result: any = mapToBulkDeletePayload({});
    expect(result).toEqual({
      request: {
        isSelectAll: false,
        bulkDeleteCriteria: {
          categoryIds: [],
          fromDate: "",
          toDate: "",
          documentStatusIds: [],
          referenceDetails: {
            referenceExternalIds: [],
            documentRelatedTo: 0
          }
        },
        fileDetails: [],
        excludedFileDetails: []
      }
    });
  });

  it("handles empty arrays for fileDetails and excludedFileDetails", () => {
    const result: any = mapToBulkDeletePayload({
      fileDetails: [],
      excludedFileDetails: []
    });
    expect(result.request.fileDetails).toEqual([]);
    expect(result.request.excludedFileDetails).toEqual([]);
  });

  it("handles missing optional arguments", () => {
    // Only provide some arguments
    const result: any = mapToBulkDeletePayload({
      isSelectAll: true,
      categoryIds: [5],
      documentRelatedTo: 2
    });
    expect(result).toEqual({
      request: {
        isSelectAll: true,
        bulkDeleteCriteria: {
          categoryIds: [5],
          fromDate: "",
          toDate: "",
          documentStatusIds: [],
          referenceDetails: {
            referenceExternalIds: [],
            documentRelatedTo: 2
          }
        },
        fileDetails: [],
        excludedFileDetails: []
      }
    });
  });

  it("handles undefined values for all arguments", () => {
    const result: any = mapToBulkDeletePayload({
      isSelectAll: undefined,
      categoryIds: undefined,
      fromDate: undefined,
      toDate: undefined,
      documentStatusIds: undefined,
      referenceExternalIds: undefined,
      documentRelatedTo: undefined,
      fileDetails: undefined,
      excludedFileDetails: undefined
    });
    expect(result).toEqual({
      request: {
        isSelectAll: false,
        bulkDeleteCriteria: {
          categoryIds: [],
          fromDate: "",
          toDate: "",
          documentStatusIds: [],
          referenceDetails: {
            referenceExternalIds: [],
            documentRelatedTo: 0
          }
        },
        fileDetails: [],
        excludedFileDetails: []
      }
    });
  });
});

describe("handleEditSelectedOverFlowMenu", () => {
  const getMocks: any = () => ({
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
        availableFileCount: 3
      },
      status : 200
    }))
  });

  const baseArgs: any = {
    e: createSyntheticEvent(),
    selectedItem: { value: "Prepare download" },
    totalSelectedCount: 1,
    isHeaderBoxChecked: false,
    allSelectedDocs: [{ fileId: "1" }],
    allRegistrationIds: [1, 2],
    dateRange: { fromDate: "2025-01-01", toDate: "2025-01-02" },
    searchRefExternalId: ["ref1"],
    documentRelatedTo: 1
  };

  it("shows dialog if nothing selected", async () => {
    const mocks: any = getMocks();
    await handleEditSelectedOverFlowMenu({
      ...baseArgs,
      ...mocks,
      totalSelectedCount: 0
    });
    expect(mocks.setShowDialog).toHaveBeenCalledWith(true);
    expect(mocks.setShowConfirmDialog).toHaveBeenCalled();
  });
  it("shows error banner if validation api fails", async () => {
    const mocks: any = getMocks();
    mocks.validation.mockResolvedValueOnce({
      status: 400,
      data: { restrictedFileCount: 0, alreadyDeletedFileCount: 0, availableFileCount: 0 }
    });
    await handleEditSelectedOverFlowMenu({
      ...baseArgs,
      ...mocks,
      selectedItem: { value: "Prepare download" },
      totalSelectedCount: 1
    });
    expect(mocks.setIsPreDialogLoading).toHaveBeenCalledWith(false);
    expect(mocks.setShowErrorBanner).toHaveBeenCalledWith(false);
    expect(mocks.setShowDialog).toHaveBeenCalledWith(false);
  });

  it("shows restricted prepare dialog if available=0 and alreadyDeleted>0 for Prepare download", async () => {
    const mocks: any = getMocks();
    mocks.validation.mockResolvedValueOnce({
      data: { restrictedFileCount: 0, alreadyDeletedFileCount: 1, availableFileCount: 0 },
      status: 200
    });
    await handleEditSelectedOverFlowMenu({
      ...baseArgs,
      ...mocks,
      selectedItem: { value: "Prepare download" },
      totalSelectedCount: 1
    });
    expect(mocks.setShowRestrictedPrepareDialog).toHaveBeenCalledWith(false);
    expect(mocks.setShowConfirmDialog).toHaveBeenCalledWith(false);
  });

  it("shows restricted delete dialog if available=0 and restricted>0 for Delete", async () => {
    const mocks: any = getMocks();
    mocks.validation.mockResolvedValueOnce({
      data: { restrictedFileCount: 1, alreadyDeletedFileCount: 0, availableFileCount: 0 },
      status: 200
    });
    await handleEditSelectedOverFlowMenu({
      ...baseArgs,
      ...mocks,
      selectedItem: { value: "Delete" },
      totalSelectedCount: 1
    });
    expect(mocks.setShowRestrictedDeleteDialog).toHaveBeenCalledWith(true);
    expect(mocks.setShowConfirmDialog).toHaveBeenCalledWith(false);
  });

  it("shows confirm dialog if available>0 for Delete", async () => {
    const mocks: any = getMocks();
    mocks.validation.mockResolvedValueOnce({
      data: { restrictedFileCount: 0, alreadyDeletedFileCount: 0, availableFileCount: 2 },
      status: 200
    });
    await handleEditSelectedOverFlowMenu({
      ...baseArgs,
      ...mocks,
      selectedItem: { value: "Delete" },
      totalSelectedCount: 1
    });
    expect(mocks.setShowConfirmDialog).toHaveBeenCalledWith(false);
    expect(mocks.setShowRestrictedDeleteDialog).toHaveBeenCalledWith(false);
  });

  it("shows confirm dialog for Prepare download if available>0", async () => {
    const mocks: any = getMocks();
    mocks.validation.mockResolvedValueOnce({
      data: { restrictedFileCount: 0, alreadyDeletedFileCount: 0, availableFileCount: 1 },
      status: 200
    });
    await handleEditSelectedOverFlowMenu({
      ...baseArgs,
      ...mocks,
      selectedItem: { value: "Prepare download" },
      totalSelectedCount: 1
    });
    expect(mocks.setShowConfirmDialog).toHaveBeenCalledWith(false);
  });

  it("opens side panel for view download", async () => {
    const mocks: any = getMocks();
    await handleEditSelectedOverFlowMenu({
      ...baseArgs,
      ...mocks,
      selectedItem: { value: "View download" },
      totalSelectedCount: 1
    });
    expect(mocks.setSidePanelOpenReason).toHaveBeenCalledWith("view");
    expect(mocks.setIsSidePanelOpen).toHaveBeenCalledWith(true);
  });

  it("clears suggestions and loading for whitespace-only input", () => {
    const t: any = (key: string) => key;
    const event: React.ChangeEvent<HTMLInputElement> = createChangeEvent("   ");
    const setSearchTerm: any = jest.fn();
    const setSuggestions: any = jest.fn();
    const setShowSearchError: any = jest.fn();
    const setIsSearchLoading: any = jest.fn();
    const setShowErrorBanner: any = jest.fn();
    const categoryId: any[] = [];
    const fromDate: any = "";
    const toDate: any = "";
    const setResetFilterSearch: any = jest.fn();


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

})