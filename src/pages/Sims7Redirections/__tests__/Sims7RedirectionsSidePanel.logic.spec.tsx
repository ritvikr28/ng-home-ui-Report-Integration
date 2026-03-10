import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useSims7RedirectionViewData } from '../Sims7RedirectionsSidePanel.logic';
import * as api from '../Sims7RedirectionsPage.api';

describe('useSims7RedirectionViewData', () => {
  const mockData = {
    moduleId: 123,
    organisationId: 1,
    dfeNumber: '123456',
    ngModule: 'TestNextGen',
    sims7Module: 'TestSIMS7',
    ngComponent: 'TestCat',
    updatedBy: 'TestUser',
    effectiveDate: '2026-02-18T00:00:00',
    redirectStatus: 'PLANNED',
    tooltipMessage: 'Test tooltip',
    cellStatus: '',
    actions: { options: [{ disabled: false, isSelected: false, text: ' View', value: 'View' }] },
    reasonForChanges: '',
    createdAt: '2026-02-18T00:00:00',
    updatedAt: '2026-02-18T00:00:00',
    id: 123,
    switchToSchool: false,
    switchToPPG: false,
    redirectType: 'Permanent',
    redirectReason: '',
    isWritebackProcessed: false,
    updatedOn: '2026-02-18T00:00:00',
  };

  beforeEach(() => jest.spyOn(api, 'fetchSims7RedirectionById').mockResolvedValue(mockData));

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls fetchSims7RedirectionById when mode is "view" and moduleId is provided', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSims7RedirectionViewData(123, 'view'));
    await waitForNextUpdate();
    expect(api.fetchSims7RedirectionById).toHaveBeenCalledWith({ moduleId: 123 });
    expect(result.current.viewData).toEqual(mockData);
  });

  it('does not call fetchSims7RedirectionById when mode is not "view"', async () => {
    renderHook(() => useSims7RedirectionViewData(123, 'edit'));
    expect(api.fetchSims7RedirectionById).not.toHaveBeenCalled();
  });

  it('does not call fetchSims7RedirectionById when moduleId is undefined', async () => {
    renderHook(() => useSims7RedirectionViewData(undefined, 'view'));
    expect(api.fetchSims7RedirectionById).not.toHaveBeenCalled();
  });

  it('returns initial viewData as null before fetch', () => {
    const { result } = renderHook(() => useSims7RedirectionViewData(123, 'view'));
    expect(result.current.viewData).toBeNull();
  });

  it('handles fetch errors gracefully', async () => {
    jest.spyOn(api, 'fetchSims7RedirectionById').mockRejectedValueOnce(new Error('API failed'));
    const { result } = renderHook(() => useSims7RedirectionViewData(123, 'view'));
    await waitFor(() => {
      expect(result.current.viewData).toBeNull();
    });
  });
});
