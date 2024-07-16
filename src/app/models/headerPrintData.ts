import { Company } from "./company.model";

export class HeaderPrintData {
    param?: Company | null;
    enteteGauche?: string[] | null;
    enteteDroite?: string[] | null;
    piedPage?: string[] | null;
}
