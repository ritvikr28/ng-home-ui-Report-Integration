import { ShowValAs, TagColor, Tooltip } from "@essnextgen/ui-kit";
import { ReactNode } from "react";
import { nextGenModuleUrlMap } from './Sims7RedirectionsMapper';

export interface Sims7RedirectionsTableRow {
    id: string;
    category: string;
    nextGenModule: string;
    sims7Module: string;
    modifiedBy: string;
    effectiveDate: string;
    status: string;
    tooltipMessage: string;
    cellStatus: string;
    actions: {
        options: {
            disabled: boolean;
            isSelected: boolean;
            text: string;
            value: string;
        }[];
    };
    reasonForChanges?: string;
    dfeNumber: string;
    ngModuleComponentUrl: string;
    previousDate: string;
}

export interface Sims7RedirectionsTableHeader {
    text: string;
    isShow: boolean;
    showValAs: ShowValAs;
    isTextTruncate?: boolean;
    anyComponent?: (value: string) => ReactNode;
    alignSpecific?: boolean;
    columnWidth?: string;
    tagColor?: TagColor;
    statusColors?: Record<string, TagColor>;
    isColumnSorting?: boolean;
    isColumnSortByDefault?: boolean;
}

export const sims7RedirectionsTableHeaders: Sims7RedirectionsTableHeader[] = [
    {
        text: "ID",
        isShow: false,
        showValAs: ShowValAs.Text,
        isTextTruncate: false
    },
    {
        text: "Category",
        isShow: true,
        showValAs: ShowValAs.Text,
        isTextTruncate: false,
        isColumnSorting: true
    },

    {
        text: "Next Gen module",
        isShow: true,
        showValAs: ShowValAs.CustomeComponent,
        isColumnSorting: true,
        // anyComponent: (value: string) => {
        //     if (!value) return null;
        //     const isTruncated: boolean = value.length > 19;
        //     const displayText: string = isTruncated ? `${value.slice(0, 19)}…` : value;
        //     // Always use the backend URL as-is
        //     return (
        //         <a href={value} target="_blank" rel="noopener noreferrer">
        //             {displayText}
        //         </a>
        //     );
        // }

        anyComponent: (value: string) => {
            if (!value) return null;
            const url = nextGenModuleUrlMap[value] || value;
            const isTruncated: boolean = value.length > 19;
            const displayText: string = isTruncated ? `${value.slice(0, 19)}…` : value;
            if (isTruncated) {
                return (
                    <Tooltip content={<span>{value}</span>}>
                        <span>
                            <a
                                href={url}
                                target="_blank"
                                className="truncated-link"
                                rel="noopener noreferrer"
                            >
                                {displayText}
                            </a>
                        </span>
                    </Tooltip>
                );
            }
            return (
                <a href={url} target="_blank" rel="noopener noreferrer">
                    {displayText}
                </a>
            );
        }
    },
    {
        text: "SIMS 7 module",
        isShow: true,
        showValAs: ShowValAs.TextWithTag,
        isTextTruncate: true,
        alignSpecific: true,
        columnWidth: "250px",
        tagColor: TagColor.Highlight,
        isColumnSorting: true
    },
    {
        text: "Modified by",
        isShow: true,
        showValAs: ShowValAs.Text,
        isTextTruncate: false,
        isColumnSorting:false
    },
    {
        text: "Effective date",
        isShow: true,
        showValAs: ShowValAs.Text,
        isTextTruncate: false,
        isColumnSorting: true
    },
    {
        text: "Status",
        isShow: true,
        showValAs: ShowValAs.Tag,
        statusColors: {
            Migrated: TagColor.Success,
            Permanent: TagColor.Success,
            "Not migrated": TagColor.Neutral,
            Planned: TagColor.Outstanding,
            Reversing: TagColor.Outstanding
        },
        isTextTruncate: false,
        isColumnSorting: true,
        isColumnSortByDefault: false
    },
    {
        text: "Reason for changes",
        isShow: false,
        showValAs: ShowValAs.Text
    }
];
