import { BaseEntity } from "./base-entity.model";

export interface Branche extends BaseEntity {
    code?: string;
    ville?: string;
    isDefaut?: Boolean;
    partenaires?: number[] | null;
}
