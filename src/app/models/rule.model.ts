import { Permission } from "./permission.model";

export interface Rule {
    moduleKey?: string | null;
    module?: string | null;
    permissions?: Permission[] | null;
}
