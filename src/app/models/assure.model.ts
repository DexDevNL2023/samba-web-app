import { BaseEntity } from "./base-entity.model";

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export interface Assure extends BaseEntity {
  numNiu?: string | null;
  lastName?: string | null;
  firstName?: string | null;
  dateNaissance?: Date | null;
  numCni?: string | null;
  sexe?: keyof typeof Gender | null;
  email?: string | null;
  telephone?: string | null;
  addresse?: string | null;
  signature?: string | null;
  registrant?: number | null;
  dossiers?: number[] | null;
  souscriptions?: number[] | null;
}
