import React from "react";
import { ShowValAs, Tag } from "@essnextgen/ui-kit";
import DocumentManagementServerView from "./DocumentManagementServer.view";

export const getTableHeadersData: {
  text: string;
  isShow: boolean;
  showValAs: ShowValAs;
  isTextTruncate?: boolean;
  columnWidth: string;
  isHeaderTextTruncate?: boolean;
  headerTxtTrunctLength?: number;
  isSimpleText?: boolean;
  txtTrunctLength?: number;
  isColumnSorting?: boolean;
  anyComponent?: (e: any) => JSX.Element;
}[] = [
  {
    text: "Id",
    isShow: false,
    showValAs: ShowValAs.Text,
    isTextTruncate: false,
    columnWidth: "16px",
  },
  {
    text: "Document",
    isShow: true,
    showValAs: ShowValAs.CustomeComponent,
    isTextTruncate: false,
    isHeaderTextTruncate: true,
    columnWidth: "267px",
    headerTxtTrunctLength: 50,
    isSimpleText: true,
    txtTrunctLength: 35,
    isColumnSorting: false,
    anyComponent: (e: any) => (
      <div style={{ display: "flex" }}>
        <span className="document-text">{e}</span>
        <Tag
          dataTestId="name"
          id="name"
          className="relatedto-tag"
          text="Locked"
        />
      </div>
    ),
  },
  {
    text: "Related to",
    isShow: true,
    showValAs: ShowValAs.CustomeComponent,
    isTextTruncate: true,
    isHeaderTextTruncate: true,
    headerTxtTrunctLength: 17,
    columnWidth: "261px",
    txtTrunctLength: 35,
    anyComponent: (e: any) => (
      <div style={{ display: "flex", gap: "2%" }}>
        <>{e}</>
        <Tag
          dataTestId="name"
          id="name"
          className="relatedto-tag"
          text="Year / Reg"
        />
      </div>
    ),
  },
  {
    text: "Category",
    isShow: true,
    showValAs: ShowValAs.Text,
    isHeaderTextTruncate: true,
    headerTxtTrunctLength: 20,
    isColumnSorting: false,
    columnWidth: "144px",
  },
  {
    text: "Added by",
    isShow: true,
    showValAs: ShowValAs.Text,
    headerTxtTrunctLength: 50,
    columnWidth: "180px",
  },
  {
    text: "Date added",
    isShow: true,
    columnWidth: "140px",
    showValAs: ShowValAs.Text,
    isTextTruncate: false,
    isColumnSorting: false,
  },
  {
    text: "Format",
    isShow: true,
    showValAs: ShowValAs.Text,
    txtTrunctLength: 12,
    isColumnSorting: false,
    isTextTruncate: false,
    isHeaderTextTruncate: true,
    headerTxtTrunctLength: 50,
    columnWidth: "120px",
  },
  {
    text: "Size",
    isShow: true,
    showValAs: ShowValAs.Text,
    txtTrunctLength: 12,
    isColumnSorting: false,
    isTextTruncate: false,
    isHeaderTextTruncate: true,
    headerTxtTrunctLength: 50,
    columnWidth: "129px",
  }
];
export const tableBodyData: {
  id: string;
  Document: string;
  Relatedto: string;
  Category: string;
  Addedby: string;
  "Date added": string;
  Format: string;
  Size: string;
}[] = [
  {
    id: "72ff5e2f-f2ed-4f56-8a3b-8277a41b8c87",
    Document: "Name ",
    Relatedto: "Bayberry View High",
    Category: "School",
    Addedby: "Helen Avery",
    "Date added": "01 Jan 2025",
    Format: "pdf",
    Size: "300 bytes",
  },
  {
    id: "72ff5e2f-f2ed-4f56-8a3b-8277a41b8c87",
    Document:
      "This is very long name that we have dsghgdfhgfhsdffdsdfds sdfhgsdjfgsjhdfgsjd fsdfsfsdhfgsdjfg fsdhfgjsdfgsj ",
    Relatedto: "Araminta Martin",
    Category: "Conduct",
    Addedby: "Richard Wilton",
    "Date added": "01 Jan 2025",
    Format: "doc",
    Size: "3KB",
  }
];
const DocumentManagementServer: React.FC = () => (
  <>
    <DocumentManagementServerView />
  </>
);

export default DocumentManagementServer;
