import { DocumentSinistre } from './document-sinistre.model';

export interface PublicSinistreRequest {
  label?: string | null;
  raison?: string | null;
  dateSurvenance?: Date | null;
  montantSinistre?: number | null;
  account?: number | null;
  souscription?: number | null;
  documents?: DocumentSinistre[];
}