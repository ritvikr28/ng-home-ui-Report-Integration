/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-enable jsx-a11y/anchor-is-valid
import { Link, ShowValAs, Tag, TagColor, TagSize } from "@essnextgen/ui-kit";

export const getNotificationTableHeadersData = (
  setSideIsOpen?: (isOpen: boolean) => void,
  setSelectedItem?: (item: any) => void,
  sortBy: string = "ReceivedDate",
  sortDirection: boolean = false,
  setNotificationIdSelected?: (id: string) => void
): {
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
  isColumnSortByDefault?: boolean;
  isColumnSortAscFirst?: boolean | undefined;
  anyComponent?: (cellData: any, rowData?: any) => JSX.Element;
}[] => [
    {
      text: "Id",
      isShow: false,
      showValAs: ShowValAs.Text,
      isTextTruncate: false,
      columnWidth: "16px"
    },
    {
      text: "Status",
      isShow: true,
      showValAs: ShowValAs.CustomeComponent,
      isTextTruncate: false,
      isHeaderTextTruncate: true,
      columnWidth: "129px",
      isColumnSorting: true,
      ...(sortBy === "Status" ? {
        isColumnSortByDefault: true,
        isColumnSortAscFirst: sortDirection
      } : {}),
      anyComponent: (cellData: any) => (
        <div>
          {cellData === "Unread" ? (
            <Tag color={TagColor.Outstanding} size={TagSize.Small} id="unread" text={cellData} />
          ) : (
            <Tag color={TagColor.Success} size={TagSize.Small} id="read" text={cellData} />
          )}
        </div>
      )
    },
    {
      text: "Notification",
      isShow: true,
      showValAs: ShowValAs.Text,
      isTextTruncate: true,
      isHeaderTextTruncate: false,
      headerTxtTrunctLength: 17,
      columnWidth: "274px",
      txtTrunctLength: 35,
      isColumnSorting: false,
      isColumnSortByDefault: false,
    },
    {
      text: "Priority",
      isShow: true,
      showValAs: ShowValAs.Text,
      isHeaderTextTruncate: true,
      headerTxtTrunctLength: 20,
      isColumnSorting: true,
      ...(sortBy === "Priority" ? {
        isColumnSortByDefault: true,
        isColumnSortAscFirst: sortDirection
      } : {}),
      columnWidth: "274px"
    },
    {
      text: "Date received",
      isShow: true,
      showValAs: ShowValAs.Text,
      isHeaderTextTruncate: true,
      headerTxtTrunctLength: 20,
      isColumnSorting: true,
      isColumnSortByDefault: true,
      isColumnSortAscFirst: sortBy === "ReceivedDate" ? sortDirection : false,
      columnWidth: "274px"
    },
    {
      text: "",
      isShow: true,
      showValAs: ShowValAs.CustomeComponent,
      columnWidth: "129px",
      isColumnSorting: false,
      anyComponent: (e: any) => {
        // const item = JSON.parse(e);
        if (!e || typeof e !== "string") return <div />;
        let item: any;
        try {
          item = JSON.parse(e);
        } catch {
          return <div />;
        }
        return (
          <>
            {/* eslint-disable jsx-a11y/anchor-is-valid */}
            <Link
              dataTestId="test-id"
              id="element-id"
              onClick={() => {
                if (setSelectedItem) setSelectedItem(e);
                if (setNotificationIdSelected) setNotificationIdSelected(item.id);
                if (setSideIsOpen) setSideIsOpen(true);
              }}
              target="_self"
            >
              View
            </Link>
          </>
        );
      }
    }
  ];

  export const NoDataMessage = {
  noDataOnSearch: (keyword: string) =>
    `Your search - ${keyword} - did not match any results. Make sure that all the words are spelled correctly.`,
  noDataToDisplay: "No data to display"
};