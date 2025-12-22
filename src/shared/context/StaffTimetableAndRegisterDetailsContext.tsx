import React, { createContext, useContext, useEffect, useState } from "react";
import { FetchStaffTimetableAndRegisterDetails, IStaffTimetableAndRegisterDetailsResponse } from "../services/registersDomain/registerEventsDetails";

interface StaffTimetableAndRegisterDetailsContextType {
  data: IStaffTimetableAndRegisterDetailsResponse | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

interface StaffTimetableAndRegisterDetailsProviderProps {
  children: React.ReactNode;
  hasAccess?: boolean;
}

const StaffTimetableAndRegisterDetailsContext = createContext<StaffTimetableAndRegisterDetailsContextType | undefined>(undefined);

export const StaffTimetableAndRegisterDetailsProvider: React.FC<StaffTimetableAndRegisterDetailsProviderProps> = ({ children, hasAccess }) => {
  const [data, setData] = useState<IStaffTimetableAndRegisterDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchData = async () => {
    if (!hasAccess) return;
    setIsLoading(true);
    setIsError(false);
    try {
      const result = await FetchStaffTimetableAndRegisterDetails();
      setData(result);
      setIsError(!result);
    } catch {
      setIsError(true);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasAccess) {
      fetchData();
    } else {
      setData(null);
      setIsLoading(false);
      setIsError(false);
    }
  }, [hasAccess]);

  return (
    <StaffTimetableAndRegisterDetailsContext.Provider value={{ data, isLoading, isError, refetch: fetchData }}>
      {children}
    </StaffTimetableAndRegisterDetailsContext.Provider>
  );
};

export const useStaffTimetableAndRegisterDetails = () => {
  const context = useContext(StaffTimetableAndRegisterDetailsContext);
  if (!context) {
    throw new Error("useStaffTimetableAndRegisterDetails must be used within a StaffTimetableAndRegisterDetailsProvider");
  }
  return context;
};
