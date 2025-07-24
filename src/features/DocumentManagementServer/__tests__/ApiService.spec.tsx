import '@testing-library/jest-dom';
import { AxiosResponse } from 'axios';
import { DocumentBasicDetails, SingleDocumentDetail } from '../responseModel';
import { service } from '../../../shared/utils';
import { fetchDocumentDetails, fetchDMSSuggestions, fetchFilterCategory } from '../ApiService';

const documentResponse: SingleDocumentDetail[] = [
  {
    organizationId: 'cd0e52dd',
    userId: '9fbe1bcc',
    registrationId: 2,
    fileId: '427e150',
    personExternalId: '00000000',
    documentInfo: {
      fileName: 'image',
      isSelectedForPrepareDownload: true,
    },
    document: 'image',
    relatedTo: null,
    category: 'App',
    addedBy: 'SIMS-NG',
    dateAdded: '11/25/2024 10:04:54',
    format: 'png',
    size: '2 KB',
    blobName: 'App_427E150E',
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
  config: {},
};


describe('fetchDocumentDetails', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return data on successful fetch', async () => {
    jest.spyOn(service, 'post').mockResolvedValueOnce(mockAxiosResponse);

    const result = await fetchDocumentDetails({ pageNumber: 1, pageSize: 40 });

    expect(result).toEqual(mockAxiosResponse.data);
    expect(service.post).toHaveBeenCalledTimes(1);
  });

  test('should return null when status is not 200', async () => {
    const mockFailureResponse: Partial<AxiosResponse<DocumentBasicDetails>> = {
      ...mockAxiosResponse,
      status: 404,
    };
    jest
      .spyOn(service, 'post')
      .mockResolvedValueOnce(mockFailureResponse as AxiosResponse<DocumentBasicDetails>);

    const result = await fetchDocumentDetails({ pageNumber: 1, pageSize: 40 });
    expect(result).toBeNull();
  });

  test('should return null when exception is thrown', async () => {
    jest.spyOn(service, 'post').mockRejectedValueOnce(new Error('API failed'));

    const result = await fetchDocumentDetails({ pageNumber: 1, pageSize: 40 });
    expect(result).toBeUndefined();
  });
});

describe('fetchDMSSuggestions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockValues = [
    { fileName: 'doc1', fileId: 'id1' },
    { fileName: 'doc2', fileId: 'id2' }
  ];

  const makeAxiosResponse = (data: any): AxiosResponse => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  });

  test('should return suggestions when API has valid values', async () => {
    const mockResponse = makeAxiosResponse({
      payload: [{ values: mockValues }],
    });

    jest.spyOn(service, 'get').mockResolvedValueOnce(mockResponse);

    const result = await fetchDMSSuggestions('doc');
    const values = Array.isArray(result?.payload?.[0]?.values)
      ? result.payload[0].values
      : [];

    expect(values).toEqual(mockValues);
  });

  test('should return empty array when no values present', async () => {
    const mockResponse = makeAxiosResponse({
      payload: [{ values: undefined }],
    });

    jest.spyOn(service, 'get').mockResolvedValueOnce(mockResponse);

    const result = await fetchDMSSuggestions('doc');
    const values = Array.isArray(result?.payload?.[0]?.values)
      ? result.payload[0].values
      : [];

    expect(values).toEqual([]);
  });

  test('should return empty array when payload is missing', async () => {
    const mockResponse = makeAxiosResponse({ payload: undefined });

    jest.spyOn(service, 'get').mockResolvedValueOnce(mockResponse);

    const result = await fetchDMSSuggestions('doc');
    const values = Array.isArray(result?.payload?.[0]?.values)
      ? result.payload[0].values
      : [];

    expect(values).toEqual([]);
  });

  test('should return empty array on API error', async () => {
    jest.spyOn(service, 'get').mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchDMSSuggestions('doc');
    const values = Array.isArray(result?.payload?.[0]?.values)
      ? result.payload[0].values
      : [];

    expect(values).toEqual([]);
  });
});

describe('fetchFilterCategory', () => {
  const mockUrl = '/validation/api/v1/applicationregistration';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return data when API call is successful', async () => {
    const mockData = { foo: 'bar' };
    (service.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const result = await fetchFilterCategory();
    expect(result).toEqual(mockData);
    expect(service.get).toHaveBeenCalledWith(mockUrl, expect.anything());
  });

  test('should return empty object and log error on failure', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (service.get as jest.Mock).mockRejectedValueOnce(new Error('API error'));

    const result = await fetchFilterCategory();
    expect(result).toEqual({});
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching DMS suggestions:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });

  test('should return undefined if response is undefined', async () => {
    (service.get as jest.Mock).mockResolvedValueOnce(undefined);

    const result = await fetchFilterCategory();
    expect(result).toBeUndefined();
  });
});

describe('fetchFilterCategory', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockUrl = '/validation/api/v1/applicationregistration';

  test('should return data when API call is successful', async () => {
    const mockData = { foo: 'bar' };

    const mockResponse: AxiosResponse = {
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    jest.spyOn(service, 'get').mockResolvedValueOnce(mockResponse);

    const result = await fetchFilterCategory();

    expect(result).toEqual(mockData);
    expect(service.get).toHaveBeenCalledWith(mockUrl, 'https://dev.platform.sims.co.uk');
  });

  test('should return empty object and log error on failure', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(service, 'get').mockRejectedValueOnce(new Error('API error'));

    const result = await fetchFilterCategory();
    expect(result).toEqual({});
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching DMS suggestions:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});