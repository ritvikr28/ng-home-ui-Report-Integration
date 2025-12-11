import { saveVideoPlayStatus } from '../videoPlayStatusSave';
import { service } from '../../utils/api-service';

jest.mock('../../utils/api-service', () => ({
  service: {
    post: jest.fn(),
  },
}));
jest.mock('../../utils', () => ({
  envConfig: { BASE_URL: 'http://mock-base-url' },
}));

describe('saveVideoPlayStatus', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns data when status is 200', async () => {
    const mockData = { errors: null, payload: { foo: 'bar' }, status: 200 };
    (service.post as jest.Mock).mockResolvedValueOnce({ status: 200, data: mockData });
    const result = await saveVideoPlayStatus();
    expect(result).toEqual(mockData);
    expect(service.post).toHaveBeenCalledWith('http://mock-base-url/VideoPlayStatus/Save', { isPlayed: 'Played' });
  });

  it('returns data when status is 201', async () => {
    const mockData = { errors: null, payload: { foo: 'bar' }, status: 201 };
    (service.post as jest.Mock).mockResolvedValueOnce({ status: 201, data: mockData });
    const result = await saveVideoPlayStatus();
    expect(result).toEqual(mockData);
  });

  it('returns data when status is 204', async () => {
    const mockData = { errors: null, payload: { foo: 'bar' }, status: 204 };
    (service.post as jest.Mock).mockResolvedValueOnce({ status: 204, data: mockData });
    const result = await saveVideoPlayStatus();
    expect(result).toEqual(mockData);
  });

  it('returns null when status is not 200/201/204', async () => {
    (service.post as jest.Mock).mockResolvedValueOnce({ status: 400, data: {} });
    const result = await saveVideoPlayStatus();
    expect(result).toBeNull();
  });

  it('returns null when an error is thrown', async () => {
    (service.post as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    const result = await saveVideoPlayStatus();
    expect(result).toBeNull();
  });
});
