import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { authService } from "@essnextgen/auth-ui";
import { service } from "../../utils/api-service";
import apiUrls from "./ApiConfig.json";
import { getUserOrganisation } from "../../utils";
import { AutoSuggestResponse, NotificationTableData } from "./api.props";

export const getNotificationTableData
: ({ PageSize, PageNumber, SearchTerm, SortBy, SortDirection }: {
  PageSize: number;
  PageNumber: number;
  SearchTerm: string;
  SortBy?: string | undefined;
  SortDirection?: boolean | undefined;
}) => Promise<NotificationTableData> = async ({ PageSize, PageNumber, SearchTerm, SortBy,
  SortDirection }: {
    PageSize: number, PageNumber: number, SearchTerm: string, SortBy?: string;
    SortDirection?: boolean;
  }): Promise<NotificationTableData> =>  {

  const orgId: string = getUserOrganisation();
  const receiverId: string | null = authService.getUserId();
  try {
     const direction = SortDirection;
    const path = `/v1/notification?OrganisationId=${orgId}&ReceiverId=${receiverId}&PageNumber=${PageNumber}&PageSize=${PageSize}&SearchTerm=${SearchTerm}&SortBy=${SortBy}&Asc=${direction}`;
    const baseUrl: string = buildApplicationUrl(apiUrls);
    const response: any = await service.get(path, baseUrl);
    return response.data;
  } catch (err: any) {
    console.log("Error fetching notification table data:", err);

    if (err.response.status === 401) {
      console.info("Unauthorized access - perhaps redirect to login?", err.response.status);

    }
    return { error: true, status: err.response.status };
  }
};

export const getViewData: (notificationId?: string | undefined) => Promise<any> = async (notificationId?: string): Promise<any> => {
  const orgId: string = getUserOrganisation();

  try {
    const path = `/v1/notification/notification-by-id?NotificationId=${notificationId}&OrganisationId=${orgId}`;
    const baseUrl: string = buildApplicationUrl(apiUrls);
    const response: any = await service.get(path, baseUrl);
    return response.data;
  } catch (err: any) {
    return { error: true, status: err.response.status }
  }
}
 
export const markAsRead: (notificationId: string) => Promise<any> = async (notificationId: string): Promise<any> => {
  const requestData: {
    NotificationId: string;
  } = {
    NotificationId: notificationId
  };
  const orgId: string = getUserOrganisation();

  try {
    const baseUrl: string = buildApplicationUrl(apiUrls);
    const path = `${baseUrl}/v1/notification/mark-as-read?NotificationId=${notificationId}&OrganisationId=${orgId}`;
    const response: any = await service.put(path, requestData);
    return response.data;
  } catch {
    return [];
  }
}
 
export const getSearchAutoSuggestData: ({ SearchTerm }: {
  SearchTerm: string;
}) => Promise<AutoSuggestResponse> = async ({ SearchTerm }: { SearchTerm: string }) => {
  const OrganisationId = authService.getOrgId();
  const receiverId = authService.getUserId();
  try {
    const path = `/v1/notification/auto-suggestions?SearchTerm=${SearchTerm}&OrganisationId=${OrganisationId}&ReceiverId=${receiverId}`;
    const baseUrl = buildApplicationUrl(apiUrls);
    const response = await service.get(path, baseUrl);
    return response.data;
  } catch (err: any) {
    console.log("Error fetching notification table data:", err);
 
    if (err.response.status === 401) {
      console.info("Unauthorized access - perhaps redirect to login?", err.response.status);
 
    }
    return { error: true, status: err.response.status };
  }
}