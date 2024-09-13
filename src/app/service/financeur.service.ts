import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Financeur } from '../models/financeur.model';
import { Prestation } from '../models/prestation.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class FinanceurService extends GenericCrudService<Financeur> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'financeurs');
    }

    // Méthode pour récupérer les prestations associées à un financeur de soin spécifique
    getAllPrestations(): Observable<Prestation[]> {
        return this.http.get<Prestation[]>(`${this.baseUrl}/${this.endpoint}/all/prestations`);
    }
}
