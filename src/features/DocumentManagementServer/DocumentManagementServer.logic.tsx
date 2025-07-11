import React, { useEffect, useState } from "react";
import { Tooltip, TooltipAlign, TooltipPosition, ShowValAs, Tag, Suggestion, ISearchItemProp } from "@essnextgen/ui-kit";
import { fetchDMSSuggestions, fetchDocumentDetails, fetchDocumentSuggestions } from "./ApiService";
import { DocumentBasicDetails,  DocumentManagementServerProps, tableDataProps } from "./responseModel";
import gtmAnalytics from "../../shared/utils/analytics";

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
        {!elem?.length ? null : (
          <div className="relatedto-main">
            <a href="/pupilprofile">{elem[0]}</a>
            <Tag className="relatedto-tag" text="Year / Reg" />
            {elem.length > 1 && (
              <Tooltip
                dataTestId="tooltip-eventtime"
                content={
                  <div>
                    {elem.map((item: any, idx: number) => (
                      <div key={idx}>{item} | "Year" | "Reg"</div>
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
      <Tooltip
        content={<span>{e}</span>}
        align={TooltipAlign.Center}
        position={TooltipPosition.Bottom}
      >
        <div className="tooltip-content document-text">
          <span>{e}</span>
        </div>
      </Tooltip>
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
      <Tooltip
        content={<span>{e}</span>}
        align={TooltipAlign.Center}
        position={TooltipPosition.Bottom}
      >
        <div className="tooltip-content document-text">
          <span>{e}</span>
        </div>
      </Tooltip>
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
 anyComponent: (e: any) => {
    // Support both string and array input
    const value = Array.isArray(e) ? e[0] : e;
    if (!value) return null;
    return (
      <div style={{ display: "flex" }}>
        <Tooltip
          dataTestId="tooltip-eventtime"
          content={<span>{value}</span>}
          align={TooltipAlign.Center}
          position={TooltipPosition.Bottom}
        >
          <div className="tooltip-content document-text">
            <span>{value}</span>
          </div>
        </Tooltip>
      </div>
    );
  },
  }
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
  }
];
export const handlePageChange = (
  _event: any,
  page: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true);
  setCurrentPage(page);
};

// Breadcrumb logic
export const onBreadcrumbClick = (path: string) => {
  window.location.assign(path);
  gtmAnalytics.pushEvent({
    event: "click",
    linkText: "Documents",
    linkUrl: "",
    clickType: "link",
    clickLocation: "breadcrumb",
  });
};

// Suggestion item click logic
export const handleSuggestionClick = async (
  item: ISearchItemProp | null,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
  loadDocumentData: (text: string, page?: number) => void
) => {
  if (!item || !item.name) return;
  setSearchTerm(item.name);
  await loadDocumentData(item.name, 1);
};

// Has items check
export const hasItems = (suggestions: Suggestion[]): boolean =>
  suggestions?.some(({ values }) => values?.length > 0);

// Search input change logic
export const handleSearchChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
  setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>,
  setShowSearchError: React.Dispatch<React.SetStateAction<boolean>>,
  setIsSearchLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { value } = e.target;
  setSearchTerm(value);

  if (value?.length < 3) {
    setSuggestions([]);
    setShowSearchError(false);
    setIsSearchLoading(false);
    return;
  }

  setIsSearchLoading(true);
  setSuggestions([]);

  debouncedFetchSuggestions(
    value,
    setIsSearchLoading,
    setSuggestions,
    setShowSearchError
  );
};

export const loadSuggestions = async (
  text: string,
  setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>,
  setSuggestionsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    setSuggestionsLoading(true);
    const result = await fetchDMSSuggestions(text);
    setSuggestions(result);
  } catch (err) {
    console.error("Suggestion fetch failed:", err);
    setSuggestions([]);
  } finally {
    setSuggestionsLoading(false);
  }
};
  
const DocumentManagementServer = ({ pageNumber, pageSize, searchText }: DocumentManagementServerProps) => {
  const [data, setData]: [DocumentBasicDetails | null, React.Dispatch<React.SetStateAction<DocumentBasicDetails | null>>] = useState<DocumentBasicDetails | null>(null);
  const [error, setError]: [string | null, React.Dispatch<React.SetStateAction<string | null>>] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);

  // === Fetch Document Table Data ===
  useEffect(() => {
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchDocumentDetails({
          pageNumber,
          pageSize,
          searchText,
        });

        if (result) {
          setData(result);
          const transformed: tableDataProps[] = result.data.map((doc) => ({
            id: doc.fileId,
            Document: doc.document,
            Relatedto: doc.relatedTo || [],
            Category: doc.category,
            Addedby: doc.addedBy,
            "Date added": new Date(doc.dateAdded).toLocaleDateString(),
            Format: doc.format,
            Size: doc.size,
          }));
          setTableData(transformed);
        } else {
          setError("Failed to fetch data");
          setTableData([]);
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError("Something went wrong");
        setTableData([]);
      } finally {
        setIsLoading(false);
        setHasFetched(true);
      }
    };

    fetchData();
  }, [pageNumber, pageSize, searchText]);

  // === Fetch Suggestions Dynamically ===

  return {
    data,
    tableData,
    error,
    isLoading,
    hasFetched,
    suggestions,
    suggestionsLoading,
    loadSuggestions, // method you can call from DMSView to fetch live suggestions
  };
};

export const formatSuggestions = (values: any[]): Suggestion[] => [
  {
    name: "",
    values: values?.map((item: any) => ({
      text: item?.fileName,
      props: {
        name: item?.fileName,
        id: item?.fileId
      },
      value: <></>
    }))
  }
];

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export const debouncedFetchSuggestions = debounce(
  async (
    searchText: string,
    setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>,
    setShowError: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      const response = await fetchDMSSuggestions(searchText);
      const values = response?.payload?.[0]?.values ?? [];
      setSuggestions(formatSuggestions(values));
    } catch (err) {
      console.error("Autosuggest error:", err);
      setShowError(true);
      setSuggestions([]);
    } finally {
      setSearchLoading(false);
    }
  },
  1000
);


export default DocumentManagementServer;
