import { fetchSims7Redirections } from '../Sims7RedirectionsPage.api';
import { service } from '../../../shared/utils/api-service';

jest.mock('../../../shared/utils/api-service', () => ({
  service: {
    get: jest.fn()
  }
}));

describe('fetchSims7Redirections', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns items when API returns valid payload', async () => {
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
    (service.get as jest.Mock).mockResolvedValue({ data: { payload: { items: mockItems } } });
    const result = await fetchSims7Redirections();
  expect(result).toEqual({ items: mockItems, totalItems: 0 });
  });

  it('returns empty array if payload is missing', async () => {
    (service.get as jest.Mock).mockResolvedValue({ data: {} });
    const result = await fetchSims7Redirections();
    expect(result).toEqual({ items: [], totalItems: 0 });
  });

  it('returns empty array if items is not an array', async () => {
    (service.get as jest.Mock).mockResolvedValue({ data: { payload: { items: null } } });
    const result = await fetchSims7Redirections();
    expect(result).toEqual({ items: [], totalItems: 0 });
  });

  it('returns empty array if response is null', async () => {
    (service.get as jest.Mock).mockResolvedValue(null);
    const result = await fetchSims7Redirections();
    expect(result).toEqual({ items: [], totalItems: 0 });
  });

  it('returns empty array if response.data is null', async () => {
    (service.get as jest.Mock).mockResolvedValue({ data: null });
    const result = await fetchSims7Redirections();
    expect(result).toEqual({ items: [], totalItems: 0 });
  });
});
