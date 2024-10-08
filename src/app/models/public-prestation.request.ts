import { PrestationType } from './prestation.model';
import { DocumentRequest } from './document-request.model';

export interface PublicPrestationRequest {
  label?: string | null;
  datePrestation?: Date | null;
  montant?: number | null;
  type?: PrestationType | null;
  description?: string | null;
  financeurs?: number[] | null;
  account?: number | null;
  sinistre?: number | null;
  documents?: DocumentRequest[];
}