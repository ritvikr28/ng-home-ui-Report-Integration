import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SidePanelTable } from "../components/DMSSidePanel/SidePanelTable";
import * as LogicModule from "../logic/DocumentManagementServer.logic";

jest.mock("../logic/DocumentManagementServer.logic", () => ({
  ...jest.requireActual("../logic/DocumentManagementServer.logic"),
  fileDownload: jest.fn(() => Promise.resolve())
}));

jest.mock("../components/EllipsisWithTooltip", () => ({
  EllipsisWithTooltip: ({ text }: { text: string }) => <span>{text}</span>
}));

jest.mock("@essnextgen/ui-kit", () => {
  const original: any = jest.requireActual("@essnextgen/ui-kit");
  return {
    ...original,
    ControlledList: ({ tableHeadersData, tableBodyData }: any) => {
      const docCol = tableHeadersData?.find((h: any) => h.text === "Document");
      const firstRow = tableBodyData?.[0];
      return (
        <div data-testid="mock-controlled-list">
          {docCol && firstRow && docCol.anyComponent(firstRow.document)}
        </div>
      );
    }
  };
});

const mockDoc = {
  name: "Test Document",
  fileId: "file-123",
  application: "TestApp",
  sectionName: "Section1",
  blobName: "test-blob.pdf"
};

const buildTableData = (doc: any) => [
  { id: doc.fileId, document: [doc], relatedTo: [], addedBy: "User", dateAdded: "01 Jan 2025" }
];

const defaultProps = {
  tableBodyData: buildTableData(mockDoc),
  onSortChange: jest.fn(),
  onDownloadError: jest.fn()
};

describe("SidePanelTable - handleDocumentClick", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (LogicModule.fileDownload as jest.Mock).mockResolvedValue(undefined);
  });

  it("calls onDownloadError(false) before initiating the download", async () => {
    render(<SidePanelTable {...defaultProps} />);
    fireEvent.click(screen.getByText("Test Document"));
    await waitFor(() => {
      expect(defaultProps.onDownloadError).toHaveBeenCalledWith(false);
    });
  });

  it("calls fileDownload with the correct arguments on document click", async () => {
    render(<SidePanelTable {...defaultProps} />);
    fireEvent.click(screen.getByText("Test Document"));
    await waitFor(() => {
      expect(LogicModule.fileDownload).toHaveBeenCalledWith(
        "file-123",
        "Test Document",
        "TestApp",
        "Section1",
        "test-blob.pdf"
      );
    });
  });

  it("does not call onDownloadError(true) when fileDownload succeeds", async () => {
    render(<SidePanelTable {...defaultProps} />);
    fireEvent.click(screen.getByText("Test Document"));
    await waitFor(() => {
      expect(LogicModule.fileDownload).toHaveBeenCalled();
    });
    expect(defaultProps.onDownloadError).not.toHaveBeenCalledWith(true);
  });

  it("calls onDownloadError(true) when fileDownload throws an error", async () => {
    (LogicModule.fileDownload as jest.Mock).mockRejectedValue(new Error("Download failed"));
    render(<SidePanelTable {...defaultProps} />);
    fireEvent.click(screen.getByText("Test Document"));
    await waitFor(() => {
      expect(defaultProps.onDownloadError).toHaveBeenCalledWith(true);
    });
    expect(defaultProps.onDownloadError).toHaveBeenCalledWith(false);
  });

  it("calls onDownloadError(false) before onDownloadError(true) on failure", async () => {
    (LogicModule.fileDownload as jest.Mock).mockRejectedValue(new Error("Network error"));
    render(<SidePanelTable {...defaultProps} />);
    fireEvent.click(screen.getByText("Test Document"));
    await waitFor(() => {
      expect(defaultProps.onDownloadError).toHaveBeenCalledTimes(2);
    });
    expect(defaultProps.onDownloadError).toHaveBeenNthCalledWith(1, false);
    expect(defaultProps.onDownloadError).toHaveBeenNthCalledWith(2, true);
  });

  it("uses empty string for sectionName when it is undefined", async () => {
    const docWithoutSection = { ...mockDoc, sectionName: undefined as any };
    render(<SidePanelTable {...defaultProps} tableBodyData={buildTableData(docWithoutSection)} />);
    fireEvent.click(screen.getByText("Test Document"));
    await waitFor(() => {
      expect(LogicModule.fileDownload).toHaveBeenCalledWith(
        "file-123",
        "Test Document",
        "TestApp",
        "",
        "test-blob.pdf"
      );
    });
  });
});
