import { pilotReady, pilotReadyForForAnyOrAll, pilotReadyForExcluded } from './flagr-helper';

export const isOrganisationInVariant: (flagName:string) => boolean = (flagName:string) => {
  const organisationEnabled: boolean = pilotReady(
    flagName,
    'ActiveOrganisations'
  );
  return organisationEnabled;
};

export const isOrganisationExcludedInVariant: (flagName: string) => boolean = (flagName: string) => {
  const organisationEnabled: boolean = pilotReadyForExcluded(
    flagName,
    'ActiveOrganisations'
  );
  return organisationEnabled;
};


export const isOrganisationInVariantForAnyOrAll: (flagName: string) => boolean = (flagName: string) => {
  const organisationEnabled: boolean = pilotReadyForForAnyOrAll(
    flagName,
    'ActiveOrganisations'
  );
  return organisationEnabled;
};


