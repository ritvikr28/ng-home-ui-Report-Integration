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
  hasAccess: boolean;
}

const StaffTimetableAndRegisterDetailsContext: React.Context<StaffTimetableAndRegisterDetailsContextType | undefined> = createContext<StaffTimetableAndRegisterDetailsContextType | undefined>(undefined);

export const StaffTimetableAndRegisterDetailsProvider: React.FC<StaffTimetableAndRegisterDetailsProviderProps> = ({ children, hasAccess }) => {
  const [data, setData]: [IStaffTimetableAndRegisterDetailsResponse | null, React.Dispatch<React.SetStateAction<IStaffTimetableAndRegisterDetailsResponse | null>>] = useState<IStaffTimetableAndRegisterDetailsResponse | null>(null);
  const [isLoading, setIsLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
  const [isError, setIsError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);

  const fetchData: () => Promise<void> = async () => {
    if (!hasAccess) return;
    setIsLoading(true);
    setIsError(false);
    try {
      const result: IStaffTimetableAndRegisterDetailsResponse | null = await FetchStaffTimetableAndRegisterDetails();
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

export const useStaffTimetableAndRegisterDetails: () => StaffTimetableAndRegisterDetailsContextType = () => {
  const context: StaffTimetableAndRegisterDetailsContextType | undefined = useContext(StaffTimetableAndRegisterDetailsContext);
  if (!context) {
    throw new Error("useStaffTimetableAndRegisterDetails must be used within a StaffTimetableAndRegisterDetailsProvider");
  }
  return context;
};
