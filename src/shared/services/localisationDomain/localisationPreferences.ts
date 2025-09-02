
import { envConfig } from "../../utils";
import { service } from "../../utils/api-service";
// Update the path below to the correct location of LocalisationPreferences or its type declarations
import { ILookupLanguageDto } from "../../model/LocalisationPref/LocalisationPreferences";

export const fetchPreferredLanguage: () => Promise<ILookupLanguageDto | null> =
  async () => {
    try {
      const response = await service.get(
        `${envConfig.BASE_URL}/User/LanguagePreference`
      );
      if (response.status === 200) {
        return response.data;
      } 
        return null;
      
    } catch (error) {
      return null;
    }
  };