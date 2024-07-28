import { BaseEntity } from "./base-entity.model";
import { Branche } from "./branche.model";
import { Fournisseur } from "./fournisseur.model";

export interface Registrant extends BaseEntity {
  numeroRegistrant?: string | null;
  branche?: Pick<Branche, 'id' | 'ville'> | null;
  partenaire?: Pick<Fournisseur, 'id' | 'nom' | 'telephone' | 'adresse'> | null;
}
