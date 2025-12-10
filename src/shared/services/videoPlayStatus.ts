import { buildApplicationUrl } from "@essnextgen/ui-application-kit";
import { AxiosResponse } from "axios";
import { service } from "../utils/api-service";
import apiUrls from "../hook/ApiConfig.json";

export interface IVideoPlayStatusResponse {
  errors: any;
  payload: {
    isPlayed: string | boolean;   // <-- FIXED
  };
  status: number;
}

export const fetchVideoPlayStatus = async (): Promise<IVideoPlayStatusResponse | null> => {
  try {
    const response: AxiosResponse<IVideoPlayStatusResponse> = await service.get(
      "VideoPlayStatus",
      buildApplicationUrl(apiUrls)
    );

    console.log("VideoPlayStatus API response:", response);

    if (response?.status === 200) {
      return response.data;
    }

    return null;
  } catch (err: any) {
    console.error("VideoPlayStatus API error:", err);
    return null;
  }
};
