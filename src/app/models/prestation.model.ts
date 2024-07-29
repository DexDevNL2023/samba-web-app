import { BaseEntity } from "./base-entity.model";

export enum PrestationType {
  BIEN = 'BIEN',
  AGRICOLE = 'AGRICOLE',
  PERSONNE = 'PERSONNE',
  SANTE = 'SANTE'
}

export enum PrestationStatus {
  NON_REMBOURSE = 'NON_REMBOURSE',
  EN_ATTENTE = 'EN_ATTENTE',
  REMBOURSE = 'REMBOURSE'
}

export interface Prestation extends BaseEntity {
  numeroPrestation?: string | null;
  label?: string | null;
  datePrestation?: Date | null;
  type?: keyof typeof PrestationType | null;
  description?: string | null;
  montant?: number | null;
  status?: keyof typeof PrestationStatus | null;
  fournisseur?: number | null;
  sinistre?: number | null;
  financeurs?: number[] | null;
  documents?: number[];
}
