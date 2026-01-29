import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { authService } from "@essnextgen/auth-ui";
import { service } from "../../utils/api-service";
import apiUrls from "./ApiConfig.json";
import { getUserOrganisation } from "../../utils";

export const getNotificationTableData: (PageSize: number, PageNumber: number) => Promise<any> = async (PageSize: number, PageNumber: number): Promise<any> =>  {

  const orgId: string = getUserOrganisation();
  const receiverId: string | null = authService.getUserId();
  // 'B6BAAAB5-B025-45B8-A2D1-47F4C1754A80';
  // authService.getUserId();
  const userName: string | null = authService.getUsername();

  console.log({ orgId, receiverId, userName });
  try {
    const path = `/v1/notification?OrganisationId=${orgId}&ReceiverId=${receiverId}&PageNumber=${PageNumber}&PageSize=${PageSize}`;
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
    console.log("Mark As Read Response:", response.data.payload);
    return response.data;
  } catch {
    return [];
  }
}