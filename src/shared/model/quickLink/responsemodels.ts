  export interface IQuickLinkApiResponse {
    id: number,
    name: string;
    link: string;
    favourite: boolean;
    createdOn: string;
  }
  export interface IQuickLinkPostApiResponse {
    quickLinkId: any;
    operation: any;
  }

  export interface IFetchQuickLinkDetailsFunctionResponse{
    response: IQuickLinkApiResponse[];
    status: boolean;
  };