export function extractDateParts(arg1: any, arg2: any, arg3: any): { day: number | undefined; month: number | undefined; year: number | undefined } {
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
    return { day, month, year };
}

export function formatDateParts(day?: number, month?: number, year?: number): { formattedDay: string; formattedMonth: string; formattedYear: string } {
    return {
        formattedDay: day ? String(day).padStart(2, '0') : '',
        formattedMonth: month ? String(month).padStart(2, '0') : '',
        formattedYear: year ? String(year) : ''
    };
}

export function isDatePartsEmpty(formattedDay: string, formattedMonth: string, formattedYear: string): boolean {
    return !formattedDay && !formattedMonth && !formattedYear;
}

export function isDatePartsInvalid(formattedDay: string, formattedMonth: string, formattedYear: string): boolean {
    return (
        !formattedDay || !formattedMonth || !formattedYear ||
        formattedDay === '00' || formattedDay === '0' ||
        formattedMonth === '00' || formattedMonth === '0' ||
        formattedYear.length < 4 ||
           Number.isNaN(Number(formattedDay)) || Number.isNaN(Number(formattedMonth)) || Number.isNaN(Number(formattedYear))
    );
}

export function isDateObjectInvalid(dateObj: Date, formattedDay: string, formattedMonth: string, formattedYear: string): boolean {
    return (
        dateObj.getFullYear() !== Number(formattedYear) ||
        dateObj.getMonth() + 1 !== Number(formattedMonth) ||
        dateObj.getDate() !== Number(formattedDay)
    );
}
