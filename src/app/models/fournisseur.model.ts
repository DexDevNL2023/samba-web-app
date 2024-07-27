import { BaseEntity } from "./base-entity.model";

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
