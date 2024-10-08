import { DocumentRequest } from './document-request.model';

export interface PublicSinistreRequest {
  label?: string | null;
  raison?: string | null;
  dateSurvenance?: Date | null;
  montantSinistre?: number | null;
  account?: number | null;
  souscription?: number | null;
  documents?: DocumentRequest[];
}