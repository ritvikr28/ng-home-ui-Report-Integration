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
  Name: string;
  Organisations: Array<string>;
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
  const pilotReadyOrg: IFeatureFlag | null = getFeaturePermission(`${envConfig.APPLICATION}`, flagName);
  if (pilotReadyOrg?.enabled) {
    const variantAttachmentPayload: IFeatureFlagVariantAttachment | undefined =
      getFeatureFlagVariantAttachment(pilotReadyOrg, variantType);
    if (
      variantAttachmentPayload &&
      variantAttachmentPayload.ExcludeOrganisations.length > 0
    ) {
      const isExcludedOrganisation: boolean | string | undefined =
        variantAttachmentPayload.ExcludeOrganisations.find(
          x => x.toLocaleUpperCase() === userOrganisation.toLocaleUpperCase()
        );
      if (isExcludedOrganisation === undefined) {
        return true;
      }
      return false;
    }
  }
  return false;
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

const flagrWithModueCheckAndOrgCheck: (flagName: string, variantType: string,menu:string,appName:string) => boolean = (
  flagName: string,
  variantType: string,
  menu :string,
  appName: string
): any => {
  const pilotReadyOrg: IFeatureFlag | null = getFeaturePermission(appName,flagName);
  if (pilotReadyOrg?.enabled) {
    const variantAttachmentPayload: IFeatureFlagVariantAttachment | undefined =
      getFeatureFlagVariantAttachment(pilotReadyOrg, variantType);
    if( variantAttachmentPayload && variantAttachmentPayload.Payload.length>0)
    {
      const modules:IAttachmentValue[]=
          variantAttachmentPayload.Payload.filter(y=>y.Name===menu);
       
      if (modules.length === 0) {
        return true;
      }
       // eslint-disable-next-line
      else if (modules.length > 0 && modules[0].Organisations.length > 0)
      {

        const isIncludedOrganisation: string | undefined =
                    modules[0].Organisations.find(
                      x => x.toLocaleUpperCase() === userOrganisation.toLocaleUpperCase()
                    );
        if (isIncludedOrganisation === undefined) {
          return false;
        }
      }
    }    
    else return true;
  }
  return true;
};

export { getFeatureFlagVariantAttachment, pilotReady, pilotReadyForForAnyOrAll ,pilotReadyForExcluded,flagrWithModueCheckAndOrgCheck};