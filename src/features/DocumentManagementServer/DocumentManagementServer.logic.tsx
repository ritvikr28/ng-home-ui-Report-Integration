import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipAlign,
  TooltipPosition,
  ShowValAs,
  Tag,
} from "@essnextgen/ui-kit";
import { fetchDocumentDetails } from "./ApiService";
import {
  DocumentBasicDetails,
  DocumentManagementServerProps,
} from "./responseModel";

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
      <>
        <div style={{ display: "flex" }}>
          <Tooltip
            dataTestId="tooltip-eventtime"
            content={<span>{e}</span>}
            align={TooltipAlign.Center}
            position={TooltipPosition.Bottom}
          >
            <div className="tooltip-content document-text">
              <span> {e} </span>
            </div>
          </Tooltip>
          <Tag
            dataTestId="name"
            id="name"
            className="relatedto-tag"
            text="Locked"
          />
        </div>
      </>
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
    anyComponent: (elem: any) => (
      <>
        {!elem || !Array.isArray(elem) || !elem?.length ? (
          []
        ) : (
          <div className="relatedto-main">
            <a href="/pupilprofile">{elem[0]}</a>
            <Tag
              dataTestId="name"
              id="name"
              className="relatedto-tag"
              text="Year / Reg"
            />
            {elem?.length > 1 ? (
              <Tooltip
                dataTestId="tooltip-eventtime"
                content={
                  <div>
                    {elem?.map((item: any) => (
                      <div>{item} | "Year" | "Reg"</div>
                    ))}
                  </div>
                }
                align={TooltipAlign.Center}
                position={TooltipPosition.Bottom}
              >
                <div className="tooltip-content">
                  <span>{`+${elem.length - 1}`}</span>
                </div>
              </Tooltip>
            ) : (
              ""
            )}
          </div>
        )}
      </>
    ),
  },
  {
    text: "Category",
    isShow: true,
    showValAs: ShowValAs.CustomeComponent,
    isHeaderTextTruncate: true,
    headerTxtTrunctLength: 20,
    isColumnSorting: false,
    columnWidth: "144px",
    anyComponent: (e: any) => (
      <>
        <Tooltip
          dataTestId="tooltip-eventtime"
          content={<span>{e}</span>}
          align={TooltipAlign.Center}
          position={TooltipPosition.Bottom}
        >
          <div className="tooltip-content document-text">
            <span> {e} </span>
          </div>
        </Tooltip>
      </>
    ),
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
    showValAs: ShowValAs.CustomeComponent,
    txtTrunctLength: 12,
    isColumnSorting: false,
    isTextTruncate: false,
    isHeaderTextTruncate: true,
    headerTxtTrunctLength: 50,
    columnWidth: "120px",
    anyComponent: (e: any) => (
      <>
        <Tooltip
          dataTestId="tooltip-eventtime"
          content={<span>{e}</span>}
          align={TooltipAlign.Center}
          position={TooltipPosition.Bottom}
        >
          <div className="tooltip-content document-text">
            <span>{e}</span>
          </div>
        </Tooltip>
      </>
    ),
  },
  {
    text: "Size",
    isShow: true,
    showValAs: ShowValAs.CustomeComponent,
    txtTrunctLength: 12,
    isColumnSorting: false,
    isTextTruncate: false,
    isHeaderTextTruncate: true,
    headerTxtTrunctLength: 50,
    columnWidth: "129px",
    anyComponent: (e: any) => (
      <>
        <Tooltip
          dataTestId="tooltip-eventtime"
          content={<span>{e}</span>}
          align={TooltipAlign.Center}
          position={TooltipPosition.Bottom}
        >
          <div className="tooltip-content document-text">
            <span>{e}</span>
          </div>
        </Tooltip>
      </>
    ),
  },
];
export const tableBodyData: {
  id: string;
  Document: string;
  Relatedto: string[];
  Category: string;
  Addedby: string;
  "Date added": string;
  Format: string;
  Size: string;
}[] = [
  {
    id: "72ff5e2f-f2ed-4f56-8a3b-8277a41b8c87",
    Document: "Name ",
    Relatedto: ["Bayberry View High", "Benjamin Johnson", "Charmaine Brown"],
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
    Relatedto: ["Araminta Martin"],
    Category: "Conduct",
    Addedby: "Richard Wilton",
    "Date added": "01 Jan 2025",
    Format: "doc",
    Size: "3KB",
  },
];

const DocumentManagementServer = ({
  pageNumber,
  pageSize,
}: DocumentManagementServerProps) => {
  const [data, setData]: [
    DocumentBasicDetails | null,
    React.Dispatch<React.SetStateAction<DocumentBasicDetails | null>>
  ] = useState<DocumentBasicDetails | null>(null);
  const [error, setError]: [
    string | null,
    React.Dispatch<React.SetStateAction<string | null>>
  ] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchData: () => Promise<void> = async () => {
      const result: DocumentBasicDetails | null = await fetchDocumentDetails({
        pageNumber,
        pageSize,
      });
      if (result) {
        setData(result);
      } else {
        setError("Failed to fetch data");
      }
      setHasFetched(true);
    };

    fetchData();
  }, [pageNumber, pageSize]);

  return { data, error, hasFetched };
};

export default DocumentManagementServer;
