import React, { useEffect, useState } from "react";
import { fetchSims7RedirectionById, Sims7RedirectionViewData } from "./Sims7RedirectionsPage.api";

export const useSims7RedirectionViewData = (moduleId?: number, mode?: string) => {
    const [viewData, setViewData]: [Sims7RedirectionViewData | null, React.Dispatch<React.SetStateAction<Sims7RedirectionViewData | null>>] = useState<Sims7RedirectionViewData | null>(null);

    useEffect(() => {
        if (mode !== "view" || !moduleId) return;
        fetchSims7RedirectionById({ moduleId })
            .then(setViewData)
            .catch(() => setViewData(null));
    }, [moduleId, mode]);

    return { viewData };
};