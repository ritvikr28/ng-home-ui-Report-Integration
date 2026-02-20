export function parseDateParts(arg1: any, arg2?: any, arg3?: any): { day: string, month: string, year: string } {
    let day: number | undefined;
    let month: number | undefined;
    let year: number | undefined;
    if (typeof arg1 === 'object' && arg1 !== null && 'day' in arg1 && 'month' in arg1 && 'year' in arg1) {
        day = arg1.day;
        month = arg1.month;
        year = arg1.year;
    } else {
        day = arg1;
        month = arg2;
        year = arg3;
    }
    return {
        day: day ? String(day).padStart(2, '0') : '',
        month: month ? String(month).padStart(2, '0') : '',
        year: year ? String(year) : ''
    };
}
