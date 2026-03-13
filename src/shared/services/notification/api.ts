import { AxiosResponse } from "axios";
import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { authService } from "@essnextgen/auth-ui";
import { service } from "../../utils/api-service";
import apiUrls from "./ApiConfig.json";
import { getUserOrganisation } from "../../utils";
import { AutoSuggestResponse, NotificationTableData, NotificationTableDataParams } from "./api.props";

export const getNotificationTableData
  : (
    params: NotificationTableDataParams
  ) => Promise<NotificationTableData> = async ({
    PageSize,
    PageNumber,
    SearchTerm,
    SortBy,
    SortDirection
  }: NotificationTableDataParams): Promise<NotificationTableData> => {

    const orgId: string = getUserOrganisation();
    const receiverId: string | null = authService.getUserId();
    try {
      const direction: boolean | undefined = SortDirection;
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
  const userId: string | null = authService.getUserId();
  try {
    const baseUrl: string = buildApplicationUrl(apiUrls);
    const path = `${baseUrl}/v1/notification/mark-as-read?NotificationId=${notificationId}&OrganisationId=${orgId}&UserId=${userId}`;
    //  const path = `${baseUrl}/v1/notification/mark-as-read?NotificationId=${notificationId}&OrganisationId=${orgId}`;
    const response: any = await service.put(path, requestData);
    return response.data;
  } catch {
    return [];
  }
}
 
export const getSearchAutoSuggestData: ({ SearchTerm }: {
  SearchTerm: string;
}) => Promise<AutoSuggestResponse> = async ({ SearchTerm }: { SearchTerm: string }) => {
  const OrganisationId: string | null = authService.getOrgId();
  const receiverId: string | null = authService.getUserId();
  try {
    const path = `/v1/notification/auto-suggestions?SearchTerm=${SearchTerm}&OrganisationId=${OrganisationId}&ReceiverId=${receiverId}`;
    const baseUrl: string = buildApplicationUrl(apiUrls);
    const response: AxiosResponse<any, any> = await service.get(path, baseUrl);
    return response.data;
  } catch (err: any) {
    console.log("Error fetching notification table data:", err);
 
    if (err.response.status === 401) {
      console.info("Unauthorized access - perhaps redirect to login?", err.response.status);
 
    }
    return { error: true, status: err.response.status };
  }
}