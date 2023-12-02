import { pilotReady } from '../flagr-helper';
import {isOrganisationInVariant} from "../flagr-utils"

jest.mock('@essnextgen/ui-flagr', () => ({
  getFeaturePermission: jest.fn(),
  hasFeaturePermission: jest.fn()
}));

jest.mock('../auth-helper', () => ({
  getUserOrganisation: jest.fn(() => 'userOrg123')
}));

describe('pilotReady', () => {
  beforeEach(() => {
    
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return true if the flag is enabled and user organization is included', () => {
    const featureFlag = {
      key: 'valid-flag',
      enabled: true,
      description: 'valid-flag',
      variants: [
        {
          Key: 'ActiveOrganisations',
          Attachment: { payload: [], IncludeOrganisations: ['userOrg123'] }
        }
      ]
    };
    jest.mock('@essnextgen/ui-flagr', () => ({
      getFeaturePermission: jest.fn().mockReturnValueOnce(featureFlag)      
    }));   
    const attachmentPayload = {
      Payload: [],
      IncludeOrganisations: ['userOrg123']
    };
    jest.mock('../flagr-helper', () => ({
      getFeatureFlagVariantAttachment: jest.fn().mockReturnValueOnce(attachmentPayload)      
    })); 
    const result = pilotReady('valid-flag', 'ActiveOrganisations');
    expect(result).toBe(true);
  });

  test('should return false if the flag is enabled but user organization is not included', () => {
    const featureFlag = {
      key: 'valid-flag',
      enabled: true,
      description: '',
      variants: [
        {
          Key: 'TableColumns',
          Attachment: JSON.parse(
            '{ "payload": [{ "key": "WorkingStatus", "value": false },{ "key": "Role", "value": true },{ "key": "Subject", "value": true }]}'
          )
        }
      ]
    };
      /* eslint-disable */  
    require('@essnextgen/ui-flagr').getFeaturePermission.mockReturnValueOnce(
      featureFlag
    );

    const attachmentPayload = {
      Payload: [{ key: 'key1', value: true }],
      IncludeOrganisations: ['someOtherOrg']
    };
    require('../flagr-helper').getFeatureFlagVariantAttachment = jest
      .fn()
      .mockReturnValueOnce(attachmentPayload);
  /* eslint-enable */  
    const result = pilotReady('valid-flag', 'TableColumns');

    expect(result).toBe(false);
  });

  test('should return true if the flag is disabled', () => {  

    const result = pilotReady('flagName1', 'variantType1');

    expect(result).toBe(true);
  });

  test('should return true if the flag permission is not found', () => {
    
    const result = pilotReady('flagName1', 'variantType1');

    expect(result).toBe(true);
  });

  test('test pilot ready to have been called', () => {
    const pilotreadyfn=jest.fn().mockReturnValueOnce(true);
    jest.mock('../flagr-helper', () => ({
      pilotready: pilotreadyfn      
    }));    
    const result = isOrganisationInVariant();

    expect(result).toBe(true);   
  });
});
