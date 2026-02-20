import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { AxiosResponse } from "axios";
import { service } from "../utils/api-service";
import apiUrls from "../hook/ApiConfig.json";

export interface IVideoPlayStatusResult {
  success: boolean;
  isPlayed: boolean;
}

export const fetchVideoPlayStatus: () => Promise<IVideoPlayStatusResult> = async (): Promise<IVideoPlayStatusResult> => {
  try {
    const response: AxiosResponse<any, any> = await service.get(
      "VideoPlayStatus",
      buildApplicationUrl(apiUrls)
    );

    if (response.status === 200 && response.data?.payload) {
      return {
        success: true,
        isPlayed: response.data.payload.isPlayed
      };
    }

    return { success: false, isPlayed: false };
  } catch {
    return { success: false, isPlayed: false };
  }
};
