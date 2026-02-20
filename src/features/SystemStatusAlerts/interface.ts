export interface Alert {
  id: string;
  // status: "Green" | "Red" | "Yellow";
  status: "Green" | "Red" | "Yellow" | "Connection error";
  alertName: string;
  information: string;
  emailSubscribed: boolean;
  latestSSMHostVersion: string;
  currentSSMHostVersion: string;
  isErrorResponse?: boolean;
}