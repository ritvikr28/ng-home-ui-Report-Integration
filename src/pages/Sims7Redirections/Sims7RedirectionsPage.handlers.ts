// Utility handlers extracted from Sims7RedirectionsPage.view.tsx to reduce cyclomatic complexity
import { Sims7RedirectionsTableRow } from "./Sims7RedirectionsPage.data";


export function handleOverflowAction(
    action: string,
    rowData: Sims7RedirectionsTableRow,
    handleViewClick: (row: Sims7RedirectionsTableRow) => void,
    handleEditClick: (row: Sims7RedirectionsTableRow) => void
): void {
    if (action === "View") {
        handleViewClick(rowData);
    } else if (action === "Edit") {
        handleEditClick(rowData);
    }
}

export function getNextSortOrder(currentOrder: "asc" | "desc"): "asc" | "desc" {
    return currentOrder === "desc" ? "asc" : "desc";
}
