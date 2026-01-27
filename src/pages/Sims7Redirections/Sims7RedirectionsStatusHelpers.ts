export function requiresDate(status: string, redirectToNextGen: string): boolean {
    return (
        (status === 'Migrated' && redirectToNextGen === 'no') ||
        (status === 'Reversing' && redirectToNextGen === 'no') ||
        (redirectToNextGen === 'yes' && status === 'Not migrated') ||
        (redirectToNextGen === 'yes' && status !== 'Migrated' && status !== 'Not migrated' && status !== 'Reversing')
    );
}

export function requiresReason(status: string, redirectToNextGen: string): boolean {
    return (
        (status === 'Migrated' && redirectToNextGen === 'no') ||
        (status === 'Reversing' && redirectToNextGen === 'no') ||
        (status === 'Not migrated' && redirectToNextGen === 'no')
    );
}
