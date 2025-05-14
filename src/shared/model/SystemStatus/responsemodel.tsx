export interface ISystemStatusAlertResponse {
  responseCode: number;
  message: string;
  listenerData: {
    listenerCount: number;
    listenerStatus: string; 
    eMailAlert: boolean;
  };
  ssmHostData: {
    latestSSMHostVersion: string; 
    currentSSMHostVersion: string; 
    ssmHostStatus: string; 
    eMailAlert: boolean;
  };
}