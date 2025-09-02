import { fetchPreferredLanguage } from '../localisationPreferences';
import { service } from '../../../utils/api-service';
import { envConfig } from '../../../utils';

jest.mock('../../../utils/api-service', () => ({
  service: {
    get: jest.fn()
  }
}));

jest.mock('@essnextgen/ui-application-kit', () => ({
  ApplicationConfig: {
    getRoleBasedMenus: jest.fn(() => [
      { appCode: 'Home' },
      { appCode: 'Other' }
    ])
  }
}));

describe('fetchPreferredLanguage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return language data when response is 200', async () => {
    const mockData = { languageCode: 'en' };
    (service.get as jest.Mock).mockResolvedValue({ status: 200, data: mockData });
    const result = await fetchPreferredLanguage();
    expect(result).toEqual(mockData);
    expect(service.get).toHaveBeenCalledWith(`${envConfig.BASE_URL}/User/LanguagePreference`);
  });

  it('should return null when response status is not 200', async () => {
    (service.get as jest.Mock).mockResolvedValue({ status: 404 });
    const result = await fetchPreferredLanguage();
    expect(result).toBeNull();
  });

  it('should return null on error', async () => {
    (service.get as jest.Mock).mockRejectedValue(new Error('Network error'));
    const result = await fetchPreferredLanguage();
    expect(result).toBeNull();
  });
});
