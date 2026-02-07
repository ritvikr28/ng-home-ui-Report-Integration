import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { authService } from "@essnextgen/auth-ui";
import { service } from "../../utils/api-service";
import apiUrls from "./ApiConfig.json";
import { getUserOrganisation } from "../../utils";

export const getNotificationTableData = async ({ PageSize, PageNumber, SortBy,
  SortDirection }: { PageSize: number, PageNumber: number, SortBy?: string;
  SortDirection?: boolean; }): Promise<any> => {
  const orgId = getUserOrganisation();
  const receiverId = authService.getUserId();
  // 'B6BAAAB5-B025-45B8-A2D1-47F4C1754A80';
  // authService.getUserId();
  const userName = authService.getUsername();
  try {
    const direction = SortDirection;
    const path = `/v1/notification?OrganisationId=${orgId}&ReceiverId=${receiverId}&PageNumber=${PageNumber}&PageSize=${PageSize}&SortBy=${SortBy}&Asc=${direction}`;
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
};

export const getViewData = async (notificationId?: string): Promise<any> => {
  const orgId = getUserOrganisation();

  try {
    const path = `/v1/notification/notification-by-id?NotificationId=${notificationId}&OrganisationId=${orgId}`;
    const baseUrl = buildApplicationUrl(apiUrls);
    const response = await service.get(path, baseUrl);
    return response.data;
  } catch (err: any) {
    return { error: true, status: err.response.status }
  }
}

export const markAsRead = async (notificationId: string): Promise<any> => {
  const requestData: {
    NotificationId: string;
  } = {
    NotificationId: notificationId,
  };
  const orgId = getUserOrganisation();

  try {
    const baseUrl = buildApplicationUrl(apiUrls);
    const path = `${baseUrl}/v1/notification/mark-as-read?NotificationId=${notificationId}&OrganisationId=${orgId}`;
    const response = await service.put(path, requestData);
    console.log("Mark As Read Response:", response.data.payload);
    return response.data;
  } catch {
    return [];
  }
}