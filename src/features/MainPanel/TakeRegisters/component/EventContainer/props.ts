import { IRegistersDetails } from "../../../../../shared/model/RegisterDomain/responsemodels";

export interface IRegisterViewProps {
    apiRegsiterEventData?: IRegistersDetails[] | null;
    apiError?: boolean 
  }