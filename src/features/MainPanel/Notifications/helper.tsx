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


// const generateId = (index: number): string =>
//   `notif-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// const formatDate = (daysAgo: number): string => {
//   const date = new Date();
//   date.setDate(date.getDate() - daysAgo);
//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//   return `${date.getDate().toString().padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}`;
// };

// export const generateNotificationData = (): {
//   Id: string;
//   Status: string;
//   Notification: string;
//   Priority: string;
//   DateReceived: string;
//   isShowIcon: boolean;
//   iconName?: string;
//   doc?: { id: string; status: string; notification: string; priority: string; dateReceived: string; }[];
// }[] => {
//   const notifications: {
//     Id: string;
//     Status: string;
//     Notification: string;
//     Priority: string;
//     DateReceived: string;
//     isShowIcon: boolean;
//     iconName?: string;
//     doc?: { id: string; status: string; notification: string; priority: string; dateReceived: string; }[];
//   }[] = [];

  // const statuses = ["Read", "Unread"];
  // const priorities = ["Low", "Medium", "High"];

  // for (let i = 0; i < 165; i += 1) {
  //   const template = notificationTemplates[i % notificationTemplates.length];
  //   const status = statuses[Math.floor(Math.random() * statuses.length)];
  //   const priority = template.priority || priorities[Math.floor(Math.random() * priorities.length)];
  //   const daysAgo = Math.floor(Math.random() * 180);
  //   const hasIcon = Math.random() > 0.5;
  //   const generateIdVal = generateId(i)

  //   notifications.push({
  //     Id: generateIdVal,
  //     Status: status,
  //     Notification: `${template.text}${i > 0 ? ` (${i + 1})` : ""}`,
  //     Priority: priority,
  //     DateReceived: formatDate(daysAgo),
  //     doc: [
  //       {
  //         id: generateIdVal,
  //         status,
  //         notification: `${template.text}${i > 0 ? ` (${i + 1})` : ""}`,
  //         priority,
  //         dateReceived: formatDate(daysAgo),
  //       }
  //     ],
  //     isShowIcon: hasIcon,
  //     iconName: hasIcon ? "chat" : undefined
  //   });
  // }
  
//   notifications.sort((a, b) => {
//     const dateA = new Date(a.DateReceived);
//     const dateB = new Date(b.DateReceived);
//     return dateB.getTime() - dateA.getTime();
//   });

//   return notifications;
// };

// export const notificationTableRows = generateNotificationData();