import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { service } from "../utils/api-service";
import apiUrls from "../hook/ApiConfig.json";

export interface IVideoPlayStatusResult {
  success: boolean;
  isPlayed: boolean | string | null;
}

export const fetchVideoPlayStatus = async (): Promise<IVideoPlayStatusResult> => {
  try {
    const response = await service.get(
      "VideoPlayStatus",
      buildApplicationUrl(apiUrls)
    );

    if (response.status === 200 && response.data?.payload) {
      return {
        success: true,
        isPlayed: response.data.payload.isPlayed
      };
    }

    return { success: false, isPlayed: null };
  } catch {
    return { success: false, isPlayed: null };
  }
};
