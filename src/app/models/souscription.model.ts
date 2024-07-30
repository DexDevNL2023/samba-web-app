import { BaseEntity } from "./base-entity.model";

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  ON_RISK = 'ON_RISK',
  WAITING = 'WAITING',
  RESILIE = 'RESILIE'
}
  
export enum PaymentFrequency {
  MENSUEL = 'MENSUEL',
  TRIMESTRIEL = 'TRIMESTRIEL',
  SEMESTRIEL = 'SEMESTRIEL',
  ANNUEL = 'ANNUEL'
}

export enum ContratType {
  BIEN = 'BIEN',
  AGRICOLE = 'AGRICOLE',
  PERSONNE = 'PERSONNE',
  SANTE = 'SANTE'
}

export interface ContratAssurance extends BaseEntity {
  numeroContrat?: string | null;         // Identifiant unique du contrat
  dateContrat?: Date | null;             // Date à laquelle le contrat a été émis
  typeContrat?: keyof typeof ContratType | null;      // Type d'assurance (Bien, Personne, Sante, Agricole)
  couverture?: string | null;            // Description de la couverture offerte par le contrat
  montantAssure?: number | null;         // Montant assuré en cas de sinistre
  franchise?: number | null;             // Franchise applicable sur le contrat
  conditions?: string | null;            // Conditions spécifiques du contrat
  exclusions?: string | null;            // Exclusions spécifiques de la couverture
  dateDebut?: Date | null;               // Date de début de la couverture
  dateFin?: Date | null;                 // Date de fin de la couverture
}

export interface Souscription extends BaseEntity {
  numeroSouscription?: string | null;
  dateSouscription?: Date | null;
  dateExpiration?: Date | null;
  montantCotisation?: number | null;
  status?: keyof typeof SubscriptionStatus | null;
  frequencePaiement?: keyof typeof PaymentFrequency | null;
  assure?: number | null;
  police?: number | null;
  contrat?: number | null;
  paiements?: number[] | null;
  sinistres?: number[] | null;
  reclamations?: number[] | null;
}
