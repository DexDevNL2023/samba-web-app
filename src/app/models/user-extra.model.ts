import { BaseEntity } from "./base-entity.model";
import { MedicalRecord } from "./medical-record.model";
import { Notification } from "./notification.model";
import { Registrant } from "./registrant.model";
import { Souscription } from "./souscription.model";

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}
  
export interface UserExtra extends BaseEntity {
  numNiu?: string | null;
  activated?: boolean | null;
  langKey?: string | null;
  imageUrl?: string | null;
  login?: string | null;
  lastName?: string | null;
  firstName?: string | null;
  email?: string | null;
  dateNaissance?: Date | null;
  numCni?: string | null;
  sexe?: keyof typeof Gender | null;
  telephone?: string | null;
  addresse?: string | null;
  ville?: string | null;
  pays?: string | null;
  authorities: string[] | null;
  signature?: string | null;
  registrant?: Pick<Registrant, 'id'> | null;
  dossiers?: Pick<MedicalRecord, 'id'>[] | null;
  souscriptions?: Pick<Souscription, 'id'>[] | null;
  notifications?: Pick<Notification, 'id'>[] | null;
}
