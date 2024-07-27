import { BaseEntity } from "./base-entity.model";

export enum PrestationType {
  CONSULTATION = 'CONSULTATION',
  HOSPITALISATION = 'HOSPITALISATION',
  SOINS_PARAMEDICAUX = 'SOINS_PARAMEDICAUX',
  RADIOLOGIE = 'RADIOLOGIE',
  ANALYSES_LABORATOIRE = 'ANALYSES_LABORATOIRE',
  PHARMACIE = 'PHARMACIE',
  CHIRURGIE = 'CHIRURGIE',
  URGENCES = 'URGENCES',
  SOINS_DENTAIRES = 'SOINS_DENTAIRES',
  SOINS_OCULAIRES = 'SOINS_OCULAIRES',
  MATERNITE = 'MATERNITE',
  REEDUCATION = 'REEDUCATION',
  PSYCHOTHERAPIE = 'PSYCHOTHERAPIE',
  SOINS_A_DOMICILE = 'SOINS_A_DOMICILE',
  AMBULANCE = 'AMBULANCE',
  VACCINATION = 'VACCINATION',
  TELEMEDECINE = 'TELEMEDECINE',
  NUTRITION = 'NUTRITION',
  PHYSIOTHERAPIE = 'PHYSIOTHERAPIE',
  AUTRES = 'AUTRES'
}

export enum PrestationStatus {
  NON_REMBOURSE = 'NON_REMBOURSE',
  EN_ATTENTE = 'EN_ATTENTE',
  REMBOURSE = 'REMBOURSE'
}

export interface Prestation extends BaseEntity {
  label?: string | null;
  datePrestation?: Date | null;
  description?: string | null;
  type?: keyof typeof PrestationType | null;
  montant?: number | null;
  status?: keyof typeof PrestationStatus | null;
  fournisseur?: number | null;
  financeurs?: number[] | null;
  sinistre?: number | null;
}