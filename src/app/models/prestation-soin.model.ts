import { BaseEntity } from "./base-entity.model";
import { FinanceurSoin } from "./financeur-soin.model";
import { Fournisseur } from "./fournisseur.model";
import { Sinistre } from "./sinistre.model";

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

export interface PrestationSoin extends BaseEntity {
  label?: string | null;
  datePrestation?: Date | null;
  description?: string | null;
  type?: keyof typeof PrestationType | null;
  status?: keyof typeof PrestationStatus | null;
  montant?: number | null;
  fournisseur?: Pick<Fournisseur, 'id'> | null;
  financeurs?: Pick<FinanceurSoin, 'id'>[] | null;
  sinistres?: Pick<Sinistre, 'id'>[] | null;
}