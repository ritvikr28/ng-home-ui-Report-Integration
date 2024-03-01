import { pilotReady } from './flagr-helper';

export const isOrganisationInVariant: (flagName:string) => boolean = (flagName:string) => {
  const organisationEnabled: boolean = pilotReady(
    flagName,
    'ActiveOrganisations'
  );
  return organisationEnabled;
};
