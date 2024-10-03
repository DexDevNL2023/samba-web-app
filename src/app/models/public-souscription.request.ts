import { PaymentMode } from './paiement.model';
import { PaymentFrequency } from './souscription.model';

export interface PublicSouscriptionRequest {
  frequencePaiement?: PaymentFrequency | null;  // Fréquence de paiement (Enum)
  account?: number | null;                      // Identifiant de l'assuré
  police?: number | null;                       // Identifiant de la police d'assurance
  mode?: PaymentMode | null;                    // Mode de paiement (Enum)
  montant?: number | null;                      // Montant du paiement
}