import { BaseEntity } from "./base-entity.model";

export enum InsuranceType {
  PERSONNE = 'PERSONNE',
  BIEN = 'BIEN',
  AGRICOLE = 'AGRICOLE',
  SANTE = 'SANTE'
}
  
export interface Assurance extends BaseEntity {
  nom?: string | null;
  description?: string | null;
  type?: keyof typeof InsuranceType | null;
  polices?: number[] | null;
}