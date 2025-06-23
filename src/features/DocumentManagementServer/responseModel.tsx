export interface SingleDocumentDetail {
  organizationId: string;
  userId: string;
  registrationId: number;
  fileId: string;
  personExternalId: string;
  documentInfo: {
    fileName: string;
    isSelectedForPrepareDownload: boolean;
  };
}

export interface DocumentBasicDetails {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  data: SingleDocumentDetail[];
}

export interface DocumentBasicDetailsResponse {
  status: number;
  error: string;
  payload: DocumentBasicDetails | null;
}


//props
export interface DocumentManagementServerProps {
  pageNumber: number;
  pageSize: number;
}
