import { renderHook } from '@testing-library/react-hooks';
import { useVideoPlayStatus } from './useVideoPlayStatus';
import * as LayoutModule from '../../Layout';
import * as AppModule from '../../App';
import { fetchVideoPlayStatus } from '../services/videoPlayStatus';

// Mock dependencies
jest.mock('../services/videoPlayStatus', () => ({
  fetchVideoPlayStatus: jest.fn()
}));
describe('useVideoPlayStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function setPermissionAndOrgView(permission: boolean, orgView: boolean) {
    // @ts-ignore
    AppModule.hasNewHomePagePermission = permission;
    // @ts-ignore
    LayoutModule.homepageVideoOrgViewIncluded = orgView;
  }

  it('returns isPlayed=true and apiError=false by default if permission or org view not included', async () => {
    setPermissionAndOrgView(false, false);
    const { result } = renderHook(() => useVideoPlayStatus());
    // No API call should be made
    expect(fetchVideoPlayStatus).not.toHaveBeenCalled();
    expect(result.current.isPlayed).toBe(true);
    expect(result.current.apiError).toBe(false);
  });

  it('sets isPlayed and apiError based on API success', async () => {
    setPermissionAndOrgView(true, true);
    (fetchVideoPlayStatus as jest.Mock).mockResolvedValue({ success: true, isPlayed: false });
    const { result, waitForNextUpdate } = renderHook(() => useVideoPlayStatus());
    await waitForNextUpdate();
    expect(result.current.isPlayed).toBe(false);
    expect(result.current.apiError).toBe(false);
  });

  it('sets apiError=true if API fails', async () => {
    setPermissionAndOrgView(true, true);
    (fetchVideoPlayStatus as jest.Mock).mockResolvedValue({ success: false });
    const { result, waitForNextUpdate } = renderHook(() => useVideoPlayStatus());
    await waitForNextUpdate();
    expect(result.current.isPlayed).toBe(false);
    expect(result.current.apiError).toBe(true);
  });

  it('sets apiError=true if API throws', async () => {
    setPermissionAndOrgView(true, true);
    (fetchVideoPlayStatus as jest.Mock).mockRejectedValue(new Error('API error'));
    const { result, waitForNextUpdate } = renderHook(() => useVideoPlayStatus());
    await waitForNextUpdate();
    expect(result.current.isPlayed).toBe(false);
    expect(result.current.apiError).toBe(true);
  });
});
