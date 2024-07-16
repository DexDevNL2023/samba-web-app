import { BaseEntity } from "./base-entity.model";
import { Fournisseur } from "./fournisseur.model";

export interface Branche extends BaseEntity {
    code?: string;
    ville?: string;
    isDefaut?: Boolean;
    partenaires?: Pick<Fournisseur, 'id'>[] | null;
}
