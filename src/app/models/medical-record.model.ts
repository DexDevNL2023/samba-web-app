import { BaseEntity } from "./base-entity.model";

export interface ConsultationEtTraitement extends BaseEntity {
  numConsultationEtTraitement?: string | null;
  date?: Date | null;
  raison?: string | null;
  medicament?: string | null;
  posologie?: string | null;
  duree?: string | null;
  therapiesEnCours?: string[] | null;
}

export interface ResultatExamenMedical extends BaseEntity {
  numResultatExamenMedical?: string | null;
  analyses?: { type: string; date: string; resultat: string }[];
  imageries?: { type: string; date: string; resultat: string }[];
  rapportsSpecialistes?: { specialiste: string; date: string; rapport: string }[];
}

export interface StatutVaccinal extends BaseEntity {
  vaccin?: string;
  date?: string;
}

export interface ModeDeVieEtHabitudes extends BaseEntity {
  numModeDeVieEtHabitudes?: string | null;
  habitudesAlimentaires?: string;
  consommationAlcool?: string;
  consommationTabac?: string;
  niveauActivitePhysique?: string;
}

export interface InformationFinanciere extends BaseEntity {
  numInformationFinanciere?: string | null;
  revenusAnnuels?: number;
  chargesFinancieres?: number;
}

export interface DeclarationEtConsentement extends BaseEntity {
  numDeclarationEtConsentement?: string | null;
  declarationBonneSante?: boolean;
  consentementCollecteDonnees?: boolean;
  declarationNonFraude?: boolean;
}

export interface DossierMedical extends BaseEntity {
  numDossierMedical?: string | null;
  patient?: number | null;
  dateUpdated?: Date | null;
  maladiesChroniques?: string[] | null;
  maladiesHereditaires?: string[] | null;
  interventionsChirurgicales?: string[] | null;
  hospitalisations?: string[] | null;
  allergies?: string[] | null;
  consultationsEtTraitements?: number[] | null;
  resultatsExamenMedicaux?: number[] | null;
  statutVaccinal?: number[] | null;
  modeDeVieEtHabitudes?: number | null;
  informationsFinancieres?: number | null;
  declarationsEtConsentements?: number | null;
}
