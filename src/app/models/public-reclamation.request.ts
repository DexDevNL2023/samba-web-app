import { TypeReclamation } from './reclamation.model';

export interface PublicReclamationRequest {
  type?: TypeReclamation | null;
  dateReclamation?: Date | null;
  description?: string | null;
  montantReclame?: number | null;
  account?: number | null;
  souscription?: number | null;
  sinistre?: number | null;
  prestation?: number | null;
}