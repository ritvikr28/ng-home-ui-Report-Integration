export const getCachedData: (key: string) => any = (key: string) => {
    try {
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch {
        return null;
    }
};
