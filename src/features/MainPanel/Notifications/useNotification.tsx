import { useState, useMemo } from "react";
import { notificationTableRows } from "./helper";

const PAGE_SIZE = 40;

export const useNotification = () => {
    const [filterBtnClicked, setFilterBtnClicked] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);    
    
    const totalNotifications = notificationTableRows.length;
    const totalPages = Math.ceil(totalNotifications / PAGE_SIZE);    
    
    const paginatedNotifications = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return notificationTableRows.slice(startIndex, endIndex);
    }, [currentPage]);    
    
    const handlePageChange = (event: any, page: number) => {
        setCurrentPage(page);
    };
    
    return {
        filterBtnClicked,
        setFilterBtnClicked,
        currentPage,
        totalPages,
        paginatedNotifications,
        totalNotifications,
        handlePageChange
    };
};