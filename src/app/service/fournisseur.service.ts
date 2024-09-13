import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fournisseur } from '../models/fournisseur.model';
import { Prestation } from '../models/prestation.model';
import { GenericCrudService } from './generic.crud.service';
import { Branche } from '../models/branche.model';

@Injectable({ providedIn: 'root' })
export class FournisseurService extends GenericCrudService<Fournisseur> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'fournisseurs');
    }

    // Méthode pour récupérer les prestations associées à un fournisseur spécifique
    getAllPrestations(): Observable<Prestation[]> {
        return this.http.get<Prestation[]>(`${this.baseUrl}/${this.endpoint}/all/prestations`);
    }

    // Méthode pour récupérer les branches associés à un fournisseur spécifique
    getAllBranches(): Observable<Branche[]> {
        return this.http.get<Branche[]>(`${this.baseUrl}/${this.endpoint}/all/sinistres`);
    }
}
