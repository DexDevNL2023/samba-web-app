import { PaymentMode } from './paiement.model';

export interface PublicPaiementRequest {
  mode?: PaymentMode | null;
  montant?: number | null;
  account?: number | null;
  souscription?: number | null;
}