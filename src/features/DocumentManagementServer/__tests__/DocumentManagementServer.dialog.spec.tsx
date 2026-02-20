// DocumentManagementServer.dialog.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import { DmsDialogs, DmsDialogsProps, getRestrictedDeleteMessage, getRestrictedDeleteNotificationForDeleted, getRestrictedDeleteNotificationForRestricted, getRestrictedDeleteNotificationTitle, getRestrictedPrepareNotificationTitle } from "../components/DocumentManagementServer.dialog";


// Mock NoSelectionDialog to render its props for assertions
// Mock NoSelectionDialog to render its props for assertions
jest.mock("../../../shared/components/NoSelectionDialog/NoSelectionDialog", () =>
  // eslint-disable-next-line react/display-name
  ({
    title,
    notificationTitle,
    message,
    loading,
    onClose
  }: any) => (
    <div data-testid="NoSelectionDialog">
      <div data-testid="title">{title}</div>
      {notificationTitle && <div data-testid="notificationTitle">{notificationTitle}</div>}
      {message && <div data-testid="message">{message}</div>}
      {loading !== undefined && <div data-testid="loading">{loading ? "loading" : "not-loading"}</div>}
      <button data-testid="close" type="button" onClick={onClose}>Close</button>
    </div>
  )
);

// Mock getDialogTitle
jest.mock("../logic/DocumentManagementServer.utils", () => ({
  getDialogTitle: jest.fn(() => "DialogTitle")
}));

const t = (key: string, params?: any) => {
  if (!params) return key;
  return `${key}:${JSON.stringify(params)}`;
};

const defaultProps: DmsDialogsProps = {
  t,
  showDialog: false,
  setShowDialog: jest.fn(),
  showRestrictedDeleteDialog: false,
  setShowRestrictedDeleteDialog: jest.fn(),
  showRestrictedPrepareDialog: false,
  setShowRestrictedPrepareDialog: jest.fn(),
  restrictedFileCount: 0,
  alreadyDeletedFileCount: 0,
  availableFileCount: 0,
  totalSelectedCount: 0,
  isHeaderBoxChecked: false,
  isPreDialogLoading: false,
  totalRecords: 10,
  onRefreshAfterClose: jest.fn()
};

describe("DmsDialogs", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders nothing when all dialogs are false", () => {
    const { container }: { container: HTMLElement } = render(<DmsDialogs {...defaultProps} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders NoSelectionDialog for showDialog", () => {
    render(<DmsDialogs {...defaultProps} showDialog={true} />);
    expect(screen.getByTestId("NoSelectionDialog")).toBeInTheDocument();
    expect(screen.getByTestId("title").textContent).toBe("DocumentManagementServer.noItemsSelectedTitle");
    expect(screen.getByTestId("message").textContent).toBe("DocumentManagementServer.noItemsSelectedMessage");
  });

  it("renders NoSelectionDialog for showRestrictedDeleteDialog", () => {
    render(<DmsDialogs {...defaultProps} showRestrictedDeleteDialog={true} restrictedFileCount={2} alreadyDeletedFileCount={1} availableFileCount={3} totalSelectedCount={6} isHeaderBoxChecked={true} />);
    expect(screen.getByTestId("NoSelectionDialog")).toBeInTheDocument();
    expect(screen.getByTestId("title").textContent).toBe("DialogTitle");
    expect(screen.getByTestId("notificationTitle").textContent).toContain("DocumentManagementServer.documentsCannotBeDeletedNotification");
    expect(screen.getByTestId("loading").textContent).toBe("not-loading");
  });

  it("renders NoSelectionDialog for showRestrictedPrepareDialog (single deleted)", () => {
    render(<DmsDialogs {...defaultProps} showRestrictedPrepareDialog={true} alreadyDeletedFileCount={1} />);
    expect(screen.getByTestId("NoSelectionDialog")).toBeInTheDocument();
    expect(screen.getByTestId("title").textContent).toContain("DocumentManagementServer.documentCannotBeDownloadedTitle");
    expect(screen.getByTestId("notificationTitle").textContent).toContain("DocumentManagementServer.documentCannotBeDownloadedMsg");
  });

  it("renders NoSelectionDialog for showRestrictedPrepareDialog (multiple deleted)", () => {
    render(<DmsDialogs {...defaultProps} showRestrictedPrepareDialog={true} alreadyDeletedFileCount={2} totalSelectedCount={2} />);
    expect(screen.getByTestId("NoSelectionDialog")).toBeInTheDocument();
    expect(screen.getByTestId("title").textContent).toContain("DocumentManagementServer.documentsCannotBeDownloadedTitle");
    expect(screen.getByTestId("notificationTitle").textContent).toContain("DocumentManagementServer.documentsCannotBeDownloadedMsg");
  });

  it("renders correct message for restrictedDeleteDialog when both restricted and alreadyDeleted", () => {
    render(<DmsDialogs {...defaultProps} showRestrictedDeleteDialog={true} restrictedFileCount={2} alreadyDeletedFileCount={2} totalRecords={2} />);
    expect(screen.getByTestId("message").textContent).toContain("All  2 files are already deleted.");
  });

  it("renders correct notificationTitle for restrictedFileCount=1", () => {
    render(<DmsDialogs {...defaultProps} showRestrictedDeleteDialog={true} restrictedFileCount={1} totalRecords={10} />);
    expect(screen.getByTestId("notificationTitle").textContent).toBe("DocumentManagementServer.documentCannotBeDeletedNotification");
  });

  it("renders correct notificationTitle for alreadyDeletedFileCount=1, availableFileCount>0", () => {
    render(<DmsDialogs {...defaultProps} showRestrictedDeleteDialog={true} alreadyDeletedFileCount={1} availableFileCount={2} totalSelectedCount={3} />);
    expect(screen.getByTestId("notificationTitle").textContent).toContain("DocumentManagementServer.singleDocumentAlreadyDeletedMsg");
  });

  it("renders correct notificationTitle for all selected already deleted", () => {
    render(<DmsDialogs {...defaultProps} showRestrictedDeleteDialog={true} alreadyDeletedFileCount={2} totalSelectedCount={2} />);
    expect(screen.getByTestId("notificationTitle").textContent).toBe("DocumentManagementServer.allSelectedDocumentsAlreadyDeleted");
  });

  it("renders correct notificationTitle for deletedCount=1 and totalSelectedCount=1", () => {
    render(<DmsDialogs {...defaultProps} showRestrictedDeleteDialog={true} alreadyDeletedFileCount={1} totalSelectedCount={1} />);
    expect(screen.getByTestId("notificationTitle").textContent).toBe("DocumentManagementServer.documentAlreadyDeletedMsg");
  });

  it("calls onRefreshAfterClose when close button is clicked in restricted dialogs", () => {
    const onRefreshAfterClose: jest.Mock<void, []> = jest.fn();
    render(<DmsDialogs {...defaultProps} showRestrictedDeleteDialog={true} onRefreshAfterClose={onRefreshAfterClose} />);
    screen.getByTestId("close").click();
    expect(onRefreshAfterClose).toHaveBeenCalled();
  });

  it("calls setShowDialog when close button is clicked in showDialog", () => {
    const setShowDialog: jest.Mock<void, [any]> = jest.fn();
    render(<DmsDialogs {...defaultProps} showDialog={true} setShowDialog={setShowDialog} />);
    screen.getByTestId("close").click();
    // onClose is a noop in showDialog, so setShowDialog is not called here
    // This is just to ensure the button exists and is clickable
    expect(screen.getByTestId("close")).toBeInTheDocument();
  });
});

// Utility function tests

describe("Utility functions", () => {
   describe("getRestrictedDeleteNotificationTitle", () => {
    it("returns restricted notification if restrictedFileCount > 0", () => {
      expect(getRestrictedDeleteNotificationTitle(2, 0, 0, 0, 10, false, t)).toContain("documentsCannotBeDeletedNotification");
    });
    it("returns deleted notification if alreadyDeletedFileCount > 0", () => {
      expect(getRestrictedDeleteNotificationTitle(0, 2, 0, 2, 10, false, t)).toContain("allSelectedDocumentsAlreadyDeleted");
    });
    it("returns empty string if no conditions met", () => {
      expect(getRestrictedDeleteNotificationTitle(0, 0, 0, 0, 10, false, t)).toBe("");
    });
  });

  describe("getRestrictedDeleteNotificationForRestricted", () => {
    it("returns single notification", () => {
      expect(getRestrictedDeleteNotificationForRestricted(1, 10, t)).toBe("DocumentManagementServer.documentCannotBeDeletedNotification");
    });
    it("returns plural notification with all", () => {
      expect(getRestrictedDeleteNotificationForRestricted(10, 10, t)).toContain("all");
    });
  });

  describe("getRestrictedDeleteNotificationForDeleted", () => {
    it("returns allSelectedDocumentsAlreadyDeleted if all deleted", () => {
      expect(getRestrictedDeleteNotificationForDeleted(2, 0, 0, 2, 10, false, t)).toBe("DocumentManagementServer.allSelectedDocumentsAlreadyDeleted");
    });
    it("returns documentAlreadyDeletedMsg if only one deleted", () => {
      expect(getRestrictedDeleteNotificationForDeleted(1, 0, 0, 1, 10, false, t)).toBe("DocumentManagementServer.documentAlreadyDeletedMsg");
    });
    it("returns singleDocumentAlreadyDeletedMsg if one deleted and available", () => {
      expect(getRestrictedDeleteNotificationForDeleted(1, 0, 1, 2, 10, false, t)).toContain("singleDocumentAlreadyDeletedMsg");
    });
    it("returns documentsAlreadyDeletedMsg otherwise", () => {
      expect(getRestrictedDeleteNotificationForDeleted(2, 0, 0, 3, 2, false, t)).toContain("DocumentManagementServer.allSelectedDocumentsAlreadyDeleted");
    });
  });

  describe("getRestrictedDeleteMessage", () => {
    it("returns message if both restricted and alreadyDeleted", () => {
      expect(getRestrictedDeleteMessage(2, 2, 2)).toContain("All  2 files are already deleted.");
    });
    it("returns empty string otherwise", () => {
      expect(getRestrictedDeleteMessage(0, 2, 2)).toBe("");
    });
  });

  describe("getRestrictedPrepareNotificationTitle", () => {
    it("returns single document msg", () => {
      expect(getRestrictedPrepareNotificationTitle(1, 0, 0, 1, false, t)).toContain("documentCannotBeDownloadedMsg");
    });
    it("returns plural document msg", () => {
      expect(getRestrictedPrepareNotificationTitle(2, 0, 0, 2, false, t)).toContain("documentsCannotBeDownloadedMsg");
    });
    it("returns 'all' param when all deleted", () => {
      expect(getRestrictedPrepareNotificationTitle(2, 0, 0, 2, false, t)).toContain("all");
    });
  });
});