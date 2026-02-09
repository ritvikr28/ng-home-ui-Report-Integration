import { SuggestionItem } from "@essnextgen/ui-kit";

export interface NotificationRowData {
  id: string;
  status: string;
  notification: string;
  priority: string;
  dateReceived: string;
}

export declare type Suggestion = {
    name: string;
    values: Array<SuggestionItem>;
};

export const PriorityType: Record<string, string> = {
  Tier3: "Low",
  Tier2: "Medium",
  Tier1: "High"
}

export interface TableNotificationProps {
  id: string;
  status: boolean;
  title: string;
  priority: keyof typeof PriorityType;
  receivedDate?: string
}