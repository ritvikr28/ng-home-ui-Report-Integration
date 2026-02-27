
export function getHandleStatusChange(setStatus: (cb: (prev: string[]) => string[]) => void): (value: string) => void {
    return (value: string) => {
        setStatus((prev: string[]) => prev.includes(value)
            ? prev.filter((s: string) => s !== value)
            : [...prev, value]);
    };
}

export function getHandlePriorityChange(setPriority: (cb: (prev: string[]) => string[]) => void): (value: string) => void {
    return (value: string) => {
        setPriority((prev: string[]) => prev.includes(value)
            ? prev.filter((p: string) => p !== value)
            : [...prev, value]);
    };
}

export function parseDateString(dateStr: string): { day?: number; month?: number; year?: number } {
    if (!dateStr) return {};
    const parts: string[] = dateStr.split("-");
    if (parts.length !== 3) return {};
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return {};
    return { day, month, year };
}
