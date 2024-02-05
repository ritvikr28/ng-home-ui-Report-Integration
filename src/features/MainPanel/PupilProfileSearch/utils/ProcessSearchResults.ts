
import { ISearchResultsApiResponse } from "../../../../shared/model/SearchSuggestions/SearchResultsApiResponse";
import { ILearnerSearchResult } from "../models/LearnerSearchResult";
// import { getDateWithMonthSuffix } from "../../../pages/NewLearnerProfile/utils/CalculateDateSuffix";



const ProcessSearchResults: (input: ISearchResultsApiResponse[]) => ILearnerSearchResult[] = (input: ISearchResultsApiResponse[]) => {
  let searchResults: ILearnerSearchResult[] = [];
  input.map((x: ISearchResultsApiResponse) => {
    const learnerSearchResult: ILearnerSearchResult = {
      organizationExternalId: x.organizationExternalId,
      admissionNumber: x.admissionNumber,
      learnerExternalId: x.learnerExternalId,
      schoolNumber: x.schoolNumber,

      learnerPreferredForename: x.learnerPreferredForename,
      learnerPreferredSurname: x.learnerPreferredSurname,
      learnerPreferredName: x.learnerPreferredName,
      learnerLegalForename: x.learnerLegalForename,
      learnerLegalSurname: x.learnerLegalSurname,
      learnerDateOfBirth:"",
      // learnerDateOfBirth: getDateWithMonthSuffix(x.learnerDateOfBirth),
      learnerLegalName: x.learnerLegalName,

      currentPrimaryClass: x.currentPrimaryClass,
      currentYearGroup: x.currentYearGroup,

      learnerContactExternalId: x.learnerContactExternalId,
      personalPronoun: x.personalPronoun,
      contacts: {
        contactForename: x.contactForename,
        contactSurname: x.contactSurname,
        contactPriority: x.contactPriority,
        hasCourtOrder: x.hasCourtOrder,
        hasCourtOrderFavour: x.hasCourtOrderFavour,
        hasParentalResponsibility: x.hasParentalResponsibility,
        canPickUp: x.canPickUp,
        contactRelationshipType: x.contactRelationshipType,
        contactTitle: x.contactTitle,
        emails: {
          contactEmailExternalId: x.contactEmailExternalId,
          contactEmailAddress: x.contactEmailAddress,
          emailLocationType: x.emailLocationType
        },
        telephones: {
          contactTelephoneExternalId: x.contactTelephoneExternalId,
          contactTelephoneNumber: x.contactTelephoneNumber,
          telephoneLocationType: x.telephoneLocationType
        }
      },
      learnerProfilePhoto: x.learnerPhotograph
    };
    searchResults = [...searchResults, learnerSearchResult];
    return searchResults;
  });
  return searchResults;
};

export default ProcessSearchResults;