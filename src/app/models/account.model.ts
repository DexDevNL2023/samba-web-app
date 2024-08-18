import { BaseEntity } from "./base-entity.model";

export enum Authority {
  CLIENT = 'ROLE_CLIENT',
  AGENT = 'ROLE_AGENT',
  ADMIN = 'ROLE_ADMIN',
  PROVIDER = 'ROLE_PROVIDER'
}

export interface Account extends BaseEntity {
  fullName?: string | null;
  email?: string | null;
  langKey?: string | null;
  login?: string | null;
  usingQr?: boolean | null;
  loginUrl?: string | null;
  imageUrl?: string | null;
  authority?: string | null;
  actived?: boolean | null;
  roles?: number[] | null;
}