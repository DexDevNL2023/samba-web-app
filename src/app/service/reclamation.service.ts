import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reclamation } from '../models/reclamation.model';
import { GenericCrudService } from './generic.crud.service';
import { Souscription } from '../models/souscription.model';

@Injectable({ providedIn: 'root' })
export class ReclamationService extends GenericCrudService<Reclamation> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'reclamations');
    }

    // Méthode pour récupérer les souscriptions associé à une réclamation spécifique
    getAllSouscriptions(): Observable<Souscription[]> {
        return this.http.get<Souscription[]>(`${this.baseUrl}/${this.endpoint}/all/souscriptions`);
    }
}
