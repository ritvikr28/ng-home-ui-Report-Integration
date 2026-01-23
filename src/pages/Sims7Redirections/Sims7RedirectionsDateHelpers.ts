// Date helpers for Sims7Redirections
export function formatDate(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function parseDateString(dateStr: string): Date | null {
    if (!dateStr || dateStr === '-') return null;
    const parts: string[] = dateStr.split(' ');
    if (parts.length === 3) {
        const [day, monthStr, year]: [string, string, string] = parts as [string, string, string];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month: number = months.indexOf(monthStr);
        if (month !== -1) {
            return new Date(Number(year), month, Number(day));
        }
    }
    return null;
}

export function isFutureDate(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
}
