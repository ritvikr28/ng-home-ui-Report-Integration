import '@testing-library/jest-dom';
import axios, { AxiosResponse } from 'axios';
import { DocumentBasicDetails, SingleDocumentDetail, PrivateDocumentBasicDetails } from '../responseModel';
import { service } from '../../../shared/utils';
import { bulkDownload, deleteFiles, fetchDMSSuggestions, fetchDocumentCategory, fetchDocumentDetails, fetchStaffProfilePhoto, fetchPrivateDocumentDetails, prepareAndDownloadFile, validation, viewDownload } from '../api/ApiService';
import * as ApiService from '../api/ApiService';

const documentResponse: SingleDocumentDetail[] = [
  {
    organizationId: 'cd0e52dd',
    userId: '9fbe1bcc',
    registrationId: 2,
    fileId: '427e150',
    personExternalId: '00000000',
    documentInfo: {
      fileName: 'image',
      isSelectedForPrepareDownload: true
    },
    document: 'image',
    relatedTo: null,
    category: 'App',
    addedBy: 'SIMS-NG',
    dateAdded: '11/25/2024 10:04:54',
    format: 'png',
    size: '2 KB',
    blobName: 'App_427E150E'
  }
];

const mockAxiosResponse: AxiosResponse<DocumentBasicDetails> = {
  data: {
    pageNumber: 1,
    pageSize: 40,
    totalRecords: 1,
    data: documentResponse,
    status: 200,
    statusCode: 200
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
};


describe('fetchDocumentDetails', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return data on successful fetch', async () => {
    jest.spyOn(service, 'post').mockResolvedValueOnce(mockAxiosResponse);

    const result: DocumentBasicDetails | null = await fetchDocumentDetails({ pageNumber: 1, pageSize: 40 });

    expect(result).toEqual(mockAxiosResponse.data);
    expect(service.post).toHaveBeenCalledTimes(1);
  });

  test('should return null when status is not 200', async () => {
    const mockFailureResponse: Partial<AxiosResponse<DocumentBasicDetails>> = {
      ...mockAxiosResponse,
      status: 404
    };
    jest
      .spyOn(service, 'post')
      .mockResolvedValueOnce(mockFailureResponse as AxiosResponse<DocumentBasicDetails>);

    const result: DocumentBasicDetails | null = await fetchDocumentDetails({ pageNumber: 1, pageSize: 40 });
    expect(result).toBeNull();
  });

  test('should return null when exception is thrown', async () => {
    jest.spyOn(service, 'post').mockRejectedValueOnce(new Error('API failed'));

    const result: DocumentBasicDetails | null = await fetchDocumentDetails({ pageNumber: 1, pageSize: 40 });
    expect(result).toEqual({ status: 500, detail: "Unknown server error" });
  });
});

describe('fetchDMSSuggestions', () => {
  it('should include DocumentRelatedTo param when documentRelatedTo is provided', async () => {
    const mockResponse: AxiosResponse = makeAxiosResponse({ payload: [{ values: [] }] });
    const spy: jest.SpyInstance = jest.spyOn(service, 'get').mockResolvedValueOnce(mockResponse);
    await fetchDMSSuggestions('doc', '', '', [], 42);
    const calledUrl: string = spy.mock.calls[0][0];
    expect(calledUrl).toContain('AutoCompleteRequest.DocumentRelatedTo=42');
  });
});

describe('clearAllFiles', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const partitionKeys= ['key1', 'key2'];
  const mockResponse: AxiosResponse = {
    data: { success: true },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  };

  test('should return status code when response status is 200', async () => {
    jest.spyOn(service, 'post').mockResolvedValueOnce(mockResponse);
    const { clearAllFiles }: any = await import('../api/ApiService');
    const result: number = await clearAllFiles({ request: { partitionKey: partitionKeys } });
    expect(result).toBe(200);
    expect(service.post).toHaveBeenCalledTimes(1);
  });

  test('should return status code when response status is not 200', async () => {
    const mockFailureResponse: AxiosResponse<DocumentBasicDetails> = { ...mockResponse, status: 404 };
    jest.spyOn(service, 'post').mockResolvedValueOnce(mockFailureResponse);
    const { clearAllFiles }: any = await import('../api/ApiService');
    const result: number = await clearAllFiles({ request: { partitionKey: partitionKeys } });
    expect(result).toBe(404);
  });

  test('should return error status code when exception is thrown', async () => {
    const errorData: any = { error: 'Failed' };
    const error: any = { response: { data: errorData, status: 500 } };
    jest.spyOn(service, 'post').mockRejectedValueOnce(error);
    const { clearAllFiles }: any = await import('../api/ApiService');
    const result: number = await clearAllFiles({ request: { partitionKey: partitionKeys } });
    expect(result).toBe(500);
  });
});
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockValues: { fileName: string; fileId: string }[] = [
    { fileName: 'doc1', fileId: 'id1' },
    { fileName: 'doc2', fileId: 'id2' }
  ];

  const makeAxiosResponse: (data: any) => AxiosResponse<any> = (data: any): AxiosResponse<any> => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  });

  test('should return suggestions when API has valid values', async () => {
    const mockResponse: AxiosResponse<any> = makeAxiosResponse({
      payload: [{ values: mockValues }]
    });

    jest.spyOn(service, 'get').mockResolvedValueOnce(mockResponse);

    const result: any = await fetchDMSSuggestions('doc', '', '', []);
    let values: any[] = [];
    if (Array.isArray(result?.payload?.[0]?.values)) {
      values = result.payload[0].values;
    }

    expect(values).toEqual(mockValues);
  });

  test('should return empty array when no values present', async () => {
    const mockResponse: AxiosResponse<any> = makeAxiosResponse({
      payload: [{ values: undefined }]
    });

    jest.spyOn(service, 'get').mockResolvedValueOnce(mockResponse);

    const result: any = await fetchDMSSuggestions('doc', '', '', []);
    const values: any[] = Array.isArray(result?.payload?.[0]?.values)
      ? result.payload[0].values
      : [];

    expect(values).toEqual([]);
  });

  test('should return empty array when payload is missing', async () => {
    const mockResponse: AxiosResponse<any> = makeAxiosResponse({ payload: undefined });

    jest.spyOn(service, 'get').mockResolvedValueOnce(mockResponse);

    const result: any = await fetchDMSSuggestions('doc', '', '', []);
    const values: any[] = Array.isArray(result?.payload?.[0]?.values)
      ? result.payload[0].values
      : [];

    expect(values).toEqual([]);
  });

  test('should return empty array on API error', async () => {
    jest.spyOn(service, 'get').mockRejectedValueOnce(new Error('Network error'));

    const result: any = await fetchDMSSuggestions('doc', '', '', []);
    const values: any[] = Array.isArray(result?.payload?.[0]?.values)
      ? result.payload[0].values
      : [];

    expect(values).toEqual([]);
  });
   it('should include categoryId params when categoryId is provided', async () => {
    const mockResponse: AxiosResponse<any> = makeAxiosResponse({ payload: [{ values: [] }] });
    const spy: jest.SpyInstance = jest.spyOn(service, 'get').mockResolvedValueOnce(mockResponse);

    await fetchDMSSuggestions('doc', '', '', [1, 2, 3]);
    const calledUrl: string = spy.mock.calls[0][0];
    expect(calledUrl).toContain('AutoCompleteRequest.CategoryId=1');
    expect(calledUrl).toContain('AutoCompleteRequest.CategoryId=2');
    expect(calledUrl).toContain('AutoCompleteRequest.CategoryId=3');
  });

  it('should not include categoryId params when categoryId is empty', async () => {
    const mockResponse: AxiosResponse<any> = makeAxiosResponse({ payload: [{ values: [] }] });
    const spy: jest.SpyInstance = jest.spyOn(service, 'get').mockResolvedValueOnce(mockResponse);

    await fetchDMSSuggestions('doc', '', '', []);
    const calledUrl: string = spy.mock.calls[0][0];
    expect(calledUrl).not.toContain('AutoCompleteRequest.CategoryId=');
  });

  it('should include FromDate param when fromDate is provided', async () => {
    const mockResponse: AxiosResponse<any> = makeAxiosResponse({ payload: [{ values: [] }] });
    const spy: jest.SpyInstance = jest.spyOn(service, 'get').mockResolvedValueOnce(mockResponse);

    await fetchDMSSuggestions('doc', '2024-07-01', '', []);
    const calledUrl: string = spy.mock.calls[0][0];
    expect(calledUrl).toContain('AutoCompleteRequest.FromDate=2024-07-01');
  });

  it('should include ToDate param when toDate is provided', async () => {
    const mockResponse: AxiosResponse<any> = makeAxiosResponse({ payload: [{ values: [] }] });
    const spy: jest.SpyInstance = jest.spyOn(service, 'get').mockResolvedValueOnce(mockResponse);

    await fetchDMSSuggestions('doc', '', '2024-07-31', []);
    const calledUrl: string = spy.mock.calls[0][0];
    expect(calledUrl).toContain('AutoCompleteRequest.ToDate=2024-07-31');
  });

  it('should encode special characters in params', async () => {
    const mockResponse: AxiosResponse<any> = makeAxiosResponse({ payload: [{ values: [] }] });
    const spy: jest.SpyInstance = jest.spyOn(service, 'get').mockResolvedValueOnce(mockResponse);

    await fetchDMSSuggestions('doc test', '2024-07-01', '2024-07-31', [10]);
    const calledUrl: string = spy.mock.calls[0][0];
    expect(calledUrl).toContain('AutoCompleteRequest.SearchText=doc%20test');
    expect(calledUrl).toContain('AutoCompleteRequest.FromDate=2024-07-01');
    expect(calledUrl).toContain('AutoCompleteRequest.ToDate=2024-07-31');
    expect(calledUrl).toContain('AutoCompleteRequest.CategoryId=10');
  });

describe('fetchDocumentCategory', () => {
  const payload : { CategoryRequest: { ReferenceExternalId: string } } = { CategoryRequest: { ReferenceExternalId: "1" } };
  const mockData: { categoryId: number, category: string }[] = [{ categoryId: 1, category: "Test" }];
  const mockUrl = '/validation/api/v1/data-export/get-linked-files-category-by-id';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return data when API call is successful', async () => {
    (service.post as jest.Mock).mockResolvedValueOnce({ data: mockData });
    const result: any = await fetchDocumentCategory(payload);
    expect(result).toEqual(mockData);
    expect(service.post).toHaveBeenCalledWith(
      mockUrl,
      payload,
      expect.objectContaining({ baseURL: expect.any(String) })
    );
  });

  it('should return empty object and log error on failure', async () => {
    const error: Error = new Error('API error');
    (service.post as jest.Mock).mockRejectedValueOnce(error);
    const consoleSpy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]> = jest.spyOn(console, 'error').mockImplementation();

    const result: any = await fetchDocumentCategory(payload);
    expect(result).toEqual({ status: 500, detail: "Unknown server error" });
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching document categories:',
      error
    );
    consoleSpy.mockRestore();
  });

  it('should return empty object if service.post throws non-Error', async () => {
    (service.post as jest.Mock).mockRejectedValueOnce('some error');
    const consoleSpy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]> = jest.spyOn(console, 'error').mockImplementation();
    const result: any = await fetchDocumentCategory(payload);
    expect(result).toEqual({ status: 500, detail: "Unknown server error" });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("returns default error object when API throws unknown error without response", async () => {
    const mockError: { response: { data: { status: number, detail: string } } } = {
      response: {
        data: {
          status: 500,
          detail: "Unknown server error"
        }
      }
    };

    (service.post as jest.Mock).mockRejectedValue(mockError);

    const result: any = await fetchDocumentCategory(payload);

    expect(result).toEqual({ status: 500, detail: "Unknown server error" });
  });

  test('should return partitionKey if all branches fail', async () => {
    jest.spyOn(service, 'post').mockRejectedValueOnce({}); // No error.response.status
    const { clearAllFiles: importedClearAllFiles }: { clearAllFiles: (arg: any) => Promise<any> } = await import('../api/ApiService');    const testPayload: { request: { partitionKey: string[] } } = { request: { partitionKey: ['key1', 'key2'] } };
    const result: any = await importedClearAllFiles(testPayload);
    expect(result).toEqual(['key1', 'key2']);
  })
});

describe('viewDownload', () => {
  it('returns response data on success', async () => {
    (service.get as jest.Mock).mockResolvedValue({ data: [{ foo: 'bar' }] });
    const result: any = await viewDownload();
    expect(result).toEqual( { data: [{ foo: 'bar' }] });
  });

  it('returns empty object and logs error on failure', async () => {
    const error: Error = new Error('Network error');
    (service.get as jest.Mock).mockRejectedValue(error);
    const consoleSpy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]> = jest.spyOn(console, 'error').mockImplementation();

    await viewDownload();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching view downloads data:',
      error
    );
    consoleSpy.mockRestore();
  });

  it('calls service.get with correct arguments', async () => {
    (service.get as jest.Mock).mockResolvedValue({ data: {} });
    await viewDownload();
    expect(service.get).toHaveBeenCalledWith(
      '/validation/api/v1/file/viewDownload',
      expect.any(String)
    );
  });
});

describe('fetchStaffProfilePhoto', () => {
  const mockExternalId = 'abc123';
  const mockUrl = `/api/v1/personThumbnailImage/${mockExternalId}`;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns response on success', async () => {
    const mockResponse: { data: { foo: string } } = { data: { foo: 'bar' } };
    (service.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result: any = await fetchStaffProfilePhoto(mockExternalId);
    expect(result).toEqual(mockResponse);
    expect(service.get).toHaveBeenCalledWith(mockUrl, expect.any(String));
  });

  it('returns empty object and logs error on failure', async () => {
    const error: Error = new Error('Network error');
    (service.get as jest.Mock).mockRejectedValueOnce(error);
    const consoleSpy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]> = jest.spyOn(console, 'error').mockImplementation();

    await fetchStaffProfilePhoto(mockExternalId);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching staff profile photo:',
      error
    );
    consoleSpy.mockRestore();
  });

  it('calls service.get with correct url and baseUrl', async () => {
    (service.get as jest.Mock).mockResolvedValueOnce({ data: {} });
    await fetchStaffProfilePhoto(mockExternalId);
    expect(service.get).toHaveBeenCalledWith(mockUrl, expect.any(String));
  });

  it('handles empty externalId gracefully', async () => {
    (service.get as jest.Mock).mockResolvedValueOnce({ data: {} });
    await fetchStaffProfilePhoto('');
    expect(service.get).toHaveBeenCalledWith('/api/v1/personThumbnailImage/', expect.any(String));
  });

  it('returns empty object if service.get throws non-Error', async () => {
    (service.get as jest.Mock).mockRejectedValueOnce('some error');
    const consoleSpy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]> = jest.spyOn(console, 'error').mockImplementation();
    await fetchStaffProfilePhoto('');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe("prepareAndDownloadFile", () => {
  const payload: { request: { foo: string } } = { request: { foo: "bar" } };
  const url = "/validation/api/v1/file/preparedownload";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns status code on successful response", async () => {
    const mockResponse: AxiosResponse = {
      data: {},
      status: 204,
      statusText: "No Content",
      headers: {},
      config: {}
    };
    (service.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result: number | undefined = await prepareAndDownloadFile(payload);
    expect(result).toBe(204);
   expect(service.post).toHaveBeenCalledWith(
     url,
     payload,
     expect.objectContaining({ baseURL: expect.any(String) })
   )
  });

  test("returns error status from error.response.status", async () => {
    const error: { response: { status: number } } = {
      response: { status: 401 }
    };
    (service.post as jest.Mock).mockRejectedValueOnce(error);

    const result: number | undefined = await prepareAndDownloadFile(payload);
    expect(result).toBe(401);
    expect(service.post).toHaveBeenCalledWith(
      url,
      payload,
      expect.objectContaining({ baseURL: expect.any(String) })
    )
  });

  test("returns 400 if error does not have response.status", async () => {
    const error: Error = new Error("Network error");
    (service.post as jest.Mock).mockRejectedValueOnce(error);

    const result: number | undefined = await prepareAndDownloadFile(payload);
    expect(result).toBe(undefined);
   expect(service.post).toHaveBeenCalledWith(
     url,
     payload,
     expect.objectContaining({ baseURL: expect.any(String) })
   )
  });

  test("returns status code on successful response with status 400", async () => {
    const mockResponse: AxiosResponse = {
      data: {},
      status: 400,
      statusText: "Bad Request",
      headers: {},
      config: {}
    };
    (service.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result: number | undefined = await prepareAndDownloadFile(payload);
    expect(result).toBe(400);
    expect(service.post).toHaveBeenCalledWith(
      url,
      payload,
      expect.objectContaining({ baseURL: expect.any(String) })
    );
  })
});


describe('downloadFile', () => {
  let getSpy: jest.SpyInstance;
  const mockBlob: Blob = new Blob(['test content'], { type: 'application/pdf' });

  beforeEach(() => {
    getSpy = jest.spyOn((ApiService as any).fileDownloadInstance, 'get');
  });

  afterEach(() => {
    jest.clearAllMocks();
    getSpy.mockRestore();
  });

  it('should call fileDownloadInstance.get with correct url and return blob', async () => {
    getSpy.mockResolvedValueOnce({ data: mockBlob });
    const { downloadFile }: { downloadFile: (app?: string, section?: string, fileId?: string) => Promise<Blob> } = await import('../api/ApiService');
  const result: Blob = await downloadFile('app', 'section', 'file123');
    expect(result).toBe(mockBlob);
    expect(getSpy).toHaveBeenCalledWith('validation/api/v1/file?FileId=file123&Application=app&Section=section');
  });

  it('should call fileDownloadInstance.get with undefined params if not provided', async () => {
    getSpy.mockResolvedValueOnce({ data: mockBlob });
    const { downloadFile }: { downloadFile: (app?: string, section?: string, fileId?: string) => Promise<Blob> } = await import('../api/ApiService');
    await downloadFile();
    expect(getSpy).toHaveBeenCalledWith('validation/api/v1/file?FileId=undefined&Application=undefined&Section=undefined');
  });

  it('should throw error if fileDownloadInstance.get fails', async () => {
    getSpy.mockRejectedValueOnce(new Error('Download failed'));
    const { downloadFile }: { downloadFile: (app?: string, section?: string, fileId?: string) => Promise<Blob> } = await import('../api/ApiService');
    await expect(downloadFile('app', 'section', 'file123')).rejects.toThrow('Download failed');
  });
});

describe("validation API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockPayload: { request: { foo: string } } = { request: { foo: "bar" } };

  it("returns response on success", async () => {
    const mockResponse: { data: { valid: boolean }; status: number } = {
      data: { valid: true },
      status: 200,
    };
    (service.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result: any = await validation(mockPayload);
    expect(result).toBe(mockResponse);
    expect(service.post).toHaveBeenCalledWith(
      "/validation/api/v1/file/getfilevalidation",
      mockPayload,
      expect.objectContaining({ baseURL: expect.any(String) })
    )
  });

  it("returns empty object and logs error on failure", async () => {
    const error: any = "some error";
    (service.post as jest.Mock).mockRejectedValueOnce(error);
    const consoleSpy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]> = jest.spyOn(console, "error").mockImplementation();
    await validation(mockPayload);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching view downloads data:",
      error
    );
    consoleSpy.mockRestore();
  });
});

describe("deleteFiles API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockPayload: { request: { foo: string } } = { request: { foo: "bar" } };
  axios.delete = jest.fn();

  it("returns status on success", async () => {
    const mockResponse: { status: number } = { status: 204 };
    (axios.delete as jest.Mock).mockResolvedValueOnce(mockResponse);

    const result: number = await deleteFiles(mockPayload);
    expect(result).toBe(204);
expect(axios.delete).toHaveBeenCalledWith(
  expect.stringContaining("/validation/api/v1/file/bulkdelete"),
  {
    data: mockPayload,
    headers: {
      "Content-Type": "application/json-patch+json",
      Authorization: expect.any(String),
    }
  }
);
  });

  it("returns error status from error.response.status", async () => {
    const error: { response: { status: number } } = { response: { status: 401 } };
    (axios.delete as jest.Mock).mockRejectedValueOnce(error);

    const result: number = await deleteFiles(mockPayload);
    expect(result).toBe(401);
  });

  it("returns payload.request.status if error has no response.status", async () => {
    (axios.delete as jest.Mock).mockRejectedValueOnce(new Error("fail"));

    const payloadWithStatus: { request: { foo: string; status: number } } = { request: { foo: "bar", status: 400 } };
    const result: number = await deleteFiles(payloadWithStatus);
    expect(result).toBe(400);
  });
});

describe('bulkDownload', () => {
  const mockBlobName = 'test_blob';
  const mockFileName= 'test_file.txt';
  const encodedBlobName = encodeURIComponent(mockBlobName);
  const encodedFileName = encodeURIComponent(mockFileName);
  const expectedUrl = `/validation/api/v1/file/bulkdownload?BulkDownloadRequest.BlobName=${encodedBlobName}&BulkDownloadRequest.FileName=${encodedFileName}`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return response data when API call is successful', async () => {
    const mockData: { success: boolean } = { success: true };
    (service.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const result: { success: boolean } = await bulkDownload(mockBlobName, mockFileName);
    expect(result).toEqual(mockData);
    expect(service.get).toHaveBeenCalledWith(expectedUrl, expect.any(String));
  });

  it('should log error and return null when API call fails', async () => {
    const error: Error = new Error('Network error');
    (service.get as jest.Mock).mockRejectedValueOnce(error);
    const consoleSpy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]> = jest.spyOn(console, 'error').mockImplementation();

    const result: null = await bulkDownload(mockBlobName, mockFileName);
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith('Error in bulk download:', error);
    consoleSpy.mockRestore();
  });

  it('should encode blobName and fileName correctly in the URL', async () => {
    (service.get as jest.Mock).mockResolvedValueOnce({ data: {} });
    await bulkDownload('blob name with spaces', 'file name with spaces.txt');
    expect(service.get).toHaveBeenCalledWith(
      `/validation/api/v1/file/bulkdownload?BulkDownloadRequest.BlobName=blob%20name%20with%20spaces&BulkDownloadRequest.FileName=file%20name%20with%20spaces.txt`,
      expect.any(String)
    );
  });
});

describe('fetchPrivateDocumentDetails', () => {
  const baseProps = {
    pageNumber: 1,
    pageSize: 10,
    userId: 'user-123',
    sortBy: 'DateAdded',
    sortDirection: 'Desc'
  };

  const mockPrivateResponse: AxiosResponse<PrivateDocumentBasicDetails> = {
    data: { pageNumber: 1, pageSize: 10, totalRecords: 1, data: [] } as any,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns data when status is 200', async () => {
    jest.spyOn(service, 'post').mockResolvedValueOnce(mockPrivateResponse);

    const result = await fetchPrivateDocumentDetails(baseProps);

    expect(result).toEqual(mockPrivateResponse.data);
    expect(service.post).toHaveBeenCalledWith(
      'validation/api/v1/file/getprivatedocumentdetails',
      { documentsRequest: baseProps },
      expect.objectContaining({ baseURL: expect.any(String) })
    );
  });

  test('returns null when status is not 200 — covers non-200 branch', async () => {
    jest.spyOn(service, 'post').mockResolvedValueOnce({ ...mockPrivateResponse, status: 404 });

    const result = await fetchPrivateDocumentDetails(baseProps);

    expect(result).toBeNull();
  });

  test('uses default sortBy and sortDirection when not provided — covers default parameter branches', async () => {
    jest.spyOn(service, 'post').mockResolvedValueOnce(mockPrivateResponse);

    await fetchPrivateDocumentDetails({ pageNumber: 1, pageSize: 10, userId: 'user-1' });

    expect(service.post).toHaveBeenCalledWith(
      'validation/api/v1/file/getprivatedocumentdetails',
      {
        documentsRequest: expect.objectContaining({
          sortBy: 'DateAdded',
          sortDirection: 'Desc'
        })
      },
      expect.objectContaining({ baseURL: expect.any(String) })
    );
  });

  test('returns err.response.data on thrown error — covers catch branch', async () => {
    const errorData = { status: 500, detail: 'Server error' };
    jest.spyOn(service, 'post').mockRejectedValueOnce({ response: { data: errorData } });

    const result = await fetchPrivateDocumentDetails(baseProps);

    expect(result).toEqual(errorData);
  });

  test('returns fallback error object when err.response.data is undefined — covers ?? branch', async () => {
    jest.spyOn(service, 'post').mockRejectedValueOnce(new Error('Network failure'));

    const result = await fetchPrivateDocumentDetails(baseProps);

    expect(result).toEqual({ status: 500, detail: 'Unknown server error' });
  });
});
