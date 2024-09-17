import { BaseEntity } from "./base-entity.model";

export enum TypeDocument {
  SINISTRE = 'DOCUMENT_SINISTRE',
  PRESTATION = 'DOCUMENT_PRESTATION'
}

export interface Document extends BaseEntity {
  numeroDocument?: string | null;
  nom?: string | null;
  type?: keyof typeof TypeDocument | null;
  description?: string | null;
  url?: string | null;
  sinistre?: number | null;
  prestation?: number | null;
}
