import { BaseEntity } from "./base-entity.model";
import { Permission } from "./permission.model";

export interface RuleReponse extends BaseEntity {
    roleKey?: string | null;
    libelle?: string | null;
    permissions?: Permission[] | null;
}
