import { DossierMedical } from "./dossier-medical.model";
import { Registrant } from "./registrant.model";
import { Souscription } from "./souscription.model";
import { RuleReponse } from './rule.reponse.model';

export interface UserData {
  roles?: Pick<RuleReponse, 'id' | 'roleKey' | 'libelle' | 'permissions'>[] | null;
  registrant?: Pick<Registrant, 'id' | 'numeroRegistrant' | 'branche' | 'partenaire'> | null;
  dossiers?: Pick<DossierMedical, 'id' | 'numDossierMedical' | 'dateUpdated'>[] | null;
  souscriptions?: Pick<Souscription, 'id' | 'numeroSouscription' | 'dateSouscription' | 'dateExpiration' | 'status' | 'frequencePaiement'>[] | null;
}
