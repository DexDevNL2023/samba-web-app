import { BaseEntity } from "./base-entity.model";
import { Branche } from "./branche.model";
import { PrestationSoin } from "./prestation-soin.model";
import { Sinistre } from "./sinistre.model";

export interface Fournisseur extends BaseEntity {
  nom?: string | null;
  adresse?: string | null;
  telephone?: string | null;
  email?: string | null;
  addresse?: string | null;
  ville?: string | null;
  pays?: string | null;
  servicesFournis?: string | null;
  prestations?: Pick<PrestationSoin, 'id'>[] | null;
  sinistres?: Pick<Sinistre, 'id'>[] | null;
  branches?: Pick<Branche, 'id'>[] | null;
}
