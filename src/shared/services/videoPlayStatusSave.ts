import { AxiosResponse } from "axios";
import { service } from "../utils/api-service";
import { envConfig } from "../utils";

export interface IVideoPlayStatusSaveResponse {
  errors: any;
  payload: any;
  status: number;
}

export const saveVideoPlayStatus: () => Promise<IVideoPlayStatusSaveResponse | null> = async (): Promise<IVideoPlayStatusSaveResponse | null> => {
  try {
    const response: AxiosResponse<IVideoPlayStatusSaveResponse> = await service.post(
      `${envConfig.BASE_URL}/VideoPlayStatus/Save`,
      { isPlayed: "Played" }
    );

    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return response.data;
    }

    return null;
  } catch {
    return null;
  }
};
