import { ToastService } from './toast.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Souscription } from '../models/souscription.model';
import { PoliceAssurance } from '../models/police-assurance.model';
import { Paiement } from '../models/paiement.model';
import { Sinistre } from '../models/sinistre.model';
import { GenericCrudService } from './generic.crud.service';
import { Assure } from '../models/assure.model';
import { Reclamation } from '../models/reclamation.model';
import { ContratAssurance } from '../models/contrat-assurance.model';

@Injectable({ providedIn: 'root' })
export class SouscriptionService extends GenericCrudService<Souscription> {

    constructor(http: HttpClient, toastService: ToastService) {
        super(http, toastService, 'souscriptions');
    }

    // Méthode pour récupérer l'utilisateur associé à une souscription spécifique
    getAllAssures(): Observable<Assure[]> {
        return this.http.get<Assure[]>(`${this.baseUrl}/${this.endpoint}/all/assures`);
    }

    // Méthode pour récupérer la police d'assurance associée à une souscription spécifique
    getAllPolices(): Observable<PoliceAssurance[]> {
        return this.http.get<PoliceAssurance[]>(`${this.baseUrl}/${this.endpoint}/all/polices`);
    }

    // Méthode pour récupérer le contrat associée à une souscription spécifique
    getAllContrats(): Observable<ContratAssurance[]> {
        return this.http.get<ContratAssurance[]>(`${this.baseUrl}/${this.endpoint}/all/contrats`);
    }

    // Méthode pour récupérer les paiements associés à une souscription spécifique
    getAllPaiements(): Observable<Paiement[]> {
        return this.http.get<Paiement[]>(`${this.baseUrl}/${this.endpoint}/all/paiements`);
    }

    // Méthode pour récupérer les sinistres associés à une souscription spécifique
    getAllSinistres(): Observable<Sinistre[]> {
        return this.http.get<Sinistre[]>(`${this.baseUrl}/${this.endpoint}/all/sinistres`);
    }

    // Méthode pour récupérer les reclamations associés à une souscription spécifique
    getAllReclamations(): Observable<Reclamation[]> {
        return this.http.get<Reclamation[]>(`${this.baseUrl}/${this.endpoint}/all/reclamations`);
    }
}
