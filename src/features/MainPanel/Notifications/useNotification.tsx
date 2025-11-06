import { useState } from "react";

export const useNotification
 = () => 
    {
    const [filterBtnClicked, setFilterBtnClicked] = useState(false);
    return {
        filterBtnClicked,
        setFilterBtnClicked
    }
}