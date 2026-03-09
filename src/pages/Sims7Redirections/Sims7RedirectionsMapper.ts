import { Sims7RedirectionsTableRow } from "./Sims7RedirectionsPage.data";
// Global map for module name to URL
export const nextGenModuleUrlMap: Record<string, string> = {};

export function formatDateDDMMYYYY(dateStr: string): string | null {
    const match: RegExpMatchArray | null = dateStr.match(/^(\d{2}) (\d{2}) (\d{4})$/);
    if (match) {
        const [, day, month, year]: string[] = match;
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIdx = parseInt(month, 10) - 1;
        if (monthIdx >= 0 && monthIdx < 12) {
            return `${day} ${monthNames[monthIdx]} ${year}`;
        }
    }
    return null;
}

export function formatDateISO(dateStr: string): string | null {
    const isoMatch: RegExpMatchArray | null = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
        const [, year, month, day]: string[] = isoMatch;
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthIdx = parseInt(month, 10) - 1;
        if (monthIdx >= 0 && monthIdx < 12) {
            return `${day} ${monthNames[monthIdx]} ${year}`;
        }
    }
    return null;
}

export function getEffectiveDate(item: any): string {
    if (item && typeof item.effectiveDate === "string") {
        const dateStr: string = item.effectiveDate;
        return (
            formatDateDDMMYYYY(dateStr) ||
            formatDateISO(dateStr) ||
            dateStr
        );
    }
    return "";
}


export function getStatusString(status: any): string {
    if (typeof status === "string") {
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace("_", " ");
    }
    if (status) {
        return String(status);
    }
    return "";
}

export function getStatus(item: any): string {
    if (!item) return "";
    return getStatusString(item.status);
}



// export function getFieldFromApi(item: any, field: string): string {
//     if (!item) return "";
//     if (field === "nextGenModule") return typeof item.ngModule === "string" ? item.ngModule : "";
//     if (field === "category") return typeof item.ngComponent === "string" ? item.ngComponent : "";
//     if (field === "sims7Module") return typeof item.sims7Module === "string" ? item.sims7Module : "";
//     if (field === "modifiedBy") return typeof item.updatedByUserName === "string" ? item.updatedByUserName : "";
//     if (field === "effectiveDate") return typeof item.effectiveDate === "string" ? item.effectiveDate : "";
//     if (field === "status") return typeof item.redirectStatus === "string" ? item.redirectStatus : "";
//     if (field === "ngModuleComponentUrl") return typeof item.nextGenComponentUrl === "string" ? item.nextGenComponentUrl : "";
//     return typeof item[field] === "string" ? item[field] : "";
// }

export function getFieldFromApi(item: any, field: string): string {
    if (!item) return "";
    const fieldMap: Record<string, string> = {
        nextGenModule: "ngModule",
        category: "ngComponent",
        sims7Module: "sims7Module",
        modifiedBy: "updatedByUserName",
        effectiveDate: "effectiveDate",
        status: "redirectStatus",
        ngModuleComponentUrl: "nextGenComponentUrl"
    };
    const key = fieldMap[field] || field;
    const value = item[key];
    return typeof value === "string" ? value : "";
}
export function mapSims7RedirectionsItem(item: any, idx: number): Sims7RedirectionsTableRow {
    const ngModuleComponentUrl = getFieldFromApi(item, "ngModuleComponentUrl");

    const moduleName = getFieldFromApi(item, "nextGenModule");
    if (moduleName && ngModuleComponentUrl) {
        nextGenModuleUrlMap[moduleName] = ngModuleComponentUrl;
    }

    console.log("ngModuleComponentUrl:", ngModuleComponentUrl);
    return {
        id: getFieldFromApi(item, "id") || (item && item.moduleId ? String(item.moduleId) : (idx + 1).toString()),
        category: getFieldFromApi(item, "category"),
        nextGenModule: getFieldFromApi(item, "nextGenModule"),
        sims7Module: getFieldFromApi(item, "sims7Module"),
        modifiedBy: getFieldFromApi(item, "modifiedBy"),
        effectiveDate: getEffectiveDate(item),
        status: getStatus({ status: getFieldFromApi(item, "status") }),
        tooltipMessage: getFieldFromApi(item, "tooltipMessage"),
        cellStatus: "",
        actions: {
            options:
                getStatus({ status: getFieldFromApi(item, "status") }) === "Permanent"
                    ? [
                        { disabled: false, isSelected: false, text: " View", value: "View" }
                    ]
                    : [
                        { disabled: false, isSelected: false, text: " View", value: "View" },
                        { disabled: false, isSelected: false, text: "Edit", value: "Edit" }
                    ]
        },
        reasonForChanges: getFieldFromApi(item, "reasonForChanges"),
        // Always include dfeNumber for use in side panel PUT request
        dfeNumber: item.dfeNumber || item.DfeNumber || "",
        ngModuleComponentUrl: getFieldFromApi(item, "ngModuleComponentUrl")
    };
}
