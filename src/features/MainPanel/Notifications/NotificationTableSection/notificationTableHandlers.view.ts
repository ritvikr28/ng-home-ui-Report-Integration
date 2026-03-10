import { SyntheticEvent } from "react";
import { SelectedItem } from "@essnextgen/ui-kit";
import { SearchTag } from "./NotificationTableSection.props";

export function getSearchOnClickClose(filters: {
    status?: string[] | undefined;
    priority?: string[] | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
} | undefined, setFilters: (filter: any) => void, searchTagList: SearchTag): (e: SyntheticEvent<Element, Event>, text: string, closeObj: SelectedItem, id?: string | number) => void {
    return (e: SyntheticEvent<Element, Event>, text: string, closeObj: SelectedItem) => {
        if (!closeObj || !filters) return;
        const updated: {
            status?: string[] | undefined;
            priority?: string[] | undefined;
            startDate?: string | undefined;
            endDate?: string | undefined;
        } = { ...filters };
        const category = (closeObj as any).categoryName || (searchTagList.find(tag => tag.closeObj.name === closeObj.name)?.categoryName);
        const filterUpdateMap: Record<string, () => void> = {
            Status: () => {
                updated.status = (filters.status || []).filter((s: string) => s.toLowerCase() !== closeObj.name.toLowerCase());
            },
            Priority: () => {
                updated.priority = (filters.priority || []).filter((p: string) => p.toLowerCase() !== closeObj.name.toLowerCase());
            },
            Date: () => {
                delete updated.startDate;
                delete updated.endDate;
            }
        };
        if (filterUpdateMap[category]) filterUpdateMap[category]();
        setFilters(updated);
    };
}
