import {
  getFeaturePermission,
  IFeatureFlag,
  IFeatureFlagVariant
} from '@essnextgen/ui-flagr';
import { getUserOrganisation } from './auth-helper';
import { envConfig } from './constants';


interface IFeatureFlagVariantAttachment {
  Payload: Array<IAttachmentValue>;
  IncludeOrganisations: Array<string>;
  ExcludeOrganisations: Array<string>;
}

interface IAttachmentValue {
  key: string;
  value: boolean;
}

const userOrganisation: string = getUserOrganisation();

const getFeatureFlagVariantAttachment: (
  featurePermission: IFeatureFlag,
  variantName: string
) => IFeatureFlagVariantAttachment | undefined = (
  featurePermission: IFeatureFlag,
  variantName: string
) => {
  const visibilityVariant: IFeatureFlagVariant | undefined =
    featurePermission.variants.find(x => x.Key === variantName);

    const defaultAttachment: IFeatureFlagVariantAttachment = {
      Payload: [],
      IncludeOrganisations: [],
      ExcludeOrganisations: []
    };

  const attachment: IFeatureFlagVariantAttachment = Object.assign(
    defaultAttachment,
    visibilityVariant?.Attachment
  );

  return attachment;
};

const pilotReady: (flagName: string, variantType: string) => boolean = (
  flagName: string,
  variantType: string
): any => {
  console.info('pilotReady included called', { flagName, variantType, userOrganisation });
  const pilotReadyOrg: IFeatureFlag | null = getFeaturePermission(`${envConfig.APPLICATION}`,flagName);

  if (pilotReadyOrg?.enabled) {
    const variantAttachmentPayload: IFeatureFlagVariantAttachment | undefined =
      getFeatureFlagVariantAttachment(pilotReadyOrg, variantType);

    if (
      variantAttachmentPayload &&
      variantAttachmentPayload.IncludeOrganisations.length > 0
    ) {
      const isIncludedOrganisation: string | undefined =
        variantAttachmentPayload.IncludeOrganisations.find(
          x => x.toLocaleUpperCase() === userOrganisation.toLocaleUpperCase()
        );
      if (isIncludedOrganisation === undefined) {
        return false;
      }
    } else return false;
  }
  return true;
};

const pilotReadyForExcluded: (flagName: string, variantType: string) => boolean = (
  flagName: string,
  variantType: string
): any => {
  console.info('pilotReady excluded called', { flagName, variantType, userOrganisation });
  const pilotReadyOrg: IFeatureFlag | null = getFeaturePermission(`${envConfig.APPLICATION}`, flagName);
  if (pilotReadyOrg?.enabled) {
    const variantAttachmentPayload: IFeatureFlagVariantAttachment | undefined =
      getFeatureFlagVariantAttachment(pilotReadyOrg, variantType);

      console.info('variantAttachmentPayload excluded', variantAttachmentPayload);
    if (
      variantAttachmentPayload &&
      variantAttachmentPayload.ExcludeOrganisations.length > 0
    ) {
      const isExcludedOrganisation: string | undefined =
        variantAttachmentPayload.ExcludeOrganisations.find(
          x => x.toLocaleUpperCase() === userOrganisation.toLocaleUpperCase()
        );
      if (isExcludedOrganisation === undefined) {
        return true;
      }
      return isExcludedOrganisation && false;
    }
  }
  return true;
};


const pilotReadyForForAnyOrAll: (flagName: string, variantType: string) => boolean = (
  flagName: string,
  variantType: string
): boolean => {
  const pilotReadyOrg: IFeatureFlag | null = getFeaturePermission(`${envConfig.APPLICATION}`, flagName);

  if (pilotReadyOrg?.enabled) {
    const variantAttachmentPayload: IFeatureFlagVariantAttachment | undefined =
      getFeatureFlagVariantAttachment(pilotReadyOrg, variantType);

    if (
      variantAttachmentPayload &&
      variantAttachmentPayload.IncludeOrganisations.length > 0
    ) {
      const isIncludedOrganisation: string | undefined =
        variantAttachmentPayload.IncludeOrganisations.find(
          x => x.toLocaleUpperCase() === userOrganisation.toLocaleUpperCase()
        );
     
      if (!isIncludedOrganisation) {
        return false;
      }
    }
    return true;
  }

  return false;
};

export { getFeatureFlagVariantAttachment, pilotReady, pilotReadyForForAnyOrAll ,pilotReadyForExcluded};