import { fetchSims7Redirections, fetchSims7RedirectionById } from '../Sims7RedirectionsPage.api';
import { service } from '../../../shared/utils/api-service';

jest.mock('../../../shared/utils/api-service', () => ({
  service: {
    get: jest.fn()
  }
}));

describe('fetchSims7Redirections', () => {
    });

describe('fetchSims7RedirectionById', () => {
  it('returns .data from service response', async () => {
    const mockData = { moduleId: 1, organisationId: 2, dfeNumber: '123', ngModule: 'A', ngComponent: 'B', sims7Module: 'C', switchToSchool: true, switchToPPG: false, effectiveDate: '2026-02-18', redirectStatus: 'PLANNED', isWritebackProcessed: false, updatedOn: '2026-02-18', updatedBy: 'User' };
    (service.get as jest.Mock).mockResolvedValue({ data: mockData });
    const result = await fetchSims7RedirectionById({ moduleId: 1 });
    expect(result).toEqual(mockData);
  });
    it('defaults totalItems to 0 if not a number', async () => {
      const mockItems = [
        {
          ngComponent: 'A',
          ngModule: 'B',
          sims7Module: 'C',
          updatedBy: 'D',
          effectiveDate: '2026-02-18T00:00:00',
          redirectStatus: 'PLANNED',
          tooltipMessage: '',
          cellStatus: '',
          actions: { options: [] },
          reasonForChanges: ''
        }
      ];
      (service.get as jest.Mock).mockResolvedValue({ data: { payload: { items: mockItems, totalItems: 'not-a-number' } } });
      const result = await fetchSims7Redirections({});
      expect(result).toEqual({ items: mockItems, totalItems: 0 });
    });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns items when API returns valid payload', async () => {
    const mockItems: Array<{
      ngComponent: string;
      ngModule: string;
      sims7Module: string;
      updatedBy: string;
      effectiveDate: string;
      redirectStatus: string;
      tooltipMessage: string;
      cellStatus: string;
      actions: { options: any[] };
      reasonForChanges: string;
    }> = [
      {
        ngComponent: 'A',
        ngModule: 'B',
        sims7Module: 'C',
        updatedBy: 'D',
        effectiveDate: '2026-02-18T00:00:00',
        redirectStatus: 'PLANNED',
        tooltipMessage: '',
        cellStatus: '',
        actions: { options: [] },
        reasonForChanges: ''
      }
    ];
    (service.get as jest.Mock).mockResolvedValue({ data: { payload: { items: mockItems } } });
    const result = await fetchSims7Redirections({});
    expect(result).toEqual({ items: mockItems, totalItems: 0 });
  });

  it('returns empty array if payload is missing', async () => {
    (service.get as jest.Mock).mockResolvedValue({ data: {} });
    const result = await fetchSims7Redirections({});
    expect(result).toEqual({ items: [], totalItems: 0 });
  });

  it('returns empty array if items is not an array', async () => {
    (service.get as jest.Mock).mockResolvedValue({ data: { payload: { items: null } } });
    const result = await fetchSims7Redirections({});
    expect(result).toEqual({ items: [], totalItems: 0 });
  });

  it('returns empty array if response is null', async () => {
    (service.get as jest.Mock).mockResolvedValue(null);
    const result = await fetchSims7Redirections({});
    expect(result).toEqual({ items: [], totalItems: 0 });
  });

  it('returns empty array if response.data is null', async () => {
    (service.get as jest.Mock).mockResolvedValue({ data: null });
    const result = await fetchSims7Redirections({});
    expect(result).toEqual({ items: [], totalItems: 0 });
  });
});
