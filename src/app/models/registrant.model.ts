import { BaseEntity } from "./base-entity.model";
import { Branche } from "./branche.model";
import { Fournisseur } from "./fournisseur.model";
import { PrestationSoin } from "./prestation-soin.model";
import { Sinistre } from "./sinistre.model";

export interface Registrant extends BaseEntity {
  branche?: Pick<Branche, 'id' | 'ville'> | null;
  partenaire?: Pick<Fournisseur, 'id' | 'nom' | 'telephone' | 'ville' | 'pays'> | null;
}
