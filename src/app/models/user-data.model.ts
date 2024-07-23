import { MedicalRecord } from "./medical-record.model";
import { Registrant } from "./registrant.model";
import { Souscription } from "./souscription.model";

export interface UserData {
  registrant?: Pick<Registrant, 'id' | 'branche' | 'partenaire'> | null;
  dossiers?: Pick<MedicalRecord, 'id' | 'numMedicalRecord' | 'dateUpdated'>[] | null;
  souscriptions?: Pick<Souscription, 'id' | 'numeroSouscription' | 'dateSouscription' | 'dateExpiration' | 'status' | 'frequencePaiement'>[] | null;
}
 