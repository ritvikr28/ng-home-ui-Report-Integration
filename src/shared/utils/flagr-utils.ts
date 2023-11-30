import { pilotReady } from './flagr-helper';

export const isOrganisationInVariant: () => boolean = () => {
  const organisationEnabled: boolean = pilotReady(
    'NewHomePage',
    'ActiveOrganisations'
  );
  return organisationEnabled;
};
