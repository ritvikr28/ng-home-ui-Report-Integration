export interface ISearchResultsApiResponse {
  organizationExternalId: string;
  schoolNumber: string;
  learnerExternalId: string;
  admissionNumber: string;
  learnerPreferredForename: string;
  learnerPreferredSurname: string;
  learnerPreferredName: string;
  learnerLegalForename: string;
  learnerLegalSurname: string;
  learnerLegalName: string;
  currentYearGroup: string;
  currentPrimaryClass: string;
  learnerPhotograph: string;
  learnerDateOfBirth: string;
  learnerContactExternalId: string;
  contactForename: string;
  contactSurname: string;
  contactPriority: number | null;
  hasCourtOrder: boolean;
  hasCourtOrderFavour: boolean;
  hasParentalResponsibility: boolean;
  canPickUp: boolean;
  contactRelationshipType: string;
  contactTitle: string;
  contactEmailExternalId: string;
  contactEmailAddress: string;
  emailLocationType: string;
  contactTelephoneExternalId: string;
  contactTelephoneNumber: string;
  telephoneLocationType: string;
  personalPronoun: string;
}

export interface ISearchSuggestionsResultsApiResponse {
  organizationExternalId: string;
  schoolNumber: string;
  learnerExternalId: string;
  admissionNumber: string;
  preferredName: string;
  preferredForename: string;
  preferredSurname: string;
  legalName: string;
  legalForename: string;
  legalSurname: string;
  yearGroup: string;
  classGroup: string;
  dateOfBirth: string;
  imagePath: string;
}
