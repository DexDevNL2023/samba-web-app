import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sinistre } from '../models/sinistre.model';
import { Souscription } from '../models/souscription.model';
import { Fournisseur } from '../models/fournisseur.model';
import { Prestation } from '../models/prestation.model';
import { Reclamation } from '../models/reclamation.model';
import { Document } from '../models/document.model';
import { GenericCrudService } from './generic.crud.service';

@Injectable({ providedIn: 'root' })
export class SinistreService extends GenericCrudService<Sinistre> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'sinistres');
    }

    // Méthode pour récupérer les souscriptions associée à un sinistre spécifique
    getAllSouscriptions(): Observable<Souscription[]> {
        return this.http.get<Souscription[]>(`${this.baseUrl}/${this.endpoint}/all/souscriptions`);
    }

    // Méthode pour récupérer les prestations de soin associée à un sinistre spécifique
    getAllPrestations(): Observable<Prestation[]> {
        return this.http.get<Prestation[]>(`${this.baseUrl}/${this.endpoint}/all/prestations`);
    }

    // Méthode pour récupérer les documents de sinistre associés à un sinistre spécifique
    getAllDocuments(): Observable<Document[]> {
        return this.http.get<Document[]>(`${this.baseUrl}/${this.endpoint}/all/documents`);
    }
}
