import { IContact } from "./Contact";

export interface ILearnerSearchResult {
  organizationExternalId: string,
  schoolNumber: string,
  learnerExternalId: string,
  admissionNumber: string,
  learnerPreferredForename: string,
  learnerPreferredSurname: string,
  learnerPreferredName: string,
  learnerLegalForename: string,
  learnerLegalSurname: string,
  learnerLegalName: string,
  currentYearGroup: string,
  currentPrimaryClass: string,
  learnerDateOfBirth: string,
  learnerContactExternalId: string,
  personalPronoun: string,
  contacts: IContact,
  learnerProfilePhoto:string
}

export const learnerEmptySearchResult: ILearnerSearchResult = {
  organizationExternalId: "",
  admissionNumber: "",
  learnerExternalId: "",
  schoolNumber: "",

  learnerPreferredForename: "",
  learnerPreferredSurname: "",
  learnerPreferredName: "",
  learnerLegalForename: "",
  learnerLegalSurname: "",
  learnerDateOfBirth: "",
  learnerLegalName: "",

  currentPrimaryClass: "",
  currentYearGroup: "",

  learnerContactExternalId: "",
  personalPronoun: "",
  contacts: {
    contactForename: "",
    contactSurname: "",
    contactPriority: null,
    hasCourtOrder: false,
    hasCourtOrderFavour: false,
    hasParentalResponsibility: false,
    canPickUp: false,
    contactRelationshipType: "",
    contactTitle: "",
    emails: {
      contactEmailExternalId: "",
      contactEmailAddress: "",
      emailLocationType: ""
    },
    telephones: {
      contactTelephoneExternalId: "",
      contactTelephoneNumber: "",
      telephoneLocationType: ""
    }
  },
  learnerProfilePhoto: ""
};