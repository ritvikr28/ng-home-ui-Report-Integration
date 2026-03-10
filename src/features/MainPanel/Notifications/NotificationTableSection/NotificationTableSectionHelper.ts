export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDate(d: string): string {
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function getDateLabel(startDate?: string, endDate?: string): string {
    if (startDate && endDate) return `${formatDate(startDate)} to ${formatDate(endDate)}`;
    if (startDate) return formatDate(startDate);
    if (endDate) return formatDate(endDate);
    return '';
}

export function buildTags(filters: any): Array<{ text: string; categoryName: string; closeObj: { name: string; id: number; value?: string } }> {
    const tags: Array<{ text: string; categoryName: string; closeObj: { name: string; id: number; value?: string } }> = [];
    const addTags: (arr: string[] | undefined, category: string, id: number) => void = (arr: string[] | undefined, category: string, id: number) => {
        (arr || []).forEach(val => tags.push({
            text: capitalize(val),
            categoryName: category,
            closeObj: { name: capitalize(val), id, value: val }
        }));
    };
    addTags(filters?.status, 'Status', 1);
    addTags(filters?.priority, 'Priority', 2);
    const dateLabel:string = getDateLabel(filters?.startDate, filters?.endDate);
    if (dateLabel) tags.push({ text: dateLabel, categoryName: 'Date', closeObj: { name: 'Date', id: 3 } });
    return tags;
}