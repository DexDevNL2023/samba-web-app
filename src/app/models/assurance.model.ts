import { BaseEntity } from "./base-entity.model";

// Enum TypeScript
export enum InsuranceType {
  PERSONNE = 'PERSONNE',
  BIEN = 'BIEN',
  AGRICOLE = 'AGRICOLE',
  AUTOMOBILE = 'AUTOMOBILE',
  HABITATION = 'HABITATION',
  VIE = 'VIE',
  ACCIDENT = 'ACCIDENT',
  VOYAGE = 'VOYAGE',
  SANTE = 'SANTE'
}

export interface Assurance extends BaseEntity {
  nom?: string | null;
  description?: string | null;
  type?: keyof typeof InsuranceType | null;
  polices?: number[] | null;
}