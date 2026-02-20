function isDatePartsEmpty(day: string, month: string, year: string): boolean {
    return !day && !month && !year;
}

function isDatePartsInvalid(day: string, month: string, year: string): boolean {
    return (
        !day || !month || !year ||
        day === '00' || day === '0' ||
        month === '00' || month === '0' ||
        year.length < 4 ||
    Number.isNaN(Number(day)) || Number.isNaN(Number(month)) || Number.isNaN(Number(year))
    );
}

function isDateObjectInvalid(dateObj: Date, day: string, month: string, year: string): boolean {
    return (
        dateObj.getFullYear() !== Number(year) ||
        dateObj.getMonth() + 1 !== Number(month) ||
        dateObj.getDate() !== Number(day)
    );
}

export function validateDateParts(day: string, month: string, year: string): string | null {
    if (isDatePartsEmpty(day, month, year)) {
        return 'Date is required';
    }
    if (isDatePartsInvalid(day, month, year)) {
        return 'Invalid Date';
    }
    const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
    if (isDateObjectInvalid(dateObj, day, month, year)) {
        return 'Invalid Date';
    }
    return null;
}
