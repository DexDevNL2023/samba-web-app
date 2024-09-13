import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DossierMedical } from '../models/medical-record.model';
import { Souscription } from '../models/souscription.model';
import { GenericCrudService } from './generic.crud.service';
import { Observable } from 'rxjs';
import { Assure } from '../models/assure.model';
import { LiteRegistrant } from '../models/lite.registrant.model';
import { Branche } from '../models/branche.model';
import { Fournisseur } from '../models/fournisseur.model';

@Injectable({ providedIn: 'root' })
export class AssureService extends GenericCrudService<Assure> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'assures');
    }

    // Méthode pour récupérer les dossiers médicaux d'un utilisateur
    getAllRegistrants(): Observable<LiteRegistrant[]> {
        return this.http.get<LiteRegistrant[]>(`${this.baseUrl}/${this.endpoint}/all/registrants`);
    }

    // Méthode pour récupérer les dossiers médicaux d'un utilisateur
    getAllDossiers(): Observable<DossierMedical[]> {
        return this.http.get<DossierMedical[]>(`${this.baseUrl}/${this.endpoint}/all/dossiers`);
    }

    // Méthode pour récupérer les souscriptions d'un utilisateur
    getAllSouscriptions(): Observable<Souscription[]> {
        return this.http.get<Souscription[]>(`${this.baseUrl}/${this.endpoint}/all/souscriptions`);
    }

    // Méthode pour récupérer les dossiers médicaux d'un utilisateur
    getAllBranches(): Observable<Branche[]> {
        return this.http.get<Branche[]>(`${this.baseUrl}/${this.endpoint}/all/branches`);
    }

    // Méthode pour récupérer les souscriptions d'un utilisateur
    getAllPartners(): Observable<Fournisseur[]> {
        return this.http.get<Fournisseur[]>(`${this.baseUrl}/${this.endpoint}/all/partenaires`);
    }
}
