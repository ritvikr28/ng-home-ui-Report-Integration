export interface ISchoolDetailsDRApiResponse {
  statusCode: number;
  uiStatus: string;
}


export interface IPrecheckStatusApiResponse {
  dbDetachedStatus: string,
  deleteNGDataStatus: string,
  dbReAttachedStatus: string,
  syncDataStatus: string,
  responseMessage: string,
  statusCode: number
}

export interface IProcessNGDeletionApiResponse {
  statusCode: number,
  uiStatus: string,
  responseMessage: string
}