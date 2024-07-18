import { BaseEntity } from "./base-entity.model";
import { MedicalDocument } from "./medical-document.model";
import { UserExtra } from "./user-extra.model";

export interface MedicalRecord extends BaseEntity {
  numMedicalRecord?: string | null;
  details?: string | null;
  dateUpdated?: Date | null;
  patient?: Pick<UserExtra, 'id' | 'numNiu' | 'lastName' | 'firstName' | 'telephone' | 'addresse' | 'ville' | 'pays'> | null;
  documents?: Pick<MedicalDocument, 'id' | 'nom' | 'url'>[] | null;
}