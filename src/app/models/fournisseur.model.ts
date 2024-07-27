import { BaseEntity } from "./base-entity.model";
import { Branche } from "./branche.model";
import { PrestationSoin } from "./prestation.model";
import { Sinistre } from "./sinistre.model";

export interface Fournisseur extends BaseEntity {
  nom?: string | null;
  telephone?: string | null;
  email?: string | null;
  adresse?: string | null;
  ville?: string | null;
  pays?: string | null;
  servicesFournis?: string | null;
  prestations?: number[] | null;
  branches?: number[] | null;
}
