import { fetchVideoPlayStatus } from '../videoPlayStatus';
import { service } from '../../utils/api-service';

jest.mock('../../utils/api-service', () => ({
  service: {
    get: jest.fn(),
  },
}));

describe('fetchVideoPlayStatus', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns success true and isPlayed when status 200 and payload exists', async () => {
    (service.get as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: { payload: { isPlayed: 'test-value' } },
    });
    const result = await fetchVideoPlayStatus();
    expect(result).toEqual({ success: true, isPlayed: 'test-value' });
  });

  it('returns success false and isPlayed null when status 200 but no payload', async () => {
    (service.get as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: {},
    });
    const result = await fetchVideoPlayStatus();
    expect(result).toEqual({ success: false, isPlayed: null });
  });

  it('returns success false and isPlayed null when status is not 200', async () => {
    (service.get as jest.Mock).mockResolvedValueOnce({
      status: 404,
      data: { payload: { isPlayed: 'test-value' } },
    });
    const result = await fetchVideoPlayStatus();
    expect(result).toEqual({ success: false, isPlayed: null });
  });

  it('returns success false and isPlayed null when an error is thrown', async () => {
    (service.get as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    const result = await fetchVideoPlayStatus();
    expect(result).toEqual({ success: false, isPlayed: null });
  });
});

describe('fetchVideoPlayStatus - optional chaining coverage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns success false and isPlayed null when status 200 but data is undefined', async () => {
    (service.get as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: undefined,
    });
    const result = await fetchVideoPlayStatus();
    expect(result).toEqual({ success: false, isPlayed: null });
  });

  it('returns success false and isPlayed null when status 200 but data is null', async () => {
    (service.get as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: null,
    });
    const result = await fetchVideoPlayStatus();
    expect(result).toEqual({ success: false, isPlayed: null });
  });
});
