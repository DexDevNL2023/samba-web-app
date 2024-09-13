import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rapport } from '../models/rapport.model';
import { Assurance } from '../models/assurance.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class RapportService extends GenericCrudService<Rapport> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'rapports');
    }

    // Méthode pour récupérer l'assurance associée à un rapport spécifique
    getAssurance(id: number): Observable<Assurance> {
        return this.http.get<Assurance>(`${this.baseUrl}/${this.endpoint}/${id}/assurance`);
    }
}
