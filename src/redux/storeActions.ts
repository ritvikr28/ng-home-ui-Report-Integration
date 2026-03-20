import * as actionTypes from "./actionTypes";

export const setApiError = (status: boolean) => ({
    type: actionTypes.VIDEO_API_ERROR,
    payload: status,
});

export const setVideoPlayStatus = (status: boolean) => ({
    type: actionTypes.VIDEO_PLAY_STATUS,
    payload: status,
});
