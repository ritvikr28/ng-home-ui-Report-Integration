import React, { createContext, useContext, useEffect, useState } from "react";
import { FetchStaffTimetableAndRegisterDetails, IStaffTimetableAndRegisterDetailsResponse } from "../services/registersDomain/registerEventsDetails";

interface StaffTimetableAndRegisterDetailsContextType {
  data: IStaffTimetableAndRegisterDetailsResponse | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

const StaffTimetableAndRegisterDetailsContext = createContext<StaffTimetableAndRegisterDetailsContextType | undefined>(undefined);

export const StaffTimetableAndRegisterDetailsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<IStaffTimetableAndRegisterDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = async () => {
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
    fetchData();
  }, []);

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
