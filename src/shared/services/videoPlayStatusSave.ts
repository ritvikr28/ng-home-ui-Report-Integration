import { AxiosResponse } from "axios";
import { service } from "../utils/api-service";
import { envConfig } from "../utils";

export interface IVideoPlayStatusSaveRequest {
  isPlayed: string;
}

export interface IVideoPlayStatusSaveResponse {
  errors: any;
  payload: any;
  status: number;
}

export const saveVideoPlayStatus = async (): Promise<IVideoPlayStatusSaveResponse | null> => {
  try {
    const requestPayload = {
      isPlayed: "Played"
    };

    const response: AxiosResponse<IVideoPlayStatusSaveResponse> = await service.post(
      `${envConfig.BASE_URL}/VideoPlayStatus/Save`,
      requestPayload
    );

    console.log("VideoPlayStatusSave API response:", response);

    if (response.status === 200) {
      return response.data;
    }

    return null;
  } catch (err: any) {
    console.error("VideoPlayStatusSave API error:", err);
    return null;
  }
};
