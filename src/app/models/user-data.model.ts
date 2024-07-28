import { DossierMedical } from "./medical-record.model";
import { Registrant } from "./registrant.model";
import { Souscription } from "./souscription.model";

export interface UserData {
  registrant?: Pick<Registrant, 'id' | 'numeroRegistrant' | 'branche' | 'partenaire'> | null;
  dossiers?: Pick<DossierMedical, 'id' | 'numDossierMedical' | 'dateUpdated'>[] | null;
  souscriptions?: Pick<Souscription, 'id' | 'numeroSouscription' | 'dateSouscription' | 'dateExpiration' | 'status' | 'frequencePaiement'>[] | null;
}
 