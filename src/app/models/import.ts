export interface Import {
    id?: number | null;
    code?: string | null;
    libelle?: string | null;
}

export class Import{
    id?: number;
    code?: string;
    libelle?: string;

    constructor(data: any){
        this.id = 0;
        this.code = data[1];
        this.libelle = data[2];
    }
}