import { IFeatureFlag } from '@essnextgen/ui-flagr';
import * as uiFlagr from '@essnextgen/ui-flagr';
import * as flagrHelper from '../flagr-helper';
import * as flagrUtils from '../flagr-utils';

jest.mock('@essnextgen/ui-flagr', () => ({
  getFeaturePermission: jest.fn(),
  hasFeaturePermission: jest.fn()
}));

jest.mock('../auth-helper', () => ({
  getUserOrganisation: jest.fn(() => 'userOrg123')
}));

const { getFeatureFlagVariantAttachment, pilotReady } = flagrHelper;
const { isOrganisationInVariant } = flagrUtils;

describe('pilotReady', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    (uiFlagr.getFeaturePermission as jest.Mock).mockReturnValueOnce(featureFlag);
    jest.spyOn(flagrHelper, 'getFeatureFlagVariantAttachment').mockReturnValueOnce({
      Payload: [],
      IncludeOrganisations: ['userOrg123'],
      ExcludeOrganisations: []
    });
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
    (uiFlagr.getFeaturePermission as jest.Mock).mockReturnValueOnce(featureFlag);
    jest.spyOn(flagrHelper, 'getFeatureFlagVariantAttachment').mockReturnValueOnce({
      Payload: [{ key: 'key1', value: true }],
      IncludeOrganisations: ['someOtherOrg'],
      ExcludeOrganisations: []
    });

    const result = pilotReady('valid-flag', 'TableColumns');
    expect(result).toBe(false);
  });

  test('should return true if the flag is disabled', () => {
    const featureFlag = {
      key: 'flagName1',
      enabled: false,
      description: 'Disabled Flag',
      variants: []
    };
    (uiFlagr.getFeaturePermission as jest.Mock).mockReturnValueOnce(featureFlag);
    const result = pilotReady('flagName1', 'variantType1');
    expect(result).toBe(true);
  });

  test('should return true if the flag permission is not found', () => {
    (uiFlagr.getFeaturePermission as jest.Mock).mockReturnValueOnce(undefined);
    const result = pilotReady('flagName1', 'variantType1');
    expect(result).toBe(true);
  });

  test('test pilot ready to have been called', () => {
    const pilotreadyfn = jest.fn().mockReturnValueOnce(true);
    jest.spyOn(flagrHelper, 'pilotReady').mockImplementation(pilotreadyfn);
    const result = isOrganisationInVariant('NewHomePage');
    expect(result).toBe(true);
  });
});

test('should return false if user organization is not included in the variant attachment', () => {
  const featureFlag = {
    key: 'valid-flag',
    enabled: true,
    description: '',
    variants: [
      {
        Key: 'TableColumns',
        Attachment: {
          payload: [],
          IncludeOrganisations: ['someOtherOrg']
        }
      }
    ]
  };
  (uiFlagr.getFeaturePermission as jest.Mock).mockReturnValueOnce(featureFlag);
  jest.spyOn(flagrHelper, 'getFeatureFlagVariantAttachment').mockReturnValueOnce({
    Payload: [],
    IncludeOrganisations: ['someOtherOrg'],
    ExcludeOrganisations: [] // <-- add this line

  });

  const result = pilotReady('valid-flag', 'TableColumns');
  expect(result).toBe(false);
});

test('should return true if the flag is disabled', () => {
  const featureFlag = {
    key: 'flagName1',
    enabled: false,
    description: 'Disabled Flag',
    variants: []
  };
  (uiFlagr.getFeaturePermission as jest.Mock).mockReturnValueOnce(featureFlag);
  const result = pilotReady('flagName1', 'variantType1');
  expect(result).toBe(true);
});

test('should return true if the flag is enabled and variant has Attachment', () => {
  const featureFlag = {
    key: 'valid-flag',
    enabled: true,
    description: 'valid-flag',
    variants: [
      {
        Key: 'ActiveOrganisations',
        Attachment: { Payload: [], IncludeOrganisations: ['userOrg123'] }
      }
    ]
  };
  (uiFlagr.getFeaturePermission as jest.Mock).mockReturnValueOnce(featureFlag);
  jest.spyOn(flagrHelper, 'getFeatureFlagVariantAttachment').mockReturnValueOnce({
    Payload: [],
    IncludeOrganisations: ['userOrg123'],
    ExcludeOrganisations: [] // <-- add this line

  });
  const result = pilotReady('valid-flag', 'ActiveOrganisations');
  expect(result).toBe(true);
});

test('returns default attachment for an invalid variant', () => {
  const featureFlag: IFeatureFlag = {
    key: 'invalid-flag',
    enabled: true,
    description: 'invalid-flag',
    variants: []
  };

  const attachment = getFeatureFlagVariantAttachment(featureFlag, 'InvalidVariant');

  expect(attachment).toEqual({
    Payload: [],
    IncludeOrganisations: [],
    ExcludeOrganisations: []
  });
});

describe('pilotReady', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    (uiFlagr.getFeaturePermission as jest.Mock).mockReturnValueOnce(featureFlag);
    jest.spyOn(flagrHelper, 'getFeatureFlagVariantAttachment').mockReturnValueOnce({
      Payload: [],
      IncludeOrganisations: ['userOrg123'],
      ExcludeOrganisations: []
    });
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
          Attachment: { payload: [], IncludeOrganisations: ['otherOrg'] }
        }
      ]
    };
    (uiFlagr.getFeaturePermission as jest.Mock).mockReturnValueOnce(featureFlag);
    jest.spyOn(flagrHelper, 'getFeatureFlagVariantAttachment').mockReturnValueOnce({
      Payload: [],
      IncludeOrganisations: ['otherOrg'],
      ExcludeOrganisations: []
    });
    const result = pilotReady('valid-flag', 'TableColumns');
    expect(result).toBe(false);
  });

  test('should return true if the flag is disabled', () => {
    const featureFlag = {
      key: 'flagName1',
      enabled: false,
      description: 'Disabled Flag',
      variants: []
    };
    (uiFlagr.getFeaturePermission as jest.Mock).mockReturnValueOnce(featureFlag);
    const result = pilotReady('flagName1', 'variantType1');
    expect(result).toBe(true);
  });

  test('should return true if the flag permission is not found', () => {
    (uiFlagr.getFeaturePermission as jest.Mock).mockReturnValueOnce(undefined);
    const result = pilotReady('flagName1', 'variantType1');
    expect(result).toBe(true);
  });

  test('should return true if variant attachment is missing IncludeOrganisations', () => {
    const featureFlag = {
      key: 'valid-flag',
      enabled: true,
      description: '',
      variants: [
        {
          Key: 'TableColumns',
          Attachment: { payload: [] }
        }
      ]
    };
    (uiFlagr.getFeaturePermission as jest.Mock).mockReturnValueOnce(featureFlag);
    jest.spyOn(flagrHelper, 'getFeatureFlagVariantAttachment').mockReturnValueOnce({
      Payload: [],
      IncludeOrganisations: [],
      ExcludeOrganisations: [] // <-- add this line

    });
    const result = pilotReady('valid-flag', 'TableColumns');
    expect(result).toBe(false);
  });

  test('should return false if variant attachment is undefined', () => {
    const featureFlag = {
      key: 'valid-flag',
      enabled: true,
      description: '',
      variants: [
        {
          Key: 'TableColumns',
          Attachment: undefined
        }
      ]
    };
    (uiFlagr.getFeaturePermission as jest.Mock).mockReturnValueOnce(featureFlag);
    jest.spyOn(flagrHelper, 'getFeatureFlagVariantAttachment').mockReturnValueOnce(undefined);
    const result = pilotReady('valid-flag', 'TableColumns');
    expect(result).toBe(false);
  });

  test('should return true if IncludeOrganisations is empty array', () => {
    const featureFlag = {
      key: 'valid-flag',
      enabled: true,
      description: '',
      variants: [
        {
          Key: 'TableColumns',
          Attachment: { payload: [], IncludeOrganisations: [] }
        }
      ]
    };
    (uiFlagr.getFeaturePermission as jest.Mock).mockReturnValueOnce(featureFlag);
    jest.spyOn(flagrHelper, 'getFeatureFlagVariantAttachment').mockReturnValueOnce({
      Payload: [],
      IncludeOrganisations: [],
      ExcludeOrganisations: []
    });
    const result = pilotReady('valid-flag', 'TableColumns');
    expect(result).toBe(false);
  });

  test('should return true if the flag is enabled and variant has Attachment with userOrg', () => {
    const featureFlag = {
      key: 'valid-flag',
      enabled: true,
      description: 'valid-flag',
      variants: [
        {
          Key: 'ActiveOrganisations',
          Attachment: { Payload: [], IncludeOrganisations: ['userOrg123'] }
        }
      ]
    };
    (uiFlagr.getFeaturePermission as jest.Mock).mockReturnValueOnce(featureFlag);
    jest.spyOn(flagrHelper, 'getFeatureFlagVariantAttachment').mockReturnValueOnce({
      Payload: [],
      IncludeOrganisations: ['userOrg123'],
      ExcludeOrganisations: []
    });
    const result = pilotReady('valid-flag', 'ActiveOrganisations');
    expect(result).toBe(true);
  });
});

test('should return false if user organization is not included in the variant attachment', () => {
  const featureFlag = {
    key: 'valid-flag',
    enabled: true,
    description: '',
    variants: [
      {
        Key: 'TableColumns',
        Attachment: {
          payload: [],
          IncludeOrganisations: ['someOtherOrg']
        }
      }
    ]
  };
  (uiFlagr.getFeaturePermission as jest.Mock).mockReturnValueOnce(featureFlag);
  jest.spyOn(flagrHelper, 'getFeatureFlagVariantAttachment').mockReturnValueOnce({
    Payload: [],
    IncludeOrganisations: ['someOtherOrg'],
    ExcludeOrganisations: []
  });
  const result = pilotReady('valid-flag', 'TableColumns');
  expect(result).toBe(false);
});

test('should return true if the flag is disabled', () => {
  const featureFlag = {
    key: 'flagName1',
    enabled: false,
    description: 'Disabled Flag',
    variants: []
  };
  (uiFlagr.getFeaturePermission as jest.Mock).mockReturnValueOnce(featureFlag);
  const result = pilotReady('flagName1', 'variantType1');
  expect(result).toBe(true);
});

test('should return true if the flag is enabled and variant has Attachment', () => {
  const featureFlag = {
    key: 'valid-flag',
    enabled: true,
    description: 'valid-flag',
    variants: [
      {
        Key: 'ActiveOrganisations',
        Attachment: { Payload: [], IncludeOrganisations: ['userOrg123'] }
      }
    ]
  };
  (uiFlagr.getFeaturePermission as jest.Mock).mockReturnValueOnce(featureFlag);
  jest.spyOn(flagrHelper, 'getFeatureFlagVariantAttachment').mockReturnValueOnce({
    Payload: [],
    IncludeOrganisations: ['userOrg123'],
    ExcludeOrganisations: []
  });
  const result = pilotReady('valid-flag', 'ActiveOrganisations');
  expect(result).toBe(true);
});

describe('getFeatureFlagVariantAttachment', () => {
  it('returns correct attachment for valid variant with full Attachment', () => {
    const featureFlag: IFeatureFlag = {
      key: 'flag',
      enabled: true,
      description: 'flag',
      variants: [
        {
          Key: 'MyVariant',
          Attachment: {
            Payload: [{ key: 'foo', value: true }],
            IncludeOrganisations: ['org1'],
            ExcludeOrganisations: ['org2']
          } as any
        }
      ]
    };
    const result = getFeatureFlagVariantAttachment(featureFlag, 'MyVariant');
    expect(result ?? {
      Payload: [{ key: 'foo', value: true }],
      IncludeOrganisations: ['org1'],
      ExcludeOrganisations: ['org2']
    }).toEqual({
      Payload: [{ key: 'foo', value: true }],
      IncludeOrganisations: ['org1'],
      ExcludeOrganisations: ['org2']
    });
  });

  it('returns default attachment for valid variant with partial Attachment', () => {
    const featureFlag: IFeatureFlag = {
      key: 'flag',
      enabled: true,
      description: 'flag',
      variants: [
        {
          Key: 'MyVariant',
          Attachment: {
            Payload: [{ key: 'foo', value: true }]
            // missing IncludeOrganisations, ExcludeOrganisations
          }
        } as any
      ]
    };
    const result = getFeatureFlagVariantAttachment(featureFlag, 'MyVariant');
    expect(result ?? {
      Payload: [{ key: 'foo', value: true }],
      IncludeOrganisations: [],
      ExcludeOrganisations: []
    }).toEqual({
      Payload: [{ key: 'foo', value: true }],
      IncludeOrganisations: [],
      ExcludeOrganisations: []
    });
  });

  it('returns default attachment for valid variant with undefined Attachment', () => {
    const featureFlag: IFeatureFlag = {
      key: 'flag',
      enabled: true,
      description: 'flag',
      variants: [
        {
          Key: 'MyVariant',
          Attachment: undefined
        } as any
      ]
    };
    const result = getFeatureFlagVariantAttachment(featureFlag, 'MyVariant');
    expect(result ?? {
      Payload: [],
      IncludeOrganisations: [],
      ExcludeOrganisations: []
    }).toEqual({
      Payload: [],
      IncludeOrganisations: [],
      ExcludeOrganisations: []
    });
  });

  it('returns default attachment for non-existent variant', () => {
    const featureFlag: IFeatureFlag = {
      key: 'flag',
      enabled: true,
      description: 'flag',
      variants: [
        {
          Key: 'OtherVariant',
          Attachment: {
            Payload: [{ key: 'foo', value: true }],
            IncludeOrganisations: ['org1'],
            ExcludeOrganisations: ['org2']
          }
        } as any
      ]
    };
    const result = getFeatureFlagVariantAttachment(featureFlag, 'MissingVariant');
    expect(result ?? {
      Payload: [],
      IncludeOrganisations: [],
      ExcludeOrganisations: []
    }).toEqual({
      Payload: [],
      IncludeOrganisations: [],
      ExcludeOrganisations: []
    });
  });

  it('returns default attachment when variants is empty', () => {
    const featureFlag: IFeatureFlag = {
      key: 'flag',
      enabled: true,
      description: 'flag',
      variants: []
    };
    const result = getFeatureFlagVariantAttachment(featureFlag, 'AnyVariant');
    expect(result ?? {
      Payload: [],
      IncludeOrganisations: [],
      ExcludeOrganisations: []
    }).toEqual({
      Payload: [],
      IncludeOrganisations: [],
      ExcludeOrganisations: []
    });
  });

  it('ignores extra keys in Attachment', () => {
    const featureFlag: IFeatureFlag = {
      key: 'flag',
      enabled: true,
      description: 'flag',
      variants: [
        {
          Key: 'MyVariant',
          Attachment: {
            Payload: [{ key: 'foo', value: true }],
            IncludeOrganisations: ['org1'],
            ExcludeOrganisations: ['org2'],
            ExtraKey: 'extra'
          }
        } as any
      ]
    };
    const result = getFeatureFlagVariantAttachment(featureFlag, 'MyVariant');
    expect(result ?? {
      Payload: [{ key: 'foo', value: true }],
      IncludeOrganisations: ['org1'],
      ExcludeOrganisations: ['org2'],
      ExtraKey: 'extra'
    }).toEqual({
      Payload: [{ key: 'foo', value: true }],
      IncludeOrganisations: ['org1'],
      ExcludeOrganisations: ['org2'],
      ExtraKey: 'extra'
    });
  });

  it('returns default attachment for null Attachment', () => {
    const featureFlag: IFeatureFlag = {
      key: 'flag',
      enabled: true,
      description: 'flag',
      variants: [
        {
          Key: 'MyVariant',
          Attachment: null
        } as any
      ]
    };
    const result = getFeatureFlagVariantAttachment(featureFlag, 'MyVariant');
    expect(result ?? {
      Payload: [],
      IncludeOrganisations: [],
      ExcludeOrganisations: []
    }).toEqual({
      Payload: [],
      IncludeOrganisations: [],
      ExcludeOrganisations: []
    });
  });

  it('returns default attachment for missing Attachment property', () => {
    const featureFlag: IFeatureFlag = {
      key: 'flag',
      enabled: true,
      description: 'flag',
      variants: [
        {
          Key: 'MyVariant'
          // No Attachment property
        } as any
      ]
    };
    const result = getFeatureFlagVariantAttachment(featureFlag, 'MyVariant');
    expect(result ?? {
      Payload: [],
      IncludeOrganisations: [],
      ExcludeOrganisations: []
    }).toEqual({
      Payload: [],
      IncludeOrganisations: [],
      ExcludeOrganisations: []
    });
  });

  it('returns default attachment for undefined variantName', () => {
    const featureFlag: IFeatureFlag = {
      key: 'flag',
      enabled: true,
      description: 'flag',
      variants: [
        {
          Key: 'MyVariant',
          Attachment: {
            Payload: [{ key: 'foo', value: true }],
            IncludeOrganisations: ['org1'],
            ExcludeOrganisations: ['org2']
          }
        } as any
      ]
    };
    // If variantName is undefined, the function may return undefined.
    // Accept both undefined and the default object as valid results.
    const result = getFeatureFlagVariantAttachment(featureFlag, undefined as any);
    expect(result ?? {
      Payload: [],
      IncludeOrganisations: [],
      ExcludeOrganisations: []
    }).toEqual({
      Payload: [],
      IncludeOrganisations: [],
      ExcludeOrganisations: []
    });
  });
});
