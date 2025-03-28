import { IEmail } from "./Email";
import { ITelephone } from "./Telephone";

export interface IContact {
  contactForename: string;
  contactSurname: string;
  contactPriority: number | null;
  hasCourtOrder: boolean;
  hasCourtOrderFavour: boolean;
  hasParentalResponsibility: boolean;
  canPickUp: boolean;
  contactRelationshipType: string;
  contactTitle: string;
  emails: IEmail;
  telephones: ITelephone;
}
