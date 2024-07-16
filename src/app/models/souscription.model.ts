import { BaseEntity } from "./base-entity.model";
import { MedicalRecord } from "./medical-record.model";
import { Paiement } from "./paiement.model";
import { PoliceAssurance } from "./police-assurance.model";
import { Sinistre } from "./sinistre.model";
import { UserExtra } from "./user-extra.model";

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  ON_RISK = 'ON_RISK',
  WATTING = 'WATTING',
  RESILIE = 'RESILIE'
}
  
export enum PaymentFrequency {
  MENSUEL = 'MENSUEL',
  TRIMESTRIEL = 'TRIMESTRIEL',
  SEMESTRIEL = 'SEMESTRIEL',
  ANNUEL = 'ANNUEL'
}
  
export interface Souscription extends BaseEntity {
  numeroSouscription?: string | null;
  dateSouscription?: Date | null;
  dateExpiration?: Date | null;
  status?: keyof typeof SubscriptionStatus | null;
  frequencePaiement?: keyof typeof PaymentFrequency | null;
  assure?: Pick<UserExtra, 'id'> | null;
  police?: Pick<PoliceAssurance, 'id'> | null;
  paiements?: Pick<Paiement, 'id'>[] | null;
  sinistres?: Pick<Sinistre, 'id'>[] | null;
}
