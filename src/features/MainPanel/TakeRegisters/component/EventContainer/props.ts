import { IRegistersDetails } from "../../model";

export interface IRegisterViewProps {
    apiRegsiterEventData?: IRegistersDetails[] | null;
    apiError?: boolean 
  }