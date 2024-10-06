import { BaseEntity } from "./base-entity.model";
 
export interface DossierMedical extends BaseEntity {
  numDossierMedical?: string | null;
  patient?: number | null;
  dateUpdated?: Date | null;
  maladiesChroniques?: string | null;
  maladiesHereditaires?: string | null;
  interventionsChirurgicales?: string | null;
  hospitalisations?: string | null;
  allergies?: string | null;
  vaccins?: string | null;
  habitudesAlimentaires?: string | null;
  consommationAlcool?: string | null;
  consommationTabac?: string | null;
  niveauActivitePhysique?: string | null;
  revenusAnnuels?: number | null;
  chargesFinancieres?: number | null;
  declarationBonneSante?: boolean | null;
  consentementCollecteDonnees?: boolean | null;
  declarationNonFraude?: boolean | null;
}
