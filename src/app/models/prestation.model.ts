import { BaseEntity } from "./base-entity.model";

export enum PrestationType {
  BIEN = 'BIEN',
  AGRICOLE = 'AGRICOLE',
  PERSONNE = 'PERSONNE',
  SANTE = 'SANTE'
}

export enum PrestationStatus {
  EN_COURS = 'EN_COURS',
  NON_REMBOURSE = 'NON_REMBOURSE',
  REMBOURSE = 'REMBOURSE'
}

export interface Prestation extends BaseEntity {
  numeroPrestation?: string | null;
  label?: string | null;
  datePrestation?: Date | null;
  montant?: number | null;
  type?: keyof typeof PrestationType | null;
  description?: string | null;
  status?: keyof typeof PrestationStatus | null;
  fournisseur?: number | null;
  souscription?: number | null;
  sinistre?: number | null;
  financeurs?: number[] | null;
  documents?: number[];
}
