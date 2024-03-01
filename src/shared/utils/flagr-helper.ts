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
    IncludeOrganisations: []
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

export { getFeatureFlagVariantAttachment, pilotReady };
